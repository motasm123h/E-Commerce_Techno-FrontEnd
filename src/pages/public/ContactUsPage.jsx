import React from 'react';
import { useSettings } from '../../app/SettingContext';

export default function ContactUsPage() {
    const { settings, loading, error } = useSettings();

    if (loading) return <div className="text-center py-24 text-gray-400 font-medium animate-pulse">Loading location maps...</div>;
    if (error) return <div className="text-center py-24 text-red-500 font-medium">{error}</div>;

    const cleanWhatsapp = settings.contact_whatsapp ? settings.contact_whatsapp.replace(/[^0-9]/g, '') : '';

    // --- الدالة الذكية لمعالجة وتنظيف رابط الخريطة تلقائياً ---
    const getSafeMapUrl = (inputUrl) => {
        if (!inputUrl) return null;

        // حالة 1: إذا قام الآدمن بنسخ كود الـ iframe بالكامل بالخطأ، نستخرج الـ src منه فقط
        if (inputUrl.includes('<iframe')) {
            const match = inputUrl.match(/src="([^"]+)"/);
            if (match && match[1]) return match[1];
        }

        // حالة 2: تنظيف أي علامات تنصيص زائدة قد تسبب خطأ 400
        return inputUrl.replace(/["']/g, '').trim();
    };

    const safeMapUrl = getSafeMapUrl(settings.contact_map_url);

    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    
                    {/* الجانب الأيسر: معلومات التواصل */}
                    <div className="bg-gray-900 text-gray-100 p-8 rounded-2xl flex flex-col justify-between space-y-8 shadow-xl">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-white mb-1">Contact Info</h2>
                                <p className="text-xs text-gray-400 font-medium">Get in touch with our tech support desks directly.</p>
                            </div>

                            <div className="space-y-4 text-sm font-semibold text-gray-200">
                                {settings.contact_phone_1 && (
                                    <a href={`tel:${settings.contact_phone_1}`} className="flex items-center space-x-3 hover:text-blue-400 transition cursor-pointer">
                                        <span className="text-lg">📞</span>
                                        <span>{settings.contact_phone_1}</span>
                                    </a>
                                )}

                                {settings.contact_phone_2 && (
                                    <a href={`tel:${settings.contact_phone_2}`} className="flex items-center space-x-3 hover:text-blue-400 transition cursor-pointer">
                                        <span className="text-lg">🏢</span>
                                        <span>{settings.contact_phone_2} <span className="text-xs text-blue-400 font-bold ml-1">(Sale Hall)</span></span>
                                    </a>
                                )}

                                {settings.contact_whatsapp && (
                                    <a 
                                        href={`https://wa.me/${cleanWhatsapp}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-3 text-green-400 font-bold hover:text-green-300 hover:underline transition group cursor-pointer"
                                    >
                                        <span className="text-lg group-hover:scale-110 transition duration-150">💬</span>
                                        <div className="flex flex-col items-start">
                                            <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Chat on WhatsApp</span>
                                            <span>{settings.contact_whatsapp}</span>
                                        </div>
                                    </a>
                                )}

                                {settings.contact_email && (
                                    <a href={`mailto:${settings.contact_email}`} className="flex items-center space-x-3 text-xs font-mono text-gray-300 hover:text-blue-400 transition cursor-pointer">
                                        <span className="text-sm">✉️</span>
                                        <span>{settings.contact_email}</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-6 space-y-3 text-xs text-gray-300 font-medium">
                            <div>
                                <span className="block font-bold uppercase text-gray-500 mb-0.5">Corporate HQ Address:</span>
                                <p>{settings.contact_address || 'Lattakia, Syria'}</p>
                            </div>
                            <div>
                                <span className="block font-bold uppercase text-gray-500 mb-0.5">Showroom & Sales Hall:</span>
                                <p className="text-blue-400 font-semibold">{settings.contact_hall_location || 'University residence st - Alzeraha'}</p>
                            </div>
                        </div>
                    </div>

                    {/* الجانب الأيمن: الخريطة التفاعلية المقاومة للأخطاء */}
                    <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[450px]">
                        <div className="mb-3 pl-2">
                            <h3 className="text-sm font-black uppercase text-gray-800 tracking-wide">Find us on Google Maps</h3>
                            <p className="text-xs text-gray-400 font-medium">Live directional mapping route link to our showroom gates.</p>
                        </div>
                        
                        <div className="w-full flex-1 rounded-xl overflow-hidden border border-gray-200 bg-white relative">
                            {safeMapUrl ? (
                                <iframe 
                                    src={safeMapUrl} // يمرر الرابط هنا بعد تنظيفه وفلترته أوتوماتيكياً
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Maps Location Frame"
                                    className="absolute inset-0"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 font-medium italic">
                                    No active Google Maps Embed link registered by Administrator.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}