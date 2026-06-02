import React from 'react';
// import { useSettings } from '../../app/SettingContext';
import { useTranslation } from 'react-i18next';
import { useGlobalApp } from '../../app/AppContext';
const ContactSkeleton = () => {
    return (
        <div className="bg-[#f8fafc] min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center py-4 flex justify-center">
                    <div className="h-8 bg-slate-200 rounded-xl w-1/4" />
                </div>
                <div className="w-full h-[400px] bg-slate-200 rounded-2xl" />
                <div className="bg-white rounded-2xl p-8 space-y-4 border border-slate-100">
                    <div className="h-5 bg-slate-200 rounded w-1/5 mx-auto" />
                    <div className="h-4 bg-slate-100 rounded w-1/3 mx-auto" />
                    <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto" />
                </div>
            </div>
        </div>
    );
};

export default function ContactUsPage() {
    const { settings, loading, error } = useGlobalApp();
    const { t, i18n } = useTranslation();

    const isRtl = i18n.language === 'ar';

    if (loading) return <ContactSkeleton />;
    if (error) return <div className="text-center py-24 text-rose-600 font-bold text-xs bg-rose-50/50 rounded-xl max-w-md mx-auto my-12 border border-rose-100 px-4">{error}</div>;

    // فك تنظيف أرقام الواتساب للروابط الخارجية
    const whatsappRaw = settings?.contact_whatsapp?.[i18n.language] || settings?.contact_whatsapp?.en || settings?.contact_whatsapp || '';
    const cleanWhatsapp = whatsappRaw.replace(/[^0-9]/g, '');

    const getSafeMapUrl = (inputUrl) => {
        if (!inputUrl) return null;
        const targetUrl = typeof inputUrl === 'object' ? (inputUrl[i18n.language] || inputUrl['en']) : inputUrl;
        if (!targetUrl) return null;
        if (targetUrl.includes('<iframe')) {
            const match = targetUrl.match(/src="([^"]+)"/);
            if (match && match[1]) return match[1];
        }
        return targetUrl.replace(/["']/g, '').trim();
    };

    const safeMapUrl = getSafeMapUrl(settings?.contact_map_url);

    const addressText = settings?.contact_address?.[i18n.language] || settings?.contact_address?.en || '';
    const hallLocationText = settings?.contact_hall_location?.[i18n.language] || settings?.contact_hall_location?.en || '';

    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-center font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                
                <div className="pb-2">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-wide">
                        {isRtl ? 'معلومات الاتصال بنا' : 'Contact Information'}
                    </h1>
                </div>

                <div className="w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden border border-slate-100 shadow-3xs bg-slate-50 relative">
                    {safeMapUrl ? (
                        <iframe 
                            src={safeMapUrl} 
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
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-bold uppercase tracking-widest bg-[#f8fafc] italic">
                            No active Google Maps Embed link registered by Administrator.
                        </div>
                    )}
                </div>

                <div className="bg-[#f8fafc] p-8 md:p-12 rounded-2xl border border-slate-100/60 shadow-3xs space-y-6 max-w-4xl mx-auto">
                    
                    {settings?.contact_email && (
                        <div className="space-y-1">
                            <a href={`mailto:${settings.contact_email?.[i18n.language]}`} className="text-sm md:text-base font-black text-slate-800 hover:text-[#00cc88] transition-colors duration-200">
                                {settings.contact_email?.[i18n.language]}
                            </a>
                        </div>
                    )}

                    <div className="space-y-3 text-xs md:text-sm font-bold text-slate-600">
                        {settings?.contact_phone_1?.[i18n.language] && (
                            <p dir="ltr">
                                <a href={`tel:${settings.contact_phone_1?.[i18n.language]}`} className="hover:text-[#00cc88] transition-colors font-mono">
                                    {settings.contact_phone_1?.[i18n.language]}
                                </a>
                                <span className="text-slate-400 font-sans mx-1.5">{isRtl ? '(خط المبيعات المباشر)' : '(Direct sales line)'}</span>
                            </p>
                        )}

                        {settings?.contact_phone_2?.[i18n.language] && (
                            <p dir="ltr">
                                <a href={`tel:${settings.contact_phone_2?.[i18n.language]}`} className="hover:text-[#00cc88] transition-colors font-mono">
                                    {settings.contact_phone_2?.[i18n.language]}
                                </a>
                                <span className="text-slate-400 font-sans mx-1.5">{isRtl ? '(مبيعات الشركات المباشرة)' : '(Corporate Direct Sales)'}</span>
                            </p>
                        )}

                        {whatsappRaw && (
                            <p dir="ltr">
                                <a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[#00cc88] font-black hover:text-[#00b374] transition-colors font-mono">
                                    {whatsappRaw}
                                </a>
                                <span className="text-slate-400 font-sans mx-1.5">{isRtl ? '(اتصال واتساب فوري)' : '(Direct WhatsApp Support)'}</span>
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200/50 text-xs md:text-sm text-slate-600 font-medium">
                        {addressText && (
                            <p className="leading-relaxed">
                                <span className="font-black text-slate-400 block sm:inline uppercase sm:after:content-[':'] sm:after:mx-1">{isRtl ? 'المقر الرئيسي' : 'Address'}</span>
                                {addressText}
                            </p>
                        )}
                        {hallLocationText && (
                            <p className="leading-relaxed text-[#00cc88] font-black">
                                <span className="font-black text-slate-400 block sm:inline uppercase sm:after:content-[':'] sm:after:mx-1">{isRtl ? 'صالة العرض والمبيعات' : 'Showroom'}</span>
                                {hallLocationText}
                            </p>
                        )}
                    </div>

                    <div className="pt-4 text-[11px] md:text-xs text-slate-400 font-semibold leading-relaxed max-w-2xl mx-auto border-t border-slate-200/40">
                        {isRtl ? (
                            <p>إذا كانت خطوط الهاتف مشغولة، يرجى إعادة الاتصال بعد بضع دقائق أو مراسلتنا عبر البريد الإلكتروني مباشرة.</p>
                        ) : (
                            <p>If our phone lines are busy, please call back in few minutes or email us directly at our customer desk.</p>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}