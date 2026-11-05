import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import LazyImage from '../components/LazyImage.jsx';
import { FLASH_PRODUCTS } from '../data/flashSales.js';
import { PRODUCTS } from '../data/products.js';

const SLOTS = [
  { key: '00', label: '00:00', status: 'ended' },
  { key: '09', label: '09:00', status: 'ended' },
  { key: '12', label: '12:00', status: 'live' },
  { key: '15', label: '15:00', status: 'upcoming' },
  { key: '18', label: '18:00', status: 'upcoming' },
  { key: '21', label: '21:00', status: 'upcoming' },
];

export default function FlashSalePage() {
  const [activeSlot, setActiveSlot] = useState('12');
  const [total, setTotal] = useState(2 * 3600 + 15 * 60 + 48);
  useEffect(() => {
    const t = setInterval(() => setTotal((s) => (s <= 0 ? 2 * 3600 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');

  const products = useMemo(() => {
    // reuse FLASH_PRODUCTS, pad with PRODUCTS for variety
    const base = FLASH_PRODUCTS.length ? FLASH_PRODUCTS : [];
    const padded = [...base];
    let i = 0;
    while (padded.length < 20) {
      const p = PRODUCTS[i % PRODUCTS.length];
      padded.push({ name: p.name, img: p.image, price: p.price.toLocaleString('vi-VN'), old: Math.round(p.price * 1.3).toLocaleString('vi-VN'), discount: 30 + (i % 4) * 10, sold: 10 + i * 3, stock: 100 });
      i++;
    }
    return padded;
  }, []);

  const active = SLOTS.find((x) => x.key === activeSlot);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-[#f53d2d] to-[#f63] rounded-sm p-4 mb-3 text-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl md:text-3xl font-bold italic">FLASH SALE</div>
            <div className="text-xs opacity-90">Giảm đến 70% · Số lượng có hạn</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-90">{active?.status === 'live' ? 'Kết thúc sau' : active?.status === 'upcoming' ? 'Bắt đầu sau' : 'Đã kết thúc'}</span>
            <div className="flex gap-1 items-center">
              {[h, m, s].map((v, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="bg-white/20 text-white text-sm font-bold px-1.5 py-0.5 rounded-sm min-w-[28px] text-center">{v}</span>
                  {i < 2 && <span className="text-white font-bold">:</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div className="bg-white rounded-sm mb-3 overflow-x-auto scrollbar-hide">
          <div className="flex">
            {SLOTS.map((slot) => {
              const isActive = slot.key === activeSlot;
              return (
                <button
                  key={slot.key}
                  onClick={() => setActiveSlot(slot.key)}
                  className={`flex-1 min-w-[90px] px-3 py-3 text-center border-b-2 transition ${isActive ? 'border-shopee-orange bg-shopee-orange-light' : 'border-transparent hover:bg-gray-50'}`}
                >
                  <div className={`text-sm font-bold ${isActive ? 'text-shopee-orange' : 'text-gray-700'}`}>{slot.label}</div>
                  <div className={`text-[10px] mt-0.5 ${slot.status === 'live' ? 'text-shopee-orange' : slot.status === 'upcoming' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {slot.status === 'live' ? 'Đang diễn ra' : slot.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-sm p-3">
          <div className="grid grid-cols-5 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
            {products.map((p, i) => {
              const sold = p.sold || 0;
              const stock = p.stock || 100;
              const pct = Math.min(100, Math.round((sold / stock) * 100));
              return (
                <div key={p.name + i} className="bg-white rounded-sm overflow-hidden cursor-pointer hover:shadow relative border border-gray-100">
                  <div className="relative">
                    <LazyImage src={p.img} alt={p.name} className="w-full aspect-square" />
                    <div className="absolute top-0 right-0 bg-shopee-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-sm">-{p.discount}%</div>
                  </div>
                  <div className="p-2">
                    <div className="text-xs text-gray-700 h-[30px] overflow-hidden">{p.name}</div>
                    <div className="flex items-baseline gap-0.5 mt-1">
                      <span className="text-shopee-orange text-[11px]">₫</span>
                      <span className="text-shopee-orange text-base font-bold">{p.price}</span>
                      <span className="text-gray-400 text-xs line-through ml-2">{p.old}</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-3 bg-[#ffe8e1] rounded-full overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-[#f53d2d] to-[#f63] rounded-full" style={{ width: `${pct}%` }} />
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-bold">Đã bán {sold}</span>
                      </div>
                    </div>
                    <button className="mt-2 w-full h-7 bg-shopee-orange text-white text-xs rounded-[2px] hover:bg-shopee-red">Mua ngay</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
