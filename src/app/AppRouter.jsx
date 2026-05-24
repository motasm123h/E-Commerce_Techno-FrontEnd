import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layouts/PublicLayout';
import AdminLayout from '../components/layouts/AdminLayout';
import ProductsPage from '../pages/public/ProductsPage';
import CartPage from '../pages/public/CartPage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import LoginPage from '../pages/admin/LoginPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PcBuilderPage from '../pages/public/PcBuilderPage';
// ADMIN PANEL RESOURCE MANAGEMENT VIEWS
import CategoriesPage from '../pages/admin/CategoriesPage';
import SectionsPage from '../pages/admin/SectionsPage';
import BrandsPage from '../pages/admin/BrandsPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AboutUsPage from '../pages/public/AboutUsPage';
import ContactUsPage from '../pages/public/ContactUsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import BannersPage from '../pages/admin/BannersPage';
import HomePage from '../pages/public/HomePage';
import CheckoutPage from '../pages/public/CheckoutPage'
import ShippingZonesAdmin from '../pages/admin/ShippingZonesAdmin';
import TrackOrderPage from '../pages/public/TrackOrderPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminAdvertisementsPage from '../pages/admin/AdminAdvertisementsPage';
import AttributesPage from '../pages/admin/AttributesPage';


export default function AppRouter() {
    return (
        <Routes>
            {/* PUBLIC LAYOUT BASE SYSTEM */}
            <Route path="/" element={<PublicLayout />}>
                {/* تم الإصلاح: HomePage هي الصفحة الافتراضية (index) للموقع */}
                <Route index element={<HomePage />} /> 
                <Route path="products" element={<ProductsPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="product/:slug" element={<ProductDetailPage />} />
                <Route path="pc-builder" element={<PcBuilderPage />} />
                <Route path="about-us" element={<AboutUsPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="contact-us" element={<ContactUsPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            {/* BACKEND ACCESS PANEL ENTRY SECURE LOCK */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* SEPARATE ADMIN SUB-SECTION VIEW MATRICES */}
            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<div className="p-2 text-xl font-medium">Admin Performance metrics dashboard overview.</div>} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="sections" element={<SectionsPage />} />
                    <Route path="brands" element={<BrandsPage />} />
                    <Route path="advertisements" element={<AdminAdvertisementsPage />} />
                    <Route path="AttributesPage" element={<AttributesPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="/admin/shipping-zones" element={<ShippingZonesAdmin />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    {/* <Route path="orders" element={<div className="p-2 text-xl">Orders Management System Table</div>} /> */}
                    <Route path="settings" element={<AdminSettingsPage />} />
                    
                    {/* تم الإصلاح: إزالة المسار المطلق /admin/ وجعله نسبياً */}
                    <Route path="banners" element={<BannersPage />} />
                </Route>
            </Route>
        </Routes>
    );
}