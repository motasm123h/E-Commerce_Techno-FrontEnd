import { Link } from 'react-router-dom';
// import { useSettings } from '../../app/SettingContext';
// import { useStoreNavigation } from '../../hooks/useStoreNavigation';
import { useTranslation } from 'react-i18next'; 
import { useGlobalApp } from '../../app/AppContext';

export default function Footer() {
    const { t, i18n } = useTranslation(); 
    const { settings ,navItems} = useGlobalApp();
    // const { navItems } = useStoreNavigation();

    const isRtl = i18n.language === 'ar';

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const rawBranches = settings?.footer_branches?.[i18n.language] || settings?.footer_branches?.en || settings?.footer_branches;
    const branchesList = rawBranches && typeof rawBranches === 'string'
        ? rawBranches.replace(/\\n/g, '\n').split('\n').map(b => b.trim()).filter(b => b !== '') 
        : [isRtl ? 'دمشق، شارع البحصة.' : 'Damascus, Al-Bahsah.'];

    const rawFooterPhones = settings?.footer_phones?.[i18n.language] || settings?.footer_phones?.en || settings?.footer_phones;
    const footerPhones = rawFooterPhones && typeof rawFooterPhones === 'string'
        ? rawFooterPhones.replace(/\\n/g, '\n').split('\n').map(p => p.trim()).filter(p => p !== '') 
        : [];

    // استخراج الهواتف الاحتياطية الموحدة في حال عدم وجود هواتف مخصصة للفوتر
    const backupPhone1 = settings?.contact_phone_1?.[i18n.language] || settings?.contact_phone_1?.en || settings?.contact_phone_1;
    const backupPhone2 = settings?.contact_phone_2?.[i18n.language] || settings?.contact_phone_2?.en || settings?.contact_phone_2;

    const displayPhones = footerPhones.length > 0 
        ? footerPhones 
        : [backupPhone1, backupPhone2].filter(Boolean);

    return (
        <footer className="w-full bg-[#f8fafc] border-t border-slate-100 mt-16 pt-12 pb-6 relative z-10 text-left rtl:text-right">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-slate-200/60 pb-10">
                
                {/* COLUMN 1: BRAND LOGO & LOCAL ADDRESS SUMMARY */}
                <div className="lg:col-span-2 space-y-4">
                    <p className="text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                        {isRtl ? 'الفروع والمراكز في سوريا:' : 'Syria Branches:'}
                    </p>
                    <ul className="text-xs text-slate-500 space-y-2 ps-4 list-disc font-semibold leading-relaxed">
                        {branchesList.map((branch, index) => (
                            <li key={index}>{branch}</li>
                        ))}
                    </ul>
                    
                    {displayPhones.length > 0 && (
                        <p className="text-xs font-black text-[#00cc88] pt-2 font-mono tracking-wide" dir="ltr">
                            📞 {isRtl ? 'اتصل بنا عبر' : 'Call us at'} {displayPhones.join(' | ')}
                        </p>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                        {settings?.social_facebook && (
                            <a href={typeof settings.social_facebook === 'object' ? (settings.social_facebook?.[i18n.language] || settings.social_facebook?.en) : settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-slate-200 hover:bg-[#00cc88] text-slate-600 hover:text-white rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all hover:scale-105">f</a>
                        )}
                        {settings?.social_instagram && (
                            <a href={typeof settings.social_instagram === 'object' ? (settings.social_instagram?.[i18n.language] || settings.social_instagram?.en) : settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-slate-200 hover:bg-[#00cc88] text-slate-600 hover:text-white rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all hover:scale-105">📸</a>
                        )}
                        {settings?.social_twitter && (
                            <a href={typeof settings.social_twitter === 'object' ? (settings.social_twitter?.[i18n.language] || settings.social_twitter?.en) : settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-slate-200 hover:bg-[#00cc88] text-slate-600 hover:text-white rounded-full flex items-center justify-center font-bold text-[10px] cursor-pointer transition-all hover:scale-105">𝕏</a>
                        )}
                        {settings?.social_youtube && (
                            <a href={typeof settings.social_youtube === 'object' ? (settings.social_youtube?.[i18n.language] || settings.social_youtube?.en) : settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-slate-200 hover:bg-[#00cc88] text-slate-600 hover:text-white rounded-full flex items-center justify-center font-bold text-[10px] cursor-pointer transition-all hover:scale-105">Y</a>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{t('navigate')}</h4>
                    <ul className="text-xs font-bold text-slate-600 space-y-3">
                        <li><Link to="/" className="hover:text-[#00cc88] transition-colors">{t('home')}</Link></li>
                        <li><Link to="/products" className="hover:text-[#00cc88] transition-colors">{t('products')}</Link></li>
                        <li><Link to="/pc-builder" className="hover:text-[#00cc88] transition-colors">{t('pc_builder')}</Link></li>
                        <li><Link to="/contact-us" className="hover:text-[#00cc88] transition-colors">{t('contact_us')}</Link></li>
                        <li><Link to="/about-us" className="hover:text-[#00cc88] transition-colors">{t('about_us')}</Link></li>
                    </ul>
                </div>

                <div className="lg:col-span-2">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{t('categories')}</h4>
                    {navItems.length === 0 ? (
                        <span className="text-xs text-slate-400 font-bold italic">
                            {isRtl ? 'لا توجد تصنيفات نشطة.' : 'No categories tracked.'}
                        </span>
                    ) : (
                        <ul className="text-xs font-bold text-slate-600 gap-y-3 gap-x-6 [column-count:1] sm:[column-count:2] leading-relaxed">
                            {navItems.map((category) => (
                                <div key={category.id} className="break-inside-avoid mb-3">
                                    <Link to={`/products?category_id=${category.id}`} className="hover:text-[#00cc88] transition-colors block truncate uppercase tracking-wide">
                                        {category.name?.[i18n.language] || category.name?.en || category.name}
                                    </Link>
                                </div>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
                <span>© 2026 TECHNO TITAN Gaming storefront. All Rights Reserved.</span>
                <button 
                    onClick={scrollToTop} 
                    className="bg-white hover:bg-slate-900 hover:text-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-black transition-all text-[11px] flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                    ▲ {t('top')}
                </button>
            </div>
        </footer>
    );
}