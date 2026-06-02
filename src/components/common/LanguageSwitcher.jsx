import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(nextLang);
    };

    return (
        <button 
            onClick={toggleLanguage}
            className="text-xs font-black uppercase tracking-widest border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer shadow-3xs"
        >
            {i18n.language === 'ar' ? 'English' : 'العربية'}
        </button>
    );
}