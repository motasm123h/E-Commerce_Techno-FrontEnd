// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../services/api';
// import ProductCard from '../../components/products/ProductCard';
// import HomeBanner from '../../components/home/HomeBanner';

// const SectionScroller = ({ section }) => {
//     const scrollRef = useRef(null);
//     const [activeIndex, setActiveIndex] = useState(0);
//     const [isDragging, setIsDragging] = useState(false);
//     const [startX, setStartX] = useState(0);
//     const [scrollLeft, setScrollLeft] = useState(0);

//     // حسابات الصفحات والداتا بدون أي تعديل
//     const cardsPerView = 6; 
//     const totalPages = Math.ceil((section.products?.length || 0) / cardsPerView);

//     // السحب بالماوس
//     const onMouseDown = (e) => {
//         setIsDragging(true);
//         setStartX(e.pageX - scrollRef.current.offsetLeft);
//         setScrollLeft(scrollRef.current.scrollLeft);
//     };

//     const onMouseMove = (e) => {
//         if (!isDragging) return;
//         e.preventDefault();
//         const x = e.pageX - scrollRef.current.offsetLeft;
//         const walk = (x - startX) * 2;
//         scrollRef.current.scrollLeft = scrollLeft - walk;
//     };

//     const onMouseUp = () => setIsDragging(false);

//     // التمرير التلقائي
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (!scrollRef.current || isDragging) return;

//             const nextIndex = (activeIndex + 1) >= totalPages ? 0 : activeIndex + 1;
            
//             scrollRef.current.scrollTo({
//                 left: nextIndex * scrollRef.current.offsetWidth,
//                 behavior: "smooth",
//             });
//             setActiveIndex(nextIndex);
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [activeIndex, isDragging, totalPages]);

//     const handleScroll = () => {
//         if (scrollRef.current) {
//             const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
//             if (index !== activeIndex) setActiveIndex(index);
//         }
//     };

//     return (
//         <div className="space-y-6 relative w-full overflow-hidden">
//             {/* حاوية العنوان + زر Explore More */}
//             <div className="border-b border-gray-200 pb-3 px-6 flex items-end justify-between">
//                 <h2 className="text-xl font-normal text-gray-500 uppercase tracking-widest">
//                     {section.name}
//                 </h2>
                
//                 {/* تم إعادة الزر وتنسيقه بشكل كلاسيكي ناعم ليناسب هوية المتجر */}
//                 <Link 
//                     to={`/products?section_id=${section.id}`} 
//                     className="text-[12px] font-normal text-gray-500 hover:text-black transition-colors duration-150 uppercase tracking-widest border-b border-transparent hover:border-black pb-0.5"
//                 >
//                     Explore more →
//                 </Link>
//             </div>

//             {/* الشبكة والخطوط الواضحة */}
//             <div
//                 ref={scrollRef}
//                 onScroll={handleScroll}
//                 className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full cursor-grab active:cursor-grabbing select-none border-y border-gray-300 bg-white"
//                 onMouseDown={onMouseDown}
//                 onMouseLeave={onMouseUp}
//                 onMouseUp={onMouseUp}
//                 onMouseMove={onMouseMove}
//             >
//                 {section.products.map((product) => (
//                     <div
//                         key={product.id}
//                         className="w-1/3 sm:w-1/4 lg:w-1/6 flex-shrink-0 snap-start border-r border-gray-300"
//                     >
//                         <ProductCard product={product} />
//                     </div>
//                 ))}
//             </div>

//             {/* Dots Navigation */}
//             <div className="flex justify-center gap-2 pb-4">
//                 {Array.from({ length: totalPages }).map((_, idx) => (
//                     <button
//                         key={idx}
//                         onClick={() => {
//                             scrollRef.current.scrollTo({
//                                 left: idx * scrollRef.current.offsetWidth,
//                                 behavior: "smooth",
//                             });
//                             setActiveIndex(idx);
//                         }}
//                         className={`h-2 rounded-full transition-all duration-300 ${
//                             activeIndex === idx ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
//                         }`}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default function HomePage() {
//     const [sectionsData, setSectionsData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchHomeData = async () => {
//             try {
//                 const res = await api.get('/public/home-sections');
//                 if (res.data?.data) setSectionsData(res.data.data);
//             } catch (err) {
//                 console.error("Error loading home sections", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchHomeData();
//     }, []);

//     if (loading) return <div className="p-20 text-center">Loading...</div>;

//     return (
//         <div className="w-full bg-gray pb-16">
//             <HomeBanner />
//             <div className="w-full mt-12 space-y-16">
//                 {sectionsData.map((section) => (
//                     <SectionScroller key={section.id} section={section} />
//                 ))}
//             </div>
//         </div>
//     );
// }












// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import api, { getImageUrl } from '../../services/api';
// import ProductCard from '../../components/products/ProductCard';
// import HomeBanner from '../../components/home/HomeBanner';

// // --- مكون عرض الإعلانات (Advertisement Block) ---
// const AdvertisementBlock = ({ ads, type }) => {
//     if (!ads || ads.length === 0) return null;

//     if (type === 'logo') {
//         return (
//             // إزالة القيود (max-w) وجعلها w-full مع هوامش متجاوبة لتعبئة الشاشة
//             <div className="w-full bg-white border-y border-gray-200 py-10 my-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
//                 {/* justify-evenly لتوزيع الإعلانات الصغيرة على كامل العرض من اليمين لليسار */}
//                 <div className="flex flex-wrap justify-evenly items-center gap-8">
//                     {ads.map(ad => (
//                         <a key={ad.id} href={ad.link_url} target="_blank" rel="noopener noreferrer" className="cursor-pointer flex justify-center min-w-[120px]">
//                             {/* إزالة الفلتر الرمادي وتكبير الحجم */}
//                             <img src={getImageUrl(ad.image_path)} alt={ad.title} className="h-16 md:h-20 lg:h-24 object-contain" />
//                         </a>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     if (type === 'banner') {
//         return (
//             // تمدد كامل للبانرات الكبيرة
//             <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-6 my-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
//                     {ads.map(ad => (
//                         <a key={ad.id} href={ad.link_url} className="block overflow-hidden group shadow-sm hover:shadow-md transition cursor-pointer">
//                             <img src={getImageUrl(ad.image_path)} alt={ad.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
//                         </a>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     return null;
// };

// // --- مكون شريط التمرير ---
// const SectionScroller = ({ section }) => {
//     const scrollRef = useRef(null);
//     const [activeIndex, setActiveIndex] = useState(0);
//     const [isDragging, setIsDragging] = useState(false);
//     const [startX, setStartX] = useState(0);
//     const [scrollLeft, setScrollLeft] = useState(0);

//     const cardsPerView = 6; 
//     const totalPages = Math.ceil((section.products?.length || 0) / cardsPerView);

//     const onMouseDown = (e) => {
//         setIsDragging(true);
//         setStartX(e.pageX - scrollRef.current.offsetLeft);
//         setScrollLeft(scrollRef.current.scrollLeft);
//     };

//     const onMouseMove = (e) => {
//         if (!isDragging) return;
//         e.preventDefault();
//         const x = e.pageX - scrollRef.current.offsetLeft;
//         const walk = (x - startX) * 1; 
//         scrollRef.current.scrollLeft = scrollLeft - walk;
//     };

//     const onMouseUp = () => setIsDragging(false);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (!scrollRef.current || isDragging) return;

//             const nextIndex = (activeIndex + 1) >= totalPages ? 0 : activeIndex + 1;
            
//             scrollRef.current.scrollTo({
//                 left: nextIndex * scrollRef.current.offsetWidth,
//                 behavior: "smooth",
//             });
//             setActiveIndex(nextIndex);
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [activeIndex, isDragging, totalPages]);

//     const handleScroll = () => {
//         if (scrollRef.current && !isDragging) {
//             const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
//             if (index !== activeIndex) setActiveIndex(index);
//         }
//     };

//     return (
//         // إزالة القيود من قسم السكرول ليتمدد مع الشاشة
//         <div className="space-y-6 relative w-full overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
//             <div className="border-b border-gray-200 pb-3 flex items-end justify-between">
//                 <h2 className="text-xl font-normal text-gray-500 uppercase tracking-widest">
//                     {section.name}
//                 </h2>
                
//                 <Link 
//                     to={`/products?section_id=${section.id}`} 
//                     className="text-[12px] font-normal text-gray-500 hover:text-black transition-colors duration-150 uppercase tracking-widest border-b border-transparent hover:border-black pb-0.5"
//                 >
//                     Explore more →
//                 </Link>
//             </div>

//             <div
//                 ref={scrollRef}
//                 onScroll={handleScroll}
//                 style={{ scrollSnapType: isDragging ? 'none' : 'x mandatory' }}
//                 className="flex overflow-x-auto scrollbar-hide w-full cursor-grab active:cursor-grabbing select-none border-y border-gray-300 bg-white"
//                 onMouseDown={onMouseDown}
//                 onMouseLeave={onMouseUp}
//                 onMouseUp={onMouseUp}
//                 onMouseMove={onMouseMove}
//             >
//                 {section.products.map((product) => (
//                     <div
//                         key={product.id}
//                         // النسب المئوية (w-1/6) تضمن أن المنتج سيتمدد ليأخذ سدس الشاشة مهما قمت بالزوم، مما يبقيها ممتلئة دائماً
//                         className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex-shrink-0 snap-start border-r border-gray-300 last:border-r-0"
//                     >
//                         <ProductCard product={product} />
//                     </div>
//                 ))}
//             </div>

//             <div className="flex justify-center gap-2 pb-4">
//                 {Array.from({ length: totalPages }).map((_, idx) => (
//                     <button
//                         key={idx}
//                         onClick={() => {
//                             scrollRef.current.scrollTo({
//                                 left: idx * scrollRef.current.offsetWidth,
//                                 behavior: "smooth",
//                             });
//                             setActiveIndex(idx);
//                         }}
//                         className={`h-2 rounded-full transition-all duration-300 ${
//                             activeIndex === idx ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
//                         }`}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default function HomePage() {
//     const [sectionsData, setSectionsData] = useState([]);
//     const [advertisements, setAdvertisements] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchHomeData = async () => {
//             try {
//                 const resSections = await api.get('/public/home-sections');
//                 if (resSections.data?.data) setSectionsData(resSections.data.data);

//                 const resAds = await api.get('/public/advertisements');
//                 if (resAds.data?.data) setAdvertisements(resAds.data.data);

//             } catch (err) {
//                 console.error("Error loading home data", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchHomeData();
//     }, []);

//     if (loading) return <div className="p-20 text-center font-bold text-gray-500 uppercase tracking-widest">Loading Storefront...</div>;

//     const logoAds = advertisements.filter(ad => ad.type === 'logo');
//     const bannerAds = advertisements.filter(ad => ad.type === 'banner');

//     return (
//         <div className="w-full bg-white pb-16">
            
//             <HomeBanner />
            
//             <div className="w-full mt-12 space-y-4">
//                 {sectionsData.map((section, index) => {
                    
//                     let adBlock = null;

//                     if (index % 2 === 0) {
//                         const bannerChunkIndex = index / 2;
//                         const start = bannerChunkIndex * 3; 
//                         const chunk = bannerAds.slice(start, start + 3);
                        
//                         if (chunk.length > 0) {
//                             adBlock = <AdvertisementBlock ads={chunk} type="banner" />;
//                         }
//                     } else {
//                         const logoChunkIndex = Math.floor(index / 2);
//                         const start = logoChunkIndex * 4; 
//                         const chunk = logoAds.slice(start, start + 4);
                        
//                         if (chunk.length > 0) {
//                             adBlock = <AdvertisementBlock ads={chunk} type="logo" />;
//                         }
//                     }

//                     return (
//                         <div key={section.id} className="flex flex-col">
//                             <SectionScroller section={section} />
//                             {adBlock}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }






import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import HomeBanner from '../../components/home/HomeBanner';
import { useGlobalApp } from '../../app/AppContext';

const SkeletonSection = () => (
    <div className="space-y-6 relative w-full overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 my-8">
        <div className="border-b border-gray-200 pb-3 flex items-end justify-between">
            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="flex gap-4 overflow-hidden border-y border-gray-200 bg-white py-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex-shrink-0 h-72 bg-gray-50 border border-gray-100 rounded-lg animate-pulse"></div>
            ))}
        </div>
    </div>
);


const AdvertisementBlock = ({ ads, type }) => {
    if (!ads || ads.length === 0) return null;

    if (type === 'logo') {
        return (
            <div className="w-full bg-white border-y border-gray-200 py-6 md:py-10 my-8 md:my-10 px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                <div className="flex justify-evenly items-center gap-2 md:gap-8">
                    {ads.map(ad => (
                        <a key={ad.id} href={ad.link_url} target="_blank" rel="noopener noreferrer" className="cursor-pointer flex justify-center shrink-1">
                            <img src={getImageUrl(ad.image_path)} alt={ad.title} className="h-7 sm:h-12 md:h-20 lg:h-24 object-contain" />
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'banner') {
        return (
            // تصغير المسافات الجانبية على الموبايل
            <div className="w-full px-2 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-4 md:py-6 my-4">
                {/* إزالة الـ grid-cols-1 وإجبارها على أن تكون 3 أعمدة دائماً، مع تصغير الـ gap في الموبايل */}
                <div className="grid grid-cols-3 gap-2 md:gap-6 w-full">
                    {ads.map(ad => (
                        <a key={ad.id} href={ad.link_url} className="block overflow-hidden group shadow-sm hover:shadow-md transition cursor-pointer rounded md:rounded-lg">
                            <img src={getImageUrl(ad.image_path)} alt={ad.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded md:rounded-lg" />
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

// --- مكون شريط التمرير ---
const SectionScroller = ({ section }) => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const cardsPerView = 6; 
    const totalPages = Math.ceil((section.products?.length || 0) / cardsPerView);

    const onMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1; 
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!scrollRef.current || isDragging) return;

            const nextIndex = (activeIndex + 1) >= totalPages ? 0 : activeIndex + 1;
            
            scrollRef.current.scrollTo({
                left: nextIndex * scrollRef.current.offsetWidth,
                behavior: "smooth",
            });
            setActiveIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [activeIndex, isDragging, totalPages]);

    const handleScroll = () => {
        if (scrollRef.current && !isDragging) {
            const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
            if (index !== activeIndex) setActiveIndex(index);
        }
    };

    return (
        <div className="space-y-6 relative w-full overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
            <div className="border-b border-gray-200 pb-3 flex items-end justify-between">
                <h2 className="text-xl font-normal text-gray-500 uppercase tracking-widest">
                    {section.name}
                </h2>
                
                <Link 
                    to={`/products?section_id=${section.id}`} 
                    className="text-[12px] font-normal text-gray-500 hover:text-black transition-colors duration-150 uppercase tracking-widest border-b border-transparent hover:border-black pb-0.5"
                >
                    Explore more →
                </Link>
            </div>

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                style={{ scrollSnapType: isDragging ? 'none' : 'x mandatory' }}
                className="flex overflow-x-auto scrollbar-hide w-full cursor-grab active:cursor-grabbing select-none border-y border-gray-300 bg-white"
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseUp}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            >
                {section.products.map((product) => (
                    <div
                        key={product.id}
                        className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex-shrink-0 snap-start border-r border-gray-300 last:border-r-0"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-2 pb-4">
                {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            scrollRef.current.scrollTo({
                                left: idx * scrollRef.current.offsetWidth,
                                behavior: "smooth",
                            });
                            setActiveIndex(idx);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            activeIndex === idx ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default function HomePage() {
    const { homeSections: sectionsData, homeAds: advertisements, loading } = useGlobalApp();

    const safeAds = advertisements || [];
    const safeSections = sectionsData || [];

    const logoAds = safeAds.filter(ad => ad.type === 'logo');
    const bannerAds = safeAds.filter(ad => ad.type === 'banner');

    return (
        <div className="w-full bg-white pb-16">
            
            <HomeBanner />
            
            {loading ? (
                <div className="w-full mt-12 space-y-4">
                    <SkeletonSection />
                    <SkeletonSection />
                </div>
            ) : (
                <div className="w-full mt-12 space-y-4">
                    {safeSections.map((section, index) => {
                        let adBlock = null;

                        if (index % 2 === 0) {
                            const bannerChunkIndex = index / 2;
                            const start = bannerChunkIndex * 3; 
                            const chunk = bannerAds.slice(start, start + 3);
                            
                            if (chunk.length > 0) {
                                adBlock = <AdvertisementBlock ads={chunk} type="banner" />;
                            }
                        } else {
                            const logoChunkIndex = Math.floor(index / 2);
                            const start = logoChunkIndex * 4; 
                            const chunk = logoAds.slice(start, start + 4);
                            
                            if (chunk.length > 0) {
                                adBlock = <AdvertisementBlock ads={chunk} type="logo" />;
                            }
                        }

                        return (
                            <div key={section.id} className="flex flex-col">
                                <SectionScroller section={section} />
                                {adBlock}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}