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
import AuthCallback from './pages/AuthCallback.jsx';
import Checkout from './pages/Checkout.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
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

function Storefront() {
  return (
    <div className="min-h-screen">
      <Header />
      <CategoryNav />
      <main className="container mt-2 px-2">
        <Banner />
        <VoucherBar />
        <CategoryIcons />
        <FlashSale />
        <ShopeeLive />
        <ShopeeMall />
        <ProductGrid />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
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
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}