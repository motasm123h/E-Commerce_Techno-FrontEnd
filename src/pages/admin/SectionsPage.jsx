import { useState, useEffect } from 'react';
import { useSections } from '../../hooks/useSections';
import { useCategories } from '../../hooks/useCategories';
import api from '../../services/api';

export default function SectionsPage() {
    const { sections, loading: sectionsLoading, error: sectionsError, addSection, removeSection, updateSection } = useSections();
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
    
    const [allAttributes, setAllAttributes] = useState([]);
    const [selectedAttributeIds, setSelectedAttributeIds] = useState([]);

    const [editingId, setEditingId] = useState(null); 
    const [nameEn, setNameEn] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [displayOnHome, setDisplayOnHome] = useState(false);
    const [homeOrder, setHomeOrder] = useState(0);
    
    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const res = await api.get('/admin/attributes');
                setAllAttributes(res.data.data || res.data);
            } catch (err) {
                console.error("Failed to load attributes", err);
            }
        };
        fetchAttributes();
    }, []);

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleEditClick = async (section) => {
        setEditingId(section.id);
        setNameEn(section.name?.en || section.name || '');
        setNameAr(section.name?.ar || '');
        setCategoryId(section.category_id || '');
        setDisplayOnHome(section.display_on_home === 1 || section.display_on_home === true);
        setHomeOrder(section.home_order || 0);
        setFormError(null);
        
        try {
            const res = await api.get(`/admin/sections/${section.id}/attributes`);
            const linkedAttributes = res.data.data || res.data;
            const linkedIds = linkedAttributes.map(attr => attr.id);
            setSelectedAttributeIds(linkedIds);
        } catch (err) {
            console.error("Failed to load section attributes", err);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAttributeToggle = (attrId) => {
        setSelectedAttributeIds(prev => 
            prev.includes(attrId) 
                ? prev.filter(id => id !== attrId) 
                : [...prev, attrId]
        );
    };

    const resetForm = () => {
        setEditingId(null);
        setNameEn('');
        setNameAr('');
        setCategoryId('');
        setDisplayOnHome(false);
        setHomeOrder(0);
        setSelectedAttributeIds([]);
        setFormError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        if (!categoryId) {
            setFormError('Please select a parent category.');
            setIsSubmitting(false);
            return;
        }

        const payload = { 
            name: {
                en: nameEn.trim(),
                ar: nameAr.trim()
            }, 
            slug: generateSlug(nameEn.trim()), // 🔥 توليد الـ slug لمنع حدوث خطأ الـ 422
            category_id: parseInt(categoryId),
            display_on_home: displayOnHome ? 1 : 0,
            home_order: parseInt(homeOrder) || 0
        };

        try {
            let result;
            let currentSectionId = editingId;

            if (editingId) {
                result = await updateSection(editingId, payload);
            } else {
                result = await addSection(payload);
                if (result.success) currentSectionId = result.data.id; 
            }
            
            if (result.success && currentSectionId) {
                await api.post(`/admin/sections/${currentSectionId}/attributes`, {
                    attribute_ids: selectedAttributeIds
                });
                resetForm(); 
            } else {
                setFormError(result.error || 'Failed to save section');
            }
        } catch (err) {
            setFormError('An unexpected error occurred.');
        }

        setIsSubmitting(false);
    };

    if (sectionsLoading || categoriesLoading) return <div className="p-6 text-gray-600">Loading sections structure data...</div>;
    if (sectionsError || categoriesError) return <div className="p-6 text-red-600">{sectionsError || categoriesError}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Sections</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 transition-all">
                <h2 className="text-lg font-medium mb-4 text-gray-800">
                    {editingId ? 'Edit Section' : 'Add New Section'}
                </h2>
                {formError && <p className="text-sm text-red-600 mb-3">{formError}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Section Name (English)</label>
                            <input
                                type="text"
                                value={nameEn}
                                onChange={(e) => setNameEn(e.target.value)}
                                placeholder="e.g., Gaming Monitors"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Section Name (Arabic)</label>
                            <input
                                type="text"
                                value={nameAr}
                                onChange={(e) => setNameAr(e.target.value)}
                                placeholder="مثال: شاشات الألعاب"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                dir="rtl"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            >
                                <option value="">Select Parent Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name?.en || cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input
                                type="number"
                                value={homeOrder}
                                onChange={(e) => setHomeOrder(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 py-2">
                        <input
                            type="checkbox"
                            id="displayOnHomeCheck"
                            checked={displayOnHome}
                            onChange={(e) => setDisplayOnHome(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="displayOnHomeCheck" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Display on Home Page
                        </label>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <label className="block text-sm font-bold text-gray-800 mb-1">
                            Link Attributes to this Section
                        </label>
                        <p className="text-xs text-gray-500 mb-4">
                            Select the specific attributes (specifications) that belong to products in this section.
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {allAttributes.map((attr) => (
                                <label key={attr.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition">
                                    <input
                                        type="checkbox"
                                        checked={selectedAttributeIds.includes(attr.id)}
                                        onChange={() => handleAttributeToggle(attr.id)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700">{attr.name?.en || attr.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={resetForm}
                                disabled={isSubmitting}
                                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 font-medium cursor-pointer"
                            >
                                Cancel
                            </button>
                        )}
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium cursor-pointer"
                        >
                            {isSubmitting ? 'Saving...' : editingId ? 'Update Section' : 'Add Section'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (EN / AR)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sections.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No sections found.</td></tr>
                        ) : (
                            sections.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">{item.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {item.name?.en || item.name} <span className="text-gray-400 mx-1">|</span> <span className="text-gray-600" dir="rtl">{item.name?.ar || '—'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.display_on_home ? (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">
                                                Visible ({item.home_order})
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Hidden</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm space-x-3">
                                        <button 
                                            onClick={() => handleEditClick(item)} 
                                            className="text-blue-600 hover:text-blue-900 font-medium cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => removeSection(item.id)} 
                                            className="text-red-600 hover:text-red-900 font-medium cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}