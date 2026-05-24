import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import api, { getImageUrl } from '../../services/api';
import ProductCard from '../../components/products/ProductCard'; 

export default function CartPage() {
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
                
                if (response.data?.success) {
                    setRecommendations(response.data.data);
                }
            } catch (error) {
                console.error("Failed to load recommendations", error);
            } finally {
                setLoadingRecs(false);
            }
        };

        fetchRecommendations();
    }, [cart.length]); 

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/products" className="bg-[#00a8e8] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0096d1] transition">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                <div className="w-full lg:w-2/3 space-y-12">
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Unit Price</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Quantity</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Line Total</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {cart.map((item) => {
                                        const qty = item.cartQuantity || item.quantity || 1;
                                        const lineTotal = item.price * qty;

                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6 align-middle">
                                                    <div className="w-16 h-16 bg-white border border-gray-100 rounded p-1 flex items-center justify-center shrink-0">
                                                        <img 
                                                            src={getImageUrl(item.image_path || item.images?.[0])} 
                                                            alt={item.name} 
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 align-middle">
                                                    <Link 
                                                        to={`/product/${item.id}`} 
                                                        state={{ productId: item.id }}
                                                        className="text-[13px] font-bold text-gray-800 hover:text-[#00a8e8] line-clamp-2 leading-relaxed"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-6 align-middle text-center text-[13px] font-bold text-gray-600">
                                                    ${Number(item.price).toFixed(2)}
                                                </td>
                                                <td className="py-4 px-6 align-middle">
                                                    <div className="flex items-center justify-center">
                                                        <div className="flex items-center border border-gray-200 rounded">
                                                            <button 
                                                                onClick={() => updateQuantity(item.id, qty - 1)}
                                                                disabled={qty <= 1}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                                                            >−</button>
                                                            <span className="w-8 text-center text-[13px] font-bold text-gray-800">{qty}</span>
                                                            <button 
                                                                onClick={() => updateQuantity(item.id, qty + 1)}
                                                                disabled={qty >= item.stock}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                                                            >+</button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 align-middle text-right text-[14px] font-black text-gray-900">
                                                    ${lineTotal.toFixed(2)}
                                                </td>
                                                <td className="py-4 px-6 align-middle text-center">
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer text-lg font-bold"
                                                        title="Remove from cart"
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

                    <div className="pt-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-[#00a8e8] inline-block pb-1">
                            You might also like
                        </h3>
                        
                        {loadingRecs ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg border border-gray-200"></div>
                                ))}
                            </div>
                        ) : recommendations.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {recommendations.map(product => (
                                    <div key={product.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No recommendations available at this time.</p>
                        )}
                    </div>

                </div>

                <div className="w-full lg:w-1/3">
                    <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
                        
                        <div className="space-y-4 text-[14px]">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-lg font-black text-gray-900">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link 
                            to="/checkout" 
                            className="mt-8 w-full block text-center bg-[#1cb8e6] hover:bg-[#15a3ce] text-white font-bold py-3.5 rounded-lg transition-colors shadow-sm tracking-wide text-[14px] cursor-pointer"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}