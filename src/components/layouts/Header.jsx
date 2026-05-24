// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../../app/CartContext';
// import { useStoreNavigation } from '../../hooks/useStoreNavigation';

// export default function Header() {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isScrolled, setIsScrolled] = useState(false);
    
//     // Tracks which category is hovered to trigger the background blur
//     const [hoveredCategory, setHoveredCategory] = useState(null);
    
//     const { cart } = useCart();
//     const navigate = useNavigate();
//     const { navItems, loading: navLoading } = useStoreNavigation();

//     const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.cartQuantity || item.quantity || 1)), 0);
//     // console.log(navItems)

//     useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 40);
            
//         };
//         window.addEventListener('scroll', handleScroll, { passive: true });
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         if (searchQuery.trim()) {
//             navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
//         }
//     };

//     return (
//         <>
//             <div 
//                 className={`fixed inset-0 z-40 bg-[#0f172a]/20 backdrop-blur-sm transition-all duration-300 pointer-events-none ${
//                     hoveredCategory ? 'opacity-100 visible' : 'opacity-0 invisible'
//                 }`} 
//             />

//             <div className="hidden lg:flex justify-between items-center bg-[#615474] text-white text-[12px] font-semibold px-6 lg:px-12 py-2">
//                 <div className="uppercase tracking-wider">
//                     Syrian MOST TRUSTED COMPUTER STORE
//                 </div>
//                 <div className="flex items-center gap-4">
//                     <Link to="/track-order" className="hover:text-gray-300 transition">Track Order</Link>
//                     <Link to="/about-us" className="hover:text-gray-300 transition">About Us</Link>
//                     <Link to="/contact-us" className="hover:text-gray-300 transition">Contact Us</Link>
//                 </div>
//             </div>

//             <header className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-gray-200 ${
//                 isScrolled ? 'bg-white/85 backdrop-blur-md shadow-md' : 'bg-white'
//             }`}>
                
//                 {/* Middle Section (Logo, Search, Cart) */}
//                 <div className="w-full px-4 sm:px-6 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-8">
                    
//                     {/* Logo */}
//                     <Link to="/" className="shrink-0">
//                         <img 
//                             src="/your-logo-here.png" // <-- Place your logo path here
//                             alt="Store Logo" 
//                             className="h-12 md:h-14 object-contain"
//                         />
//                     </Link>

//                     {/* Search Bar */}
//                     <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-4xl relative">
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className={`w-full border border-gray-300 text-gray-800 text-sm rounded-full pl-5 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
//                                 isScrolled ? 'bg-white/60' : 'bg-[#f8f9fa]'
//                             }`}
//                         />
//                         <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 cursor-pointer">
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
//                         </button>
//                     </form>

//                     {/* Social & Cart Icons */}
//                     <div className="flex items-center gap-4 shrink-0">
//                         <div className="hidden lg:flex items-center gap-1.5">
//                             <a href="#" className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">f</a>
//                             <a href="#" className="w-8 h-8 rounded-full bg-[#3f729b] text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">in</a>
//                             <a href="#" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">t</a>
//                             <a href="#" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">✉</a>
//                             <a href="#" className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">✆</a>
//                         </div>
                        
//                         <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2"></div>

//                         <Link to="/login" className="hidden sm:block text-gray-600 font-bold text-xs uppercase tracking-wide hover:text-[#0066b2] transition">
//                             LOGIN / REGISTER
//                         </Link>

//                         <div className="text-gray-900 font-black text-sm ml-2">
//                             ${cartTotal.toFixed(2)}
//                         </div>

//                         <Link to="/cart" className="relative text-[#2381c8] hover:text-[#005599] transition ml-1">
//                             <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                             </svg>
//                             {cart.length > 0 && (
//                                 <span className="absolute -top-1 -right-1 bg-[#c25934] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
//                                     {cart.length}
//                                 </span>
//                             )}
//                         </Link>
//                     </div>
//                 </div>

//                 {/* Bottom Section (Categories) */}
//                 <div className="w-full px-4 pb-4 pt-1 flex justify-center items-center">
//                     <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                        
//                         {/* FIX: Professional Skeleton Loader instead of text */}
//                         {navLoading ? (
//                             <div className="flex gap-8 pb-2">
//                                 {[1, 2, 3, 4, 5, 6].map((i) => (
//                                     <div key={i} className="h-4 w-24 bg-gray-200 animate-pulse rounded-full"></div>
//                                 ))}
//                             </div>
//                         ) : (
//                             navItems.map(category => (
//                                 <div 
//                                     key={category.id} 
//                                     className="relative group"
//                                     onMouseEnter={() => setHoveredCategory(category.id)}
//                                     onMouseLeave={() => setHoveredCategory(null)}
//                                 >
//                                     <Link 
//                                         to={`/products?category_id=${category.id}`} 
//                                         className="flex items-center gap-1 text-[#0066b2] font-black text-[14px] uppercase tracking-wider hover:text-blue-900 transition cursor-pointer pb-2"
//                                     >
//                                         {category.name}
//                                         {category.sections?.length > 0 && (
//                                             <svg className="w-3 h-3 text-[#0066b2] group-hover:text-blue-900 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
//                                             </svg>
//                                         )}
//                                     </Link>

//                                     {/* Dropdown (6 columns logic) */}
//                                     {category.sections?.length > 0 && (
//                                         <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
//                                             <div 
//                                                 className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-6 grid gap-x-12 gap-y-4"
//                                                 style={{
//                                                     gridTemplateColumns: `repeat(${Math.ceil(category.sections.length / 6) || 1}, minmax(180px, 1fr))`,
//                                                     gridTemplateRows: `repeat(${Math.min(6, category.sections.length)}, auto)`,
//                                                     gridAutoFlow: 'column' 
//                                                 }}
//                                             >
//                                                 {category.sections.map(section => (
//                                                     <Link 
//                                                         key={section.id} 
//                                                         to={`/products?section_id=${section.id}`} 
//                                                         className="text-[13px] font-bold text-gray-600 hover:text-[#0066b2] transition-colors whitespace-nowrap block"
//                                                     >
//                                                         {section.name}
//                                                     </Link>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))
//                         )}
                        
//                         {!navLoading && (
//                             <div className="relative group pb-2">
//                                 <Link to="/pc-builder" className="text-[#0066b2] font-black text-[14px] uppercase tracking-wider hover:text-blue-900 transition">
//                                     PRICE QUOTE
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </header>
//         </>
//     );
// }

















// import { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../../app/CartContext';
// import { useGlobalApp } from '../../app/AppContext';
// // Import the new component (Adjust the path if needed)
// import MiniCart from '../../components/cart/MiniCart';

// export default function Header() {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [hoveredCategory, setHoveredCategory] = useState(null);

//     const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

//     const { cart } = useCart();
//     const navigate = useNavigate();

//     const { navItems, loading: navLoading, settings } = useGlobalApp();
//     const safeNavItems = navItems || []; 

//     const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.cartQuantity || item.quantity || 1)), 0);
//     const totalItems = cart.reduce((sum, item) => sum + (item.cartQuantity || item.quantity || 1), 0);

//     const waNumber = settings?.contact_whatsapp ? settings.contact_whatsapp.replace(/[^0-9]/g, '') : '';
//     const waLink = waNumber ? `https://wa.me/${waNumber}` : '#';

//     const prevTotalRef = useRef(totalItems);
//     useEffect(() => {
//         if (totalItems > prevTotalRef.current) {
//             setIsMiniCartOpen(true);
//             const timer = setTimeout(() => setIsMiniCartOpen(false), 3500);
//             prevTotalRef.current = totalItems;
//             return () => clearTimeout(timer);
//         }
//         prevTotalRef.current = totalItems;
//     }, [totalItems]);

//     useEffect(() => {
//         const handleScroll = () => {
//             // Trigger the glassmorphism effect after scrolling past the blue bar (~40px)
//             setIsScrolled(window.scrollY > 40);
//         };
//         window.addEventListener('scroll', handleScroll, { passive: true });
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         if (searchQuery.trim()) {
//             navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
//         }
//     };

//     return (
//         <>
//             <div 
//                 className={`fixed inset-0 z-40 bg-[#0f172a]/20 backdrop-blur-sm transition-all duration-300 pointer-events-none ${
//                     hoveredCategory ? 'opacity-100 visible' : 'opacity-0 invisible'
//                 }`} 
//             />

//             <div className="hidden lg:flex justify-between items-center bg-[#615474] text-white text-[12px] font-semibold px-6 lg:px-12 py-2">
//                 <div className="uppercase tracking-wider">
//                     Syrian MOST TRUSTED COMPUTER STORE
//                 </div>
//                 <div className="flex items-center gap-4">
//                     <Link to="/track-order" className="hover:text-gray-300 transition">Track Order</Link>
//                     <Link to="/about-us" className="hover:text-gray-300 transition">About Us</Link>
//                     <Link to="/contact-us" className="hover:text-gray-300 transition">Contact Us</Link>
//                 </div>
//             </div>

//             <header className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-gray-200 ${
//                 isScrolled ? 'bg-white/85 backdrop-blur-md shadow-md' : 'bg-white'
//             }`}>
                
//                 <div className="w-full px-4 sm:px-6 lg:px-12 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                    
//                     {/* Logo */}
//                     <Link to="/" className="shrink-0">
//                         <img 
//                             src="/your-logo-here.png" // <-- Place your logo path here
//                             alt="Store Logo" 
//                             className="h-10 md:h-14 object-contain"
//                         />
//                     </Link>

//                     {/* Search Bar */}
//                     <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-4xl relative">
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className={`w-full border border-gray-300 text-gray-800 text-sm rounded-full pl-5 pr-12 py-2.5 md:py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
//                                 isScrolled ? 'bg-white/60' : 'bg-[#f8f9fa]'
//                             }`}
//                         />
//                         <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 cursor-pointer">
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
//                         </button>
//                     </form>

//                     {/* Social & Cart Icons */}
//                     <div className="flex items-center gap-3 md:gap-4 shrink-0 relative">
//                         <div className="hidden lg:flex items-center gap-1.5">
//                             <a href={settings?.social_facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">f</a>
//                             <a href={settings?.social_instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#3f729b] text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">in</a>
//                             <a href={`mailto:${settings?.contact_email || ''}`} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">✉</a>                            
//                             <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">✆</a>   
//                         </div>
//                         <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2"></div>

//                         <Link to="/login" className="hidden sm:block text-gray-600 font-bold text-xs uppercase tracking-wide hover:text-[#0066b2] transition">
//                             LOGIN / REGISTER
//                         </Link>

//                         <div className="text-gray-900 font-black text-sm ml-1 md:ml-2">
//                             ${cartTotal.toFixed(2)}
//                         </div>

//                         {/* --- تم إضافة حاوية السلة هنا لتعمل الـ MiniCart --- */}
//                         <div 
//                             className="relative flex items-center h-full py-2"
//                             onMouseEnter={() => setIsMiniCartOpen(true)}
//                             onMouseLeave={() => setIsMiniCartOpen(false)}
//                         >
//                             <Link to="/cart" className="relative text-[#2381c8] hover:text-[#005599] transition ml-1 cursor-pointer">
//                                 <svg className="w-8 h-8 md:w-9 md:h-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                                 </svg>
//                                 {cart.length > 0 && (
//                                     <span className="absolute -top-1 -right-1 bg-[#c25934] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
//                                         {cart.length}
//                                     </span>
//                                 )}
//                             </Link>

//                             {/* استدعاء مكون السلة المنبثقة */}
//                             <MiniCart isOpen={isMiniCartOpen} />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Bottom Section (Categories) */}
//                 <div className="w-full px-4 pb-3 pt-1 flex justify-center items-center">
//                     <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-10 gap-y-3 md:gap-y-4">
                        
//                         {navLoading ? (
//                             <div className="flex flex-wrap justify-center gap-4 md:gap-8 pb-2">
//                                 {[1, 2, 3, 4].map((i) => (
//                                     <div key={i} className="h-4 w-20 md:w-24 bg-gray-200 animate-pulse rounded-full"></div>
//                                 ))}
//                             </div>
//                         ) : (
//                             safeNavItems.map(category => (
//                                 <div 
//                                     key={category.id} 
//                                     className="relative group"
//                                     onMouseEnter={() => setHoveredCategory(category.id)}
//                                     onMouseLeave={() => setHoveredCategory(null)}
//                                 >
//                                     <Link 
//                                         to={`/products?category_id=${category.id}`} 
//                                         className="flex items-center gap-1 text-[#0066b2] font-black text-xs md:text-[14px] uppercase tracking-wider hover:text-blue-900 transition cursor-pointer pb-2"
//                                     >
//                                         {category.name}
//                                         {category.sections?.length > 0 && (
//                                             <svg className="w-3 h-3 text-[#0066b2] group-hover:text-blue-900 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
//                                             </svg>
//                                         )}
//                                     </Link>

//                                     {category.sections?.length > 0 && (
//                                         <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
//                                             <div 
//                                                 className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-4 md:p-6 grid gap-x-8 md:gap-x-12 gap-y-4 max-w-[95vw] overflow-x-auto"
//                                                 style={{
//                                                     gridTemplateColumns: `repeat(${Math.ceil(category.sections.length / 6) || 1}, minmax(140px, 1fr))`,
//                                                     gridTemplateRows: `repeat(${Math.min(6, category.sections.length)}, auto)`,
//                                                     gridAutoFlow: 'column' 
//                                                 }}
//                                             >
//                                                 {category.sections.map(section => (
//                                                     <Link 
//                                                         key={section.id} 
//                                                         to={`/products?section_id=${section.id}`} 
//                                                         className="text-xs md:text-[13px] font-bold text-gray-600 hover:text-[#0066b2] transition-colors whitespace-nowrap block"
//                                                     >
//                                                         {section.name}
//                                                     </Link>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))
//                         )}
                        
//                         {!navLoading && (
//                             <div className="relative group pb-2">
//                                 <Link to="/pc-builder" className="text-[#0066b2] font-black text-xs md:text-[14px] uppercase tracking-wider hover:text-blue-900 transition">
//                                     PRICE QUOTE
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </header>
//         </>
//     );
// }





import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import { useGlobalApp } from '../../app/AppContext';
import MiniCart from '../../components/cart/MiniCart';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

    const { cart } = useCart();
    const navigate = useNavigate();

    const { navItems, loading: navLoading, settings } = useGlobalApp();
    const safeNavItems = navItems || []; 

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.cartQuantity || item.quantity || 1)), 0);
    const totalItems = cart.reduce((sum, item) => sum + (item.cartQuantity || item.quantity || 1), 0);

    const waNumber = settings?.contact_whatsapp ? settings.contact_whatsapp.replace(/[^0-9]/g, '') : '';
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
            // Trigger the glassmorphism effect after scrolling past the blue bar (~40px)
            setIsScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            <div 
                className={`fixed inset-0 z-40 bg-[#0f172a]/20 backdrop-blur-sm transition-all duration-300 pointer-events-none ${
                    hoveredCategory ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`} 
            />

            <div className="hidden lg:flex justify-between items-center bg-[#615474] text-white text-[12px] font-semibold px-6 lg:px-12 py-2">
                <div className="uppercase tracking-wider">
                    Syrian MOST TRUSTED COMPUTER STORE
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/track-order" className="hover:text-gray-300 transition">Track Order</Link>
                    <Link to="/about-us" className="hover:text-gray-300 transition">About Us</Link>
                    <Link to="/contact-us" className="hover:text-gray-300 transition">Contact Us</Link>
                </div>
            </div>

            <header className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-gray-200 ${
                isScrolled ? 'bg-white/85 backdrop-blur-md shadow-md' : 'bg-white'
            }`}>
                
                <div className="w-full px-4 sm:px-6 lg:px-12 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                    
                    {/* Logo */}
                    <Link to="/" className="shrink-0">
                        <img 
                            src="/your-logo-here.png" // <-- Place your logo path here
                            alt="Store Logo" 
                            className="h-10 md:h-14 object-contain"
                        />
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-4xl relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full border border-gray-300 text-gray-800 text-sm rounded-full pl-5 pr-12 py-2.5 md:py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                                isScrolled ? 'bg-white/60' : 'bg-[#f8f9fa]'
                            }`}
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </form>

                    {/* Social & Cart Icons */}
                    <div className="flex items-center gap-3 md:gap-4 shrink-0 relative">
                        <div className="hidden lg:flex items-center gap-1.5">
                            <a href={settings?.social_facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">f</a>
                            <a href={settings?.social_instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#3f729b] text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">in</a>
                            <a href={`mailto:${settings?.contact_email || ''}`} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">✉</a>                            
                            <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">✆</a>   
                        </div>
                        <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2"></div>

                        <Link to="/login" className="hidden sm:block text-gray-600 font-bold text-xs uppercase tracking-wide hover:text-[#0066b2] transition">
                            LOGIN / REGISTER
                        </Link>

                        <div className="text-gray-900 font-black text-sm ml-1 md:ml-2">
                            ${cartTotal.toFixed(2)}
                        </div>

                        {/* --- تم إزالة أحداث الـ Hover من هنا --- */}
                        <div className="relative flex items-center h-full py-2">
                            <Link to="/cart" className="relative text-[#2381c8] hover:text-[#005599] transition ml-1 cursor-pointer">
                                <svg className="w-8 h-8 md:w-9 md:h-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#c25934] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            {/* استدعاء مكون السلة المنبثقة */}
                            <MiniCart isOpen={isMiniCartOpen} />
                        </div>
                    </div>
                </div>

                {/* Bottom Section (Categories) */}
                <div className="w-full px-4 pb-3 pt-1 flex justify-center items-center">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-10 gap-y-3 md:gap-y-4">
                        
                        {navLoading ? (
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8 pb-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-4 w-20 md:w-24 bg-gray-200 animate-pulse rounded-full"></div>
                                ))}
                            </div>
                        ) : (
                            safeNavItems.map(category => (
                                <div 
                                    key={category.id} 
                                    className="relative group"
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                >
                                    <Link 
                                        to={`/products?category_id=${category.id}`} 
                                        className="flex items-center gap-1 text-[#0066b2] font-black text-xs md:text-[14px] uppercase tracking-wider hover:text-blue-900 transition cursor-pointer pb-2"
                                    >
                                        {category.name}
                                        {category.sections?.length > 0 && (
                                            <svg className="w-3 h-3 text-[#0066b2] group-hover:text-blue-900 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        )}
                                    </Link>

                                    {category.sections?.length > 0 && (
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                            <div 
                                                className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-4 md:p-6 grid gap-x-8 md:gap-x-12 gap-y-4 max-w-[95vw] overflow-x-auto"
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
                                                        className="text-xs md:text-[13px] font-bold text-gray-600 hover:text-[#0066b2] transition-colors whitespace-nowrap block"
                                                    >
                                                        {section.name}
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
                                <Link to="/pc-builder" className="text-[#0066b2] font-black text-xs md:text-[14px] uppercase tracking-wider hover:text-blue-900 transition">
                                    PRICE QUOTE
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}