import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [activeStatusTab, setActiveStatusTab] = useState('pending');
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [searchSectionName, setSearchSectionName] = useState('Gaming Monitors');
    const [sectionInventory, setSectionInventory] = useState(null);
    const [inventoryLoading, setInventoryLoading] = useState(false);
    const [inventoryError, setInventoryError] = useState(null);


    useEffect(() => {
        setStatsLoading(true);
        api.get('/admin/dashboard/main')
            .then(res => {
                if (res.data?.success) setStats(res.data);
            })
            .catch(err => console.error("Failed to load dashboard metrics grid", err))
            .finally(() => setStatsLoading(false));
    }, []);


    useEffect(() => {
        setOrdersLoading(true);
        api.get(`/admin/orders-by-status?status=${activeStatusTab}`)
            .then(res => {
                if (res.data?.success) setOrders(res.data.data);
            })
            .catch(err => console.error("Failed to filter tracking orders profile", err))
            .finally(() => setOrdersLoading(false));
    }, [activeStatusTab]);

    const handleInventoryFetch = (e) => {
        if (e) e.preventDefault();
        if (!searchSectionName.trim()) return;

        setInventoryLoading(true);
        setInventoryError(null);
        api.get(`/admin/sections/inventory-stats?section_name=${encodeURIComponent(searchSectionName.trim())}`)
            .then(res => {
                if (res.data?.success) {
                    setSectionInventory(res.data);
                }
            })
            .catch(err => {
                setSectionInventory(null);
                setInventoryError(err.response?.data?.message || 'Target section profile data context not found.');
            })
            .finally(() => setInventoryLoading(false));
    };


    useEffect(() => {
        handleInventoryFetch();
    }, []);

    if (statsLoading) {
        return <div className="p-6 text-xs font-black uppercase text-gray-400 animate-pulse tracking-widest">Compiling live core statistics vault matrix...</div>;
    }

    return (
        <div className="space-y-8 pb-12 animate-fade-in font-sans">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-3xs flex flex-col justify-between group hover:border-[#63c98f]/40 transition duration-300">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Total Accumulated Revenue</span>
                    <h3 className="text-2xl font-black text-gray-900 mt-2 font-mono">${stats?.total_revenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                    <span className="text-[9px] font-bold text-[#63c98f] bg-emerald-50 self-start px-2 py-0.5 rounded-md mt-4 uppercase tracking-wide">✓ Vault Secure</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-3xs flex flex-col justify-between group hover:border-[#63c98f]/40 transition duration-300">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">This Month Gross Revenue</span>
                    <h3 className="text-2xl font-black text-gray-900 mt-2 font-mono">${stats?.this_month_revenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 self-start px-2 py-0.5 rounded-md mt-4 uppercase tracking-wide">Current Interval</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-3xs flex flex-col justify-between group hover:border-amber-500/40 transition duration-300">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Pending Verification Queue</span>
                    <h3 className="text-2xl font-black text-gray-900 mt-2 font-mono">{stats?.pending_orders_count} <span className="text-xs font-bold text-gray-400">Orders</span></h3>
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 self-start px-2 py-0.5 rounded-md mt-4 uppercase tracking-wide animate-pulse">Needs Processing</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-3xs flex flex-col justify-between group hover:border-rose-500/40 transition duration-300">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Critical Low Stock Lines</span>
                    <h3 className="text-2xl font-black text-gray-900 mt-2 font-mono">{stats?.low_stock_products?.length} <span className="text-xs font-bold text-gray-400">Items</span></h3>
                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 self-start px-2 py-0.5 rounded-md mt-4 uppercase tracking-wide">Depleting Assets</span>
                </div>

            </div>

            {/* الجناح الأوسط المتفرع: جرد مستودع السكشن + معالجة حطام النواقص المخزنية */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* الجزء الأول: محرك جرد السكشن الذكي للقطع */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-3xs space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50 pb-4">
                        <div>
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Blueprint Section Inventory Node</h3>
                            <p className="text-[11px] text-gray-400 font-medium">Verify physical assets availability clustered by PC Builder configurations mapping tags.</p>
                        </div>
                        
                        <form onSubmit={handleInventoryFetch} className="flex items-center gap-2 w-full sm:w-auto">
                            <input 
                                type="text"
                                value={searchSectionName}
                                onChange={(e) => setSearchSectionName(e.target.value)}
                                placeholder="Section Name (e.g., Component)..."
                                className="px-3 py-2 border border-gray-200 bg-slate-50/50 rounded-xl text-xs font-bold focus:outline-none focus:border-[#63c98f] w-full sm:w-48"
                            />
                            <button type="submit" disabled={inventoryLoading} className="bg-gray-900 hover:bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition shrink-0 cursor-pointer">
                                {inventoryLoading ? 'Scanning...' : 'Scan'}
                            </button>
                        </form>
                    </div>

                    {inventoryError && <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl">{inventoryError}</div>}

                    {sectionInventory && (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                                Active Node: <span className="text-[#63c98f] font-black">{sectionInventory.section?.name?.en || sectionInventory.section?.name}</span>
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {sectionInventory.inventory_matrix?.map((item, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-gray-100/70 rounded-xl p-4 flex justify-between items-center">
                                        <div>
                                            <span className="text-xs font-black text-slate-800 tracking-tight block">{item.type}</span>
                                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5 block">Unique Catalog Links: {item.products_count}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-mono font-black text-slate-900 block">{item.total_stock}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">Total Units Available</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* الجزء الثاني: صندوق النواقص الحرجة للمستودع */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-3xs space-y-4 max-h-[380px] overflow-y-auto">
                    <div>
                        <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Depleted Inventory Vault</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Critical warning: Items stock &lt; 5 units</p>
                    </div>
                    
                    <div className="space-y-2.5">
                        {stats?.low_stock_products?.length === 0 ? (
                            <p className="text-xs text-gray-400 italic text-center py-12">All hardware lines loaded above safe buffer thresholds.</p>
                        ) : (
                            stats?.low_stock_products?.map((prod) => (
                                <div key={prod.id} className="p-3 border border-dashed border-gray-200 hover:border-rose-200 rounded-xl flex justify-between items-center transition bg-white group">
                                    <div className="min-w-0 pr-2">
                                        <span className="text-xs font-bold text-gray-800 uppercase block truncate">{prod.name}</span>
                                        <span className="text-[9px] text-gray-400 font-mono block mt-0.5">ID Node: #{prod.id}</span>
                                    </div>
                                    <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg shrink-0 ${prod.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {prod.stock === 0 ? 'SOLD OUT' : `${prod.stock} LEFT`}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* الجزء السفلي: نظام جلب وفرز قائمة الطلبات حسب حالتها الحالية النشطة */}
            <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50 pb-4">
                    <div>
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Transaction Management Control</h3>
                        <p className="text-[11px] text-gray-400 font-medium">Filter streaming incoming invoices tokens aggregated by lifecycle state parameters.</p>
                    </div>

                    <div className="flex flex-wrap gap-1 bg-slate-50 border border-gray-200/50 p-1 rounded-xl">
                        {['pending', 'confirmed', 'shipped', 'cancelled','delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setActiveStatusTab(status)}
                                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer select-none ${
                                    activeStatusTab === status
                                        ? 'bg-gray-900 text-white shadow-xs'
                                        : 'text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {ordersLoading ? (
                    <div className="text-xs font-bold text-gray-400 italic py-10 text-center uppercase tracking-widest animate-pulse">Streaming order block criteria arrays...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-slate-50/40">
                                    <th className="py-3 px-4">Tracking Reference</th>
                                    <th className="py-3 px-4">Customer Payload</th>
                                    <th className="py-3 px-4">Destination Area</th>
                                    <th className="py-3 px-4">Payment Node</th>
                                    <th className="py-3 px-4 text-right">Invoice Valuation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-gray-700">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-gray-400 font-bold italic uppercase tracking-wider">
                                            No tracking invoices recorded under this parameter category block.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 transition">
                                            <td className="py-3.5 px-4 font-mono font-black text-gray-900 select-all tracking-wider uppercase">
                                                {order.tracking_code}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-gray-900">{order.customer_name}</div>
                                                <div className="text-[10px] text-gray-400 mt-0.5 font-mono">{order.customer_phone}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="text-gray-800">{order.delivery_location}</div>
                                                <div className="text-[10px] text-[#63c98f] font-black uppercase tracking-wide mt-0.5">
                                                    {order.shipping_zone?.city_name || 'Global Route'}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 uppercase text-[10px] font-black tracking-wider">
                                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                                    {order.payment_method}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 text-sm">
                                                ${Number(order.total_amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}