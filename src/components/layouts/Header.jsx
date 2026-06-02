import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import { useGlobalApp } from '../../app/AppContext';
import MiniCart from '../../components/cart/MiniCart';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import logo from '../../assets/logo.jpg';
import { useTranslation } from 'react-i18next'; 

export default function Header() {
    const { t, i18n } = useTranslation(); 
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMobileCategory, setActiveMobileCategory] = useState(null);

    const { cart } = useCart();
    const navigate = useNavigate();

    const { navItems, loading: navLoading, settings } = useGlobalApp();
    // console.log(settings.social_facebook?.['en'])
    const safeNavItems = navItems || []; 

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.cartQuantity || item.quantity || 1)), 0);
    const totalItems = cart.reduce((sum, item) => sum + (item.cartQuantity || item.quantity || 1), 0);

    const waNumber = settings?.contact_whatsapp?.['en'] ? settings.contact_whatsapp?.['en'].replace(/[^0-9]/g, '') : '';
    const waLink = waNumber ? `https://wa.me/${waNumber}` : '#';

    const prevTotalRef = useRef(totalItems);
    
    useEffect(() => {
        if (totalItems > prevTotalRef.current) {
            setIsMiniCartOpen(true);
            const timer = setTimeout(() => setIsMiniCartOpen(false), 3500);
            prevTotalRef.current = totalItems;
            return () => clearTimeout(timer);
        }
        prevTotalRef.current = totalItems;
    }, [totalItems]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [navigate]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const toggleMobileCategory = (catId) => {
        setActiveMobileCategory(activeMobileCategory === catId ? null : catId);
    };

    return (
        <>
            <div className="hidden lg:flex justify-between items-center bg-[#0b131f] text-slate-300 text-[11px] font-bold px-6 lg:px-12 py-2 border-b border-slate-800/40 relative z-40">
                <div className="uppercase tracking-widest text-slate-400">
                    Syrian MOST TRUSTED COMPUTER STORE
                </div>
                <div className="flex items-center gap-6 tracking-wide">
                    <Link to="/track-order" className="hover:text-[#00cc88] transition-colors">{t('track_order')}</Link>
                    <Link to="/about-us" className="hover:text-[#00cc88] transition-colors">{t('about_us')}</Link>
                    <Link to="/contact-us" className="hover:text-[#00cc88] transition-colors">{t('contact_us')}</Link>
                </div>
            </div>

            <header className={`sticky top-0 z-[9990] w-full transition-all duration-300 border-b border-slate-100 ${
                isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
            }`}>
                <div className="w-full px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between md:gap-8">
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 text-slate-700 hover:text-[#00cc88] transition-colors cursor-pointer"
                            aria-label="Open Mobile Navigation Menu"
                        >
                            <span className="w-6 h-0.5 bg-current rounded-full" />
                            <span className="w-6 h-0.5 bg-current rounded-full" />
                            <span className="w-6 h-0.5 bg-current rounded-full" />
                        </button>

                        <Link to="/" className="block">
                            <img 
                                src={logo}
                                alt="Store Logo" 
                                width="160" 
                                height="44" 
                                className="h-8 sm:h-9 md:h-11 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-4xl relative hidden sm:block mx-4">
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full border border-slate-200 text-slate-800 text-sm font-medium rounded-full pl-5 pr-12 py-2 md:py-2.5 focus:outline-none focus:border-[#00cc88] focus:ring-1 focus:ring-[#00cc88] transition-all ${
                                isScrolled ? 'bg-white/60' : 'bg-[#f8fafc]'
                            }`}
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00cc88] transition-colors cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </form>

                    <div className="flex items-center gap-3 md:gap-4 shrink-0 relative">
                        <div className="hidden lg:flex items-center gap-2">
                            <a href={settings?.social_facebook?.['en'] || '#'} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-[#00cc88] hover:text-white hover:scale-105 transition-all" aria-label="Follow us on Facebook">f</a>
                            <a href={settings?.social_instagram?.['en']  || '#'} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-[#00cc88] hover:text-white hover:scale-105 transition-all" aria-label="Follow us on Instagram">in</a>
                            <a href={`mailto:${settings?.contact_email?.['en']  || ''}`} className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-[#00cc88] hover:text-white hover:scale-105 transition-all" aria-label="Contact us over Email">✉</a>            
                            <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-[#00cc88] hover:text-white hover:scale-105 transition-all" aria-label="Contact us on WhatsApp">✆</a>   
                        </div>
                        <div className="hidden lg:block w-px h-6 bg-slate-200 mx-1"></div>

                        <LanguageSwitcher />

                        <div className="text-slate-800 font-black text-sm ml-1 md:ml-2">
                            ${cartTotal.toFixed(2)}
                        </div>

                        <div 
                            className="relative flex items-center h-full py-2"
                            onMouseEnter={() => setIsMiniCartOpen(true)}
                            onMouseLeave={() => setIsMiniCartOpen(false)}
                        >
                            <Link to="/cart" className="relative text-slate-700 hover:text-[#00cc88] transition-colors ml-1 cursor-pointer" aria-label="Shopping Cart Vault">
                                <svg className="w-7 h-7 md:w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#00cc88] text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full shadow-xs animate-fade-in">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            <MiniCart isOpen={isMiniCartOpen} />
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-4 sm:hidden w-full">
                    <form onSubmit={handleSearchSubmit} className="w-full relative">
                        <input
                            type="text"
                            placeholder="Search Products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-slate-200 text-slate-800 text-xs rounded-full pl-4 pr-10 py-2 bg-[#f8fafc] focus:outline-none focus:border-[#00cc88]"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00cc88] transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </form>
                </div>

                <div className="w-full px-4 pb-3 pt-1 hidden lg:flex justify-center items-center border-t border-slate-50">
                    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                        {navLoading ? (
                            <div className="flex flex-wrap justify-center gap-8 pb-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-4 w-24 bg-slate-100 animate-pulse rounded-full"></div>
                                ))}
                            </div>
                        ) : (
                            safeNavItems.map(category => (
                                <div 
                                    key={category.id} 
                                    className="relative group"
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                    lock-scrolling="true"
                                >
                                    <Link 
                                        to={`/products?category_id=${category.id}`} 
                                        className="flex items-center gap-1 text-slate-800 font-bold text-[13px] uppercase tracking-wider hover:text-[#00cc88] transition-colors cursor-pointer pb-2"
                                    >
                                        {category.name?.[i18n.language] || category.name?.en || category.name}
                                        {category.sections?.length > 0 && (
                                            <svg className="w-3 h-3 text-[#00cc88] group-hover:text-[#00cc88] group-hover:translate-y-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        )}
                                    </Link>

                                    {category.sections?.length > 0 && (
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                            <div 
                                                className="bg-white/95 backdrop-blur-xl border border-slate-100 shadow-xl rounded-2xl p-6 grid gap-x-12 gap-y-4"
                                                style={{
                                                    gridTemplateColumns: `repeat(${Math.ceil(category.sections.length / 6) || 1}, minmax(140px, 1fr))`,
                                                    gridTemplateRows: `repeat(${Math.min(6, category.sections.length)}, auto)`,
                                                    gridAutoFlow: 'column' 
                                                }}
                                            >
                                                {category.sections.map(section => (
                                                    <Link 
                                                        key={section.id} 
                                                        to={`/products?section_id=${section.id}`} 
                                                        className="text-[13px] font-bold text-slate-600 hover:text-[#00cc88] transition-colors whitespace-nowrap block"
                                                    >
                                                        {section.name?.[i18n.language] || section.name?.en || section.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        
                        {!navLoading && (
                            <div className="relative group pb-2">
                                <Link to="/pc-builder" className="text-slate-800 font-bold text-[13px] uppercase tracking-wider hover:text-[#00cc88] transition-colors border-b-2 border-transparent hover:border-[#00cc88] pb-1">
                                     {t('pc_builder')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className={`fixed inset-0 z-[9999] transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
                <div 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
                />

                <div className={`absolute top-0 left-0 bottom-0 w-full max-w-xs bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col transition-transform duration-500 ease-out transform ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <span className="text-xs font-black uppercase text-slate-800 tracking-widest">Titan Navigation</span>
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm shadow-xs hover:bg-slate-100 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                        <Link 
                            to="/pc-builder" 
                            className="block w-full text-left font-black text-sm uppercase text-[#00cc88] bg-emerald-50/50 border border-emerald-100/50 rounded-xl px-4 py-3 shadow-2xs"
                        >
                             {t('pc_builder')}
                        </Link>

                        <div className="h-px bg-slate-100 my-3" />

                        {navLoading ? (
                            <div className="space-y-3 p-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-5 bg-slate-100 rounded animate-pulse w-3/4" />
                                ))}
                            </div>
                        ) : (
                            safeNavItems.map(category => {
                                const hasSections = category.sections && category.sections.length > 0;
                                const isExpanded = activeMobileCategory === category.id;

                                return (
                                    <div key={category.id} className="border border-slate-50 rounded-xl overflow-hidden">
                                        <div className="flex items-center justify-between bg-slate-50/30 hover:bg-slate-50 transition px-3 py-2.5">
                                            <Link 
                                                to={`/products?category_id=${category.id}`}
                                                className="text-sm font-bold text-slate-800 uppercase tracking-wide flex-1 hover:text-[#00cc88]"
                                            >
                                                {category.name?.[i18n.language] || category.name?.en || category.name}
                                            </Link>
                                            {hasSections && (
                                                <button 
                                                    onClick={() => toggleMobileCategory(category.id)}
                                                    className="p-1 text-slate-400 hover:text-slate-700 transition transform cursor-pointer"
                                                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>

                                        {hasSections && (
                                            <div className={`transition-all duration-300 overflow-hidden bg-white ${
                                                isExpanded ? 'max-h-[400px] border-t border-slate-50 px-4 py-2 space-y-2' : 'max-h-0'
                                            }`}>
                                                {category.sections.map(section => (
                                                    <Link
                                                        key={section.id}
                                                        to={`/products?section_id=${section.id}`}
                                                        className="block text-xs font-semibold text-slate-600 hover:text-[#00cc88] py-1.5 border-b border-slate-50/50 last:border-0 pl-2"
                                                    >
                                                        • {section.name?.[i18n.language] || section.name?.en || section.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        <div className="h-px bg-slate-100 my-4" />

                        <div className="space-y-1 text-xs font-bold text-slate-500 p-2">
                            <Link to="/track-order" className="block py-2 hover:text-[#00cc88] transition-colors">📍 {t('track_order')}</Link>
                            <Link to="/about-us" className="block py-2 hover:text-[#00cc88] transition-colors">ℹ️ {t('about_us')}</Link>
                            <Link to="/contact-us" className="block py-2 hover:text-[#00cc88] transition-colors">📞 {t('contact_us')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}