// import { useState, useEffect } from 'react';
// import { useCart } from '../../app/CartContext';
// import { Link } from 'react-router-dom';
// import api, { getImageUrl } from '../../services/api';

// export default function CheckoutPage() {
//     const { cart, cartTotal, clearCart } = useCart();
    
//     const [shippingZones, setShippingZones] = useState([]);
//     const [zonesLoading, setZonesLoading] = useState(true);
    
//     const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);

//     const [formData, setFormData] = useState({
//         customer_name: '',
//         customer_phone: '',
//         delivery_location: '',
//         shipping_zone_id: '',
//         payment_method: 'cash'
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [successData, setSuccessData] = useState(null);

//     const selectedZone = shippingZones.find(z => z.id.toString() === formData.shipping_zone_id);
//     const shippingFee = selectedZone ? Number(selectedZone.fee) : 0;
//     const finalTotal = cartTotal + shippingFee;

//     useEffect(() => {
//         const fetchZones = async () => {
//             try {
//                 const response = await api.get('/public/shipping-zones');
//                 const zonesData = response.data?.data || response.data || [];
//                 const activeZones = zonesData.filter(z => z.is_active === 1 || z.is_active === true);
                
//                 setShippingZones(activeZones);
                
//                 if (activeZones.length > 0) {
//                     setFormData(prev => ({ ...prev, shipping_zone_id: activeZones[0].id.toString() }));
//                 }
//             } catch (err) {
//                 console.error("Failed to load shipping zones", err);
//             } finally {
//                 setZonesLoading(false);
//             }
//         };

//         fetchZones();
//     }, []);

//     const handleInputChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleZoneSelect = (zoneId) => {
//         setFormData({ ...formData, shipping_zone_id: zoneId.toString() });
//         setIsZoneDropdownOpen(false);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!formData.shipping_zone_id) {
//             setError('Please select a valid shipping zone.');
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         const payload = {
//             ...formData,
//             cart: cart.map(item => ({
//                 id: item.id,
//                 quantity: item.cartQuantity || item.quantity,
//                 selectedColor: item.selectedColor || null
//             }))
//         };

//         try {
//             const response = await api.post('/orders', payload);
//             setSuccessData(response.data);
//             clearCart(); 
//         } catch (err) {
//             setError(err.response?.data?.message || 'Something went wrong. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (successData) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//                 <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 max-w-md w-full text-center space-y-6 shadow-xl transition-all">
//                     <div className="w-16 h-16 bg-[#63c98f]/10 text-[#63c98f] rounded-full flex items-center justify-center mx-auto">
//                         <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                         </svg>
//                     </div>
//                     <div>
//                         <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Order Confirmed</h2>
//                         <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Transaction Successful</p>
//                     </div>
                    
//                     <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-6">
//                         <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-2">Your Tracking Code</p>
//                         <p className="text-3xl font-black text-gray-900 tracking-widest select-all">
//                             {successData.tracking_code}
//                         </p>
//                     </div>

//                     <p className="text-xs text-gray-500 font-medium">Please safeguard this invoice token to monitor delivery routing.</p>

//                     <Link to="/track-order" className="block bg-[#63c98f] hover:bg-[#52b37c] text-white font-bold text-xs uppercase px-6 py-4 rounded-xl tracking-wider transition w-full shadow-sm text-center">
//                         Track Order Status
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     if (!cart || cart.length === 0) {
//         return (
//             <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
//                 <div className="text-center bg-white rounded-2xl border border-gray-100 p-12 max-w-xl w-full shadow-sm">
//                     <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-1">Checkout Unavailable</h2>
//                     <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Your cart repository is empty</p>
//                     <Link to="/products" className="inline-block bg-[#63c98f] hover:bg-[#52b37c] text-white font-bold text-xs uppercase px-6 py-3 rounded-lg transition tracking-wider shadow-xs">
//                         Return To Storefront
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
//                 <div className="lg:col-span-2 space-y-6">
//                     <div>
//                         <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Account Details</h1>
//                         <div className="w-8 h-1 bg-[#63c98f] rounded mt-1" />
//                     </div>

//                     {error && (
//                         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide">
//                             {error}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {/* بيانات الاتصال والاسم */}
//                         <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs space-y-4">
//                             <div className="space-y-1.5 relative">
//                                 <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Phone <span className="text-red-500">*</span></label>
//                                 <div className="relative flex items-center">
//                                     <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none border-r pr-2.5 border-gray-200">
//                                         <span className="text-base">🇸🇾</span>
//                                         <span className="text-xs font-bold text-gray-500">+963</span>
//                                     </div>
//                                     <input 
//                                         required 
//                                         type="tel" 
//                                         name="customer_phone" 
//                                         value={formData.customer_phone.replace('+963', '')} 
//                                         onChange={(e) => setFormData({...formData, customer_phone: '+963' + e.target.value.trim()})} 
//                                         className="w-full bg-white border border-gray-200 pl-20 pr-4 py-3 text-sm font-semibold rounded-lg focus:outline-none focus:border-[#63c98f] focus:ring-1 focus:ring-[#63c98f] transition shadow-2xs placeholder-gray-300" 
//                                         placeholder="9xx xxx xxx" 
//                                     />
//                                 </div>
//                             </div>

//                             <div className="border-t border-gray-100 pt-4">
//                                 <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Billing Details</h2>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="space-y-1.5">
//                                         <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">First Name <span className="text-red-500">*</span></label>
//                                         <input required type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full bg-white border border-gray-200 px-4 py-3 text-sm font-semibold rounded-lg focus:outline-none focus:border-[#63c98f] transition shadow-2xs" placeholder="John" />
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Last Name <span className="text-red-500">*</span></label>
//                                         <input required type="text" className="w-full bg-white border border-gray-200 px-4 py-3 text-sm font-semibold rounded-lg focus:outline-none focus:border-[#63c98f] transition shadow-2xs" placeholder="Doe" />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="space-y-4 pt-2">
//                                 <div className="space-y-1.5">
//                                     <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Area OR Region Name <span className="text-red-500">*</span></label>
//                                     <input required type="text" name="delivery_location" value={formData.delivery_location} onChange={handleInputChange} className="w-full bg-white border border-gray-200 px-4 py-3 text-sm font-semibold rounded-lg focus:outline-none focus:border-[#63c98f] transition shadow-2xs" placeholder="Address Line 1" />
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">City <span className="text-red-500">*</span></label>
//                                     <input required type="text" name="city_location" onChange={handleInputChange}  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm font-semibold rounded-lg focus:outline-none focus:border-[#63c98f] transition shadow-2xs" placeholder="e.g., Damascus" />
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <input type="text" name="addressOne_location" onChange={handleInputChange}  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm font-semibold rounded-lg focus:outline-none focus:border-[#63c98f] transition shadow-2xs" placeholder="Address Line 2 (optional)" />
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Order Note</label>
//                                     <textarea rows="2" name="order_note" onChange={handleInputChange}  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm font-semibold rounded-lg focus:outline-none focus:border-[#63c98f] transition shadow-2xs placeholder-gray-300" placeholder="Special note for delivery"></textarea>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* طرق الدفع والشحن المحدثة التفاعلية */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
//                             {/* طريقة الدفع - تمت استعادتها كما كانت في كودك الأصلي */}
//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Payment Method</label>
//                                 <select 
//                                     name="payment_method" 
//                                     value={formData.payment_method} 
//                                     onChange={handleInputChange} 
//                                     className="w-full bg-white border border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-gray-900 transition appearance-none rounded-lg shadow-2xs"
//                                 >
//                                     <option value="cash">Cash on Delivery (COD)</option>
//                                     <option value="haram_transfer">Al-Haram Transfer</option>
//                                 </select>
//                             </div>

//                             {/* مناطق الشحن - تحويلها إلى نظام القائمة المنسدلة المنهارة (Collapse Component) */}
//                             <div className="space-y-2 relative">
//                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Shipping Zone</label>
                                
//                                 {/* حقل العرض الرئيسي القابل للضغط لفتح/إغلاق القائمة */}
//                                 <div 
//                                     onClick={() => !zonesLoading && shippingZones.length > 0 && setIsZoneDropdownOpen(!isZoneDropdownOpen)}
//                                     className={`w-full bg-white border border-gray-200 px-4 py-3 text-sm font-bold flex justify-between items-center rounded-lg shadow-2xs cursor-pointer select-none ${zonesLoading || shippingZones.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                 >
//                                     <span>
//                                         {zonesLoading 
//                                             ? 'Loading zones...' 
//                                             : selectedZone 
//                                                 ? `${selectedZone.city_name} (+$${Number(selectedZone.fee).toFixed(2)})` 
//                                                 : 'Select Shipping Zone'
//                                         }
//                                     </span>
//                                     <svg className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${isZoneDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
//                                     </svg>
//                                 </div>

//                                 {/* القائمة المنهارة المنبثقة للخيارات (Collapse Panel Container) */}
//                                 {isZoneDropdownOpen && (
//                                     <div className="absolute top-full left-0 w-full bg-white border border-gray-100 shadow-xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto border-t-0 animate-fade-in">
//                                         {shippingZones.map(zone => (
//                                             <div 
//                                                 key={zone.id}
//                                                 onClick={() => handleZoneSelect(zone.id)}
//                                                 className={`px-4 py-3 text-sm font-semibold flex justify-between items-center cursor-pointer transition-colors ${formData.shipping_zone_id === zone.id.toString() ? 'bg-[#63c98f]/10 text-[#63c98f]' : 'text-gray-700 hover:bg-gray-50'}`}
//                                             >
//                                                 <span className="uppercase">{zone.city_name}</span>
//                                                 <span className="font-black text-gray-900">${Number(zone.fee).toFixed(2)}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>

//                         </div>
//                     </form>
//                 </div>

//                 {/* جناح ملخص المنتجات والفاتورة الافتراضية */}
//                 <div className="space-y-6 lg:sticky top-24">
//                     <div>
//                         <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Order Summary</h2>
//                         <div className="w-8 h-1 bg-[#63c98f] rounded mt-1" />
//                     </div>

//                     <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col space-y-5">
//                         <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
//                             {cart.map((item) => (
//                                 <div key={`${item.id}-${item.selectedColor}`} className="flex gap-3 items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
//                                     <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg p-1 shrink-0 flex items-center justify-center">
//                                         <img src={getImageUrl(item.images?.[0])} alt="preview" className="max-h-full max-w-full object-contain" />
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-[11px] font-bold text-gray-800 truncate uppercase">{item.name}</p>
//                                         <p className="text-[10px] text-gray-400 font-black mt-0.5 uppercase tracking-wide">
//                                             {item.cartQuantity || item.quantity} x ${Number(item.price).toFixed(2)}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
                        
//                         <div className="space-y-2 border-t pt-4 border-gray-100 text-xs font-semibold text-gray-600">
//                             <div className="flex justify-between">
//                                 <span>Subtotal</span>
//                                 <span className="font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span>Shipping Cost</span>
//                                 <span className="font-bold text-gray-900">
//                                     {zonesLoading ? 'Calculating...' : `$${shippingFee.toFixed(2)}`}
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="pt-4 border-t border-gray-200 space-y-4">
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm font-black uppercase tracking-wider text-gray-900">Total</span>
//                                 <span className="text-2xl font-black text-[#63c98f]">${finalTotal.toFixed(2)}</span>
//                             </div>

//                             <div className="flex items-start space-x-2 py-1">
//                                 <input required type="checkbox" id="agree_terms" className="mt-0.5 h-4 w-4 text-[#63c98f] border-gray-300 rounded focus:ring-[#63c98f] cursor-pointer" />
//                                 <label htmlFor="agree_terms" className="text-[11px] text-gray-400 font-medium cursor-pointer select-none leading-tight">
//                                     I agree to the <span className="text-[#63c98f] underline hover:text-[#52b37c]">Terms & Conditions</span>
//                                 </label>
//                             </div>

//                             <button 
//                                 onClick={handleSubmit}
//                                 type="submit" 
//                                 disabled={loading || shippingZones.length === 0} 
//                                 className="w-full bg-[#63c98f] hover:bg-[#52b37c] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition shadow-md disabled:opacity-50 text-center cursor-pointer"
//                             >
//                                 {loading ? 'Processing Transaction...' : 'Place Order'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }







import { useState, useEffect } from 'react';
import { useCart } from '../../app/CartContext';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../../services/api';
import { useTranslation } from 'react-i18next'; 

export default function CheckoutPage() {
    const { t, i18n } = useTranslation();
    const { cart, cartTotal, clearCart } = useCart();
    
    const [shippingZones, setShippingZones] = useState([]);
    const [zonesLoading, setZonesLoading] = useState(true);
    
    const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        delivery_location: '',
        shipping_zone_id: '',
        payment_method: 'cash'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successData, setSuccessData] = useState(null);

    // ⚡ حالة مراقبة نجاح ومضة عملية النسخ للفاتورة ⚡
    const [isCopied, setIsCopied] = useState(false);

    const isRtl = i18n.language === 'ar';

    const selectedZone = shippingZones.find(z => z.id.toString() === formData.shipping_zone_id);
    const shippingFee = selectedZone ? Number(selectedZone.fee) : 0;
    const finalTotal = cartTotal + shippingFee;

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const response = await api.get('/public/shipping-zones');
                const zonesData = response.data?.data || response.data || [];
                const activeZones = zonesData.filter(z => z.is_active === 1 || z.is_active === true);
                
                setShippingZones(activeZones);
                
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

    const handleZoneSelect = (zoneId) => {
        setFormData({ ...formData, shipping_zone_id: zoneId.toString() });
        setIsZoneDropdownOpen(false);
    };

    // ⚡ الدالة البرمجية المسؤولة عن نسخ الرمز والتحكم بالومضة التفاعلية للمستخدم ⚡
    const handleCopyCode = (codeText) => {
        if (!codeText) return;
        navigator.clipboard.writeText(codeText)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // إرجاع الزر لوضعه الطبيعي بعد ثانيتين
            })
            .catch(err => console.error("Failed to copy tracking security token", err));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.shipping_zone_id) {
            setError(t('err_select_zone'));
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
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-12 max-w-md w-full text-center space-y-6 shadow-xl transition-all">
                    <div className="w-16 h-16 bg-[#00cc88]/10 text-[#00cc88] rounded-full flex items-center justify-center mx-auto shadow-2xs shadow-emerald-500/5">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('order_confirmed')}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('trans_success')}</p>
                    </div>
                    
                    {/* ⚡ التعديل: صندوق كود التتبع المطور كلياً بمحاكاة زر النسخ المزدوج من صورتك الفاخرة ⚡ */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center relative group">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">{t('tracking_code_title')}</p>
                        
                        <div className="flex items-center gap-3 w-full justify-center">
                            <p className="text-2xl sm:text-3xl font-mono font-black text-slate-900 tracking-widest select-all">
                                {successData.tracking_code}
                            </p>
                            
                            <button
                                onClick={() => handleCopyCode(successData.tracking_code)}
                                className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer shadow-3xs flex items-center justify-center shrink-0 active:scale-95 ${
                                    isCopied 
                                        ? 'bg-[#00cc88]/10 border-[#00cc88] text-[#00cc88]' 
                                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                                }`}
                                title="Copy Invoice Token"
                            >
                                {isCopied ? (
                                    <span className="text-[10px] font-black px-1 uppercase tracking-tight">Copied!</span>
                                ) : (
                                    /* الأيقونة المزدوجة النظيفة المطابقة لملامح صورتك المرفقة تماماً */
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold">{t('safeguard_token')}</p>

                    <Link to="/track-order" className="block bg-[#00cc88] hover:bg-[#00b374] text-white font-black text-xs uppercase px-6 py-4 rounded-xl tracking-widest transition-all w-full shadow-md shadow-emerald-500/10 text-center">
                        {t('track_status_btn')}
                    </Link>
                </div>
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f8fafc] px-4">
                <div className="text-center bg-white rounded-2xl border border-slate-100 p-12 max-w-xl w-full shadow-2xs">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide mb-1">{t('checkout_unavailable')}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">{t('cart_repo_empty')}</p>
                    <Link to="/products" className="inline-block bg-[#00cc88] hover:bg-[#00b374] text-white font-black text-xs uppercase px-6 py-3.5 rounded-xl transition tracking-widest shadow-md shadow-emerald-500/10">
                        {t('return_store')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t('account_details')}</h1>
                        <div className="w-8 h-1 bg-[#00cc88] rounded mt-1.5" />
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-2xs space-y-4">
                            <div className="space-y-1.5 relative">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">{t('label_phone')} <span className="text-rose-500">*</span></label>
                                <div className="relative flex items-center">
                                    <div className="absolute start-3 flex items-center gap-1.5 pointer-events-none border-e pe-2.5 border-slate-200">
                                        <span className="text-base">🇸🇾</span>
                                        <span className="text-xs font-mono font-black text-slate-500">+963</span>
                                    </div>
                                    <input 
                                        required 
                                        type="tel" 
                                        name="customer_phone" 
                                        value={formData.customer_phone.replace('+963', '')} 
                                        onChange={(e) => setFormData({...formData, customer_phone: '+963' + e.target.value.trim()})} 
                                        className="w-full bg-slate-50/30 border border-slate-200 ps-20 pe-4 py-3 text-sm font-mono font-black text-slate-800 rounded-xl focus:outline-none focus:border-[#00cc88] focus:ring-1 focus:ring-[#00cc88] transition shadow-3xs placeholder-slate-300" 
                                        placeholder="9xx xxx xxx" 
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">{t('billing_details')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">{t('label_first_name')} <span className="text-rose-500">*</span></label>
                                        <input required type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full bg-slate-50/30 border border-slate-200 px-4 py-3 text-xs font-bold text-slate-800 rounded-xl focus:outline-none focus:border-[#00cc88] transition shadow-3xs" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">{t('label_last_name')} <span className="text-rose-500">*</span></label>
                                        <input required type="text" className="w-full bg-slate-50/30 border border-slate-200 px-4 py-3 text-xs font-bold text-slate-800 rounded-xl focus:outline-none focus:border-[#00cc88] transition shadow-3xs" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">{t('label_area')} <span className="text-rose-500">*</span></label>
                                    <input required type="text" name="delivery_location" value={formData.delivery_location} onChange={handleInputChange} className="w-full bg-slate-50/30 border border-slate-200 px-4 py-3 text-xs font-bold text-slate-800 rounded-xl focus:outline-none focus:border-[#00cc88] transition shadow-3xs" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">{t('label_city')} <span className="text-rose-500">*</span></label>
                                        <input required type="text" name="city_location" onChange={handleInputChange} className="w-full bg-slate-50/30 border border-slate-200 px-4 py-3 text-xs font-bold text-slate-800 rounded-xl focus:outline-none focus:border-[#00cc88] transition shadow-3xs" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">{isRtl ? 'تفاصيل العنوان الإضافية (اختياري)' : 'Address Line 2 (optional)'}</label>
                                        <input type="text" name="addressOne_location" onChange={handleInputChange} className="w-full bg-slate-50/30 border border-slate-200 px-4 py-3 text-xs font-bold text-slate-800 rounded-xl focus:outline-none focus:border-[#00cc88] transition shadow-3xs" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">{t('label_order_note')}</label>
                                    <textarea rows="2" name="order_note" onChange={handleInputChange} className="w-full bg-slate-50/30 border border-slate-200 px-4 py-3 text-xs font-bold text-slate-800 rounded-xl focus:outline-none focus:border-[#00cc88] transition shadow-3xs placeholder-slate-300" placeholder={t('placeholder_note')}></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('label_payment_method')}</label>
                                <select 
                                    name="payment_method" 
                                    value={formData.payment_method} 
                                    onChange={handleInputChange} 
                                    className="w-full bg-white border border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-none focus:border-[#00cc88] focus:ring-1 focus:ring-[#00cc88] transition appearance-none rounded-xl shadow-2xs cursor-pointer"
                                >
                                    <option value="cash">{t('cod_option')}</option>
                                    <option value="haram_transfer">{t('haram_option')}</option>
                                </select>
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('label_shipping_zone')}</label>
                                
                                <div 
                                    onClick={() => !zonesLoading && shippingZones.length > 0 && setIsZoneDropdownOpen(!isZoneDropdownOpen)}
                                    className={`w-full bg-white border border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-800 flex justify-between items-center rounded-xl shadow-2xs cursor-pointer select-none focus:border-[#00cc88] ${zonesLoading || shippingZones.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span>
                                        {zonesLoading 
                                            ? t('loading_zones') 
                                            : selectedZone 
                                                ? `${selectedZone.city_name} (+$${Number(selectedZone.fee).toFixed(2)})` 
                                                : t('select_zone_placeholder')
                                        }
                                    </span>
                                    <svg className={`w-4 h-4 text-slate-400 transform transition-transform duration-200 ${isZoneDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {isZoneDropdownOpen && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-slate-100 shadow-xl rounded-xl mt-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto border-t-0 animate-fade-in">
                                        {shippingZones.map(zone => (
                                            <div 
                                                key={zone.id}
                                                onClick={() => handleZoneSelect(zone.id)}
                                                className={`px-4 py-3 text-xs font-black uppercase tracking-wider flex justify-between items-center cursor-pointer transition-colors ${formData.shipping_zone_id === zone.id.toString() ? 'bg-[#00cc88]/10 text-[#00cc88]' : 'text-slate-700 hover:bg-slate-50'}`}
                                            >
                                                <span>{zone.city_name}</span>
                                                <span className="font-mono text-xs font-black text-slate-900">${Number(zone.fee).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="space-y-6 lg:sticky top-28">
                    <div>
                        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">{t('summary_title')}</h2>
                        <div className="w-8 h-1 bg-[#00cc88] rounded mt-1.5" />
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs flex flex-col space-y-5">
                        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.selectedColor}`} className="flex gap-3 items-center border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl p-1 shrink-0 flex items-center justify-center">
                                        <img src={getImageUrl(item.images?.[0])} alt="preview" className="max-h-full max-w-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-extrabold text-slate-800 truncate uppercase tracking-tight">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 font-black mt-0.5 font-mono">
                                            {item.cartQuantity || item.quantity} x ${Number(item.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-2 border-t pt-4 border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <div className="flex justify-between">
                                <span>{t('summary_subtotal')}</span>
                                <span className="font-mono text-sm font-black text-slate-900">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('shipping_cost')}</span>
                                <span className="font-mono text-sm font-black text-slate-900">
                                    {zonesLoading ? t('calc_shipping') : `$${shippingFee.toFixed(2)}`}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 space-y-4">
                            <div className="flex justify-between items-center font-black uppercase tracking-wider">
                                <span className="text-xs text-slate-900">Total amount</span>
                                <span className="text-2xl font-mono text-[#00cc88]">${finalTotal.toFixed(2)}</span>
                            </div>

                            <div className="flex items-start space-x-2 py-1">
                                <input required type="checkbox" id="agree_terms" className="mt-0.5 h-4 w-4 accent-[#00cc88] border-slate-200 rounded focus:ring-[#00cc88] cursor-pointer" />
                                <label htmlFor="agree_terms" className="text-[11px] text-slate-400 font-bold uppercase tracking-wide cursor-pointer select-none leading-tight mx-1.5">
                                    {t('agree_terms')}
                                </label>
                            </div>

                            <button 
                                onClick={handleSubmit}
                                type="submit" 
                                disabled={loading || shippingZones.length === 0} 
                                className="w-full bg-[#00cc88] hover:bg-[#00b374] text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300 shadow-md shadow-emerald-500/10 text-center cursor-pointer select-none transform hover:-translate-y-0.5 disabled:opacity-30 disabled:transform-none disabled:shadow-none"
                            >
                                {loading ? t('processing_trans') : t('place_order_btn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}