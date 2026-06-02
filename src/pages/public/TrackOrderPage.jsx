import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function TrackOrderPage() {
    const [trackingCode, setTrackingCode] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingCode.trim()) return;

        setLoading(true);
        setError(null);
        setOrderData(null);

        try {
            const response = await api.get(`/orders/track/${trackingCode.trim()}`);
            setOrderData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid tracking code or order not found.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
        
        setCancelLoading(true);
        setError(null);

        try {
            await api.post('/v1/orders', {
                tracking_code: orderData.tracking_code,
                action: 'cancel' // أو تعديل الرابط حسب صياغة الباك إند لديك لمسار الإلغاء
            });
            setOrderData(prev => ({ ...prev, status: 'cancelled' }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel order.');
        } finally {
            setCancelLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const statusFlow = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentStatusIndex = orderData ? statusFlow.indexOf(orderData.status) : -1;

    // قاموس الأيقونات الخاصة بكل مرحلة شحن لتسهيل القراءة البصرية (UI-UX Icons)
    const statusIcons = {
        pending: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        confirmed: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        shipped: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25M3.375 14.25h15m0 0L16.5 9.75H4.125L3.375 14.25m15 0h1.125c.39 0 .74-.2 1.01-.5a1.121 1.121 0 00.12-.132V14.25z" />
            </svg>
        ),
        delivered: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        )
    };

    return (
        <div className="bg-gray-50/50 min-h-screen py-16 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* صندوق البحث العلوي الأنيق */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 text-center space-y-6 shadow-xs">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">Track Your Order</h1>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Enter your matrix code to inspect delivery status</p>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <input 
                            type="text" 
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                            placeholder="e.g. W5CMFGI9" 
                            className="w-full sm:w-2/3 bg-gray-50 border border-gray-200 px-5 py-3.5 text-center sm:text-left text-base font-bold uppercase tracking-widest focus:outline-none focus:border-[#63c98f] focus:ring-1 focus:ring-[#63c98f] rounded-xl transition"
                            required
                        />
                        <button 
                            type="submit" 
                            disabled={loading || !trackingCode.trim()}
                            className="w-full sm:w-auto bg-[#63c98f] hover:bg-[#52b37c] text-white font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-xl transition disabled:opacity-50 shadow-sm cursor-pointer"
                        >
                            {loading ? 'Searching...' : 'Track'}
                        </button>
                    </form>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide text-left animate-fade-in">
                            {error}
                        </div>
                    )}
                </div>

                {/* لوحة عرض نتائج تتبع الشحنة المتقدمة */}
                {orderData && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 space-y-8 shadow-xs animate-fade-in">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 gap-4 border-gray-100">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-0.5">Tracking Token</p>
                                <p className="text-2xl font-black text-gray-900 tracking-wider select-all">{orderData.tracking_code}</p>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Current Status</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                    orderData.status === 'cancelled' 
                                        ? 'bg-red-50 text-red-600 border border-red-100' 
                                        : 'bg-[#63c98f]/10 text-[#63c98f] border border-[#63c98f]/20'
                                }`}>
                                    {orderData.status}
                                </span>
                            </div>
                        </div>

                        {/* شريط التقدم الدائري الأنيق (Progress Flow Tracker) */}
                        {orderData.status !== 'cancelled' && (
                            <div className="relative pt-4 pb-6 px-2">
                                {/* خط الخلفية الرمادي */}
                                <div className="absolute top-7 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />
                                
                                {/* خط الشحن الأخضر التفاعلي المتحرك */}
                                <div 
                                    className="absolute top-7 left-0 h-1 bg-[#63c98f] -translate-y-1/2 z-0 transition-all duration-700 rounded-full"
                                    style={{ width: `${(currentStatusIndex / (statusFlow.length - 1)) * 100}%` }}
                                />
                                
                                <div className="relative z-10 flex justify-between">
                                    {statusFlow.map((step, index) => {
                                        const isCompleted = index <= currentStatusIndex;
                                        return (
                                            <div key={step} className="flex flex-col items-center gap-2">
                                                {/* الدوائر التفاعلية الحاوية للأيقونات */}
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 border ${
                                                    isCompleted 
                                                        ? 'bg-[#63c98f] text-white border-[#63c98f] shadow-sm' 
                                                        : 'bg-white text-gray-300 border-gray-200'
                                                }`}>
                                                    {statusIcons[step]}
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${
                                                    isCompleted ? 'text-gray-800' : 'text-gray-300'
                                                }`}>
                                                    {step}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* صندوق معلومات الشحنة وعميل التوصيل */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-50 bg-gray-50/40 p-5 rounded-xl border">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-0.5">Customer Name</p>
                                <p className="text-xs font-bold text-gray-800 uppercase">{orderData.customer_name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-0.5">Order Creation Date</p>
                                <p className="text-xs font-bold text-gray-800 uppercase">{formatDate(orderData.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-0.5">Total Valuation</p>
                                <p className="text-lg font-black text-[#63c98f]">${Number(orderData.total_amount).toFixed(2)}</p>
                            </div>
                        </div>

                        {/* تذييل الصفحة وزر الإلغاء الذكي لحالات الـ Pending */}
                        <div className="border-t pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 tracking-wide text-center sm:text-left">
                                Need assistance? <Link to="/contact-us" className="text-gray-800 underline font-bold hover:text-[#63c98f] transition">Contact Node Support</Link>
                            </p>
                            
                            {orderData.status === 'pending' && (
                                <button 
                                    onClick={handleCancelOrder}
                                    disabled={cancelLoading}
                                    className="w-full sm:w-auto bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 shadow-2xs"
                                >
                                    {cancelLoading ? 'Cancelling routing...' : 'Cancel Order'}
                                </button>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}