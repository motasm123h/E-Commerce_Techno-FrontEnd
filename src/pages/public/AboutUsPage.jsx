import { useSettings } from '../../app/SettingContext';

export default function AboutUsPage() {
    const { settings, loading, error } = useSettings();

    if (loading) return <div className="text-center py-24 text-gray-400 font-medium animate-pulse">Loading corporate metrics...</div>;
    if (error) return <div className="text-center py-24 text-red-500 font-medium">{error}</div>;

    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* شعار الشركة الرئيسي المستوحى من الصورة الثانية بلمسة بيضاء وعصرية */}
                <div className="text-center py-4 border-b border-gray-100">
                    <h1 className="text-5xl font-black tracking-tighter text-gray-900 select-none">
                        <span className="text-gray-500">TECHNO</span> <span className="text-green-300">TITAN</span>
                    </h1>
                </div>

                <div className="space-y-3">
                    <h2 className="text-lg font-black text-blue-600 uppercase tracking-wider border-r-4 border-blue-600 pr-3 text-right">
                        Foundation / التأسيس
                    </h2>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        {settings.about_foundation || 'No foundation criteria data loaded.'}
                    </p>
                </div>

                <div className="space-y-3">
                    <h2 className="text-lg font-black text-blue-600 uppercase tracking-wider border-r-4 border-blue-600 pr-3 text-right">
                        History / مسيرتنا عبر التاريخ
                    </h2>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        {settings.about_history || 'No timeline records available.'}
                    </p>
                </div>

                <div className="space-y-3">
                    <h2 className="text-lg font-black text-blue-600 uppercase tracking-wider border-r-4 border-blue-600 pr-3 text-right">
                        Who Are We / من نحن
                    </h2>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                            {settings.about_who_we_are}
                        </p>
                        {settings.about_agents && (
                            <div className="border-t border-gray-200/60 pt-3">
                                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Exclusive System Agents:</span>
                                <span className="text-sm font-black text-gray-800 tracking-wide">{settings.about_agents}</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}