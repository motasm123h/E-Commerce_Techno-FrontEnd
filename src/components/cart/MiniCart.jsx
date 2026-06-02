// import { Link } from 'react-router-dom';
// import { useCart } from '../../app/CartContext';
// import { getImageUrl } from '../../services/api';

// export default function MiniCart({ isOpen }) {
//     const { cart, removeFromCart } = useCart();
    
//     // Calculate total inside the component so the parent doesn't have to pass it
//     const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.cartQuantity || item.quantity || 1)), 0);

//     return (
//         <div className={`absolute top-full right-0 mt-1 w-[340px] bg-white border border-gray-100 shadow-2xl rounded-lg p-5 transition-all duration-300 origin-top-right z-50 ${isOpen ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible translate-y-2'}`}>
//             {cart.length === 0 ? (
//                 <div className="text-center py-6 text-gray-500 font-bold">
//                     Your cart is currently empty.
//                 </div>
//             ) : (
//                 <>
//                     {/* Products List */}
//                     <div className="max-h-64 overflow-y-auto pr-2 space-y-4 mb-4 custom-scrollbar">
//                         {cart.map((item, index) => (
//                             <div key={index} className="flex gap-3">
//                                 {/* Product Image */}
//                                 <div className="w-16 h-16 shrink-0 bg-white border border-gray-100 p-1 flex items-center justify-center rounded">
//                                     {console.log(item.images[0])}
//                                     <img 
//                                         src={getImageUrl(item.images[0] || item.images?.[0]?.image_path)} 
//                                         alt={item.name} 
//                                         className="max-h-full max-w-full object-contain" 
//                                     />
//                                 </div>
                                
//                                 {/* Details */}
//                                 <div className="flex-1 min-w-0">
//                                     <Link to={`/product/${item.id}`} className="text-[13px] font-semibold text-[#3b5998] hover:underline leading-tight line-clamp-3">
//                                         {item.name}
//                                     </Link>
//                                     <div className="text-sm font-bold text-gray-500 mt-1">
//                                         {item.cartQuantity || item.quantity || 1} × ${Number(item.price).toFixed(2)}
//                                     </div>
//                                 </div>

//                                 {/* Remove Button */}
//                                 <button 
//                                     onClick={() => removeFromCart && removeFromCart(item.id)}
//                                     className="w-6 h-6 shrink-0 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
//                                     title="Remove item"
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Subtotal */}
//                     <div className="border-t border-gray-200 pt-3 mb-4 flex justify-between items-center text-[15px]">
//                         <span className="font-bold text-gray-600">Subtotal:</span>
//                         <span className="font-black text-gray-900">${cartTotal.toFixed(2)}</span>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="space-y-2">
//                         <Link to="/cart" className="block w-full text-center bg-[#4a6583] hover:bg-[#3b536e] text-white font-bold py-2.5 rounded transition shadow-sm">
//                             VIEW CART
//                         </Link>
//                         <Link to="/checkout" className="block w-full text-center bg-[#b85b37] hover:bg-[#9c4c2d] text-white font-bold py-2.5 rounded transition shadow-sm">
//                             CHECKOUT
//                         </Link>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }





import { Link } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import { getImageUrl } from '../../services/api';
import { useTranslation } from 'react-i18next'; // ⚡ استدعاء الترجمة

export default function MiniCart({ isOpen }) {
    const { t, i18n } = useTranslation(); 
    const { cart, removeFromCart } = useCart();
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.cartQuantity || item.quantity || 1)), 0);
    const isRtl = i18n.language === 'ar';

    return (
        /* ⚡ التعديل الهندسي الحاسم: استخدام end-0 بدلاً من right-0، وتعديل الـ origin ديناميكياً بناءً على اتجاه لغة العرض النشطة لمنع خروج القائمة عن حدود شاشة اللمس ⚡ */
        <div className={`absolute top-full end-0 mt-1 w-[340px] bg-white border border-slate-100 shadow-2xl rounded-2xl p-5 transition-all duration-300 z-50 ${
            isRtl ? 'origin-top-left' : 'origin-top-right'
        } ${
            isOpen ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible translate-y-2'
        }`}>
            {cart.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-black uppercase tracking-wider">
                    {t('mini_cart_empty')}
                </div>
            ) : (
                <>
                    {/* قائمة المنتجات المصغرة */}
                    <div className="max-h-64 overflow-y-auto pr-2 pl-2 space-y-4 mb-4 custom-scrollbar">
                        {cart.map((item, index) => (
                            <div key={index} className="flex gap-3 items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                <div className="w-14 h-14 shrink-0 bg-white border border-slate-100 p-1 flex items-center justify-center rounded-xl shadow-3xs">
                                    <img 
                                        src={getImageUrl(item.images?.[0] || item.image_path)} 
                                        alt={item.name} 
                                        className="max-h-full max-w-full object-contain" 
                                    />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <Link to={`/product/${item.id}`} className="text-[12px] font-extrabold text-slate-800 hover:text-[#00cc88] transition-colors leading-tight line-clamp-2 uppercase tracking-tight">
                                        {item.name}
                                    </Link>
                                    <div className="text-xs font-mono font-black text-slate-400 mt-0.5">
                                        {item.cartQuantity || item.quantity || 1} × ${Number(item.price).toFixed(2)}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => removeFromCart && removeFromCart(item.id)}
                                    className="w-6 h-6 shrink-0 rounded-full text-slate-300 flex items-center justify-center hover:text-rose-500 transition-colors cursor-pointer text-xs font-bold"
                                    title="Remove item"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* المجموع الكلي المصغر */}
                    <div className="border-t border-slate-100 pt-4 mb-4 flex justify-between items-center text-xs font-black uppercase tracking-wider">
                        <span className="text-slate-500">{t('mini_cart_subtotal')}</span>
                        <span className="font-mono text-sm font-black text-slate-900">${cartTotal.toFixed(2)}</span>
                    </div>

                    {/* أزرار السلة وإتمام الشراء المتوهجة بالنيون الأخضر */}
                    <div className="space-y-2 pt-1">
                        <Link to="/cart" className="block w-full text-center bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-sm shadow-slate-900/10">
                            {t('view_cart')}
                        </Link>
                        <Link to="/checkout" className="block w-full text-center bg-[#00cc88] hover:bg-[#00b374] text-white text-[11px] font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-md shadow-emerald-500/10">
                            {t('mini_cart_checkout')}
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}