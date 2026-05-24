import { useState, useEffect } from 'react';
import { useSettings } from '../../app/SettingContext';

export default function AdminSettingsPage() {
    const { settings, loading, error, updateSettings } = useSettings();
    
    const [formData, setFormData] = useState({
        about_foundation: '',
        about_history: '',
        about_who_we_are: '',
        about_agents: '',
        contact_phone_1: '',
        contact_phone_2: '',
        contact_whatsapp: '',
        contact_email: '',
        contact_address: '',
        contact_hall_location: '',
        contact_map_url: '',
        // --- الحقول الجديدة للفوتر والسوشيال ميديا ---
        footer_branches: '',
        footer_phones: '',
        social_facebook: '',
        social_instagram: '',
        social_linkedin: '',
        social_twitter: ''
    });

    const [uiStatus, setUiStatus] = useState({ error: null, success: false, submitting: false });

    useEffect(() => {
        if (settings && Object.keys(settings).length > 0) {
            setFormData(prev => ({ ...prev, ...settings }));
        }
    }, [settings]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUiStatus({ error: null, success: false, submitting: true });

        const result = await updateSettings(formData);
        if (result.success) {
            setUiStatus({ error: null, success: true, submitting: false });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setUiStatus({ error: result.error, success: false, submitting: false });
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Loading settings dashboard...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <h1 className="text-2xl font-black text-gray-900">Dynamic Store Configurations</h1>
            
            {uiStatus.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm font-semibold">
                    ✓ All store content and mapping criteria compiled and published successfully!
                </div>
            )}
            {uiStatus.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-semibold">
                    {uiStatus.error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. About Us Content */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-xs">
                    <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-2">1. About Us Content CMS</h3>
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Foundation Summary Text</label>
                        <textarea name="about_foundation" rows="2" value={formData.about_foundation} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Corporate History Timeline Text</label>
                        <textarea name="about_history" rows="5" value={formData.about_history} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase">"Who We Are" Identity Declaration</label>
                        <textarea name="about_who_we_are" rows="4" value={formData.about_who_we_are} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Exclusive Agency Brand Marks</label>
                        <input type="text" name="about_agents" value={formData.about_agents} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                    </div>
                </div>

                {/* 2. Contact Info & Location Mapping */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                    <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">2. Contact Info & Location Mapping</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Primary Phone Line</label>
                            <input type="text" name="contact_phone_1" value={formData.contact_phone_1} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Sales Hall Phone Line</label>
                            <input type="text" name="contact_phone_2" value={formData.contact_phone_2} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">WhatsApp Operations Link/Number</label>
                            <input type="text" name="contact_whatsapp" value={formData.contact_whatsapp} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Support Email Desk</label>
                            <input type="email" name="contact_email" value={formData.contact_email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Regional Headquarters Address</label>
                            <input type="text" name="contact_address" value={formData.contact_address} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Showroom/Sale Hall Address String</label>
                            <input type="text" name="contact_hall_location" value={formData.contact_hall_location} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="block text-xs font-bold text-blue-600 uppercase">Google Maps Embed URL (src attribute only)</label>
                            <input type="text" name="contact_map_url" value={formData.contact_map_url} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm font-mono text-xs" />
                        </div>
                    </div>
                </div>

                {/* 3. Footer & Social Media (القسم الجديد الديناميكي) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                    <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">3. Footer & Social Media Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* قوائم الفوتر الديناميكية */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase">
                                    Footer Branches <span className="text-blue-500 normal-case">(Write each branch on a new line)</span>
                                </label>
                                <textarea name="footer_branches" rows="4" placeholder="Jnah, Said Al Khansa St.&#10;Zalqa, Main Road" value={formData.footer_branches} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-mono leading-relaxed" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase">
                                    Footer Phone Numbers <span className="text-blue-500 normal-case">(Write each number on a new line)</span>
                                </label>
                                <textarea name="footer_phones" rows="3" placeholder="+961 71 222 667&#10;+961 1 855 175" value={formData.footer_phones} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-mono leading-relaxed" />
                            </div>
                        </div>

                        {/* روابط السوشيال ميديا */}
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-blue-600 uppercase">Facebook URL</label>
                                <input type="url" name="social_facebook" placeholder="https://facebook.com/..." value={formData.social_facebook} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-pink-600 uppercase">Instagram URL</label>
                                <input type="url" name="social_instagram" placeholder="https://instagram.com/..." value={formData.social_instagram} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-blue-500 uppercase">LinkedIn URL</label>
                                <input type="url" name="social_linkedin" placeholder="https://linkedin.com/..." value={formData.social_linkedin} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-800 uppercase">X (Twitter) URL</label>
                                <input type="url" name="social_twitter" placeholder="https://x.com/..." value={formData.social_twitter} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                            </div>
                        </div>

                    </div>
                </div>

                <div className="text-right">
                    <button type="submit" disabled={uiStatus.submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition duration-150 disabled:opacity-50 shadow-md cursor-pointer text-sm">
                        {uiStatus.submitting ? 'Publishing Changes...' : 'Publish Content Metrics'}
                    </button>
                </div>
            </form>
        </div>
    );
}