import { useState, useEffect } from 'react';
// import { useSettings } from '../../app/SettingContext';
import { useGlobalApp } from '../../app/AppContext';
export default function AdminSettingsPage() {
    const { settings, loading, error, updateSettings } = useGlobalApp();
    
    const [formData, setFormData] = useState({
        about_foundation_en: '',
        about_foundation_ar: '',
        about_history_en: '',
        about_history_ar: '',
        about_who_we_are_en: '',
        about_who_we_are_ar: '',
        about_agents_en: '',
        about_agents_ar: '',
        contact_phone_1: '',
        contact_phone_2: '',
        contact_whatsapp: '',
        contact_email: '',
        contact_address_en: '',
        contact_address_ar: '',
        contact_hall_location_en: '',
        contact_hall_location_ar: '',
        contact_map_url: '',
        footer_branches_en: '',
        footer_branches_ar: '',
        footer_phones: '',
        social_facebook: '',
        social_instagram: '',
        social_youtube: '',
        social_twitter: ''
    });

    const [uiStatus, setUiStatus] = useState({ error: null, success: false, submitting: false });

    useEffect(() => {
        if (settings && Object.keys(settings).length > 0) {
            setFormData(prev => ({
                ...prev,
                about_foundation_en: settings.about_foundation?.en || (typeof settings.about_foundation === 'string' ? settings.about_foundation : ''),
                about_foundation_ar: settings.about_foundation?.ar || '',
                about_history_en: settings.about_history?.en || (typeof settings.about_history === 'string' ? settings.about_history : ''),
                about_history_ar: settings.about_history?.ar || '',
                about_who_we_are_en: settings.about_who_we_are?.en || (typeof settings.about_who_we_are === 'string' ? settings.about_who_we_are : ''),
                about_who_we_are_ar: settings.about_who_we_are?.ar || '',
                about_agents_en: settings.about_agents?.en || (typeof settings.about_agents === 'string' ? settings.about_agents : ''),
                about_agents_ar: settings.about_agents?.ar || '',
                
                // الحقول غير المترجمة (النصوص الصافية كالهواتف والروابط والبريد)
                contact_phone_1: settings.contact_phone_1?.en || settings.contact_phone_1 || '',
                contact_phone_2: settings.contact_phone_2?.en || settings.contact_phone_2 || '',
                contact_whatsapp: settings.contact_whatsapp?.en || settings.contact_whatsapp || '',
                contact_email: settings.contact_email?.en || settings.contact_email || '',
                contact_map_url: settings.contact_map_url?.en || settings.contact_map_url || '',
                footer_phones: settings.footer_phones?.en || settings.footer_phones || '',
                social_facebook: settings.social_facebook?.en || settings.social_facebook || '',
                social_instagram: settings.social_instagram?.en || settings.social_instagram || '',
                social_youtube: settings.social_youtube?.en || settings.social_youtube || '',
                social_twitter: settings.social_twitter?.en || settings.social_twitter || '',
                
                contact_address_en: settings.contact_address?.en || (typeof settings.contact_address === 'string' ? settings.contact_address : ''),
                contact_address_ar: settings.contact_address?.ar || '',
                contact_hall_location_en: settings.contact_hall_location?.en || (typeof settings.contact_hall_location === 'string' ? settings.contact_hall_location : ''),
                contact_hall_location_ar: settings.contact_hall_location?.ar || '',
                footer_branches_en: settings.footer_branches?.en || (typeof settings.footer_branches === 'string' ? settings.footer_branches : ''),
                footer_branches_ar: settings.footer_branches?.ar || ''
            }));
        }
    }, [settings]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUiStatus({ error: null, success: false, submitting: true });

        const formattedPayload = {
            about_foundation: { en: formData.about_foundation_en, ar: formData.about_foundation_ar },
            about_history: { en: formData.about_history_en, ar: formData.about_history_ar },
            about_who_we_are: { en: formData.about_who_we_are_en, ar: formData.about_who_we_are_ar },
            about_agents: { en: formData.about_agents_en, ar: formData.about_agents_ar },
            contact_phone_1: formData.contact_phone_1,
            contact_phone_2: formData.contact_phone_2,
            contact_whatsapp: formData.contact_whatsapp,
            contact_email: formData.contact_email,
            contact_address: { en: formData.contact_address_en, ar: formData.contact_address_ar },
            contact_hall_location: { en: formData.contact_hall_location_en, ar: formData.contact_hall_location_ar },
            contact_map_url: formData.contact_map_url,
            footer_branches: { en: formData.footer_branches_en, ar: formData.footer_branches_ar },
            footer_phones: formData.footer_phones,
            social_facebook: formData.social_facebook,
            social_instagram: formData.social_instagram,
            social_youtube: formData.social_youtube,
            social_twitter: formData.social_twitter
        };

        const result = await updateSettings(formattedPayload);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Foundation Summary (EN)</label>
                            <textarea name="about_foundation_en" rows="2" value={formData.about_foundation_en} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">ملخص التأسيس (AR)</label>
                            <textarea name="about_foundation_ar" rows="2" value={formData.about_foundation_ar} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" dir="rtl" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Corporate History Timeline (EN)</label>
                            <textarea name="about_history_en" rows="4" value={formData.about_history_en} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">تاريخ الشركة العريق (AR)</label>
                            <textarea name="about_history_ar" rows="4" value={formData.about_history_ar} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" dir="rtl" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">"Who We Are" Declaration (EN)</label>
                            <textarea name="about_who_we_are_en" rows="3" value={formData.about_who_we_are_en} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">إعلان الهوية "من نحن" (AR)</label>
                            <textarea name="about_who_we_are_ar" rows="3" value={formData.about_who_we_are_ar} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" dir="rtl" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Exclusive Agency Brand Marks (EN)</label>
                            <input type="text" name="about_agents_en" value={formData.about_agents_en} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">الوكالات والماركات الحصرية (AR)</label>
                            <input type="text" name="about_agents_ar" value={formData.about_agents_ar} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" dir="rtl" />
                        </div>
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
                            <label className="block text-xs font-bold text-gray-500 uppercase">HQ Address (EN)</label>
                            <input type="text" name="contact_address_en" value={formData.contact_address_en} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">عنوان المقر الرئيسي (AR)</label>
                            <input type="text" name="contact_address_ar" value={formData.contact_address_ar} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" dir="rtl" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Showroom Address String (EN)</label>
                            <input type="text" name="contact_hall_location_en" value={formData.contact_hall_location_en} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">عنوان صالة العرض (AR)</label>
                            <input type="text" name="contact_hall_location_ar" value={formData.contact_hall_location_ar} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" dir="rtl" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-xs font-bold text-blue-600 uppercase">Google Maps Embed URL (src attribute only)</label>
                            <input type="text" name="contact_map_url" value={formData.contact_map_url} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm font-mono text-xs" />
                        </div>
                    </div>
                </div>

                {/* 3. Footer & Social Media */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                    <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">3. Footer & Social Media Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Footer Branches (EN)</label>
                                <textarea name="footer_branches_en" rows="3" placeholder="Zalqa, Main Road" value={formData.footer_branches_en} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-mono leading-relaxed" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase">فروع الفوتر (AR)</label>
                                <textarea name="footer_branches_ar" rows="3" placeholder="دمشق، شارع البحصة" value={formData.footer_branches_ar} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-mono leading-relaxed" dir="rtl" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Footer Phone Numbers</label>
                                <textarea name="footer_phones" rows="3" placeholder="+963 11 222 333" value={formData.footer_phones} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-mono leading-relaxed" />
                            </div>
                        </div>

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
                                <label className="block text-xs font-bold text-red-600 uppercase">YouTube Channel URL</label>
                                <input type="url" name="social_youtube" placeholder="https://youtube.com/@..." value={formData.social_youtube} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-red-400 focus:ring-1 focus:ring-red-400" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-gray-800 uppercase">X (Twitter) URL</label>
                                <input type="url" name="social_twitter" placeholder="https://x.com/..." value={formData.social_twitter} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <button type="submit" disabled={uiStatus.submitting} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl transition duration-150 disabled:opacity-50 shadow-md cursor-pointer text-sm hover:bg-blue-700">
                        {uiStatus.submitting ? 'Publishing Changes...' : 'Publish Content Metrics'}
                    </button>
                </div>
            </form>
        </div>
    );
}