import { useState } from 'react';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { useSections } from '../../hooks/useSections';
import { getImageUrl } from '../../services/api';

export default function AdminProductsPage() {
    const { products, addProduct, updateProduct, removeProduct } = useAdminProducts();
    const { categories } = useCategories();
    const { brands } = useBrands();
    const { sections } = useSections();

    // حالات التحكم بظهور النوافذ المنبثقة المعزولة
    const [viewingProduct, setViewingProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // حالات الحقول للتحكم التام بمدخلات الداتا
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [details, setDetails] = useState('');
    const [colors, setColors] = useState(''); 
    const [componentType, setComponentType] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [categoryId, setCategoryId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [images, setImages] = useState([]); 
    
    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNameChange = (e) => {
        const title = e.target.value;
        setName(title);
        setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormError(null);
        setName(''); setSlug(''); setPrice(''); setStock(''); setDetails(''); setColors(''); setComponentType('');
        setIsActive(true); setCategoryId(''); setBrandId(''); setSectionId(''); setImages([]);
        setIsFormOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormError(null);
        setName(product.name);
        setSlug(product.slug);
        setPrice(product.price);
        setStock(product.stock);
        setComponentType(product.component_type || '');
        setIsActive(!!product.is_active);
        setCategoryId(product.category_id || '');
        setBrandId(product.brand_id || '');
        setSectionId(product.section_id || '');
        setColors(Array.isArray(product.colors) ? product.colors.join(', ') : '');
        setDetails(Array.isArray(product.details) ? product.details.join(' // \n') : '');
        setIsFormOpen(true);
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
        formData.append('details', details);
        formData.append('colors', colors);
        formData.append('is_active', isActive ? 1 : 0);
        formData.append('component_type', componentType);
        // if (componentType) formData.append('component_type', componentType);
        if (categoryId) formData.append('category_id', categoryId);
        if (brandId) formData.append('brand_id', brandId);
        if (sectionId) formData.append('section_id', sectionId);

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

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">Products Workspace</h1>
                <button onClick={openCreateModal} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-xs hover:bg-blue-700 transition cursor-pointer">
                    + Create Product Profile
                </button>
            </div>

            {/* الجدول الإداري النظيف والواسع */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left">Product</th>
                            <th className="px-6 py-3 text-left">Component</th>
                            <th className="px-6 py-3 text-left">Stock Position</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">MSRP Price</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900 leading-none">{product.name}</div>
                                    <span className="text-[10px] text-gray-400 font-mono mt-1 block">{product.slug}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {product.component_type ? (
                                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-xs font-bold uppercase">{product.component_type}</span>
                                    ) : (
                                        <span className="text-gray-300 italic text-xs font-medium">Standard</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={product.stock <= 5 ? "text-amber-600 font-bold" : "text-gray-500"}>{product.stock} units</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 inline-flex text-xs font-bold rounded-full ${product.is_active ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500'}`}>
                                        {product.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-black text-gray-900">${Number(product.price).toFixed(2)}</td>
                                <td className="px-6 py-4 text-right space-x-3 text-xs font-bold">
                                    <button onClick={() => setViewingProduct(product)} className="text-blue-600 hover:underline cursor-pointer">👁️ View</button>
                                    <button onClick={() => openEditModal(product)} className="text-amber-600 hover:underline cursor-pointer">✏️ Edit</button>
                                    <button onClick={() => removeProduct(product.id)} className="text-red-600 hover:underline cursor-pointer">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- نافذة المودال المعزولة للإنشاء والتعديل التلقائي (Form Modal) --- */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                {editingProduct ? `✏️ Modify Product Matrix` : '✨ Launch Catalog Profile'}
                            </h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold text-sm cursor-pointer">✕</button>
                        </div>

                        {formError && <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">{formError}</p>}

                        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Product Title</label>
                                <input type="text" required value={name} onChange={handleNameChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">URL Slug</label>
                                <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Price ($)</label>
                                <input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Stock Units</label>
                                <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Build Colors (, separated)</label>
                                <input type="text" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Red, Green" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Media Files</label>
                                <input type="file" multiple accept="image/*" onChange={(e) => setImages([...e.target.files])} className="mt-1 block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Category</label>
                                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none">
                                    <option value="">None</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Brand</label>
                                <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none">
                                    <option value="">None</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name} - {b.slug}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Section</label>
                                <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none">
                                    <option value="">None</option>
                                    {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-blue-600">PC Builder Configurator Node</label>
                                <select value={componentType} onChange={(e) => setComponentType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-blue-200 bg-blue-50/20 rounded-lg text-sm font-bold text-blue-700 focus:outline-none">
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
                            <div className="flex items-center md:col-span-2 py-1">
                                <input type="checkbox" id="modal_is_active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                <label htmlFor="modal_is_active" className="ml-2 text-[10px] font-bold uppercase text-gray-500">Visible on public store</label>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Specifications Grid (Title : Value // format)</label>
                                <textarea rows="4" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="الوزن : 294g //&#10;المقاومة : 32 ohm //" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-xs font-mono focus:outline-none" />
                            </div>
                            <div className="md:col-span-2 text-right space-x-2 pt-2 border-t border-gray-100">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer">Close</button>
                                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold text-xs tracking-wide cursor-pointer shadow-xs">
                                    {isSubmitting ? 'Saving Metrics...' : editingProduct ? 'Save Matrix Updates' : 'Publish Asset Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- نافذة معاينة بيانات المخزن واستعراض التفاصيل (View Modal) --- */}
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
                                <span className="text-xs font-black text-blue-600 truncate block mt-0.5">{viewingProduct.section?.name || viewingProduct.section || 'N/A'}</span>
                            </div>
                        </div>

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