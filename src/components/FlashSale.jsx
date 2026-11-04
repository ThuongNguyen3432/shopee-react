import { useState, useEffect } from 'react';
import LazyImage from './LazyImage.jsx';

import { FLASH_PRODUCTS as flashProducts } from '../data/flashSales.js';

export default function FlashSale() {
  const [total, setTotal] = useState(2 * 3600 + 15 * 60 + 48);
  useEffect(() => {
    const t = setInterval(() => setTotal((s) => (s <= 0 ? 2 * 3600 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');

  return (
    <section className="bg-white mt-2.5 p-3 rounded-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-shopee-orange text-lg font-bold italic">FLASH SALE</div>
        <div className="flex gap-1 items-center">
          {[h, m, s].map((v, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="bg-black text-white text-sm font-bold px-1.5 py-0.5 rounded-sm min-w-[28px] text-center">{v}</span>
              {i < 2 && <span className="text-black font-bold">:</span>}
            </span>
          ))}
        </div>
        <a href="/flash-sale" className="ml-auto text-shopee-orange text-sm">Xem tất cả ›</a>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {flashProducts.map((p) => (
          <div key={p.name} className="min-w-[160px] bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow relative border border-gray-200">
            <div className="relative">
              <LazyImage src={p.img} alt={p.name} className="w-full aspect-square" />
              <div className="absolute top-0 right-0 bg-shopee-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-sm">
                -{p.discount}%
              </div>
            </div>
            <div className="p-2">
              <div className="text-xs text-gray-700 h-[30px] overflow-hidden">{p.name}</div>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-shopee-orange text-[11px]">₫</span>
                <span className="text-shopee-orange text-base font-bold">{p.price.replace('₫', '')}</span>
                <span className="text-gray-400 text-xs line-through ml-2"> {p.old}</span>
              </div>
              <div className="flash-sold">
                <div className="flash-sold-bar" style={{ width: `${p.sold}%` }} />
                <div className="flash-sold-text">Đã bán {p.sold > 90 ? '1k+' : p.sold + '%'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}