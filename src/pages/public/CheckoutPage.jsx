import { useState, useEffect } from 'react';
import { useCart } from '../../app/CartContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    
    const [shippingZones, setShippingZones] = useState([]);
    const [zonesLoading, setZonesLoading] = useState(true);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        delivery_location: '',
        shipping_zone_id: '', // سيتم تعبئتها تلقائياً بعد جلب الزونات
        payment_method: 'cash'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successData, setSuccessData] = useState(null);

    // جلب مناطق الشحن من الباك إند عند تحميل الصفحة
    useEffect(() => {
        const fetchZones = async () => {
            try {
                const response = await api.get('/public/shipping-zones');
                const zonesData = response.data?.data || response.data || [];
                // تصفية الزونات الفعالة فقط
                const activeZones = zonesData.filter(z => z.is_active === 1 || z.is_active === true);
                
                setShippingZones(activeZones);
                
                // تحديد أول منطقة شحن كقيمة افتراضية إذا كانت موجودة
                if (activeZones.length > 0) {
                    setFormData(prev => ({ ...prev, shipping_zone_id: activeZones[0].id.toString() }));
                }
            } catch (err) {
                console.error("Failed to load shipping zones", err);
            } finally {
                setZonesLoading(false);
            }
        };

        fetchZones();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.shipping_zone_id) {
            setError('Please select a valid shipping zone.');
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            cart: cart.map(item => ({
                id: item.id,
                quantity: item.cartQuantity || item.quantity,
                selectedColor: item.selectedColor || null
            }))
        };

        try {
            const response = await api.post('/orders', payload);
            console.log(response.data)
            setSuccessData(response.data);
            clearCart(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (successData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white border-2 border-gray-900 p-12 max-w-lg w-full text-center space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Order Confirmed</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction Successful</p>
                    </div>
                    
                    <div className="bg-gray-50 border-2 border-gray-200 p-8">
                        <p className="text-[10px] font-black uppercase text-gray-500 mb-3 tracking-widest">Your Tracking Code</p>
                        <p className="text-4xl font-black text-blue-600 tracking-widest select-all">
                            {successData.tracking_code}
                        </p>
                    </div>

                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Please save this code to track your order.</p>

                    <Link to="/track-order" className="block bg-gray-900 text-white font-black text-xs uppercase px-8 py-5 tracking-widest hover:bg-blue-600 transition w-full cursor-pointer border-2 border-gray-900 hover:border-blue-600">
                        Track Order Now
                    </Link>
                </div>
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 bg-gray-50 px-4">
                <div className="text-center bg-white border-2 border-gray-200 p-12 max-w-2xl w-full">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-2">Checkout Unavailable</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8">Your cart is empty</p>
                    <Link to="/products" className="inline-block border-b-2 border-gray-900 text-sm font-black pb-1 hover:text-blue-600 hover:border-blue-600 transition uppercase tracking-widest">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                <div className="lg:col-span-2 space-y-8">
                    <div className="border-b-2 border-gray-900 pb-4">
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                            Checkout Details
                        </h1>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-600 text-red-700 p-4 text-xs font-bold uppercase tracking-wider">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Name</label>
                                <input required type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-gray-900 transition" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Phone Number</label>
                                <input required type="text" name="customer_phone" value={formData.customer_phone} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-gray-900 transition" placeholder="+963 9xx xxx xxx" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Detailed Address</label>
                            <textarea required name="delivery_location" value={formData.delivery_location} onChange={handleInputChange} rows="3" className="w-full bg-gray-50 border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-gray-900 transition" placeholder="City, Street, Building, Floor..."></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-gray-100">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Shipping Zone</label>
                                <select 
                                    name="shipping_zone_id" 
                                    value={formData.shipping_zone_id} 
                                    onChange={handleInputChange} 
                                    disabled={zonesLoading || shippingZones.length === 0}
                                    className="w-full bg-gray-50 border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-gray-900 transition appearance-none rounded-none disabled:opacity-50"
                                >
                                    {zonesLoading ? (
                                        <option value="">Loading zones...</option>
                                    ) : shippingZones.length === 0 ? (
                                        <option value="">No zones available</option>
                                    ) : (
                                        shippingZones.map(zone => (
                                            <option key={zone.id} value={zone.id}>
                                                {zone.city_name} (+${Number(zone.fee).toFixed(2)})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Payment Method</label>
                                <select name="payment_method" value={formData.payment_method} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-gray-900 transition appearance-none rounded-none">
                                    <option value="cash">Cash on Delivery (COD)</option>
                                    <option value="haram_transfer">Al-Haram Transfer</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" disabled={loading || shippingZones.length === 0} className="w-full bg-gray-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-5 transition disabled:opacity-50 mt-4 border-2 border-gray-900 hover:border-blue-600 cursor-pointer">
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="border-b-2 border-gray-900 pb-4">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                            Summary
                        </h2>
                    </div>
                    
                    <div className="bg-white border-2 border-gray-200 p-8 space-y-6">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.selectedColor}`} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex-1 pr-4">
                                        <p className="text-xs font-bold text-gray-800 line-clamp-1 uppercase">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">QTY: {item.cartQuantity || item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-black text-gray-900">${(item.price * (item.cartQuantity || item.quantity)).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="pt-6 border-t-2 border-gray-900 flex justify-between items-center">
                            <span className="text-sm font-black uppercase tracking-widest text-gray-900">Total</span>
                            <span className="text-2xl font-black text-blue-600">${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}