import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash, ShoppingCart } from 'iconsax-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import { PRODUCTS } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';

const VND = (n) => Number(n || 0).toLocaleString('vi-VN');
const KEY = 'recentlyViewed';

export function trackView(id) {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    const next = [id, ...list.filter((x) => x !== id)].slice(0, 20);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export function getRecentIds() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export default function RecentlyViewedPage() {
  const { add } = useCart();
  const [ids, setIds] = useState(getRecentIds);
  const items = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  const clear = () => { setIds([]); try { localStorage.setItem(KEY, '[]'); } catch {} };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Đã xem</span>
        </div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h1 className="text-lg md:text-xl text-gray-800 flex items-center gap-2">
            <Eye size={20} variant="Bold" color="#ee4d2d" /> Sản phẩm đã xem
            <span className="text-sm text-gray-500">({items.length})</span>
          </h1>
          {items.length > 0 && (
            <button onClick={clear} className="text-sm text-gray-500 hover:text-shopee-orange flex items-center gap-1">
              <Trash size={14} variant="Linear" color="currentColor" /> Xóa tất cả
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-sm py-14 text-center">
            <Eye size={56} variant="Linear" color="#c7c7c7" className="mx-auto mb-3" />
            <div className="text-sm text-gray-700">Chưa có sản phẩm nào được xem</div>
            <Link to="/" className="mt-4 inline-block h-9 px-10 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">Mua sắm ngay</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {items.map((p) => (
              <div key={p.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Link to={`/product/${p.id}`}>
                  <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" loading="lazy" />
                </Link>
                <div className="p-2">
                  <Link to={`/product/${p.id}`} className="text-xs text-gray-800 line-clamp-2 h-[34px] block">{p.name}</Link>
                  <div className="text-shopee-orange text-base font-medium mt-1">₫{VND(p.price)}</div>
                  <button
                    onClick={() => add(p)}
                    className="mt-2 w-full h-7 bg-shopee-orange text-white text-xs rounded-[2px] hover:bg-shopee-red flex items-center justify-center gap-1"
                  >
                    <ShoppingCart size={12} variant="Outline" color="#fff" /> Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
