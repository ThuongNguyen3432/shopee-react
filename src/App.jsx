import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import CategoryNav from './components/CategoryNav.jsx';
import Banner from './components/Banner.jsx';
import VoucherBar from './components/VoucherBar.jsx';
import CategoryIcons from './components/CategoryIcons.jsx';
import FlashSale from './components/FlashSale.jsx';
import ShopeeLive from './components/ShopeeLive.jsx';
import ShopeeMall from './components/ShopeeMall.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import Footer from './components/Footer.jsx';
import BackToTop from './components/BackToTop.jsx';
import PromoPopup from './components/PromoPopup.jsx';
import TopSearchesSection from './components/TopSearches.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Checkout from './pages/Checkout.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import RecentlyViewedPage from './pages/RecentlyViewedPage.jsx';
import ReturnRefundPage from './pages/ReturnRefundPage.jsx';
import VouchersPage from './pages/VouchersPage.jsx';
import FlashSalePage from './pages/FlashSalePage.jsx';
import LivePage from './pages/LivePage.jsx';
import MallPage from './pages/MallPage.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import Products from './admin/Products.jsx';
import Categories from './admin/Categories.jsx';
import Orders from './admin/Orders.jsx';
import Users from './admin/Users.jsx';
import Vouchers from './admin/Vouchers.jsx';
import Banners from './admin/Banners.jsx';
import FlashSaleAdmin from './admin/FlashSale.jsx';
import Settings from './admin/Settings.jsx';
import Popup from './admin/Popup.jsx';
import TopSearches from './admin/TopSearches.jsx';
import SiteSettings from './admin/SiteSettings.jsx';
import SellerLayout from './seller/SellerLayout.jsx';
import SellerDashboard from './seller/SellerDashboard.jsx';
import SellerProducts from './seller/SellerProducts.jsx';
import SellerOrders from './seller/SellerOrders.jsx';
import SellerChat from './seller/SellerChat.jsx';
import SellerVouchers from './seller/SellerVouchers.jsx';
import SellerPromotions from './seller/SellerPromotions.jsx';
import SellerRevenue from './seller/SellerRevenue.jsx';
import SellerAnalytics from './seller/SellerAnalytics.jsx';
import SellerSettings from './seller/SellerSettings.jsx';

function Storefront() {
  return (
    <div className="min-h-screen">
      <Header />
      <CategoryNav />
      <main className="container mt-2 px-2">
        <Banner />
        <VoucherBar />
        <TopSearchesSection className="mb-2" />
        <CategoryIcons />
        <FlashSale />
        <ShopeeLive />
        <ShopeeMall />
        <ProductGrid />
      </main>
      <Footer />
      <BackToTop />
      <PromoPopup />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/reset" element={<ResetPassword />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/order/:code" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/returns" element={<ProtectedRoute><ReturnRefundPage /></ProtectedRoute>} />
        <Route path="/recently-viewed" element={<ProtectedRoute><RecentlyViewedPage /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/shop/:shopId" element={<ShopPage />} />
        <Route path="/vouchers" element={<VouchersPage />} />
        <Route path="/flash-sale" element={<FlashSalePage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/mall" element={<MallPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="vouchers" element={<Vouchers />} />
          <Route path="banners" element={<Banners />} />
          <Route path="flash-sale" element={<FlashSaleAdmin />} />
          <Route path="settings" element={<Settings />} />
          <Route path="popup" element={<Popup />} />
          <Route path="top-searches" element={<TopSearches />} />
          <Route path="site-settings" element={<SiteSettings />} />
        </Route>
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="chat" element={<SellerChat />} />
          <Route path="vouchers" element={<SellerVouchers />} />
          <Route path="promotions" element={<SellerPromotions />} />
          <Route path="revenue" element={<SellerRevenue />} />
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}