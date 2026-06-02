import { useState, useEffect } from 'react';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { useSections } from '../../hooks/useSections';
import api, { getImageUrl } from '../../services/api';

export default function AdminProductsPage() {
    const { products, addProduct, updateProduct, removeProduct } = useAdminProducts();
    const { categories } = useCategories();
    const { brands } = useBrands();
    const { sections } = useSections();

    const [allTags, setAllTags] = useState([]);
    const [selectedTagIds, setSelectedTagIds] = useState([]);

    const [viewingProduct, setViewingProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    
    // Updated to arrays for dynamic UI
    const [details, setDetails] = useState([]); 
    const [colors, setColors] = useState([]); 
    const [colorInput, setColorInput] = useState('');

    const [componentType, setComponentType] = useState('');
    const [isActive, setIsActive] = useState(true);
    
    const [categoryId, setCategoryId] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [brandId, setBrandId] = useState('');
    
    const [images, setImages] = useState([]); 
    const [description, setDescription] = useState('');
    const [existingImages, setExistingImages] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

    const [availableAttributes, setAvailableAttributes] = useState([]);
    const [productSelectedValues, setProductSelectedValues] = useState({}); 
    
    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredSections = sections.filter(sec => !categoryId || String(sec.category_id) === String(categoryId));
    const filteredBrands = brands.filter(b => !sectionId || String(b.section_id) === String(sectionId));

    useEffect(() => {
        api.get('/public/tags')
            .then(res => {
                if (Array.isArray(res.data)) setAllTags(res.data);
            })
            .catch(err => console.error("Error loading system tags context node", err));
    }, []);

    useEffect(() => {
        if (!sectionId) {
            setAvailableAttributes([]);
            return;
        }

        api.get(`/admin/sections/${sectionId}/full-attributes`)
            .then(res => {
                if (res.data?.success) {
                    const fetchedAttributes = res.data.data;
                    setAvailableAttributes(fetchedAttributes);

                    if (editingProduct) {
                        const remappedValues = {};
                        
                        if (editingProduct.attribute_groups && editingProduct.attribute_groups.length > 0) {
                            editingProduct.attribute_groups.forEach(group => {
                                const parentAttrId = group.attribute_id;
                                const targetAttr = fetchedAttributes.find(a => Number(a.id) === Number(parentAttrId));
                                
                                if (!targetAttr) return;

                                const isMulti = targetAttr.type === 'checkbox';

                                if (isMulti) {
                                    remappedValues[parentAttrId] = group.selected_values.map(v => Number(v.value_id));
                                } else {
                                    if (group.selected_values.length > 0) {
                                        remappedValues[parentAttrId] = Number(group.selected_values[0].value_id);
                                    }
                                }
                            });
                        }
                        setProductSelectedValues(remappedValues);
                    }
                }
            })
            .catch(err => console.error("Error fetching specs blueprint for section", err));
    }, [sectionId, editingProduct]);

    const handleNameChange = (e) => {
        const title = e.target.value;
        setName(title);
        setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormError(null);
        setName(''); setSlug(''); setPrice(''); setStock(''); setComponentType('');
        setIsActive(true); setCategoryId(''); setBrandId(''); setSectionId(''); setImages([]);
        setExistingImages([]);
        setProductSelectedValues({});
        setAvailableAttributes([]);
        setSelectedTagIds([]); 
        setDescription('');
        
        // Reset dynamic arrays
        setDetails([]);
        setColors([]);
        setColorInput('');
        
        setIsFormOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormError(null);
        
        setProductSelectedValues({}); 
        setAvailableAttributes([]);

        setName(product.name);
        setSlug(product.slug);
        setPrice(product.price);
        setStock(product.stock);
        setComponentType(product.component_type || '');
        setIsActive(!!product.is_active);
        
        setImages([]);
        setDescription(product.description || '');
        setExistingImages(Array.isArray(product.images) ? product.images : []);

        if (product.tags) {
            setSelectedTagIds(product.tags.map(t => t.id));
        } else {
            setSelectedTagIds([]);
        }

        setCategoryId(product.category_id || '');
        setSectionId(product.section_id || '');
        setBrandId(product.brand_id || '');

        // Parse colors
        setColors(Array.isArray(product.colors) ? product.colors : []);
        setColorInput('');

        // Parse details into label/value rows
        setDetails(
            Array.isArray(product.details)
                ? product.details.map(item => {
                    const colonIdx = item.indexOf(':');
                    if (colonIdx !== -1) {
                        return { label: item.slice(0, colonIdx).trim(), value: item.slice(colonIdx + 1).trim() };
                    }
                    return { label: '', value: item.trim() };
                  })
                : []
        );
        
        setIsFormOpen(true);
    };

    const handleRemoveExistingImage = (imgUrlToRemove) => {
        setExistingImages(prev => prev.filter(url => url !== imgUrlToRemove));
    };

    const handleDynamicValueChange = (attributeId, valueId, isCheckbox = false, isChecked = false) => {
        setProductSelectedValues(prev => {
            if (isCheckbox) {
                const currentArray = Array.isArray(prev[attributeId]) ? prev[attributeId] : [];
                const updatedArray = isChecked 
                    ? [...currentArray, Number(valueId)] 
                    : currentArray.filter(id => Number(id) !== Number(valueId));
                return { ...prev, [attributeId]: updatedArray };
            }
            return { ...prev, [attributeId]: valueId ? Number(valueId) : '' };
        });
    };

    const handleTagCheckboxToggle = (tagId) => {
        setSelectedTagIds(prev => 
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('is_active', isActive ? 1 : 0);
        formData.append('component_type', componentType);
        formData.append('description', description);

        if (categoryId) formData.append('category_id', categoryId);
        if (brandId) formData.append('brand_id', brandId);
        if (sectionId) formData.append('section_id', sectionId);

        if (existingImages && existingImages.length > 0) {
            existingImages.forEach((url) => {
                formData.append('existing_images[]', url); 
            });
        } else {
            formData.append('existing_images', ''); 
        }

        if (images && images.length > 0) {
            images.forEach((file) => {
                formData.append('new_images[]', file); 
            });
        }

        // Serialize dynamic arrays
        details.forEach((row, i) => {
            if (row.value.trim() !== '') {
                const serialized = row.label.trim() ? `${row.label.trim()}: ${row.value.trim()}` : row.value.trim();
                formData.append(`details[${i}]`, serialized);
            }
        });

        colors.forEach((c, i) => formData.append(`colors[${i}]`, c));

        Object.values(productSelectedValues).forEach(val => {
            if (Array.isArray(val)) {
                val.forEach(id => { if(id) formData.append('attribute_value_ids[]', id); });
            } else {
                if (val) formData.append('attribute_value_ids[]', val);
            }
        });

        selectedTagIds.forEach((id) => {
            formData.append('tag_ids[]', id);
        });

        images.forEach((file) => formData.append('images[]', file));

        let result;
        if (editingProduct) {
            result = await updateProduct(editingProduct.id, formData);
        } else {
            result = await addProduct(formData);
        }

        if (result.success) {
            setIsFormOpen(false);
            setEditingProduct(null);
        } else {
            setFormError(result.error);
        }
        setIsSubmitting(false);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             product.slug.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategoryTab === 'all' || 
                                String(product.category_id) === String(selectedCategoryTab);

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6 relative">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">Products Workspace</h1>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Control live database storage profiles, catalog matrix tags, and specs nodes.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input 
                        type="text"
                        placeholder="Search assets by name or matrix slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-xl bg-white text-xs font-semibold focus:outline-none focus:border-[#63c98f] shadow-2xs"
                    />
                    <button onClick={openCreateModal} className="bg-[#63c98f] text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-md hover:bg-[#52b37c] transition cursor-pointer shrink-0 select-none">
                        + Create Asset Profile
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200/60 pb-1 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setSelectedCategoryTab('all')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${selectedCategoryTab === 'all' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
                >
                    All Catalog Logs ({products.length})
                </button>
                {categories.map((cat) => {
                    const count = products.filter(p => String(p.category_id) === String(cat.id)).length;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategoryTab(cat.id)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${String(selectedCategoryTab) === String(cat.id) ? 'bg-[#63c98f] text-white shadow-xs' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
                        >
                            {cat.name?.en || cat.name} ({count})
                        </button>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/70 text-xs font-black text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Product Matrix</th>
                                <th className="px-6 py-4 text-left">Component Status</th>
                                <th className="px-6 py-4 text-left">Stock Position</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">MSRP Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-16 text-xs text-gray-400 font-bold italic">
                                        No active catalog entries match the current workspace filter parameters.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 leading-none mb-1">{product.name}</div>
                                            <span className="text-[10px] text-gray-400 font-mono block tracking-tight mb-1">{product.slug}</span>
                                            {product.tags && product.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {product.tags.map(t => (
                                                        <span key={t.id} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide">
                                                            {t.name?.en || t.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.component_type ? (
                                                <span className="bg-green-50 text-[#63c98f] border border-green-100 px-2 py-0.5 rounded-md text-xs font-bold uppercase">{product.component_type}</span>
                                            ) : (
                                                <span className="text-gray-300 italic text-xs font-medium">Standard Asset</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={product.stock <= 5 ? "text-amber-600 font-bold" : "text-gray-500"}>{product.stock} units</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 inline-flex text-xs font-bold rounded-full border ${product.is_active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                {product.is_active ? 'Active' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-black text-gray-900">${Number(product.price).toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right space-x-4 text-xs font-bold">
                                            <button onClick={() => setViewingProduct(product)} className="text-gray-600 hover:text-gray-900 cursor-pointer">👁️ View</button>
                                            <button onClick={() => openEditModal(product)} className="text-amber-600 hover:text-amber-800 cursor-pointer">✏️ Edit</button>
                                            <button onClick={() => removeProduct(product.id)} className="text-red-500 hover:text-red-700 cursor-pointer">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-6xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6">
                        
                        <div className="md:col-span-4 flex justify-between items-center border-b border-gray-100 pb-2">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                {editingProduct ? `✏️ Modify Product Matrix` : '✨ Launch Catalog Profile'}
                            </h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold text-sm cursor-pointer">✕</button>
                        </div>

                        {formError && <div className="md:col-span-4 text-xs font-bold text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">{formError}</div>}

                        <form onSubmit={handleFormSubmit} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Product Title</label>
                                <input type="text" required value={name} onChange={handleNameChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:border-[#63c98f] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">URL Slug</label>
                                <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:border-[#63c98f] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Price ($)</label>
                                <input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:border-[#63c98f] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Stock Units</label>
                                <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:border-[#63c98f] focus:outline-none" />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Category Selection</label>
                                <select 
                                    value={categoryId} 
                                    onChange={(e) => {
                                        setCategoryId(e.target.value);
                                        setSectionId(''); 
                                        setBrandId(''); 
                                    }} 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:border-[#63c98f]"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name?.en || cat.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Section Target</label>
                                <select 
                                    value={sectionId} 
                                    onChange={(e) => {
                                        setSectionId(e.target.value);
                                        setBrandId(''); 
                                    }} 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:border-[#63c98f]"
                                >
                                    <option value="">All Sections</option>
                                    {filteredSections.map(s => <option key={s.id} value={s.id}>{s.name?.en || s.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Brand Affiliation</label>
                                <select 
                                    value={brandId} 
                                    onChange={(e) => setBrandId(e.target.value)} 
                                    className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:border-[#63c98f]"
                                >
                                    <option value="">All Brands</option>
                                    {filteredBrands.map(b => <option key={b.id} value={b.id}>{b.name?.en || b.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-[#63c98f]">PC Builder Node Config</label>
                                <select value={componentType} onChange={(e) => setComponentType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-green-200 bg-green-50/20 rounded-lg text-sm font-bold text-[#63c98f] focus:outline-none">
                                    <option value="">Not a Component</option>
                                    <option value="case">Case</option>
                                    <option value="cpu">CPU</option>
                                    <option value="motherboard">Motherboard</option>
                                    <option value="graphic_card">Graphic Card</option>
                                    <option value="ram">RAM</option>
                                    <option value="hard_disk">HDD/SSD</option>
                                    <option value="power_supply">Power Supply</option>
                                </select>
                            </div>

                            {/* DYNAMIC COLORS ROW EDITOR */}
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Build Colors</label>
                                <div className="mt-1 flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-lg bg-white min-h-[38px]">
                                    {colors.map((c, i) => (
                                        <span key={i} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs font-bold">
                                            {c}
                                            <button type="button" onClick={() => setColors(prev => prev.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 font-bold leading-none">×</button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={colorInput}
                                        onChange={e => setColorInput(e.target.value)}
                                        onKeyDown={e => {
                                            if ((e.key === 'Enter' || e.key === ',') && colorInput.trim()) {
                                                e.preventDefault();
                                                setColors(prev => [...prev, colorInput.trim()]);
                                                setColorInput('');
                                            }
                                        }}
                                        placeholder={colors.length === 0 ? 'Type and press Enter...' : ''}
                                        className="flex-1 min-w-[80px] text-xs outline-none bg-transparent"
                                    />
                                </div>
                                <p className="text-[9px] text-gray-300 mt-0.5">Press Enter or comma to add</p>
                            </div>

                            {editingProduct && existingImages.length > 0 && (
                                <div className="sm:col-span-2 bg-gray-50/50 border border-gray-100 p-3 rounded-xl space-y-2">
                                    <label className="block text-[10px] font-bold uppercase text-gray-400">Active Server Images (Click ✕ to Drop)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {existingImages.map((imgUrl, idx) => (
                                            <div key={idx} className="relative w-14 h-14 bg-white border border-gray-200 rounded-lg p-1 group overflow-hidden flex items-center justify-center">
                                                <img src={getImageUrl(imgUrl)} alt="vault" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                                <button 
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(imgUrl)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center font-bold text-[9px] rounded-bl shadow-xs hover:bg-red-700 transition cursor-pointer"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Upload New Media Files</label>
                                <input type="file" multiple accept="image/*" onChange={(e) => setImages([...e.target.files])} className="mt-1 block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-green-50 file:text-[#63c98f] cursor-pointer" />
                            </div>
                            <div className="flex items-center sm:col-span-2 py-1">
                                <input type="checkbox" id="modal_is_active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-[#63c98f] border-gray-300 rounded" />
                                <label htmlFor="modal_is_active" className="ml-2 text-[10px] font-bold uppercase text-gray-500">Visible on public store</label>
                            </div>
                            <div className="sm:col-span-2 space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400">Marketing Description (EN)</label>
                                    <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter English marketing summary description..." className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs focus:outline-none focus:border-[#63c98f]" />
                                </div>
                                
                                {/* DYNAMIC DETAILS ROW EDITOR */}
                                <div className="sm:col-span-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-[10px] font-bold uppercase text-gray-400">
                                            Specifications Grid
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setDetails(prev => [...prev, { label: '', value: '' }])}
                                            className="text-[10px] font-bold text-[#63c98f] hover:underline cursor-pointer"
                                        >
                                            + Add Row
                                        </button>
                                    </div>
                                    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                        {details.length === 0 && (
                                            <p className="text-[10px] text-gray-300 italic text-center py-4 border border-dashed border-gray-200 rounded-lg">
                                                No specs yet — click + Add Row
                                            </p>
                                        )}
                                        {details.map((row, i) => (
                                            <div key={i} className="flex gap-1.5 items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Label (e.g. CPU)"
                                                    value={row.label}
                                                    onChange={e => setDetails(prev => prev.map((r, idx) => idx === i ? { ...r, label: e.target.value } : r))}
                                                    className="w-2/5 px-2 py-1.5 border border-gray-200 rounded-lg bg-white text-xs focus:border-[#63c98f] focus:outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Value (e.g. Intel i7)"
                                                    value={row.value}
                                                    onChange={e => setDetails(prev => prev.map((r, idx) => idx === i ? { ...r, value: e.target.value } : r))}
                                                    className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg bg-white text-xs focus:border-[#63c98f] focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setDetails(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="text-red-400 hover:text-red-600 font-bold text-xs px-1.5 shrink-0 cursor-pointer"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="sm:col-span-2 text-right space-x-2 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer">Close</button>
                                <button type="submit" disabled={isSubmitting} className="bg-[#63c98f] text-white px-5 py-2 rounded-xl hover:bg-[#52b37c] disabled:opacity-50 font-bold text-xs tracking-wide cursor-pointer shadow-md">
                                    {isSubmitting ? 'Saving Metrics...' : editingProduct ? 'Save Matrix Updates' : 'Publish Asset Profile'}
                                </button>
                            </div>
                        </form>

                        <div className="md:col-span-2 space-y-4">
                            
                            <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-4 flex flex-col space-y-2">
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-2">
                                    Bind Asset Marketing Tags
                                </h4>
                                {allTags.length === 0 ? (
                                    <p className="text-[11px] text-gray-400 italic py-4 text-center">No system tags registered yet.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2 pt-1 max-h-[150px] overflow-y-auto">
                                        {allTags.map((tag) => (
                                            <label 
                                                key={tag.id}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase select-none cursor-pointer transition-all active:scale-95 ${selectedTagIds.includes(tag.id) ? 'bg-[#63c98f]/10 border-[#63c98f] text-[#63c98f]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                            >
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedTagIds.includes(tag.id)}
                                                    onChange={() => handleTagCheckboxToggle(tag.id)}
                                                    className="hidden"
                                                />
                                                #{tag.name?.en || tag.name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-4 flex flex-col space-y-4 shadow-3xs">
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-2">
                                    Filter Attributes Blueprint Matrix
                                </h4>
                                {availableAttributes.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic text-center py-12">
                                        Please select a target Section on the left configuration column to safely render its corresponding technical structural compatibility blueprint.
                                    </p>
                                ) : (
                                    <div className="space-y-4 overflow-y-auto max-h-[52vh] pr-1">
                                        {availableAttributes.map((attr) => {
                                            const isCheckboxType = attr.type === 'checkbox';
                                            
                                            const currentSelections = Array.isArray(productSelectedValues[attr.id]) 
                                                ? productSelectedValues[attr.id].map(Number) 
                                                : productSelectedValues[attr.id] ? [Number(productSelectedValues[attr.id])] : [];

                                            return (
                                                <div key={attr.id} className="bg-white p-3 rounded-xl border border-gray-200 space-y-2 shadow-3xs">
                                                    <div className="flex justify-between items-center">
                                                        <label className="block text-[11px] font-black uppercase text-gray-700 tracking-wide">
                                                            {attr.name?.en || attr.name}
                                                        </label>
                                                        <span className="text-[9px] bg-slate-100 font-bold px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-wider">
                                                            {isCheckboxType ? 'Checkbox (Multiple Choices)' : 'Dropdown (Single Choice)'}
                                                        </span>
                                                    </div>

                                                    {isCheckboxType ? (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                                            {attr.values?.map((val) => (
                                                                <label 
                                                                    key={val.id} 
                                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all ${currentSelections.includes(Number(val.id)) ? 'bg-green-50/40 border-[#63c98f] text-gray-900 font-bold' : 'bg-slate-50/50 border-gray-200/70 text-gray-500 hover:bg-slate-50'}`}
                                                                >
                                                                    <input 
                                                                        type="checkbox"
                                                                        checked={currentSelections.includes(Number(val.id))}
                                                                        onChange={(e) => handleDynamicValueChange(attr.id, Number(val.id), true, e.target.checked)}
                                                                        className="accent-[#63c98f] h-3.5 w-3.5"
                                                                    />
                                                                    <span>{typeof val.value === 'object' ? (val.value?.en || val.value) : val.value}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <select
                                                            value={productSelectedValues[attr.id] || ''}
                                                            onChange={(e) => handleDynamicValueChange(attr.id, e.target.value ? Number(e.target.value) : '', false)}
                                                            className="w-full border border-gray-300 p-2 text-xs bg-slate-50/50 rounded-lg focus:bg-white focus:border-[#63c98f] outline-none transition"
                                                        >
                                                            <option value="">Select Blueprint Value</option>
                                                            {attr.values?.map((val) => (
                                                                <option key={val.id} value={val.id}>
                                                                    {typeof val.value === 'object' ? (val.value?.en || val.value) : val.value}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {viewingProduct && (
                <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl border border-gray-100 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">📦 Warehouse Inspection Node</h3>
                            <button onClick={() => setViewingProduct(null)} className="text-gray-400 hover:text-gray-700 font-bold text-sm cursor-pointer">✕</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span className="block mb-0.5">Asset Evaluation</span>
                                <span className="text-base font-black text-gray-900">${Number(viewingProduct.price).toFixed(2)}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span className="block mb-0.5">Physical Stock</span>
                                <span className={`text-base font-black ${viewingProduct.stock <= 0 ? 'text-red-600' : 'text-green-600'}`}>{viewingProduct.stock} Units</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span className="block mb-0.5">Section Node</span>
                                <span className="text-xs font-black text-[#63c98f] truncate block mt-0.5">
                                    {viewingProduct.section?.name?.en || viewingProduct.section?.name || 'Standard Unit'}
                                </span>
                            </div>
                        </div>

                        {viewingProduct.tags && viewingProduct.tags.length > 0 && (
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-bold uppercase text-gray-400">Bound Marketing Tags</h4>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {viewingProduct.tags.map(t => (
                                        <span key={t.id} className="bg-green-50 text-[#63c98f] border border-green-100 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                                            #{t.name?.en || t.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {viewingProduct.attribute_groups && viewingProduct.attribute_groups.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold uppercase text-gray-400">Blueprint Compatibility Matrix</h4>
                                <div className="space-y-1">
                                    {viewingProduct.attribute_groups.map((group, idx) => (
                                        <p key={idx} className="text-xs text-gray-700">
                                            <span className="font-bold">{group.attribute_name?.en || group.attribute_name}: </span>
                                            {group.selected_values.map(v => v.value_name?.en || v.value_name).join(', ')}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {viewingProduct.images?.length > 0 && (
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-bold uppercase text-gray-400">Media Catalog Array</h4>
                                <div className="flex gap-2 overflow-x-auto py-1">
                                    {viewingProduct.images.map((img, idx) => (
                                        <img key={idx} src={getImageUrl(img)} alt="preview" className="h-14 w-14 object-cover rounded-lg border border-gray-200 bg-gray-50 flex-shrink-0" />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {viewingProduct.details?.length > 0 && (
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-bold uppercase text-gray-400">Live Technical Specification Render</h4>
                                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden text-center" dir="rtl">
                                    {viewingProduct.details.map((item, index) => {
                                        if (item.includes(':')) {
                                            const [t, v] = item.split(':');
                                            return (
                                                <div key={index} className="grid grid-cols-3 border-b border-gray-800 last:border-0 text-xs font-medium">
                                                    <div className="col-span-1 p-2.5 bg-[#141414] text-gray-200 font-bold border-l border-gray-800">{t.trim()}</div>
                                                    <div className="col-span-2 p-2.5 text-gray-300 font-sans" dir="ltr">{v.trim()}</div>
                                                </div>
                                            );
                                        }
                                        return <div key={index} className="p-2 bg-[#141414] text-gray-400 text-[10px] italic">{item}</div>;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}