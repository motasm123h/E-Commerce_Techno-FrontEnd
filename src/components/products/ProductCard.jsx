import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import { getImageUrl } from '../../services/api';
import { useTranslation } from 'react-i18next'; 

export default function ProductCard({ product, index }) {
    const { t, i18n } = useTranslation(); 
    const { cart, addToCart } = useCart();
    const navigate = useNavigate();

    const isRtl = i18n.language === 'ar';
    const isPriority = index < 2;
    const isAlreadyInCart = cart ? cart.some(item => item.id === product.id) : false;
    
    const primaryImage = product.images && product.images.length > 0 
        ? getImageUrl(product.images[0]) 
        : 'https://via.placeholder.com/400x400?text=No+Image';
        
    const secondaryImage = product.images && product.images.length > 1 
        ? getImageUrl(product.images[1]) 
        : null;

    const handleCartAction = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock <= 0) return;

        if (isAlreadyInCart) {
            navigate('/cart');
        } else {
            addToCart(product);
        }
    };

    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]+>/g, '');
    };

    const productDescription = product?.description
    return (
        <div className="bg-white flex flex-col items-center p-5 text-center h-full relative w-full group hover:shadow-xl shadow-xs transition-all duration-300 border border-slate-100 hover:border-slate-200 rounded-3xl overflow-hidden text-left rtl:text-right">
            
            <Link
                to={`/product/${product.slug}`}
                className="w-full aspect-square bg-white relative block mb-4 overflow-hidden shrink-0 rounded-2xl"
            >
                <img
                    width="270"
                    height="270"
                    src={primaryImage}
                    alt={product.name}
                    loading={isPriority ? "eager" : "lazy"}
                    fetchPriority={isPriority ? "high" : "low"}
                    className={`absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-500 z-10 ${secondaryImage ? 'opacity-100 lg:group-hover:opacity-0' : 'opacity-100'}`}
                />

                {secondaryImage && (
                    <img 
                        width="270"
                        height="270"
                        src={secondaryImage} 
                        alt={`${product.name} alternate view`} 
                        loading="lazy"
                        fetchPriority="low"
                        className="absolute inset-0 w-full h-full object-contain p-2 opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100 hidden lg:block"
                    />
                )}

                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-20 flex items-center justify-center transition-all">
                        <span className="text-slate-800 text-xs font-black uppercase tracking-wider bg-white/90 px-4 py-2 border border-slate-200 shadow-xs rounded-xl">
                            {t('sold_out')}
                        </span>
                    </div>
                )}
            </Link>

            {/* كتلة البيانات النصية */}
            <div className="flex flex-col flex-grow w-full space-y-1.5 relative z-10">
                
                {/* طباعة التاغات التسويقية للمنتج إذا وجدت أعلى الاسم لإعطاء شكل فخم */}
                {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-0.5 justify-start">
                        {product.tags.slice(0, 2).map(tag => (
                            <span key={tag.id} className="text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md">
                                #{tag.name?.[i18n.language] || tag.name?.en || tag.name}
                            </span>
                        ))}
                    </div>
                )}

                <Link 
                    to={`/product/${product.slug}`} 
                    className="text-[14px] font-bold text-slate-800 hover:text-[#00cc88] transition-colors line-clamp-1 leading-snug block w-full tracking-tight"
                >
                    {product.name}
                </Link>
                
                {/* ⚡ طباعة حقل الوصف المترجم الجديد بأسلوب انسيابي وأنيق بدلاً من الديتيلز الجامدة ⚡ */}
                {productDescription && (
                    <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed w-full min-h-[2.2rem]">
                        {stripHtml(productDescription)}
                    </p>
                )}

                {/* جزء السعر أو شارة النفاذ */}
                {product.stock <= 0 ? (
                    <div className="text-xs font-black text-slate-400 uppercase tracking-wide pt-1 mt-auto">
                        {t('sold_out')}
                    </div>
                ) : (
                    <div className="text-[16px] font-mono font-black text-slate-900 pt-1 tracking-tight mt-auto flex items-center justify-between w-full">
                        <span>${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        {product.brand?.name && (
                            // <span className="text-[9px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md text-slate-400 font-sans font-black uppercase tracking-widest"></span>
                            <span className="text-[9px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md text-slate-400 font-sans font-black uppercase tracking-widest">{product.brand?.[i18n.language]}</span>
                        )}
                    </div>
                )}
            </div>

            <div className="w-full pt-4 mt-auto flex justify-center relative z-10">
                <button 
                    onClick={handleCartAction}
                    disabled={product.stock <= 0 && !isAlreadyInCart}
                    className={`max-xs:text-[10px] text-xs font-black uppercase py-2.5 px-4 transition-all duration-300 cursor-pointer w-full rounded-xl tracking-wider select-none border border-transparent shadow-2xs active:scale-98
                        ${product.stock <= 0 && !isAlreadyInCart
                            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                            : isAlreadyInCart
                                ? 'bg-slate-900 text-white hover:bg-black'
                                : 'bg-[#00cc88] text-white hover:bg-[#00b374] shadow-md shadow-emerald-500/10' 
                        }
                    `}
                >
                    {product.stock <= 0 && !isAlreadyInCart 
                        ? t('sold_out') 
                        : isAlreadyInCart 
                            ? t('view_cart') 
                            : t('add_to_cart')
                    }
                </button>
            </div>
        </div>
    );
}