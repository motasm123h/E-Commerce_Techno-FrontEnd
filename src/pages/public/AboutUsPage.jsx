// import { useSettings } from '../../app/SettingContext';
import { useTranslation } from 'react-i18next';
import { useGlobalApp } from '../../app/AppContext';


const PageSkeleton = () => {
    return (
        <div className="bg-[#f8fafc] min-h-screen py-16 px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center py-4 flex justify-center">
                    <div className="h-10 bg-slate-200 rounded-xl w-1/4" />
                </div>
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-10 space-y-4">
                        <div className="h-5 bg-slate-200 rounded w-1/5 mx-auto" />
                        <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto" />
                        <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function AboutUsPage() {
    const { settings, loading, error } = useGlobalApp();
    const { t, i18n } = useTranslation();

    const isRtl = i18n.language === 'ar';

    if (loading) return <PageSkeleton />;
    if (error) return <div className="text-center py-24 text-rose-600 font-bold text-xs bg-rose-50/50 rounded-xl max-w-md mx-auto my-12 border border-rose-100 px-4">{error}</div>;
    const foundationText = settings?.about_foundation?.[i18n.language] || settings?.about_foundation?.en || '';
    const historyText = settings?.about_history?.[i18n.language] || settings?.about_history?.en || '';
    const whoWeAreText = settings?.about_who_we_are?.[i18n.language] || settings?.about_who_we_are?.en || '';
    const agentsText = settings?.about_agents?.[i18n.language] || settings?.about_agents?.en || '';
    
    return (
        <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-5xl mx-auto space-y-12">
                
                <div className="pb-4">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 select-none uppercase">
                        {isRtl ? (
                            <>حول <span className="text-[#00cc88]">تكنو تايتان</span> سوريا</>
                        ) : (
                            <>About <span className="text-slate-400">TECHNO</span> <span className="text-[#00cc88]">TITAN</span> Syria</>
                        )}
                    </h1>
                </div>

                {foundationText && (
                    <div className="bg-[#f8fafc] p-8 md:p-12 rounded-2xl border border-slate-100/50 space-y-4">
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">
                            {isRtl ? 'رؤيتنا ورسالتنا' : 'Our Mission'}
                        </h2>
                        <p className="text-[13px] md:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
                            {foundationText}
                        </p>
                    </div>
                )}

                {historyText && (
                    <div className="bg-[#f8fafc] p-8 md:p-12 rounded-2xl border border-slate-100/50 space-y-4">
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">
                            {isRtl ? 'مسيرتنا عبر التاريخ' : 'Our Corporate History'}
                        </h2>
                        <p className="text-[13px] md:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
                            {historyText}
                        </p>
                    </div>
                )}

                {whoWeAreText && (
                    <div className="bg-[#f8fafc] p-8 md:p-12 rounded-2xl border border-slate-100/50 space-y-4">
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">
                            {isRtl ? 'منتجاتنا وأنظمتنا' : 'Our Products & Systems'}
                        </h2>
                        <div className="text-[13px] md:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto space-y-4">
                            <p className="whitespace-pre-line">
                                {whoWeAreText}
                            </p>
                            
                            {agentsText && (
                                <div className="border-t border-slate-200/60 pt-6 mt-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                        {isRtl ? 'الوكالات والماركات المعتمدة:' : 'Authorized Ecosystem Marks:'}
                                    </span>
                                    <span className="text-sm font-black text-slate-800 tracking-wide uppercase">
                                        {agentsText}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}