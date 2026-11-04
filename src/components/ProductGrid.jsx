import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import ProductModal from './ProductModal.jsx';
import ProductCard from './ProductCard.jsx';

import { PRODUCTS as products } from '../data/products.js';
const TABS = ['Gợi ý hôm nay', 'Flash Sale', 'Shopee Mall', 'Xu hướng', 'Mới nhất'];
const discountOf = (id) => 20 + (id * 7) % 50;

export default function ProductGrid() {
  const { add } = useCart();
  const [list, setList] = useState(products);
  const [activeTab, setActiveTab] = useState('Gợi ý hôm nay');
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState('popular');
  const [visible, setVisible] = useState(24);

  const sorted = [...list].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <section className="bg-white mt-2.5 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-base font-medium pb-1.5 border-b-2 transition whitespace-nowrap ${activeTab === t ? 'text-shopee-orange border-shopee-orange' : 'text-gray-500 border-transparent hover:text-shopee-orange'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-xs border border-gray-300 rounded-sm px-2 py-1">
          <option value="popular">Phổ biến</option>
          <option value="price-asc">Giá: thấp → cao</option>
          <option value="price-desc">Giá: cao → thấp</option>
          <option value="rating">Đánh giá</option>
        </select>
      </div>
      <div className="grid grid-cols-6 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
        {sorted.slice(0, visible).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      <div className="text-center mt-4">
        {visible < sorted.length && (
          <button
            onClick={() => setVisible((v) => Math.min(v + 24, sorted.length))}
            className="px-8 py-2 border border-gray-300 text-gray-600 text-sm hover:border-shopee-orange hover:text-shopee-orange rounded-sm"
          >
            Xem thêm ({sorted.length - visible} sản phẩm)
          </button>
        )}
      </div>
      <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={add} />
    </section>
  );
}