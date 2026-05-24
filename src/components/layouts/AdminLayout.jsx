import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';

export default function AdminLayout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Logout process failed:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Navigation Panel */}
            <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between shadow-lg">
                <div>
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-blue-400 tracking-wide">Admin Panel</h2>
                    </div>
                    
                    <nav className="space-y-1">
                        <Link to="/admin" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                            Dashboard
                        </Link>
                        <Link to="/admin/categories" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                            Categories
                        </Link>
                        <Link to="/admin/sections" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                            Sections
                        </Link>
                        <Link to="/admin/brands" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                            Brands
                        </Link>
                        <Link to="/admin/products" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                            Products
                        </Link>
                        <Link to="/admin/shipping-zones" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                            ShippingZones
                        </Link>
                        <Link to="/admin/advertisements" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                            advertisements
                        </Link>
                        <Link to="/admin/banners" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                            Promo Banners
                        </Link>
                        <Link to="/admin/settings" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                             Store Settings
                        </Link>
                        <Link to="/admin/AttributesPage" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                             Store AttributesPage
                        </Link>


                        <Link to="/admin/orders" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                            Orders
                        </Link>
                        {/* <Link to="/orders" className="block p-2.5 hover:bg-gray-800 rounded transition text-gray-300 hover:text-white font-medium text-sm">
                            AdminOrdersPage
                        </Link> */}
                    </nav>
                </div>

                <div>
                    <Link to="/" className="block p-2.5 text-gray-400 hover:text-white transition font-medium text-sm border-t border-gray-800 pt-4">
                        ← View Store
                    </Link>
                </div>
            </aside>

            {/* Main Application Interface */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between border-b border-gray-200">
                    <span className="font-medium text-gray-700">
                        Welcome back, <span className="text-blue-600 font-semibold">{user?.name || 'Admin'}</span>
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-800 font-medium transition text-sm cursor-pointer"
                    >
                        Logout
                    </button>
                </header>
                
                {/* Dynamic Content Window Rendering Views */}
                <main className="p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}