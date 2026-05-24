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

    // دالة إلغاء الطلب
    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
        
        setCancelLoading(true);
        setError(null);

        try {
            await api.post(`/orders/${orderData.tracking_code}/cancel`);
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

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-10">
                
                {/* Header & Search Form */}
                <div className="bg-white border-2 border-gray-900 p-10 text-center space-y-6 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Track Your Order</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enter your code to check the status</p>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <input 
                            type="text" 
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                            placeholder="e.g. W5CMFGI9" 
                            className="w-full sm:w-2/3 bg-gray-50 border-2 border-gray-200 px-6 py-4 text-center sm:text-left text-lg font-black uppercase tracking-widest focus:outline-none focus:border-gray-900 transition"
                            required
                        />
                        <button 
                            type="submit" 
                            disabled={loading || !trackingCode}
                            className="w-full sm:w-auto bg-gray-900 hover:bg-blue-600 text-white font-black text-sm uppercase tracking-widest px-10 py-4 transition disabled:opacity-50 border-2 border-gray-900 hover:border-blue-600 cursor-pointer"
                        >
                            {loading ? 'Searching...' : 'Track'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 bg-red-50 border-2 border-red-600 text-red-700 p-4 text-xs font-bold uppercase tracking-wider text-left">
                            {error}
                        </div>
                    )}
                </div>

                {/* Order Details Result */}
                {orderData && (
                    <div className="bg-white border-2 border-gray-200 p-10 space-y-10 animate-fade-in">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-gray-900 pb-6 gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Tracking Code</p>
                                <p className="text-3xl font-black text-gray-900 tracking-widest">{orderData.tracking_code}</p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Current Status</p>
                                <p className={`text-xl font-black uppercase tracking-widest ${orderData.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'}`}>
                                    {orderData.status}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {orderData.status !== 'cancelled' && (
                            <div className="relative pt-4 pb-8">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                                <div 
                                    className="absolute top-1/2 left-0 h-1 bg-gray-900 -translate-y-1/2 z-0 transition-all duration-500"
                                    style={{ width: `${(currentStatusIndex / (statusFlow.length - 1)) * 100}%` }}
                                ></div>
                                
                                <div className="relative z-10 flex justify-between">
                                    {statusFlow.map((step, index) => {
                                        const isCompleted = index <= currentStatusIndex;
                                        return (
                                            <div key={step} className="flex flex-col items-center gap-2">
                                                <div className={`w-6 h-6 border-2 flex items-center justify-center bg-white transition-colors duration-300 ${isCompleted ? 'border-gray-900' : 'border-gray-200'}`}>
                                                    {isCompleted && <div className="w-2 h-2 bg-gray-900"></div>}
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest absolute mt-8 ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>
                                                    {step}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Order Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Customer Name</p>
                                <p className="text-sm font-bold text-gray-900 uppercase">{orderData.customer_name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Order Date</p>
                                <p className="text-sm font-bold text-gray-900 uppercase">{formatDate(orderData.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Amount</p>
                                <p className="text-xl font-black text-blue-600">${Number(orderData.total_amount).toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Cancel Button (يظهر فقط إذا كان pending) */}
                        <div className="border-t-2 border-gray-100 pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center sm:text-left">
                                Need help? <Link to="/contact" className="text-gray-900 border-b-2 border-gray-900 hover:text-blue-600 hover:border-blue-600 transition">Contact Support</Link>
                            </p>
                            
                            {orderData.status === 'pending' && (
                                <button 
                                    onClick={handleCancelOrder}
                                    disabled={cancelLoading}
                                    className="w-full sm:w-auto bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black text-xs uppercase tracking-widest px-8 py-3 transition cursor-pointer disabled:opacity-50"
                                >
                                    {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}