import { useState, useEffect } from 'react';
import { bannerApi } from '../../services/adminService';
import { getImageUrl } from '../../services/api';

export default function BannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    // Form states
    const [imageFile, setImageFile] = useState(null);
    const [linkUrl, setLinkUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await bannerApi.getAllAdmin();
            setBanners(res.data || []);
        } catch (err) {
            console.error("Failed to fetch banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const openCreate = () => {
        setEditingBanner(null);
        setImageFile(null);
        setLinkUrl('');
        setIsActive(true);
        setIsFormOpen(true);
    };

    const openEdit = (banner) => {
        setEditingBanner(banner);
        setImageFile(null);
        setLinkUrl(banner.link_url || '');
        setIsActive(!!banner.is_active);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        if (imageFile) formData.append('image', imageFile);
        if (linkUrl) formData.append('link_url', linkUrl);
        formData.append('is_active', isActive ? 1 : 0);

        try {
            if (editingBanner) {
                await bannerApi.update(editingBanner.id, formData);
            } else {
                await bannerApi.create(formData);
            }
            setIsFormOpen(false);
            fetchBanners();
        } catch (err) {
            alert("Failed to save banner.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            await bannerApi.delete(id);
            setBanners(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            alert("Failed to delete banner.");
        }
    };

    if (loading) return <div className="p-6 text-gray-500 font-medium">Loading banners configuration...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">Promo Banners</h1>
                <button onClick={openCreate} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition cursor-pointer">
                    + Add New Banner
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map(banner => (
                    <div key={banner.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs relative">
                        <div className="h-40 bg-neutral-900 flex items-center justify-center">
                            <img src={getImageUrl(banner.image_path)} alt="banner" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="p-4 flex flex-col space-y-3">
                            <div className="flex justify-between items-center">
                                <span className={`px-2 py-1 text-[10px] font-bold rounded-sm uppercase ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {banner.is_active ? 'Active' : 'Hidden'}
                                </span>
                                <div className="space-x-3 text-xs font-bold">
                                    <button onClick={() => openEdit(banner)} className="text-amber-600 hover:underline cursor-pointer">Edit</button>
                                    <button onClick={() => handleDelete(banner.id)} className="text-red-600 hover:underline cursor-pointer">Delete</button>
                                </div>
                            </div>
                            {banner.link_url && (
                                <p className="text-xs text-gray-500 truncate border-t border-gray-100 pt-2">Link: {banner.link_url}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-gray-950/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3">
                            {editingBanner ? 'Edit Banner' : 'Create Banner'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Banner Image File</label>
                                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} required={!editingBanner} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 cursor-pointer" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Redirect Link (Optional)</label>
                                <input type="text" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="/category/laptops" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300" id="b_active" />
                                <label htmlFor="b_active" className="ml-2 text-xs font-bold text-gray-600">Active (Visible to public)</label>
                            </div>
                            
                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-xs">
                                    {isSubmitting ? 'Saving...' : 'Save Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}