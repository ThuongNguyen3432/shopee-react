import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash, ShoppingCart } from 'iconsax-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import { PRODUCTS } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';

const VND = (n) => Number(n || 0).toLocaleString('vi-VN');

export default function WishlistPage() {
  const { add } = useCart();
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    const onStorage = () => {
      try { setIds(JSON.parse(localStorage.getItem('wishlist') || '[]')); } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const items = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  const remove = (id) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      try { localStorage.setItem('wishlist', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const clearAll = () => {
    setIds([]);
    try { localStorage.setItem('wishlist', '[]'); } catch {}
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Yêu thích</span>
        </div>

        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h1 className="text-lg md:text-xl text-gray-800 flex items-center gap-2">
            <Heart size={20} variant="Bold" color="#ee4d2d" /> Sản phẩm yêu thích
            <span className="text-sm text-gray-500">({items.length})</span>
          </h1>
          {items.length > 0 && (
            <button onClick={clearAll} className="text-sm text-gray-500 hover:text-shopee-orange flex items-center gap-1">
              <Trash size={14} variant="Linear" color="currentColor" /> Xóa tất cả
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-sm py-14 text-center">
            <Heart size={56} variant="Linear" color="#c7c7c7" className="mx-auto mb-3" />
            <div className="text-sm text-gray-700">Chưa có sản phẩm yêu thích</div>
            <div className="text-xs text-gray-400 mt-1">Hãy thả tim cho sản phẩm bạn thích nhé!</div>
            <Link to="/" className="mt-4 inline-block h-9 px-10 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">Mua sắm ngay</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {items.map((p, i) => (
              <div key={p.id} className="relative">
                <button
                  onClick={() => remove(p.id)}
                  aria-label="Bỏ yêu thích"
                  className="absolute top-1 right-1 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition"
                >
                  <Heart size={14} variant="Bold" color="#ee4d2d" />
                </button>
                <div onClick={() => window.location.assign(`/product/${p.id}`)} className="cursor-pointer">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" loading="lazy" />
                    <div className="p-2">
                      <div className="text-xs text-gray-800 line-clamp-2 h-[34px]">{p.name}</div>
                      <div className="text-shopee-orange text-base font-medium mt-1">₫{VND(p.price)}</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); add(p); }}
                        className="mt-2 w-full h-7 bg-shopee-orange text-white text-xs rounded-[2px] hover:bg-shopee-red flex items-center justify-center gap-1"
                      >
                        <ShoppingCart size={12} variant="Outline" color="#fff" /> Thêm vào giỏ
                      </button>
                    </div>
                  </div>
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
