import { useState, useEffect } from 'react';
import { categoryApi } from '../../services/adminService';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [nameEn, setNameEn] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryApi.getAll();
            setCategories(data.data ? data.data : data);
        } catch (err) {
            console.error("Failed to load categories array map", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nameEn.trim() || !nameAr.trim()) return;

        const payload = {
            name: {
                en: nameEn.trim(),
                ar: nameAr.trim()
            },
            slug: generateSlug(nameEn.trim()) // 🔥 إضافة الـ slug لحل خطأ 422
        };

        try {
            if (editingId) {
                await categoryApi.update(editingId, payload);
                setEditingId(null);
            } else {
                await categoryApi.create(payload);
            }
            setNameEn('');
            setNameAr('');
            fetchCategories(); 
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save category block criteria.");
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setNameEn(cat.name?.en || cat.name || '');
        setNameAr(cat.name?.ar || '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNameEn('');
        setNameAr('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category permanently?")) return;
        try {
            await categoryApi.delete(id);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert("Failed to remove category block.");
        }
    };

    if (loading) return <div className="p-6 text-gray-500 font-medium">Loading categories directory...</div>;

    return (
        <div className="space-y-6 max-w-3xl">
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">Categories Directory</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-gray-200 space-y-4 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        type="text" 
                        placeholder="Category Label (English)..." 
                        value={nameEn} 
                        onChange={(e) => setNameEn(e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 font-medium"
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="اسم التصنيف (بالعربية)..." 
                        value={nameAr} 
                        onChange={(e) => setNameAr(e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 font-medium"
                        required
                        dir="rtl"
                    />
                </div>
                <div className="flex justify-end gap-3 items-center">
                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="text-xs font-bold text-gray-400 hover:text-gray-600 transition">Cancel</button>
                    )}
                    <button type="submit" className="bg-gray-900 hover:bg-blue-600 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition cursor-pointer tracking-wider">
                        {editingId ? 'Save Update' : 'Add Category'}
                    </button>
                </div>
            </form>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <ul className="divide-y divide-gray-100">
                    {categories.length === 0 ? (
                        <li className="p-4 text-center text-sm text-gray-400 italic">No nodes found in directory record indexes.</li>
                    ) : (
                        categories.map(cat => (
                            <li key={cat.id} className="p-4 flex justify-between items-center hover:bg-gray-50/60 transition text-sm font-semibold text-gray-700">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-900">{cat.name?.en || cat.name}</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-500" dir="rtl">{cat.name?.ar || '—'}</span>
                                </div>
                                <div className="space-x-3 text-xs font-bold">
                                    <button onClick={() => startEdit(cat)} className="text-amber-600 hover:underline cursor-pointer">✏️ Edit</button>
                                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline cursor-pointer">Delete</button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}