import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../../services/api'; // تأكد من استدعاء getImageUrl هنا
import { Link } from 'react-router-dom';


export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.post(`/orders/${id}`, { status: newStatus });
            setOrders(orders.map(order => 
                order.id === id ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you absolutely sure you want to delete this order? This action will also delete its items.')) return;
        try {
            await api.delete(`/orders/${id}`);
            setOrders(orders.filter(order => order.id !== id));
        } catch (error) {
            alert('Failed to delete order');
        }
    };

    const viewOrderDetails = async (order) => {
        try {
            // نجلب تفاصيل الطلب مع علاقات items.product من الباك إند
            const response = await api.get(`/orders/${order.id}`);
            setSelectedOrder(response.data);
            setIsModalOpen(true);
        } catch (error) {
            alert('Failed to load order details');
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
        <div className="p-6 max-w-7xl mx-auto space-y-10 font-sans">
            
            {/* الشريط العلوي */}
            <div className="flex justify-between items-end border-b-2 border-gray-900 pb-4 relative z-20">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Order Management</h1>
                
                <div className="relative group">
                    <button className="bg-gray-900 hover:bg-blue-600 transition text-white font-black text-xs uppercase px-6 py-3 tracking-widest cursor-pointer flex items-center gap-2">
                        Alerts 
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded-none">{notifications.length}</span>
                    </button>
                    
                    {notifications.length > 0 && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-gray-900 shadow-xl hidden group-hover:block">
                            <div className="p-3 bg-gray-50 border-b-2 border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500">Recent Activity</div>
                            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                                {notifications.map(notif => (
                                    <div key={notif.id} className="p-4 hover:bg-gray-50 transition flex justify-between items-start gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">{notif.data.message}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Code: {notif.data.tracking_code}</p>
                                        </div>
                                        <button 
                                            onClick={() => markNotificationAsRead(notif.id)}
                                            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-gray-900 cursor-pointer"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* جدول الطلبات */}
            {loading ? (
                <div className="p-10 text-center font-black uppercase tracking-widest text-gray-400">Loading Orders...</div>
            ) : (
                <div className="bg-white border-2 border-gray-200 overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b-2 border-gray-900">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Tracking Code</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Customer Info</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Total</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        No Orders Found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-sm font-black text-gray-900 uppercase tracking-widest">{order.tracking_code}</td>
                                        <td className="p-4">
                                            <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{order.customer_phone}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{formatDate(order.created_at)}</p>
                                        </td>
                                        <td className="p-4 text-sm font-black text-blue-600">${Number(order.total_amount).toFixed(2)}</td>
                                        <td className="p-4">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 border-2 outline-none appearance-none cursor-pointer ${
                                                    order.status === 'pending' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
                                                    order.status === 'cancelled' ? 'bg-red-50 border-red-400 text-red-700' :
                                                    'bg-green-50 border-green-400 text-green-700'
                                                }`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-right space-x-4">
                                            <button 
                                                onClick={() => viewOrderDetails(order)} 
                                                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 cursor-pointer"
                                            >
                                                View Details
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(order.id)} 
                                                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 cursor-pointer"
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
            )}

            {/* Pagination Controls */}
            {pagination.last_page > 1 && (
                <div className="flex justify-center space-x-2 pt-4">
                    <button 
                        disabled={pagination.current_page === 1}
                        onClick={() => fetchDashboardData(pagination.current_page - 1)}
                        className="px-4 py-2 border-2 border-gray-900 bg-white text-gray-900 font-black text-[10px] uppercase tracking-widest disabled:opacity-30 hover:bg-gray-100 transition cursor-pointer"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button 
                        disabled={pagination.current_page === pagination.last_page}
                        onClick={() => fetchDashboardData(pagination.current_page + 1)}
                        className="px-4 py-2 border-2 border-gray-900 bg-white text-gray-900 font-black text-[10px] uppercase tracking-widest disabled:opacity-30 hover:bg-gray-100 transition cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* نافذة تفاصيل الطلب الكاملة (Full Order Details Modal) */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-white border-2 border-gray-900 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
                        
                        <div className="flex justify-between items-center border-b-2 border-gray-900 p-6 bg-gray-50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Order Details</h2>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Code: {selectedOrder.tracking_code} | Date: {formatDate(selectedOrder.created_at)}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-3xl font-black text-gray-400 hover:text-red-600 cursor-pointer transition">&times;</button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto space-y-8">
                            
                            {/* Customer & Shipping Summary Box */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 border-2 border-gray-200 p-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 border-b-2 border-gray-200 pb-1">Customer Info</p>
                                        <p className="text-sm font-bold text-gray-900 mt-2 uppercase">{selectedOrder.customer_name}</p>
                                        <p className="text-xs font-bold text-gray-600">{selectedOrder.customer_phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 border-b-2 border-gray-200 pb-1">Payment & Status</p>
                                        <p className="text-xs font-bold text-gray-900 mt-2 uppercase">Method: <span className="text-blue-600">{selectedOrder.payment_method === 'cash' ? 'Cash on Delivery' : 'Al-Haram Transfer'}</span></p>
                                        <p className="text-xs font-bold text-gray-900 uppercase mt-1">Status: <span className={selectedOrder.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}>{selectedOrder.status}</span></p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 border-b-2 border-gray-200 pb-1">Shipping Details</p>
                                    <p className="text-xs font-black text-gray-900 mt-2 uppercase">Zone: {selectedOrder.shipping_city}</p>
                                    <p className="text-xs font-bold text-gray-600 mt-1 leading-relaxed">{selectedOrder.delivery_location}</p>
                                </div>
                            </div>

                            {/* Products List (Complete with Images) */}
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-3 mb-6">Ordered Items ({selectedOrder.items?.length || 0})</h3>
                                <div className="space-y-4">
                                   {selectedOrder.items && selectedOrder.items.map(item => (
                                        <div key={item.id} className="flex gap-6 items-center border-2 border-gray-100 p-4 hover:border-gray-300 transition bg-white group">
                                            
                                            {/* صورة المنتج قابلة للنقر */}
                                            {item.product ? (
                                                <Link to={`/product/${item.product.id}`} target="_blank" className="w-20 h-20 bg-gray-50 border-2 border-gray-200 flex items-center justify-center flex-shrink-0 p-2 cursor-pointer group-hover:border-blue-600 transition">
                                                    {item.product.images && item.product.images.length > 0 ? (
                                                        <img 
                                                            src={getImageUrl(item.product.images[0])} 
                                                            alt={item.product.name} 
                                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" 
                                                        />
                                                    ) : (
                                                        <span className="text-[8px] font-black uppercase text-gray-300 tracking-widest text-center">No Img</span>
                                                    )}
                                                </Link>
                                            ) : (
                                                <div className="w-20 h-20 bg-gray-50 border-2 border-gray-200 flex items-center justify-center flex-shrink-0 p-2">
                                                    <span className="text-[8px] font-black uppercase text-gray-300 tracking-widest text-center">No Img</span>
                                                </div>
                                            )}
                                            
                                            {/* تفاصيل المنتج */}
                                            <div className="flex-1">
                                                {/* اسم المنتج قابل للنقر */}
                                                {item.product ? (
                                                    <Link to={`/product/${item.product.id}`} target="_blank" className="text-sm md:text-base font-black text-gray-900 uppercase tracking-wide line-clamp-1 hover:text-blue-600 transition cursor-pointer">
                                                        {item.product.name}
                                                    </Link>
                                                ) : (
                                                    <p className="text-sm md:text-base font-black text-red-500 uppercase tracking-wide line-clamp-1">
                                                        Deleted Product
                                                    </p>
                                                )}
                                                
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                        Unit Price: <span className="text-gray-900">${Number(item.price).toFixed(2)}</span>
                                                    </p>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                        QTY: <span className="text-gray-900">{item.quantity}</span>
                                                    </p>
                                                    {item.color && (
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                            Color: <span className="text-gray-900">{item.color}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* إجمالي سعر القطعة المضروب بالكمية */}
                                            <div className="text-right pl-4 border-l-2 border-gray-100 min-w-[100px]">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                                                <p className="text-lg font-black text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer (Total Pricing) */}
                        <div className="border-t-2 border-gray-900 p-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                Shipping Fee: ${Number(selectedOrder.shipping_fee).toFixed(2)}
                            </span>
                            <span className="text-2xl font-black text-blue-600 uppercase tracking-widest">
                                Final Total: ${Number(selectedOrder.total_amount).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}