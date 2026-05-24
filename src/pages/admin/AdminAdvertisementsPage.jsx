import { useState, useRef } from 'react';
import { useAdvertisements } from '../../hooks/useAdvertisements';
import { getImageUrl } from '../../services/api';

export default function AdminAdvertisementsPage() {
    const { ads, loading, error, addAd, updateAd, removeAd } = useAdvertisements();
    
    // حالات التحكم بالنافذة المنبثقة
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAd, setEditingAd] = useState(null);

    // حالات الحقول (Form State)
    const [title, setTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [type, setType] = useState('logo'); // 'logo' or 'banner'
    const [isActive, setIsActive] = useState(true);
    const [sortOrder, setSortOrder] = useState(0);
    
    // التعامل مع الصور
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    
    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // فتح نافذة الإنشاء
    const openCreateModal = () => {
        setEditingAd(null);
        setFormError(null);
        setTitle('');
        setLinkUrl('');
        setType('logo');
        setIsActive(true);
        setSortOrder(0);
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsFormOpen(true);
    };

    // فتح نافذة التعديل
    const openEditModal = (ad) => {
        setEditingAd(ad);
        setFormError(null);
        setTitle(ad.title);
        setLinkUrl(ad.link_url || '');
        setType(ad.type);
        setIsActive(!!ad.is_active);
        setSortOrder(ad.sort_order || 0);
        setImageFile(null);
        // عرض الصورة الحالية كمعاينة
        setImagePreview(ad.image_path ? getImageUrl(ad.image_path) : null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsFormOpen(true);
    };

    // التعامل مع اختيار صورة جديدة
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // إرسال البيانات (إنشاء أو تعديل)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        if (!editingAd && !imageFile) {
            setFormError('Please select an image for the advertisement.');
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('is_active', isActive ? 1 : 0);
        formData.append('sort_order', sortOrder);
        
        if (linkUrl) formData.append('link_url', linkUrl);
        if (imageFile) formData.append('image', imageFile);

        let result;
        if (editingAd) {
            result = await updateAd(editingAd.id, formData);
        } else {
            result = await addAd(formData);
        }

        if (result.success) {
            setIsFormOpen(false);
            setEditingAd(null);
        } else {
            setFormError(result.error);
        }
        setIsSubmitting(false);
    };

    // الحذف مع تأكيد بسيط
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this advertisement?')) {
            await removeAd(id);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold tracking-widest uppercase">Loading Advertisements...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">Advertisements Management</h1>
                <button onClick={openCreateModal} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-xs hover:bg-blue-700 transition cursor-pointer">
                    + Create New Ad
                </button>
            </div>

            {/* الجدول الإداري */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3 text-left w-24">Image</th>
                            <th className="px-6 py-3 text-left">Title & Link</th>
                            <th className="px-6 py-3 text-left">Type</th>
                            <th className="px-6 py-3 text-center">Order</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                        {ads.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No advertisements found.</td></tr>
                        ) : (
                            ads.map((ad) => (
                                <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="h-12 w-20 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center p-1">
                                            {ad.image_path ? (
                                                <img src={getImageUrl(ad.image_path)} alt={ad.title} className="max-h-full max-w-full object-contain" />
                                            ) : (
                                                <span className="text-[10px] text-gray-400">No Img</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{ad.title}</div>
                                        {ad.link_url && (
                                            <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline mt-1 truncate max-w-xs block">
                                                {ad.link_url}
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${ad.type === 'logo' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                            {ad.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{ad.sort_order}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-full ${ad.is_active ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500'}`}>
                                            {ad.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3 text-xs font-bold">
                                        <button onClick={() => openEditModal(ad)} className="text-amber-600 hover:underline cursor-pointer">✏️ Edit</button>
                                        <button onClick={() => handleDelete(ad.id)} className="text-red-600 hover:underline cursor-pointer">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* نافذة الإنشاء والتعديل (Modal) */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                {editingAd ? `✏️ Modify Advertisement` : '✨ Launch New Advertisement'}
                            </h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold text-sm cursor-pointer">✕</button>
                        </div>

                        {formError && <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">{formError}</p>}

                        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Title / Name</label>
                                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:outline-none" />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Ad Type Layout</label>
                                <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:outline-none">
                                    <option value="logo">Partner Logo (Small)</option>
                                    <option value="banner">Large Banner (Promo)</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Target Link URL (Optional)</label>
                                <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com/promo" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:outline-none" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400">Display Order</label>
                                <input type="number" required value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:outline-none" />
                            </div>

                            <div className="flex items-center py-1 mt-6">
                                <input type="checkbox" id="ad_is_active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer" />
                                <label htmlFor="ad_is_active" className="ml-2 text-[10px] font-bold uppercase text-gray-500 cursor-pointer">Visible on public store</label>
                            </div>

                            {/* رفع الصورة والمعاينة */}
                            <div className="md:col-span-2 border border-gray-200 rounded-xl p-4 bg-gray-50">
                                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Advertisement Image</label>
                                <div className="flex items-start gap-4">
                                    {imagePreview && (
                                        <div className="h-24 w-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2 shrink-0">
                                            <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            ref={fileInputRef}
                                            className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 cursor-pointer" 
                                        />
                                        <p className="text-[10px] text-gray-400 mt-2">Recommended: PNG with transparent background for Logos. JPG/WebP for Banners.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 text-right space-x-2 pt-2 border-t border-gray-100 mt-2">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer">Close</button>
                                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold text-xs tracking-wide cursor-pointer shadow-xs">
                                    {isSubmitting ? 'Saving...' : editingAd ? 'Save Updates' : 'Publish Advertisement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}