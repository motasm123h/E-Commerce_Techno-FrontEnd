import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import api, { getImageUrl } from '../../services/api';
import ProductCard from '../../components/products/ProductCard'; 
import { useTranslation } from 'react-i18next'; // ⚡ استدعاء مكتبة الترجمة

export default function CartPage() {
    const { t } = useTranslation(); // ⚡ تفعيل دالة الترجمة t
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(true);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.cartQuantity || item.quantity || 1)), 0);
    const total = subtotal; 

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoadingRecs(true);
                const productIds = cart.map(item => item.id);
                const response = await api.post('/public/cart/recommendations', { product_ids: productIds });
                if (response.data?.success) setRecommendations(response.data.data);
            } catch (error) {
                console.error("Failed to load recommendations", error);
            } finally {
                setLoadingRecs(false);
            }
        };
        if (cart.length > 0) fetchRecommendations();
    }, [cart.length]); 

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f8fafc] px-4">
                <svg className="w-20 h-20 text-slate-200 mb-6 animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-wider">{t('cart_empty_title')}</h2>
                <p className="text-sm text-slate-400 font-bold mb-8">{t('cart_empty_desc')}</p>
                <Link to="/products" className="bg-[#00cc88] hover:bg-[#00b374] text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_4px_15px_rgba(0,204,136,0.25)] transition-all duration-300 transform hover:-translate-y-0.5">
                    {t('continue_shopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#f8fafc] min-h-screen py-10 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    <div className="w-full lg:w-2/3 space-y-12">
                        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.02)] border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                {/* ⚡ تم ضبط المحاذاة النصية لتنقلب تلقائياً حسب اتجاه الـ LTR / RTL بمرونة كاملة */}
                                <table className="w-full text-left rtl:text-right border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/70">
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('th_component')}</th>
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('th_specs')}</th>
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('th_unit')}</th>
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('th_quantity')}</th>
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right rtl:text-left">{t('th_subtotal')}</th>
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {cart.map((item) => {
                                            const qty = item.cartQuantity || item.quantity || 1;
                                            const lineTotal = item.price * qty;

                                            return (
                                                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                                                    <td className="py-4 px-6 align-middle">
                                                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-xl p-1 flex items-center justify-center shrink-0 shadow-3xs">
                                                            <img 
                                                                src={getImageUrl(item.image_path || item.images?.[0])} 
                                                                alt={item.name} 
                                                                className="max-h-full max-w-full object-contain"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 align-middle">
                                                        <Link 
                                                            to={`/product/${item.slug || item.id}`} 
                                                            className="text-[13px] font-extrabold text-slate-800 hover:text-[#00cc88] transition-colors line-clamp-2 leading-snug tracking-tight uppercase"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </td>
                                                    <td className="py-4 px-6 align-middle text-center text-xs font-mono font-black text-slate-800">
                                                        ${Number(item.price).toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-6 align-middle">
                                                        <div className="flex items-center justify-center">
                                                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 p-0.5">
                                                                <button 
                                                                    onClick={() => updateQuantity(item.id, qty - 1)}
                                                                    disabled={qty <= 1}
                                                                    className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 rounded-lg font-black transition disabled:opacity-20 cursor-pointer"
                                                                >−</button>
                                                                <span className="w-8 text-center text-xs font-mono font-black text-slate-900">{qty}</span>
                                                                <button 
                                                                    onClick={() => updateQuantity(item.id, qty + 1)}
                                                                    disabled={qty >= item.stock}
                                                                    className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 rounded-lg font-black transition disabled:opacity-20 cursor-pointer"
                                                                >+</button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 align-middle text-right rtl:text-left text-xs font-mono font-black text-slate-900">
                                                        ${lineTotal.toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-6 align-middle text-center">
                                                        <button 
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer text-xs font-black p-2"
                                                        >
                                                            ✕
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-[#00cc88] inline-block pb-1">
                                {t('rec_title')}
                            </h3>
                            
                            {loadingRecs ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-80 bg-slate-50 animate-pulse rounded-2xl border border-slate-100"></div>
                                    ))}
                                </div>
                            ) : recommendations.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {recommendations.map((product, index) => (
                                        <div key={product.id} className="rounded-2xl overflow-hidden bg-white shadow-2xs border border-slate-100/50">
                                            <ProductCard product={product} index={index} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{t('rec_empty')}</p>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3">
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 sticky top-28 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
                            <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 border-b border-slate-100 pb-3">{t('summary_title')}</h2>
                            
                            <div className="space-y-4 text-xs font-black uppercase tracking-wider">
                                <div className="flex justify-between text-slate-500">
                                    <span>{t('summary_subtotal')}</span>
                                    <span className="font-mono text-sm font-black text-slate-900">${subtotal.toFixed(2)}</span>
                                </div>
                                
                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-slate-800">{t('summary_total')}</span>
                                    <span className="text-base font-mono font-black text-slate-900">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link 
                                to="/checkout" 
                                className="mt-8 w-full block text-center bg-[#00cc88] hover:bg-[#00b374] text-white font-black uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(0,204,136,0.25)] hover:shadow-[0_4px_25px_rgba(0,204,136,0.45)] text-xs cursor-pointer select-none transform hover:-translate-y-0.5"
                            >
                                {t('checkout_btn')} →
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}