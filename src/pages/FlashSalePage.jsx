import { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import LazyImage from '../components/LazyImage.jsx';
import { FLASH_PRODUCTS } from '../data/flashSales.js';

export default function FlashSalePage() {
  const [total, setTotal] = useState(2 * 3600 + 15 * 60 + 48);
  useEffect(() => {
    const t = setInterval(() => setTotal((s) => (s <= 0 ? 2 * 3600 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        <div className="bg-white rounded-sm p-4 mb-3 flex items-center gap-4">
          <div className="text-shopee-orange text-2xl font-bold italic">FLASH SALE</div>
          <div className="flex gap-1 items-center">
            {[h, m, s].map((v, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-black text-white text-sm font-bold px-1.5 py-0.5 rounded-sm min-w-[28px] text-center">{v}</span>
                {i < 2 && <span className="text-black font-bold">:</span>}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
          {FLASH_PRODUCTS.map((p, i) => (
            <div key={p.name + i} className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow relative border border-gray-100">
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
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}