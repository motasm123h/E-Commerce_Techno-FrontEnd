import { Link } from 'react-router-dom';
import { useSettings } from '../../app/SettingContext';
import { useStoreNavigation } from '../../hooks/useStoreNavigation';

export default function Footer() {
    const { settings } = useSettings();
    const { navItems } = useStoreNavigation();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const branchesList = settings?.footer_branches 
        ? settings.footer_branches.split('\n').map(b => b.trim()).filter(b => b !== '') 
        : ['Damascus, Al-Bahsah.'];

    const footerPhones = settings?.footer_phones 
        ? settings.footer_phones.split('\n').map(p => p.trim()).filter(p => p !== '') 
        : [];

    const displayPhones = footerPhones.length > 0 
        ? footerPhones 
        : [settings?.contact_phone_1, settings?.contact_phone_2].filter(Boolean);

    return (
        <footer className="w-full bg-white border-t border-gray-200 mt-16 pt-12 pb-6 relative z-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-gray-100 pb-10">
                
                {/* COLUMN 1: BRAND LOGO & LOCAL ADDRESS SUMMARY */}
                <div className="lg:col-span-2 space-y-4">
                    <p className="text-sm font-bold text-gray-600 flex items-center gap-1">
                        📍 Syria Branches:
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 pl-4 list-disc font-medium">
                        {branchesList.map((branch, index) => (
                            <li key={index}>{branch}</li>
                        ))}
                    </ul>
                    
                    {displayPhones.length > 0 && (
                        <p className="text-xs font-bold text-blue-600 pt-2">
                            📞 Call us at {displayPhones.join(' | ')}
                        </p>
                    )}

                    <div className="flex items-center space-x-3 pt-2">
                        {settings?.social_facebook && (
                            <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition">f</a>
                        )}
                        {settings?.social_instagram && (
                            <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition">📸</a>
                        )}
                        {settings?.social_linkedin && (
                            <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-blue-400 hover:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition">in</a>
                        )}
                        {settings?.social_twitter && (
                            <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-7 h-7 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center font-bold text-[10px] cursor-pointer transition">𝕏</a>
                        )}
                    </div>
                </div>

                {/* COLUMN 2: NAVIGATE */}
                <div>
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Navigate</h4>
                    <ul className="text-xs font-semibold text-gray-500 space-y-2.5">
                        <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
                        <li><Link to="/products" className="hover:text-blue-600 transition">Products</Link></li>
                        <li><Link to="/pc-builder" className="hover:text-blue-600 transition">PC Builder</Link></li>
                        <li><Link to="/contact-us" className="hover:text-blue-600 transition">Contact Us</Link></li>
                        <li><Link to="/about-us" className="hover:text-blue-600 transition">About Us</Link></li>
                    </ul>
                </div>

                {/* COLUMN 3 & 4: CATEGORIES */}
                <div className="lg:col-span-2">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Categories</h4>
                    {navItems.length === 0 ? (
                        <span className="text-xs text-gray-400 italic">No categories tracked.</span>
                    ) : (
                        <ul className="text-xs font-semibold text-gray-500 gap-y-2.5 gap-x-6 [column-count:1] sm:[column-count:2] leading-relaxed">
                            {navItems.map((category) => (
                                <li key={category.id} className="break-inside-avoid mb-2.5">
                                    <Link to={`/products?category_id=${category.id}`} className="hover:text-blue-600 transition block truncate">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* BOTTOM */}
            <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-400 font-medium gap-2">
                <span>© 2026 Techno Vision Mock Storefront. All Rights Reserved.</span>
                <button 
                    onClick={scrollToTop} 
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 p-2 rounded-md text-gray-600 font-bold transition text-xs flex items-center gap-1 cursor-pointer"
                >
                    ▲ Top
                </button>
            </div>
        </footer>
    );
}