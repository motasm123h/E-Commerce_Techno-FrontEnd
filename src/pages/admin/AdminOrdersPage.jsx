import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../../services/api';
import { Link } from 'react-router-dom';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // إدارة رسائل الأخطاء والنجاح داخل الواجهة بدلاً من الـ Alert التقليدي
    const [actionError, setActionError] = useState(null);
    const [actionSuccess, setActionSuccess] = useState(null);

    const fetchDashboardData = async (page = 1) => {
        setLoading(true);
        try {
            const [ordersRes, notifRes] = await Promise.all([
                api.get(`/orders?page=${page}`),
                api.get('/admin/notifications').catch(() => ({ data: [] })) 
            ]);
            
            setOrders(ordersRes.data.data || ordersRes.data);
            setPagination({
                current_page: ordersRes.data.current_page,
                last_page: ordersRes.data.last_page,
            });
            setNotifications(notifRes.data || []);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
            showFeedback('error', 'Failed to retrieve active server logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // دالة مساعدة للتحكم بالملاحظات اللحظية المنبثقة في الواجهة
    const showFeedback = (type, message) => {
        if (type === 'error') {
            setActionError(message);
            setTimeout(() => setActionError(null), 4000);
        } else {
            setActionSuccess(message);
            setTimeout(() => setActionSuccess(null), 4000);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.post(`/orders/${id}`, { status: newStatus });
            setOrders(orders.map(order => 
                order.id === id ? { ...order, status: newStatus } : order
            ));
            showFeedback('success', `Matrix updated: Order marked as ${newStatus}`);
        } catch (error) {
            console.error(error);
            showFeedback('error', error.response?.data?.message || 'Failed to sync status update');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you absolutely sure you want to delete this order? This action will also delete its items.')) return;
        try {
            await api.delete(`/orders/${id}`);
            setOrders(orders.filter(order => order.id !== id));
            showFeedback('success', 'Asset cleared from logs successfully');
        } catch (error) {
            showFeedback('error', 'System constraint: Failed to drop order matrix');
        }
    };

    const viewOrderDetails = async (order) => {
        try {
            const response = await api.get(`/orders/${order.id}`);
            setSelectedOrder(response.data);
            setIsModalOpen(true);
        } catch (error) {
            showFeedback('error', 'Failed to load isolated transaction details');
        }
    };

    const markNotificationAsRead = async (id) => {
        try {
            await api.post(`/admin/notifications/${id}/mark-as-read`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 relative">
            
            {actionError && (
                <div className="fixed top-20 right-8 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-xl text-xs font-bold animate-fade-in flex items-center gap-2">
                    <span>⚠️</span> {actionError}
                </div>
            )}
            {actionSuccess && (
                <div className="fixed top-20 right-8 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-xl text-xs font-bold animate-fade-in flex items-center gap-2">
                    <span>✓</span> {actionSuccess}
                </div>
            )}

            {/* الشريط العلوي العصري */}
            <div className="flex justify-between items-center pb-2">
                <div>
                    <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">Order Operations</h1>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Track, audit, and dispatch customer pipeline shipments.</p>
                </div>
                
                {/* <div className="relative group">
                    <button className="bg-white border border-gray-200 hover:border-gray-300 transition text-gray-700 font-bold text-xs uppercase px-4 py-2.5 rounded-xl tracking-wide cursor-pointer flex items-center gap-2 shadow-2xs select-none">
                        Alert Logs 
                        <span className="bg-red-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full">{notifications.length}</span>
                    </button>
                    
                    {notifications.length > 0 && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl hidden group-hover:block z-40 overflow-hidden animate-fade-in">
                            <div className="p-3 bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-400">Recent Activity Node</div>
                            <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                                {notifications.map(notif => (
                                    <div key={notif.id} className="p-4 hover:bg-gray-50/50 transition flex justify-between items-start gap-4">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-gray-700 leading-normal">{notif.data.message}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">Code: {notif.data.tracking_code}</p>
                                        </div>
                                        <button 
                                            onClick={() => markNotificationAsRead(notif.id)}
                                            className="text-[10px] font-black uppercase text-[#63c98f] hover:text-[#52b37c] cursor-pointer"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div> */}
            </div>

            {/* جدول ومساحة عرض الطلبات */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-24 text-center text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">
                    Synchronizing Logistics Grid...
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4">Tracking Code</th>
                                    <th className="px-6 py-4">Customer Matrix</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4">Logistics Status</th>
                                    <th className="px-6 py-4 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-16 text-center text-xs font-bold text-gray-400 italic">
                                            No active orders registered in this deployment cycle.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-black bg-gray-100 text-gray-800 font-mono px-2.5 py-1 rounded-lg tracking-wider border border-gray-200/50">{order.tracking_code}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 mb-0.5">{order.customer_name}</div>
                                                <div className="text-[11px] text-gray-400 font-medium flex items-center gap-2">
                                                    <span>📞 {order.customer_phone}</span>
                                                    <span className="text-gray-200">|</span>
                                                    <span>🗓️ {formatDate(order.created_at)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-black text-gray-900">${Number(order.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-4">
                                                <div className="relative inline-block">
                                                    <select 
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 border rounded-xl outline-none appearance-none cursor-pointer pr-6 select-none transition shadow-2xs ${
                                                            order.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                                            order.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-700' :
                                                            'bg-green-50 border-green-200 text-green-700'
                                                        }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] opacity-60">▼</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-4 text-xs font-bold">
                                                <button 
                                                    onClick={() => viewOrderDetails(order)} 
                                                    className="text-gray-600 hover:text-gray-900 transition cursor-pointer"
                                                >
                                                    👁️ Inspect
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(order.id)} 
                                                    className="text-red-500 hover:text-red-700 transition cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* وعاء التحكم بالصفحات */}
            {pagination.last_page > 1 && (
                <div className="flex justify-center items-center space-x-4 pt-2">
                    <button 
                        disabled={pagination.current_page === 1}
                        onClick={() => fetchDashboardData(pagination.current_page - 1)}
                        className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer shadow-2xs"
                    >
                        ← Prev
                    </button>
                    <span className="text-xs font-bold text-gray-400">
                        Page {pagination.current_page} / {pagination.last_page}
                    </span>
                    <button 
                        disabled={pagination.current_page === pagination.last_page}
                        onClick={() => fetchDashboardData(pagination.current_page + 1)}
                        className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer shadow-2xs"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* نافذة تفاصيل الطلب الكاملة المحدثة بطراز المعاينة الفاخر */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 backdrop-blur-xs p-4 animate-fade-in">
                    <div className="bg-white border border-gray-100 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        
                        <div className="flex justify-between items-center border-b border-gray-100 p-6 bg-gray-50/50">
                            <div>
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">📦 Warehouse Order Hub</h2>
                                <p className="text-[10px] font-mono text-gray-400 mt-1">UUID: {selectedOrder.tracking_code} | Generated: {formatDate(selectedOrder.created_at)}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 text-sm font-bold cursor-pointer transition">✕</button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto space-y-6">
                            
                            {/* لوحة ملخص العميل وبيانات الشحن المحدثة */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 border border-gray-200/60 rounded-xl p-5">
                                <div className="space-y-4">
                                    <div>
                                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-200/60 pb-1">Recipient Matrix</span>
                                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{selectedOrder.customer_name}</p>
                                        <p className="text-xs font-bold text-gray-500 mt-0.5">📞 {selectedOrder.customer_phone}</p>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-200/60 pb-1">Financial & Pipeline</span>
                                        <p className="text-xs font-semibold text-gray-700 uppercase mt-2">Method: <span className="text-[#63c98f] font-bold">{selectedOrder.payment_method === 'cash' ? 'Cash on Delivery' : 'Al-Haram Bureau'}</span></p>
                                        <p className="text-xs font-semibold text-gray-700 uppercase mt-1">Node Status: <span className="text-gray-900 font-bold uppercase">{selectedOrder.status}</span></p>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-200/60 pb-1">Logistics Destination</span>
                                    <p className="text-xs font-bold text-gray-800 uppercase">Region Hub: <span className="text-[#63c98f]">{selectedOrder.shipping_city}</span></p>
                                    <p className="text-xs font-medium text-gray-500 mt-2 leading-relaxed bg-white border border-gray-100 rounded-lg p-3 italic">"{selectedOrder.delivery_location}"</p>
                                </div>
                            </div>

                            {/* قائمة السلع المطلوبة داخل المودال مع تأثير الهوفر المطور */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Manifest Items ({selectedOrder.items?.length || 0})</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                   {selectedOrder.items && selectedOrder.items.map(item => (
                                        <div key={item.id} className="flex gap-4 items-center border border-gray-100 p-3 rounded-xl bg-white hover:shadow-2xs transition group">
                                            
                                            <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 p-1.5 group-hover:border-[#63c98f] transition">
                                                {item.product?.images?.length > 0 ? (
                                                    <img 
                                                        src={getImageUrl(item.product.images[0])} 
                                                        alt={item.product.name} 
                                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" 
                                                    />
                                                ) : (
                                                    <span className="text-[8px] font-black uppercase text-gray-300 tracking-wider">No Image</span>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                {item.product ? (
                                                    <Link to={`/product/${item.product.id}`} target="_blank" className="text-xs font-bold text-gray-800 uppercase truncate block hover:text-[#63c98f] transition">
                                                        {item.product.name}
                                                    </Link>
                                                ) : (
                                                    <p className="text-xs font-bold text-red-400 uppercase">System Asset Dropped (Deleted Product)</p>
                                                )}
                                                
                                                <div className="flex items-center gap-4 mt-1 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                                    <span>MSRP: <span className="text-gray-700">${Number(item.price).toFixed(2)}</span></span>
                                                    <span>QTY: <span className="text-gray-700">{item.quantity}</span></span>
                                                    {item.color && <span>Node: <span className="text-gray-700">{item.color}</span></span>}
                                                </div>
                                            </div>

                                            <div className="text-right pl-4 border-l border-gray-100 min-w-[80px]">
                                                <p className="text-[9px] font-bold uppercase text-gray-400">Yield</p>
                                                <p className="text-sm font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* الفوتر الخاص ببيانات الحسابات المالية مجرد من الألوان الزرقاء القديمة */}
                        <div className="border-t border-gray-100 p-5 bg-gray-50 flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                Transit Fee: ${Number(selectedOrder.shipping_fee).toFixed(2)}
                            </span>
                            <span className="text-lg font-black text-gray-900 uppercase tracking-wide">
                                Aggregate Total: <span className="text-[#63c98f]">${Number(selectedOrder.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}