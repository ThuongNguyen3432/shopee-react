import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { slugify } from '../lib/slugify.js';
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import Header from '../components/Header.jsx';
import { useSEO } from '../hooks/useSEO.js';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

export default function CategoryPage() {
  const { slug } = useParams();
  useSEO({ title: displayName, description: `${displayName} - Mua sắm online tại Shopee.`, url: `/category/${slug}` });
  const decoded = decodeURIComponent(slug || '');
  const matchedCat = CATEGORIES.find((c) => slugify(c) === slugify(decoded));
  const displayName = matchedCat || decoded.replace(/-/g, ' ');

  const filtered = matchedCat
    ? PRODUCTS.filter((p) => p.category === matchedCat)
    : PRODUCTS.filter((p) => slugify(p.category) === slugify(decoded));

  const list = filtered.length ? filtered : PRODUCTS;
  const [visible, setVisible] = useState(24);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-700">{displayName}</span>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-3 mb-3">
          <h1 className="text-lg font-bold text-gray-800">{displayName}</h1>
          <p className="text-xs text-gray-500 mt-1">{list.length} sản phẩm</p>
        </div>

        {/* Sub-categories */}
        <div className="bg-white rounded-sm shadow-sm p-3 mb-3 flex flex-wrap gap-2">
          {CATEGORIES.slice(0, 12).map((c) => (
            <Link key={c} to={`/category/${slugify(c)}`} className={`text-xs px-3 py-1.5 rounded-full border ${c === matchedCat ? 'border-shopee-orange text-shopee-orange bg-shopee-orange-light' : 'border-gray-200 text-gray-600 hover:border-shopee-orange hover:text-shopee-orange'}`}>
              {c}
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-sm shadow-sm p-3">
          <div className="grid grid-cols-6 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
            {list.slice(0, visible).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          {list.length === 0 && (
            <div className="text-center py-12 text-gray-400">Không có sản phẩm trong danh mục này.</div>
          )}
          {visible < list.length && (
            <div className="text-center mt-4">
              <button onClick={() => setVisible((v) => Math.min(v + 24, list.length))} className="px-8 py-2 border border-gray-300 text-gray-600 text-sm hover:border-shopee-orange hover:text-shopee-orange rounded-sm">
                Xem thêm ({list.length - visible} sản phẩm)
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