import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products.js';
import { slugify } from '../lib/slugify.js';
import ProductCard from '../components/ProductCard.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').toLowerCase();
  const nq = slugify(q);
  const filtered = q
    ? PRODUCTS.filter((p) => slugify(p.name).includes(nq) || slugify(p.category).includes(nq))
    : PRODUCTS;
  const [visible, setVisible] = useState(24);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-700">Tìm kiếm: "{q}"</span>
        </div>
        <div className="bg-white rounded-sm shadow-sm p-3 mb-3">
          <h1 className="text-lg font-bold text-gray-800">Kết quả cho "{q}"</h1>
          <p className="text-xs text-gray-500 mt-1">{filtered.length} sản phẩm</p>
        </div>
        <div className="bg-white rounded-sm shadow-sm p-3">
          <div className="grid grid-cols-6 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
            {filtered.slice(0, visible).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">Không tìm thấy sản phẩm phù hợp.</div>
          )}
          {visible < filtered.length && (
            <div className="text-center mt-4">
              <button onClick={() => setVisible((v) => Math.min(v + 24, filtered.length))} className="px-8 py-2 border border-gray-300 text-gray-600 text-sm hover:border-shopee-orange hover:text-shopee-orange rounded-sm">
                Xem thêm ({filtered.length - visible} sản phẩm)
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}