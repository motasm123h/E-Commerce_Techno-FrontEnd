// import { useSearchParams } from 'react-router-dom';
// import { useProducts } from '../../hooks/useProducts';
// import ProductCard from '../../components/products/ProductCard';
// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next'; 
// import api from '../../services/api';

// const FilterAccordion = ({ title, children, defaultOpen = false, isMain = false }) => {
//     const [isOpen, setIsOpen] = useState(defaultOpen);
//     const { i18n } = useTranslation();

//     return (
//         <div className="border-b border-slate-100 last:border-0">
//             <button
//                 type="button"
//                 onClick={() => setIsOpen(!isOpen)}
//                 className={`w-full flex justify-between items-center py-3 px-4 transition-colors ${
//                     isMain ? 'bg-[#00cc88] text-white text-xs font-black uppercase tracking-wider' : 'bg-white text-slate-700 text-[12px] font-bold hover:bg-slate-50'
//                 }`}
//             >
//                 <span>{typeof title === 'object' ? (title?.[i18n.language] || title?.en) : title}</span>
//                 <svg className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
//                 </svg>
//             </button>
//             {isOpen && <div className={`px-4 py-3 ${isMain ? 'bg-white' : 'bg-slate-50/40 ps-6'}`}>{children}</div>}
//         </div>
//     );
// };

// const ProductSkeleton = () => {
//     return (
//         <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white p-5 space-y-4 animate-pulse">
//             <div className="w-full aspect-square bg-slate-100 rounded-xl" />
//             <div className="space-y-2">
//                 <div className="h-4 bg-slate-100 rounded w-5/6" />
//                 <div className="h-4 bg-slate-100 rounded w-2/3" />
//                 <div className="h-4 bg-slate-100 rounded w-1/3 pt-2" />
//             </div>
//         </div>
//     );
// };

// export default function ProductsPage() {
//     const { t, i18n } = useTranslation(); 
//     const { products, pagination, loading, error } = useProducts();
//     const [searchParams, setSearchParams] = useSearchParams();

//     const minPrice = searchParams.get('min_price') || '';
//     const maxPrice = searchParams.get('max_price') || '';
//     const sortBy = searchParams.get('sort_by') || 'newest';
//     const sectionId = searchParams.get('section_id');
    
//     const activeTagId = searchParams.get('tag_id') || '';
//     const [publicTags, setPublicTags] = useState([]);

//     const [dynamicFilters, setDynamicFilters] = useState([]);
//     const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

//     const isRtl = i18n.language === 'ar';

//     useEffect(() => {
//         api.get('/public/tags')
//             .then(res => {
//                 if (Array.isArray(res.data)) setPublicTags(res.data);
//             })
//             .catch(err => console.error("Error fetching public global metrics tags", err));
//     }, []);

//     useEffect(() => {
//         if (sectionId) {
//             api.get(`/public/sections/filters?section_id=${sectionId}`)
//                 .then(res => {
//                     if (res.data?.success) setDynamicFilters(res.data.data);
//                 })
//                 .catch(err => console.error("Error fetching section filters", err));
//         } else {
//             setDynamicFilters([]);
//         }
//     }, [sectionId]);

//     useEffect(() => {
//         setIsMobileFilterOpen(false);
//     }, [searchParams]);

//     const handlePriceFilterSubmit = (e) => {
//         if (e) e.preventDefault();
//         const newParams = new URLSearchParams(searchParams);
        
//         const minVal = e.target.elements.min_price.value;
//         const maxVal = e.target.elements.max_price.value;

//         if (minVal) newParams.set('min_price', minVal); else newParams.delete('min_price');
//         if (maxVal) newParams.set('max_price', maxVal); else newParams.delete('max_price');
        
//         newParams.set('page', '1'); 
//         setSearchParams(newParams);
//     };

//     const handleSortChange = (newSortValue) => {
//         const newParams = new URLSearchParams(searchParams);
//         newParams.set('sort_by', newSortValue);
//         newParams.set('page', '1');
//         setSearchParams(newParams);
//     };

//     const handleTagSelectToggle = (tagId) => {
//         const newParams = new URLSearchParams(searchParams);
//         if (String(activeTagId) === String(tagId)) {
//             newParams.delete('tag_id');
//         } else {
//             newParams.set('tag_id', tagId.toString());
//         }
//         newParams.set('page', '1');
//         setSearchParams(newParams);
//     };

//     const handleCheckboxChange = (valueId, isChecked) => {
//         const newParams = new URLSearchParams(searchParams);
//         let currentValues = newParams.getAll('attribute_values[]');

//         if (isChecked) {
//             if (!currentValues.includes(valueId.toString())) {
//                 newParams.append('attribute_values[]', valueId.toString());
//             }
//         } else {
//             newParams.delete('attribute_values[]');
//             currentValues.filter(id => id !== valueId.toString()).forEach(id => {
//                 newParams.append('attribute_values[]', id);
//             });
//         }
//         newParams.set('page', '1');
//         setSearchParams(newParams);
//     };

//     const clearFilters = () => setSearchParams(sectionId ? { section_id: sectionId } : {});

//     const handlePageChange = (newPage) => {
//         const newParams = new URLSearchParams(searchParams);
//         newParams.set('page', newPage.toString());
//         setSearchParams(newParams);
//         window.scrollTo({ top: 0, behavior: 'smooth' }); 
//     };

//     const activeAttributeValues = searchParams.getAll('attribute_values[]');

//     const FilterFormContent = () => (
//         <form onSubmit={handlePriceFilterSubmit} className="space-y-6">
//             <div className="space-y-3">
//                 <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
//                     {isRtl ? 'نطاق الأسعار' : 'Price Range'}
//                 </label>
//                 <div className="flex items-center gap-2">
//                     <input type="number" name="min_price" placeholder={isRtl ? "الأدنى" : "Min"} defaultValue={minPrice} className="w-full border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl outline-none focus:border-[#00cc88] bg-white font-mono" />
//                     <span className="text-slate-300 font-bold">-</span>
//                     <input type="number" name="max_price" placeholder={isRtl ? "الأعلى" : "Max"} defaultValue={maxPrice} className="w-full border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl outline-none focus:border-[#00cc88] bg-white font-mono" />
//                 </div>
//                 <button type="submit" className="w-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider py-2.5 rounded-xl hover:bg-black transition-colors shadow-2xs cursor-pointer">
//                     {isRtl ? 'تطبيق السعر' : 'Apply Price'}
//                 </button>
//             </div>

//             <div className="w-full h-px bg-slate-100" />

//             <div className="border border-slate-100 bg-white overflow-hidden rounded-2xl shadow-2xs">
//                 {dynamicFilters.map((filter) => (
//                     <FilterAccordion key={filter.id} title={filter.name?.[i18n.language] || filter.name?.en || filter.name} isMain={true} defaultOpen={true}>
//                         {filter.values?.map((val) => (
//                             <label key={val.id} className="flex items-center gap-2.5 py-2 cursor-pointer hover:text-[#00cc88] font-bold text-xs text-slate-600 transition-colors">
//                                 <input 
//                                     type="checkbox" 
//                                     className="accent-[#00cc88] h-4 w-4 cursor-pointer"
//                                     checked={activeAttributeValues.includes(val.id.toString())}
//                                     onChange={(e) => handleCheckboxChange(val.id, e.target.checked)}
//                                 /> 
//                                 <span className="font-sans font-semibold text-slate-700">
//                                     {typeof val.value === 'object' ? (val.value?.[i18n.language] || val.value?.en) : val.value}
//                                 </span>
//                             </label>
//                         ))}
//                     </FilterAccordion>
//                 ))}

//                 <div className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-black transition-colors" onClick={clearFilters}>
//                     <span>✕</span>
//                     <span>{isRtl ? 'إعادة تعيين الفلاتر' : 'Reset All'}</span>
//                 </div>
//             </div>
//         </form>
//     );

//     return (
//         <div className="w-full bg-[#f8fafc] min-h-screen">
//             <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8 relative">
//                 <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
//                     <div className="hidden lg:flex w-1/4 xl:w-1/5 shrink-0 flex-col gap-6 sticky top-28">
//                         <div className="border-b border-slate-200 pb-2">
//                             <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//                                 {isRtl ? 'لوحة التصفية والمطابقة' : 'Filters Blueprint'}
//                             </h2>
//                         </div>
//                         <FilterFormContent />
//                     </div>

//                     <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isMobileFilterOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
//                         <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
                        
//                         <div className={`fixed inset-y-0 start-0 w-4/5 max-w-sm bg-white p-6 shadow-2xl flex flex-col space-y-4 overflow-y-auto transform transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'}`}>
//                             <div className="flex justify-between items-center border-b border-slate-100 pb-3">
//                                 <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
//                                     {isRtl ? 'تصفية المنتجات' : 'Refine Products'}
//                                 </h2>
//                                 <button onClick={() => setIsMobileFilterOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-base p-1">✕</button>
//                             </div>
//                             <FilterFormContent />
//                         </div>
//                     </div>

//                     <div className="w-full lg:w-3/4 xl:w-4/5 space-y-4">
                        
//                         {/* {publicTags.length > 0 && (
//                             <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
//                                 {publicTags.map((tag) => (
//                                     <button
//                                         key={tag.id}
//                                         onClick={() => handleTagSelectToggle(tag.id)}
//                                         className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide border transition-all cursor-pointer whitespace-nowrap select-none active:scale-95 ${
//                                             String(activeTagId) === String(tag.id)
//                                                 ? 'bg-[#00cc88] border-[#00cc88] text-white shadow-xs'
//                                                 : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
//                                         }`}
//                                     >
//                                         #{tag.name?.[i18n.language] || tag.name?.en || tag.name}
//                                     </button>
//                                 ))}
//                             </div>
//                         )} */}

//                         <div className="flex flex-row justify-between items-center pb-4 mb-2 border-b border-slate-100 gap-4 pt-1">
//                             <div className="flex items-center gap-3">
//                                 <button 
//                                     onClick={() => setIsMobileFilterOpen(true)}
//                                     className="lg:hidden bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl flex items-center justify-center transition cursor-pointer hover:bg-slate-50 shadow-2xs"
//                                     title="Open Filters"
//                                 >
//                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
//                                     </svg>
//                                 </button>
//                                 <h1 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-widest">
//                                     {t('catalog')} 
//                                 </h1>
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 <select 
//                                     value={sortBy} 
//                                     onChange={(e) => handleSortChange(e.target.value)}
//                                     className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white outline-none cursor-pointer focus:border-[#00cc88] shadow-2xs font-bold uppercase tracking-wider"
//                                 >
//                                     <option value="newest">{isRtl ? 'المنتجات الأحدث' : 'Latest Drop'}</option>
//                                     <option value="price_asc">{isRtl ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
//                                     <option value="price_desc">{isRtl ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
//                                 </select>
//                             </div>
//                         </div>

//                         {error && <div className="py-10 text-center text-rose-500 font-bold text-xs bg-rose-50 border border-rose-100 rounded-xl">{error}</div>}

//                         {loading ? (
//                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                                 {[...Array(10)].map((_, i) => (
//                                     <ProductSkeleton key={i} />
//                                 ))}
//                             </div>
//                         ) : (
//                             !error && (
//                                 <>
//                                     {products.length === 0 ? (
//                                         <div className="py-20 text-center text-slate-400 font-bold text-xs bg-white rounded-2xl border border-dashed border-slate-200 uppercase tracking-widest">
//                                             {isRtl ? 'لم نجد أي منتجات تطابق خيارات التصفية الحالية.' : 'No assets found matching the chosen parameters.'}
//                                         </div>
//                                     ) : (
//                                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                                             {products.map((product, index) => (
//                                                 <div key={product.id} className="rounded-2xl overflow-hidden bg-white shadow-2xs border border-transparent hover:border-slate-100/60 transition duration-300">
//                                                     <ProductCard product={product} index={index}/>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}

//                                     {pagination && pagination.last_page > 1 && (
//                                         <div className="flex justify-center items-center gap-4 pt-12 mt-8 border-t border-slate-100">
//                                             <button onClick={() => handlePageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs disabled:opacity-30 font-black hover:border-[#00cc88] hover:text-[#00cc88] transition-all cursor-pointer select-none shadow-2xs">
//                                                 {isRtl ? 'السابق' : 'Prev'}
//                                             </button>
//                                             <span className="text-xs text-slate-400 font-mono font-bold">
//                                                 {isRtl ? `صفحة ${pagination.current_page} / ${pagination.last_page}` : `Page ${pagination.current_page} / ${pagination.last_page}`}
//                                             </span>
//                                             <button onClick={() => handlePageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs disabled:opacity-30 font-black hover:border-[#00cc88] hover:text-[#00cc88] transition-all cursor-pointer select-none shadow-2xs">
//                                                 {isRtl ? 'التالي' : 'Next'}
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             )
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }




import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/products/ProductCard';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; 
import api from '../../services/api';

const FilterAccordion = ({ title, children, defaultOpen = false, isMain = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const { i18n } = useTranslation();

    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex justify-between items-center py-3 px-4 transition-colors ${
                    isMain ? 'bg-[#00cc88] text-white text-xs font-black uppercase tracking-wider' : 'bg-white text-slate-700 text-[12px] font-bold hover:bg-slate-50'
                }`}
            >
                <span>{typeof title === 'object' ? (title?.[i18n.language] || title?.en) : title}</span>
                <svg className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && <div className={`px-4 py-3 ${isMain ? 'bg-white' : 'bg-slate-50/40 ps-6'}`}>{children}</div>}
        </div>
    );
};

const ProductSkeleton = () => {
    return (
        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white p-5 space-y-4 animate-pulse">
            <div className="w-full aspect-square bg-slate-100 rounded-xl" />
            <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-5/6" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-1/3 pt-2" />
            </div>
        </div>
    );
};

export default function ProductsPage() {
    const { t, i18n } = useTranslation(); 
    const { products, pagination, loading, error } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();

    const minPrice = searchParams.get('min_price') || '';
    const maxPrice = searchParams.get('max_price') || '';
    const sortBy = searchParams.get('sort_by') || 'newest';
    const sectionId = searchParams.get('section_id');
    
    const activeTagId = searchParams.get('tag_id') || '';
    const [publicTags, setPublicTags] = useState([]);

    const [dynamicFilters, setDynamicFilters] = useState([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const isRtl = i18n.language === 'ar';

    useEffect(() => {
        api.get('/public/tags')
            .then(res => {
                if (Array.isArray(res.data)) setPublicTags(res.data);
            })
            .catch(err => console.error("Error fetching public global metrics tags", err));
    }, []);

    useEffect(() => {
        if (sectionId) {
            api.get(`/public/sections/filters?section_id=${sectionId}`)
                .then(res => {
                    if (res.data?.success) setDynamicFilters(res.data.data);
                    console.log(res.data.data)
                })
                .catch(err => console.error("Error fetching section filters", err));
        } else {
            setDynamicFilters([]);
        }
    }, [sectionId]);

    useEffect(() => {
        setIsMobileFilterOpen(false);
    }, [searchParams]);

    const handlePriceFilterSubmit = (e) => {
        if (e) e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        
        const minVal = e.target.elements.min_price.value;
        const maxVal = e.target.elements.max_price.value;

        if (minVal) newParams.set('min_price', minVal); else newParams.delete('min_price');
        if (maxVal) newParams.set('max_price', maxVal); else newParams.delete('max_price');
        
        newParams.set('page', '1'); 
        setSearchParams(newParams);
    };

    const handleSortChange = (newSortValue) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort_by', newSortValue);
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const handleTagSelectToggle = (tagId) => {
        const newParams = new URLSearchParams(searchParams);
        if (String(activeTagId) === String(tagId)) {
            newParams.delete('tag_id');
        } else {
            newParams.set('tag_id', tagId.toString());
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    // ⚡ تحديث ذكي: يضمن الحفاظ على الفلاتر المتعددة وحقنها دفعة واحدة بداخل مسار المتصفح كـ Array
    const handleCheckboxChange = (valueId, isChecked) => {
        const newParams = new URLSearchParams(searchParams);
        let currentValues = newParams.getAll('attribute_values[]');

        if (isChecked) {
            if (!currentValues.includes(valueId.toString())) {
                newParams.append('attribute_values[]', valueId.toString());
            }
        } else {
            // تفريغ وإعادة بناء الحقول المتبقية فقط عند إلغاء التحديد
            newParams.delete('attribute_values[]');
            currentValues
                .filter(id => id !== valueId.toString())
                .forEach(id => newParams.append('attribute_values[]', id));
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const clearFilters = () => setSearchParams(sectionId ? { section_id: sectionId } : {});

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage.toString());
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    const activeAttributeValues = searchParams.getAll('attribute_values[]');

    const FilterFormContent = () => (
        <form onSubmit={handlePriceFilterSubmit} className="space-y-6">
            <div className="space-y-3">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    {isRtl ? 'نطاق الأسعار' : 'Price Range'}
                </label>
                <div className="flex items-center gap-2">
                    <input type="number" name="min_price" placeholder={isRtl ? "الأدنى" : "Min"} defaultValue={minPrice} className="w-full border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl outline-none focus:border-[#00cc88] bg-white font-mono" />
                    <span className="text-slate-300 font-bold">-</span>
                    <input type="number" name="max_price" placeholder={isRtl ? "الأعلى" : "Max"} defaultValue={maxPrice} className="w-full border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl outline-none focus:border-[#00cc88] bg-white font-mono" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider py-2.5 rounded-xl hover:bg-black transition-colors shadow-2xs cursor-pointer">
                    {isRtl ? 'تطبيق السعر' : 'Apply Price'}
                </button>
            </div>

            <div className="w-full h-px bg-slate-100" />

            <div className="border border-slate-100 bg-white overflow-hidden rounded-2xl shadow-2xs">
                {dynamicFilters.map((filter) => (
                    <FilterAccordion key={filter.id} title={filter.name?.[i18n.language] || filter.name?.en || filter.name} isMain={true} defaultOpen={true}>
                        {/* تصفية وعرض الخيارات المتوفرة للخاصية */}
                        <div className="flex flex-col space-y-1">
                            {filter.values?.map((val) => (
                                <label key={val.id} className="flex items-center gap-2.5 py-1.5 cursor-pointer hover:text-[#00cc88] font-bold text-xs text-slate-600 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        className="accent-[#00cc88] h-4 w-4 cursor-pointer rounded"
                                        checked={activeAttributeValues.includes(val.id.toString())}
                                        onChange={(e) => handleCheckboxChange(val.id, e.target.checked)}
                                    /> 
                                    <span className="font-sans font-semibold text-slate-700">
                                        {typeof val.value === 'object' ? (val.value?.[i18n.language] || val.value?.en) : val.value}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </FilterAccordion>
                ))}

                <div className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-black transition-colors" onClick={clearFilters}>
                    <span>✕</span>
                    <span>{isRtl ? 'إعادة تعيين الفلاتر' : 'Reset All'}</span>
                </div>
            </div>
        </form>
    );

    return (
        <div className="w-full bg-[#f8fafc] min-h-screen">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8 relative">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    <div className="hidden lg:flex w-1/4 xl:w-1/5 shrink-0 flex-col gap-6 sticky top-28">
                        <div className="border-b border-slate-200 pb-2">
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                                {isRtl ? 'لوحة التصفية والمطابقة' : 'Filters Blueprint'}
                            </h2>
                        </div>
                        <FilterFormContent />
                    </div>

                    <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isMobileFilterOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
                        
                        <div className={`fixed inset-y-0 start-0 w-4/5 max-w-sm bg-white p-6 shadow-2xl flex flex-col space-y-4 overflow-y-auto transform transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'}`}>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                    {isRtl ? 'تصفية المنتجات' : 'Refine Products'}
                                </h2>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-base p-1">✕</button>
                            </div>
                            <FilterFormContent />
                        </div>
                    </div>

                    <div className="w-full lg:w-3/4 xl:w-4/5 space-y-4">
                        
                        {publicTags.length > 0 && (
                            <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                                {publicTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => handleTagSelectToggle(tag.id)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide border transition-all cursor-pointer whitespace-nowrap select-none active:scale-95 ${
                                            String(activeTagId) === String(tag.id)
                                                ? 'bg-[#00cc88] border-[#00cc88] text-white shadow-xs'
                                                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                                        }`}
                                    >
                                        #{tag.name?.[i18n.language] || tag.name?.en || tag.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-row justify-between items-center pb-4 mb-2 border-b border-slate-100 gap-4 pt-1">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="lg:hidden bg-white border border-slate-200 text-slate-700 p-2.5 rounded-xl flex items-center justify-center transition cursor-pointer hover:bg-slate-50 shadow-2xs"
                                    title="Open Filters"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                </button>
                                <h1 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-widest">
                                    {t('catalog')} 
                                </h1>
                            </div>

                            <div className="flex items-center gap-2">
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white outline-none cursor-pointer focus:border-[#00cc88] shadow-2xs font-bold uppercase tracking-wider"
                                >
                                    <option value="newest">{isRtl ? 'المنتجات الأحدث' : 'Latest Drop'}</option>
                                    <option value="price_asc">{isRtl ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                                    <option value="price_desc">{isRtl ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                                </select>
                            </div>
                        </div>

                        {error && <div className="py-10 text-center text-rose-500 font-bold text-xs bg-rose-50 border border-rose-100 rounded-xl">{error}</div>}

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {[...Array(10)].map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            !error && (
                                <>
                                    {products.length === 0 ? (
                                        <div className="py-20 text-center text-slate-400 font-bold text-xs bg-white rounded-2xl border border-dashed border-slate-200 uppercase tracking-widest">
                                            {isRtl ? 'لم نجد أي منتجات تطابق خيارات التصفية الحالية.' : 'No assets found matching the chosen parameters.'}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {products.map((product, index) => (
                                                <div key={product.id} className="rounded-2xl overflow-hidden bg-white shadow-2xs border border-transparent hover:border-slate-100/60 transition duration-300">
                                                    <ProductCard product={product} index={index}/>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {pagination && pagination.last_page > 1 && (
                                        <div className="flex justify-center items-center gap-4 pt-12 mt-8 border-t border-slate-100">
                                            <button onClick={() => handlePageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs disabled:opacity-30 font-black hover:border-[#00cc88] hover:text-[#00cc88] transition-all cursor-pointer select-none shadow-2xs">
                                                {isRtl ? 'السابق' : 'Prev'}
                                            </button>
                                            <span className="text-xs text-slate-400 font-mono font-bold">
                                                {isRtl ? `صفحة ${pagination.current_page} / ${pagination.last_page}` : `Page ${pagination.current_page} / ${pagination.last_page}`}
                                            </span>
                                            <button onClick={() => handlePageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs disabled:opacity-30 font-black hover:border-[#00cc88] hover:text-[#00cc88] transition-all cursor-pointer select-none shadow-2xs">
                                                {isRtl ? 'التالي' : 'Next'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}