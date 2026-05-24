import { useState, useEffect } from 'react';
import { categoryApi } from '../../services/adminService';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            if (editingId) {
                // تمرير المعرف متبوعاً بالكائن المطابق تماماً لما ينتظره شرط الباك إند عندك
                await categoryApi.update(editingId, { name: name.trim() });
                setEditingId(null);
            } else {
                await categoryApi.create({ name: name.trim() });
            }
            setName('');
            fetchCategories(); // تحديث فوري آمن ومضمون للعلاقات
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save category block criteria.");
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setName(cat.name);
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
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">Categories Directory</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3 shadow-xs">
                <input 
                    type="text" 
                    placeholder="Type Category Label (e.g., Electronics, Hardware)..." 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 font-medium"
                    required
                />
                <button type="submit" className="bg-gray-900 hover:bg-blue-600 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition cursor-pointer tracking-wider">
                    {editingId ? 'Save Update' : 'Add Category'}
                </button>
                {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setName(''); }} className="text-xs font-bold text-gray-400 hover:text-gray-600 transition">Cancel</button>
                )}
            </form>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <ul className="divide-y divide-gray-100">
                    {categories.length === 0 ? (
                        <li className="p-4 text-center text-sm text-gray-400 italic">No nodes found in directory record indexes.</li>
                    ) : (
                        categories.map(cat => (
                            <li key={cat.id} className="p-4 flex justify-between items-center hover:bg-gray-50/60 transition text-sm font-semibold text-gray-700">
                                <span>{cat.name}</span>
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