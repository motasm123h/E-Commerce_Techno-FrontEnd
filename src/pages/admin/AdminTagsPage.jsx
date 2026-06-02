import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminTagsPage() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const [nameEn, setNameEn] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchTags = () => {
        setLoading(true);
        api.get('/admin/tags')
            .then(res => {
                if (Array.isArray(res.data)) setTags(res.data);
            })
            .catch(err => console.error("Failed to stream tags matrix", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const openCreateModal = () => {
        setEditingTag(null);
        setNameEn('');
        setNameAr('');
        setFormError(null);
        setIsFormOpen(true);
    };

    const openEditModal = (tag) => {
        setEditingTag(tag);
        setNameEn(tag.name?.en || '');
        setNameAr(tag.name?.ar || '');
        setFormError(null);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSubmitting(true);

        const payload = {
            name: { en: nameEn.trim(), ar: nameAr.trim() }
        };

        try {
            if (editingTag) {
                await api.put(`/admin/tags/${editingTag.id}`, payload);
            } else {
                await api.post('/admin/tags', payload);
            }
            setIsFormOpen(false);
            fetchTags();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to sync tag configuration.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to drop this asset tag node?")) return;
        try {
            await api.delete(`/admin/tags/${id}`);
            fetchTags();
        } catch (err) {
            alert("Failed to drop selected tag link.");
        }
    };

    if (loading) return <div className="p-6 text-xs font-black uppercase text-gray-400 animate-pulse tracking-widest">Streaming structural tag matrices...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                    <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">Marketing Tags Index</h1>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Manage globally available asset tracking tags and performance grouping queries.</p>
                </div>
                <button onClick={openCreateModal} className="bg-[#63c98f] text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-md hover:bg-[#52b37c] transition cursor-pointer select-none">
                    + Launch New Tag
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.length === 0 ? (
                    <p className="text-xs text-gray-400 font-bold italic col-span-3 text-center py-12 bg-white rounded-2xl border border-gray-200">No cross-catalogs marketing tags built inside the system database layout.</p>
                ) : (
                    tags.map(tag => (
                        <div key={tag.id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-3xs flex items-center justify-between group hover:border-[#63c98f]/40 transition duration-300">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">#{tag.name?.en}</h3>
                                <span className="text-xs text-gray-400 font-semibold block mt-0.5" dir="rtl">{tag.name?.ar}</span>
                                <span className="text-[10px] font-mono text-slate-400 block mt-2">Slug: {tag.slug}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold shrink-0">
                                <button onClick={() => openEditModal(tag)} className="text-amber-600 hover:text-amber-800 cursor-pointer">Modify</button>
                                <button onClick={() => handleDelete(tag.id)} className="text-red-500 hover:text-red-700 cursor-pointer">Drop</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                {editingTag ? '✏️ Modify Structural Tag' : '✨ Launch Master Tag Node'}
                            </h3>
                            <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold text-sm">✕</button>
                        </div>

                        {formError && <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">{formError}</div>}

                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase text-gray-400">Tag Token Label (EN)</label>
                            <input type="text" required value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g., Gaming" className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:border-[#63c98f] focus:outline-none font-semibold" />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase text-gray-400">اسم الوسم (AR)</label>
                            <input type="text" required value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="مثال: جيمنج وثقيل" className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:border-[#63c98f] focus:outline-none font-semibold text-right" dir="rtl" />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50">Close</button>
                            <button type="submit" disabled={submitting} className="bg-[#63c98f] text-white px-5 py-2 rounded-xl hover:bg-[#52b37c] disabled:opacity-50 font-bold text-xs tracking-wide cursor-pointer shadow-md">
                                {submitting ? 'Publishing...' : 'Compile Token'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}