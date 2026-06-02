import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import HomeBanner from '../../components/home/HomeBanner';
import { useGlobalApp } from '../../app/AppContext';

const SkeletonSection = () => (
    <div className="space-y-6 relative w-full overflow-hidden my-8">
        <div className="border-b border-slate-100 pb-3 flex items-end justify-between px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
            <div className="h-6 w-48 bg-slate-200 animate-pulse rounded"></div>
            <div className="h-4 w-24 bg-slate-200 animate-pulse rounded"></div>
        </div>
        <div className="flex gap-4 overflow-hidden bg-transparent py-4 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex-shrink-0 h-72 bg-white shadow-sm rounded-xl animate-pulse"></div>
            ))}
        </div>
    </div>
);

const AdvertisementBlock = ({ ads, type }) => {
    if (!ads || ads.length === 0) return null;

    if (type === 'logo') {
        return (
            <div className="w-full py-6 md:py-8 my-4 md:my-8 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                <div className="flex flex-nowrap justify-start md:justify-between items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-hide w-full pb-2 md:pb-0">
                    {ads.map(ad => (
                        <a 
                            key={ad.id} 
                            href={ad.link_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            // ⚡ التعديل هنا: تحديد عرض وارتفاع كـ "صندوق" وهمي لتوحيد قياسات اللوغوهات المختلفة ⚡
                            className="cursor-pointer flex justify-center items-center flex-shrink-0 w-24 sm:w-28 md:w-32 lg:w-40 h-12 sm:h-16 md:h-20"
                        >
                            <img 
                                src={getImageUrl(ad.image_path)} 
                                alt={ad.title} 
                                // ⚡ إجبار الصورة على احترام الحاوية وعدم تجاوزها ⚡
                                className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105 drop-shadow-sm mix-blend-multiply"
                            />
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'banner') {
        return (
            <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-4 md:py-6 my-2 md:my-4">
                <div className="flex md:grid md:grid-cols-3 flex-nowrap gap-4 md:gap-6 w-full overflow-x-auto scrollbar-hide pb-3 md:pb-0">
                    {ads.map(ad => (
                        <a key={ad.id} href={ad.link_url} className="block overflow-hidden group shadow-xs hover:shadow-md transition cursor-pointer rounded-xl md:rounded-2xl border border-slate-100/50 w-[85vw] md:w-full flex-shrink-0">
                            <img 
                                src={getImageUrl(ad.image_path)} 
                                alt={ad.title} 
                                className="w-full h-auto object-cover transform group-hover:scale-103 transition-transform duration-500 rounded-xl md:rounded-2xl" 
                            />
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

const SectionScroller = ({ section }) => {
    const { t, i18n } = useTranslation(); 
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const cardsPerView = 6; 
    const totalPages = Math.ceil((section.products?.length || 0) / cardsPerView);

    const isRtl = i18n.language === 'ar'; 

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
        if (isRtl) {
            scrollRef.current.scrollLeft = scrollLeft + walk;
        } else {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const onMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!scrollRef.current || isDragging) return;
            const nextIndex = (activeIndex + 1) >= totalPages ? 0 : activeIndex + 1;
            if (scrollRef.current) {
                const targetScrollLeft = isRtl 
                    ? -nextIndex * scrollRef.current.offsetWidth 
                    : nextIndex * scrollRef.current.offsetWidth;

                scrollRef.current.scrollTo({
                    left: targetScrollLeft,
                    behavior: "smooth",
                });
                setActiveIndex(nextIndex);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [activeIndex, isDragging, totalPages, isRtl]);

    const handleScroll = () => {
        if (scrollRef.current && !isDragging) {
            const index = Math.round(Math.abs(scrollRef.current.scrollLeft) / scrollRef.current.offsetWidth);
            if (index !== activeIndex) setActiveIndex(index);
        }
    };

    return (
        <div className="space-y-4 relative w-full overflow-hidden my-8">
            <div className="border-b border-slate-200 pb-3 flex items-end justify-between px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">
                          {section.name?.[i18n.language] || section.name?.en || section.name}
                </h2>
                <Link 
                    to={`/products?section_id=${section.id}`} 
                    className="text-[11px] font-black text-slate-400 hover:text-[#00cc88] transition-colors duration-150 uppercase tracking-widest border-b border-transparent hover:border-[#00cc88] pb-0.5 flex items-center gap-1"
                >
                    {isRtl ? 'استكشف المزيد ←' : 'Explore more →'}
                </Link>
            </div>

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                style={{ scrollSnapType: isDragging ? 'none' : 'x mandatory' }}
                className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide w-full cursor-grab active:cursor-grabbing select-none bg-transparent pt-2 pb-6"
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseUp}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            >
                {section.products.map((product, index) => (
                    <div
                        key={product.id}
                        className={`w-[60%] sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex-shrink-0 snap-start
                            ${index === 0 ? (isRtl ? 'me-4 sm:me-8 md:me-12 lg:me-16 xl:me-24' : 'ms-4 sm:ms-8 md:ms-12 lg:ms-16 xl:ms-24') : ''}
                            ${index === section.products.length - 1 ? (isRtl ? 'ms-4 sm:ms-8 md:ms-12 lg:ms-16 xl:ms-24' : 'me-4 sm:me-8 md:me-12 lg:me-16 xl:me-24') : ''}
                        `}
                    >
                        <ProductCard product={product} index={index} />
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-2 pb-4">
                {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            const targetScrollLeft = isRtl 
                                ? -idx * scrollRef.current.offsetWidth 
                                : idx * scrollRef.current.offsetWidth;

                            scrollRef.current.scrollTo({
                                left: targetScrollLeft,
                                behavior: "smooth",
                            });
                            setActiveIndex(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            activeIndex === idx ? "w-6 bg-[#00cc88]" : "w-1.5 bg-slate-200"
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
        <div className="w-full bg-[#f8fafc] pb-18">
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
                            // ⚡ التعديل هنا: تعديل المنطق ليسحب 5 لوغوهات في كل مرة ⚡
                            const start = logoChunkIndex * 5; 
                            const chunk = logoAds.slice(start, start + 5);
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