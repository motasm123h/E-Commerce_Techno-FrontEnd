import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import { getImageUrl } from '../../services/api';

export default function ProductCard({ product }) {
    const { cartItems, addToCart } = useCart();
    const navigate = useNavigate();

    const isAlreadyInCart = cartItems ? cartItems.some(item => item.id === product.id) : false;

    // جلب الصورة الأساسية
    const primaryImage = product.images && product.images.length > 0 
        ? getImageUrl(product.images[0]) 
        : 'https://via.placeholder.com/400x400?text=No+Image';
        
    // جلب الصورة الثانية (لتبديلها عند التمرير)
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

    // دالة لمسح أكواد الـ HTML من الوصف لكي يظهر كنص نظيف في الكرت
    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]+>/g, '');
    };

    return (
        <div className="bg-white flex flex-col items-center p-4 sm:p-6 text-center h-full relative w-full group">
            
            {product.stock <= 0 && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 z-10 tracking-wider">
                    Sold Out
                </span>
            )}

            <Link 
                to={`/product/${product.slug}`}
                state={{ productId: product.id }}
                className="w-full aspect-square bg-white relative block mb-4 overflow-hidden"
            >
                {/* الصورة الأساسية: تم حصر تأثير الشفافية على الشاشات الكبيرة lg:group-hover */}
                <img 
                    src={primaryImage} 
                    alt={product.name} 
                    className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-500 ${secondaryImage ? 'opacity-100 lg:group-hover:opacity-0' : 'opacity-100'}`}
                    loading="lazy"
                />
                
                {/* الصورة البديلة: مخفية على الموبايل (hidden) وتظهر فقط على الشاشات الكبيرة (lg:block) عند التمرير */}
                {secondaryImage && (
                    <img 
                        src={secondaryImage} 
                        alt={`${product.name} alternate view`} 
                        className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100 hidden lg:block"
                        loading="lazy"
                    />
                )}
            </Link>

            <div className="flex flex-col items-center flex-grow w-full space-y-2">
                <Link 
                    to={`/product/${product.slug}`} 
                    state={{ productId: product.id }}
                    className="text-[15px] font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 leading-snug px-1 block w-full"
                >
                    {product.name}
                </Link>
                
                {/* استخدام product.details[0] بناءً على تعديلك الصحيح */}
                {product.details && product.details.length > 0 && (
                    <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed px-2 w-full">
                        {stripHtml(product.details[0])}
                    </p>
                )}

                <div className="text-[16px] font-bold text-gray-900 pt-2 tracking-tight mt-auto">
                    ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            </div>

            <div className="w-full pt-4 mt-auto flex justify-center">
                <button 
                    onClick={handleCartAction}
                    disabled={product.stock <= 0 && !isAlreadyInCart}
                    className={`text-[13px] font-normal py-1.5 px-4 transition-all duration-200 cursor-pointer w-full max-w-[200px] text-center border rounded-none normal-case tracking-wide
                        ${product.stock <= 0 && !isAlreadyInCart
                            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
                            : isAlreadyInCart
                                ? 'bg-gray-900 border-gray-900 text-white hover:bg-black' 
                                : 'bg-white border-gray-400 text-gray-700 hover:border-gray-900 hover:text-gray-900' 
                        }
                    `}
                >
                    {product.stock <= 0 && !isAlreadyInCart 
                        ? 'Sold Out' 
                        : isAlreadyInCart 
                            ? 'View cart' 
                            : 'Add to cart'
                    }
                </button>
            </div>
        </div>
    );
}