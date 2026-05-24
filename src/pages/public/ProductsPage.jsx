// import { useSearchParams } from 'react-router-dom';
// import { useProducts } from '../../hooks/useProducts';
// import ProductCard from '../../components/products/ProductCard';
// import { useState, useEffect } from 'react';

// export default function ProductsPage() {
//     const { products, pagination, loading, error } = useProducts();
//     const [searchParams, setSearchParams] = useSearchParams();

//     const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
//     const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
//     const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'newest');

//     useEffect(() => {
//         setMinPrice(searchParams.get('min_price') || '');
//         setMaxPrice(searchParams.get('max_price') || '');
//         setSortBy(searchParams.get('sort_by') || 'newest');
//     }, [searchParams]);

//     const handleFilter = (e) => {
//         if (e) e.preventDefault();
//         const newParams = new URLSearchParams(); 
        
//         if (minPrice) newParams.set('min_price', minPrice);
//         if (maxPrice) newParams.set('max_price', maxPrice);
//         newParams.set('sort_by', sortBy);
//         newParams.set('page', '1'); 
        
//         setSearchParams(newParams);
//     };

//     const clearFilters = () => {
//         setSearchParams({});
//     };

//     const handlePageChange = (newPage) => {
//         const newParams = new URLSearchParams(searchParams);
//         newParams.set('page', newPage.toString());
//         setSearchParams(newParams);
//         window.scrollTo({ top: 0, behavior: 'smooth' }); 
//     };

//     return (
        
//         <div className="w-full max-w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-10 space-y-8">
            
//             <div className="bg-white border-b border-gray-200 pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
//                 <div>
//                     <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Catalog</h1>
//                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
//                         {pagination?.total || 0} Products Available
//                     </p>
//                 </div>

//                 <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4 w-full md:w-auto">
//                     <div className="flex flex-col gap-1 flex-grow md:flex-grow-0">
//                         <label className="text-[9px] font-black uppercase text-gray-400">Sort By</label>
//                         <select 
//                             value={sortBy} 
//                             onChange={(e) => setSortBy(e.target.value)}
//                             className="bg-gray-50 border-b-2 border-gray-900 px-3 py-2 text-xs font-bold focus:outline-none cursor-pointer w-full"
//                         >
//                             <option value="newest">Newest</option>
//                             <option value="price_asc">Price: Low to High</option>
//                             <option value="price_desc">Price: High to Low</option>
//                         </select>
//                     </div>

//                     <div className="flex flex-col gap-1 flex-grow md:flex-grow-0">
//                         <label className="text-[9px] font-black uppercase text-gray-400">Price Range</label>
//                         <div className="flex items-center gap-2">
//                             <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full md:w-20 border-b border-gray-300 text-xs py-2 focus:border-gray-900 outline-none" />
//                             <span className="text-gray-300">—</span>
//                             <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full md:w-20 border-b border-gray-300 text-xs py-2 focus:border-gray-900 outline-none" />
//                         </div>
//                     </div>

//                     <button type="submit" className="bg-gray-900 text-white text-[10px] font-black uppercase px-6 py-2.5 hover:bg-blue-600 transition cursor-pointer whitespace-nowrap">
//                         Apply
//                     </button>
//                     <button type="button" onClick={clearFilters} className="text-[10px] font-bold text-gray-400 underline hover:text-red-500 cursor-pointer whitespace-nowrap">
//                         Reset
//                     </button>
//                 </form>
//             </div>

//             {loading && <div className="py-20 text-center font-black uppercase tracking-widest text-gray-400">Loading Catalog...</div>}
//             {error && <div className="py-10 text-center font-bold text-red-500">{error}</div>}

//             {!loading && !error && (
//                 <>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 border-l border-t border-gray-100">
//                         {products.map((product) => (
//                             <div key={product.id} className="border-r border-b border-gray-100">
//                                 <ProductCard product={product} />
//                             </div>
//                         ))}
//                     </div>

//                     {pagination && pagination.last_page > 1 && (
//                         <div className="flex justify-center items-center gap-6 pt-10 mt-10 border-t-2 border-gray-100">
//                             <button
//                                 onClick={() => handlePageChange(pagination.current_page - 1)}
//                                 disabled={pagination.current_page === 1}
//                                 className="px-6 py-3 border-2 border-gray-900 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-gray-900 hover:text-white transition cursor-pointer"
//                             >
//                                 Prev
//                             </button>
//                             <span className="text-xs font-black uppercase tracking-widest text-gray-500">
//                                 Page <span className="text-gray-900">{pagination.current_page}</span> of {pagination.last_page}
//                             </span>
//                             <button
//                                 onClick={() => handlePageChange(pagination.current_page + 1)}
//                                 disabled={pagination.current_page === pagination.last_page}
//                                 className="px-6 py-3 border-2 border-gray-900 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-gray-900 hover:text-white transition cursor-pointer"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }









import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/products/ProductCard';
import { useState, useEffect } from 'react';

// --- مكون القائمة المنسدلة (Accordion) للفلاتر ---
const FilterAccordion = ({ title, children, defaultOpen = false, isMain = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex justify-between items-center py-2.5 px-3 transition-colors ${
                    isMain 
                        ? 'bg-[#00a8e8] text-white text-[13px] font-bold' 
                        : 'bg-white text-gray-700 text-[12px] font-semibold hover:bg-gray-50'
                }`}
            >
                <span>{title}</span>
                <svg 
                    className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? (isMain ? 'rotate-180' : 'rotate-90') : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMain ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                </svg>
            </button>
            {isOpen && (
                <div className={`px-3 py-2 ${isMain ? 'bg-white' : 'bg-gray-50/50 pl-6'}`}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default function ProductsPage() {
    const { products, pagination, loading, error } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();

    const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'newest');

    useEffect(() => {
        setMinPrice(searchParams.get('min_price') || '');
        setMaxPrice(searchParams.get('max_price') || '');
        setSortBy(searchParams.get('sort_by') || 'newest');
    }, [searchParams]);

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        const newParams = new URLSearchParams(searchParams); 
        
        if (minPrice) newParams.set('min_price', minPrice);
        else newParams.delete('min_price');

        if (maxPrice) newParams.set('max_price', maxPrice);
        else newParams.delete('max_price');

        newParams.set('sort_by', sortBy);
        newParams.set('page', '1'); 
        
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage.toString());
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8">
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* --- الشريط الجانبي (Sidebar - Filters) --- */}
                <div className="w-full lg:w-1/4 xl:w-1/5 shrink-0 flex flex-col gap-6 sticky top-24">
                    
                    {/* ترويسة الفلاتر */}
                    <div className="border-b border-gray-200 pb-2">
                        <h2 className="text-[15px] font-normal text-gray-800 uppercase tracking-widest">Filters</h2>
                    </div>

                    <form onSubmit={handleFilter} className="space-y-6">
                        {/* فلتر السعر */}
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-800">Price</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={minPrice} 
                                    onChange={(e) => setMinPrice(e.target.value)} 
                                    className="w-full border border-gray-200 text-xs py-2 px-3 rounded focus:border-[#00a8e8] outline-none" 
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={maxPrice} 
                                    onChange={(e) => setMaxPrice(e.target.value)} 
                                    className="w-full border border-gray-200 text-xs py-2 px-3 rounded focus:border-[#00a8e8] outline-none" 
                                />
                            </div>
                            <button type="submit" className="hidden">Apply Price</button>
                        </div>

                        {/* خط مزخرف أزرق مثل الصورة */}
                        <div className="w-full h-[2px] bg-[#00a8e8] relative">
                            <div className="absolute left-0 -top-1 w-2.5 h-2.5 rounded-full bg-[#00a8e8]"></div>
                            <div className="absolute right-0 -top-1 w-2.5 h-2.5 rounded-full bg-[#00a8e8]"></div>
                        </div>

                        {/* نظام الفلاتر المتداخل (Accordions) */}
                        <div className="border border-gray-100 shadow-sm bg-white overflow-hidden">
                            <FilterAccordion title="Brand" isMain={true} defaultOpen={true}>
                                {/* ستحتاج هنا لعرض البراندات من الباك إند */}
                                <label className="flex items-center gap-2 py-1.5 cursor-pointer hover:text-[#00a8e8] text-[12px] text-gray-600">
                                    <input type="checkbox" className="accent-[#00a8e8]" /> ASUS
                                </label>
                                <label className="flex items-center gap-2 py-1.5 cursor-pointer hover:text-[#00a8e8] text-[12px] text-gray-600">
                                    <input type="checkbox" className="accent-[#00a8e8]" /> GIGABYTE
                                </label>
                            </FilterAccordion>

                            <FilterAccordion title="Specifications" isMain={true} defaultOpen={true}>
                                <FilterAccordion title="Screen Size">
                                    <label className="flex items-center gap-2 py-1 cursor-pointer text-[12px] text-gray-500">
                                        <input type="checkbox" className="accent-[#00a8e8]" /> 24-inch
                                    </label>
                                    <label className="flex items-center gap-2 py-1 cursor-pointer text-[12px] text-gray-500">
                                        <input type="checkbox" className="accent-[#00a8e8]" /> 27-inch
                                    </label>
                                </FilterAccordion>
                                <FilterAccordion title="Refresh Rate">
                                    <label className="flex items-center gap-2 py-1 cursor-pointer text-[12px] text-gray-500">
                                        <input type="checkbox" className="accent-[#00a8e8]" /> 144Hz
                                    </label>
                                    <label className="flex items-center gap-2 py-1 cursor-pointer text-[12px] text-gray-500">
                                        <input type="checkbox" className="accent-[#00a8e8]" /> 240Hz
                                    </label>
                                </FilterAccordion>
                            </FilterAccordion>

                            {/* زر تفريغ الفلاتر */}
                            <div className="bg-[#00a8e8] text-white text-[12px] font-bold px-3 py-2.5 flex justify-between items-center cursor-pointer hover:bg-[#0096d1]" onClick={clearFilters}>
                                <span>✕</span>
                                <span>Reset All</span>
                            </div>
                        </div>
                    </form>
                </div>

                {/* --- منطقة المنتجات الرئيسية (Main Content) --- */}
                <div className="w-full lg:w-3/4 xl:w-4/5">
                    
                    {/* الترويسة العلوية للمنتجات */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-6">
                        <h1 className="text-2xl sm:text-3xl font-normal text-gray-800 uppercase tracking-wide">
                            CATALOG
                        </h1>

                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            {/* أيقونات طريقة العرض (شبكة / قائمة) */}
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-[#00a8e8] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                <svg className="w-5 h-5 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </div>

                            <div className="flex items-center gap-2 border border-gray-200 rounded px-2 bg-white">
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        handleFilter();
                                    }}
                                    className="bg-transparent py-1.5 text-xs text-gray-600 focus:outline-none cursor-pointer"
                                >
                                    <option value="newest">Latest</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* عرض حالات التحميل والخطأ */}
                    {loading && <div className="py-20 text-center font-bold uppercase tracking-widest text-gray-400">Loading Catalog...</div>}
                    {error && <div className="py-10 text-center font-bold text-red-500">{error}</div>}

                    {/* شبكة المنتجات (5 أعمدة) */}
                    {!loading && !error && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {products.map((product) => (
                                    <div key={product.id} className="border border-gray-100 rounded-lg overflow-hidden bg-white hover:shadow-md transition duration-300">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>

                            {/* الترقيم (Pagination) */}
                            {pagination && pagination.last_page > 1 && (
                                <div className="flex justify-center items-center gap-4 pt-12 mt-8">
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                        className="px-4 py-2 border border-gray-200 rounded bg-white text-gray-600 text-xs font-bold disabled:opacity-50 hover:border-[#00a8e8] hover:text-[#00a8e8] transition cursor-pointer"
                                    >
                                        Prev
                                    </button>
                                    <span className="text-xs text-gray-500">
                                        Showing {pagination.current_page} of {pagination.last_page}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page === pagination.last_page}
                                        className="px-4 py-2 border border-gray-200 rounded bg-white text-gray-600 text-xs font-bold disabled:opacity-50 hover:border-[#00a8e8] hover:text-[#00a8e8] transition cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}