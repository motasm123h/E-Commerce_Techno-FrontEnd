import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../../services/api';

export default function HomeBanner() {
    const [banners, setBanners] = useState([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/public/banners')
            .then(res => {
                if (res.data?.data) {
                    setBanners(res.data.data);
                }
            })
            .catch(err => console.error("Failed to fetch dynamic banners", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (loading) return <div className="w-full h-[450px] bg-gray-100 animate-pulse" />;
    if (banners.length === 0) return null;

    const currentBanner = banners[activeIdx];

    return (
        /* التعديل الجذري: w-full فقط بدون أي max-w أو px-4 ليمتد من الحافة للحافة */
        <div className="w-full">
            {/* زيادة الارتفاع لـ 450px ليكون البنر ضخماً */}
            <div className="w-full h-[450px] bg-neutral-900 overflow-hidden relative border-y border-gray-200">
                {currentBanner.link_url ? (
                    <Link to={currentBanner.link_url} className="block w-full h-full">
                        <img 
                            src={getImageUrl(currentBanner.image_path)} 
                            alt="Store Promotional Banner" 
                            className="w-full h-full object-cover transition-opacity duration-500"
                        />
                    </Link>
                ) : (
                    <img 
                        src={getImageUrl(currentBanner.image_path)} 
                        alt="Store Promotional Banner" 
                        className="w-full h-full object-cover transition-opacity duration-500"
                    />
                )}
                
                {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        {banners.map((_, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setActiveIdx(idx)}
                                className={`h-2.5 rounded-full transition-all cursor-pointer shadow-sm ${idx === activeIdx ? 'bg-white w-6' : 'bg-white/50 w-2.5 hover:bg-white/80'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}