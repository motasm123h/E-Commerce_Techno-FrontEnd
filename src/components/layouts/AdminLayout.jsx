// import { Outlet, Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../app/AuthContext';

// export default function AdminLayout() {
//     const { logout, user } = useAuth();
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         try {
//             await logout();
//             navigate('/admin/login');
//         } catch (error) {
//             console.error("Logout process failed:", error);
//         }
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             {/* Sidebar Navigation Panel */}
//             <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between shadow-lg">
//                 <div>
//                     <div className="mb-8">
//                         <h2 className="text-2xl font-bold text-blue-400 tracking-wide">Admin Panel</h2>
//                     </div>
                    
//                     <nav className="space-y-1">
//                         <Link to="/admin" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                             Dashboard
//                         </Link>
//                         <Link to="/admin/categories" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                             Categories
//                         </Link>
//                         <Link to="/admin/sections" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                             Sections
//                         </Link>
//                         <Link to="/admin/brands" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                             Brands
//                         </Link>
//                         <Link to="/admin/products" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                             Products
//                         </Link>
//                         <Link to="/admin/shipping-zones" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                             ShippingZones
//                         </Link>
//                         <Link to="/admin/advertisements" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                             advertisements
//                         </Link>
//                         <Link to="/admin/banners" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                             Promo Banners
//                         </Link>
//                         <Link to="/admin/settings" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                              Store Settings
//                         </Link>
//                         <Link to="/admin/AttributesPage" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                              Store AttributesPage
//                         </Link>


//                         <Link to="/admin/orders" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                             Orders
//                         </Link>
//                         {/* <Link to="/orders" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
//                             AdminOrdersPage
//                         </Link> */}
//                     </nav>
//                 </div>

//                 <div>
//                     <Link to="/" className="block p-2.5 text-gray-400 hover:text-white transition font-medium text-sm border-t border-gray-800 pt-4">
//                         ← View Store
//                     </Link>
//                 </div>
//             </aside>

//             {/* Main Application Interface */}
//             <div className="flex-1 flex flex-col">
//                 <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between border-b border-gray-200">
//                     <span className="font-medium text-gray-700">
//                         Welcome back, <span className="text-blue-600 font-semibold">{user?.name || 'Admin'}</span>
//                     </span>
//                     <button 
//                         onClick={handleLogout}
//                         className="text-red-600 hover:text-red-800 font-medium transition text-sm cursor-pointer"
//                     >
//                         Logout
//                     </button>
//                 </header>
                
//                 {/* Dynamic Content Window Rendering Views */}
//                 <main className="p-8 flex-1 overflow-y-auto">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// }


import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import api from '../../services/api';

export default function AdminLayout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // نظام جلب وإدارة الإشعارات المركزي
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    useEffect(() => {
        api.get('/admin/notifications')
            .then(res => {
                if (Array.isArray(res.data)) {
                    setNotifications(res.data);
                }
            })
            .catch(err => console.error("Failed to fetch admin notifications", err));
    }, [location.pathname]); 

    const markAsRead = async (id) => {
        try {
            await api.post(`/admin/notifications/${id}/mark-as-read`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Logout process failed:", error);
        }
    };

    const isActiveLink = (path) => location.pathname === path;

    return (
        <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
            
            <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between shadow-xl h-full shrink-0 sticky top-0">
                <div className="flex flex-col h-full overflow-y-auto pr-1 space-y-8 no-scrollbar">
                    <div>
                        <h2 className="text-2xl font-black text-[#63c98f] tracking-wider uppercase">Titan Control</h2>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mt-1">Core Administrator</span>
                    </div>
                    
                    <nav className="space-y-1 flex-1">
                        {[
                            { path: '/admin', label: 'Dashboard' },
                            { path: '/admin/categories', label: 'Categories' },
                            { path: '/admin/sections', label: 'Sections' },
                            { path: '/admin/brands', label: 'Brands' },
                            { path: '/admin/products', label: ' Create Products' },
                            { path: '/admin/shipping-zones', label: 'Shipping Zones' },
                            { path: '/admin/advertisements', label: 'Advertisements' },
                            { path: '/admin/banners', label: 'Banners' },
                            { path: '/admin/settings', label: 'Store Settings' },
                            { path: '/admin/AttributesPage', label: 'Store Attributes' },
                            { path: '/admin/orders', label: 'Orders' },
                            { path: '/admin/tags', label: 'Store Tags (CMS)' },
                        ].map((link) => (
                            <Link 
                                key={link.path}
                                to={link.path} 
                                className={`block p-2.5 rounded-xl transition text-sm font-bold tracking-wide ${
                                    isActiveLink(link.path)
                                        ? 'bg-[#63c98f] text-white shadow-xs'
                                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="pt-4 border-t border-gray-800 mt-auto">
                    <Link to="/" className="block p-2 text-center rounded-xl bg-gray-800 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-700/50 transition">
                        ← View Live Store
                    </Link>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                <header className="bg-white h-16 flex items-center px-8 justify-between border-b border-gray-200 shrink-0 z-30">
                    <span className="text-sm font-medium text-gray-600">
                        Welcome back, <span className="text-[#63c98f] font-black">{user?.name || 'Admin'}</span>
                    </span>
                    
                    <div className="flex items-center gap-6 relative">
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="relative p-2 text-gray-500 hover:text-gray-800 transition cursor-pointer select-none"
                            >
                                <span className="text-xl">🔔</span>
                                {notifications.length > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full animate-bounce">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 z-50 space-y-2 max-h-96 overflow-y-auto">
                                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">Unread Notifications</h4>
                                    {notifications.length === 0 ? (
                                        <p className="text-xs text-gray-400 italic text-center py-6">No new incoming alerts.</p>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl flex flex-col gap-1">
                                                <p className="text-xs text-gray-700 font-semibold leading-relaxed">{n.data?.message || 'New Store Event Linked'}</p>
                                                <button onClick={() => markAsRead(n.id)} className="text-[10px] text-[#63c98f] font-bold text-left hover:underline mt-1 cursor-pointer">
                                                    ✓ Dismiss Alert
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </header>
                
                <main className="p-8 flex-1 overflow-y-auto bg-gray-50/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}