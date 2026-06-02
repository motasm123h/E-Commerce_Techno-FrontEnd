// import { Routes, Route } from 'react-router-dom';
// import PublicLayout from '../components/layouts/PublicLayout';
// import AdminLayout from '../components/layouts/AdminLayout';
// import ProductsPage from '../pages/public/ProductsPage';
// import CartPage from '../pages/public/CartPage';
// import ProductDetailPage from '../pages/public/ProductDetailPage';
// import LoginPage from '../pages/admin/LoginPage';
// import ProtectedRoute from '../components/common/ProtectedRoute';
// import PcBuilderPage from '../pages/public/PcBuilderPage';
// import CategoriesPage from '../pages/admin/CategoriesPage';
// import SectionsPage from '../pages/admin/SectionsPage';
// import BrandsPage from '../pages/admin/BrandsPage';
// import AdminProductsPage from '../pages/admin/AdminProductsPage';
// import AboutUsPage from '../pages/public/AboutUsPage';
// import ContactUsPage from '../pages/public/ContactUsPage';
// import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
// import BannersPage from '../pages/admin/BannersPage';
// import HomePage from '../pages/public/HomePage';
// import CheckoutPage from '../pages/public/CheckoutPage'
// import ShippingZonesAdmin from '../pages/admin/ShippingZonesAdmin';
// import TrackOrderPage from '../pages/public/TrackOrderPage';
// import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
// import AdminAdvertisementsPage from '../pages/admin/AdminAdvertisementsPage';
// import AttributesPage from '../pages/admin/AttributesPage';
// import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
// import AdminTagsPage from '../pages/admin/AdminTagsPage';
// export default function AppRouter() {
//     return (
//         <Routes>
//             <Route path="/" element={<PublicLayout />}>
//                 <Route index element={<HomePage />} /> 
//                 <Route path="products" element={<ProductsPage />} />
//                 <Route path="cart" element={<CartPage />} />
//                 <Route path="product/:slug" element={<ProductDetailPage />} />
//                 <Route path="pc-builder" element={<PcBuilderPage />} />
//                 <Route path="about-us" element={<AboutUsPage />} />
//                 <Route path="/track-order" element={<TrackOrderPage />} />
//                 <Route path="contact-us" element={<ContactUsPage />} />
//                 <Route path="/checkout" element={<CheckoutPage />} />
//             </Route>

//             <Route path="/admin/login" element={<LoginPage />} />

//             <Route element={<ProtectedRoute />}>
//                 <Route path="/admin" element={<AdminLayout />}>
//                     <Route index element={<AdminDashboardPage />} />
//                     <Route path="tags" element={<AdminTagsPage />} />
//                     <Route path="categories" element={<CategoriesPage />} />
//                     <Route path="sections" element={<SectionsPage />} />
//                     <Route path="brands" element={<BrandsPage />} />
//                     <Route path="advertisements" element={<AdminAdvertisementsPage />} />
//                     <Route path="AttributesPage" element={<AttributesPage />} />
//                     <Route path="orders" element={<AdminOrdersPage />} />
//                     <Route path="/admin/shipping-zones" element={<ShippingZonesAdmin />} />
//                     <Route path="products" element={<AdminProductsPage />} />
//                     <Route path="settings" element={<AdminSettingsPage />} />
                    
//                     <Route path="banners" element={<BannersPage />} />
//                 </Route>
//             </Route>
//         </Routes>
//     );
// }




import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// المكونات والتخطيطات الثابتة التي يجب تحميلها فوراً للنواة (Critical Path)
import PublicLayout from '../components/layouts/PublicLayout';
import AdminLayout from '../components/layouts/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// ⚡ تحويل جميع الصفحات العامة إلى استدعاءات ديناميكية (Lazy Loading) لتقليص حجم الـ CSS/JS الأولي
const HomePage = lazy(() => import('../pages/public/HomePage'));
const ProductsPage = lazy(() => import('../pages/public/ProductsPage'));
const CartPage = lazy(() => import('../pages/public/CartPage'));
const ProductDetailPage = lazy(() => import('../pages/public/ProductDetailPage'));
const PcBuilderPage = lazy(() => import('../pages/public/PcBuilderPage'));
const AboutUsPage = lazy(() => import('../pages/public/AboutUsPage'));
const TrackOrderPage = lazy(() => import('../pages/public/TrackOrderPage'));
const ContactUsPage = lazy(() => import('../pages/public/ContactUsPage'));
const CheckoutPage = lazy(() => import('../pages/public/CheckoutPage'));

// ⚡ تحويل جميع صفحات لوحة تحكم المشرفين إلى استدعاءات ديناميكية
// هذا يمنع العميل العادي من تحميل أكواد وتصاميم لوحة التحكم دون زيارتها!
const LoginPage = lazy(() => import('../pages/admin/LoginPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminTagsPage = lazy(() => import('../pages/admin/AdminTagsPage'));
const CategoriesPage = lazy(() => import('../pages/admin/CategoriesPage'));
const SectionsPage = lazy(() => import('../pages/admin/SectionsPage'));
const BrandsPage = lazy(() => import('../pages/admin/BrandsPage'));
const AdminAdvertisementsPage = lazy(() => import('../pages/admin/AdminAdvertisementsPage'));
const AttributesPage = lazy(() => import('../pages/admin/AttributesPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'));
const ShippingZonesAdmin = lazy(() => import('../pages/admin/ShippingZonesAdmin'));
const AdminProductsPage = lazy(() => import('../pages/admin/AdminProductsPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage'));
const BannersPage = lazy(() => import('../pages/admin/BannersPage'));

// مكون مؤقت (Skeleton) يظهر برمشة عين أثناء قيام المتصفح بسحب ملفات الـ CSS/JS الخاصة بالمسار المستهدف
const PageLoaderSkeleton = () => (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#00cc88] rounded-full animate-spin mb-4" />
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest animate-pulse font-sans">
            Streaming matrix node assets...
        </p>
    </div>
);

export default function AppRouter() {
    return (
        // تغليف شجرة المسارات بـ Suspense وحقن السكيلتون للتحميل غير الحرج
        <Suspense fallback={<PageLoaderSkeleton />}>
            <Routes>
                {/* مسارات الواجهة العامة للزوار */}
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<HomePage />} /> 
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="product/:slug" element={<ProductDetailPage />} />
                    <Route path="pc-builder" element={<PcBuilderPage />} />
                    <Route path="about-us" element={<AboutUsPage />} />
                    <Route path="track-order" element={<TrackOrderPage />} />
                    <Route path="contact-us" element={<ContactUsPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                </Route>

                {/* تسجيل دخول المشرفين */}
                <Route path="/admin/login" element={<LoginPage />} />

                {/* جدار الحماية والمسارات الخاصة بـ الإدارة */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="tags" element={<AdminTagsPage />} />
                        <Route path="categories" element={<CategoriesPage />} />
                        <Route path="sections" element={<SectionsPage />} />
                        <Route path="brands" element={<BrandsPage />} />
                        <Route path="advertisements" element={<AdminAdvertisementsPage />} />
                        <Route path="AttributesPage" element={<AttributesPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="shipping-zones" element={<ShippingZonesAdmin />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                        <Route path="banners" element={<BannersPage />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
}