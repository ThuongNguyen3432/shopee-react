import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowDown2, TickCircle } from 'iconsax-react';
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { slugify } from '../lib/slugify.js';
import ProductCard from '../components/ProductCard.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

const SORTS = [
  { value: 'popular', label: 'Liên quan' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'sold', label: 'Bán chạy' },
  { value: 'price-asc', label: 'Giá: Thấp đến cao' },
  { value: 'price-desc', label: 'Giá: Cao đến thấp' },
];

function soldNumber(value) {
  const raw = String(value ?? '');
  if (/k$/i.test(raw)) return parseFloat(raw) * 1000;
  if (/tr$/i.test(raw)) return parseFloat(raw) * 1000000;
  return Number(raw.replace(/\D/g, '')) || 0;
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const cat = params.get('cat') || 'Tất cả';
  const sort = params.get('sort') || 'popular';
  const [visible, setVisible] = useState(24);

  const filterCats = useMemo(() => ['Tất cả', ...CATEGORIES], []);

  const filtered = useMemo(() => {
    const nq = slugify(q);
    const ncat = slugify(cat);
    const list = PRODUCTS.filter((p) => {
      const matchQ = !nq || slugify(p.name).includes(nq) || slugify(p.category).includes(nq);
      const matchCat = ncat === slugify('Tất cả')
        || slugify(p.category).includes(ncat)
        || ncat.includes(slugify(p.category));
      return matchQ && matchCat;
    });

    const sorted = [...list];
    switch (sort) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'sold': sorted.sort((a, b) => soldNumber(b.sold) - soldNumber(a.sold)); break;
      case 'newest': sorted.sort((a, b) => b.id - a.id); break;
      default: sorted.sort((a, b) => soldNumber(b.sold) - soldNumber(a.sold));
    }
    return sorted;
  }, [q, cat, sort]);

  useEffect(() => { setVisible(24); }, [q, cat, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'Tất cả') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const heading = q
    ? `Kết quả cho "${q}"`
    : cat !== 'Tất cả'
      ? `${cat}`
      : 'Tất cả sản phẩm';

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-700">Tìm kiếm{q ? `: "${q}"` : ''}</span>
          {cat !== 'Tất cả' && (
            <>
              <span>/</span>
              <span className="text-gray-700">{cat}</span>
            </>
          )}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-sm shadow-sm mb-3">
          <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-500 shrink-0">Bộ lọc:</span>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1 min-w-0 py-0.5">
              {filterCats.map((c) => {
                const active = c === cat;
                return (
                  <button
                    key={c}
                    onClick={() => updateParam('cat', c)}
                    aria-pressed={active}
                    className={`shrink-0 h-7 px-3 rounded-[2px] border text-xs transition flex items-center gap-1 ${active
                      ? 'border-shopee-orange bg-shopee-orange-light text-shopee-orange font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-shopee-orange hover:text-shopee-orange'}`}
                  >
                    {active && c !== 'Tất cả' && <TickCircle size={12} variant="Bold" color="currentColor" />}
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-3 py-2 flex items-center gap-3 flex-wrap">
            <h1 className="text-sm md:text-base font-medium text-gray-800">{heading}</h1>
            <span className="text-xs text-gray-500">{filtered.length.toLocaleString('vi-VN')} sản phẩm</span>
            <div className="flex items-center gap-1.5 ml-auto flex-wrap">
              <span className="text-xs text-gray-500 hidden sm:inline">Sắp xếp theo</span>
              {SORTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => updateParam('sort', s.value === 'popular' ? '' : s.value)}
                  className={`h-7 px-2.5 rounded-[2px] text-xs transition ${sort === s.value
                    ? 'bg-shopee-orange text-white'
                    : 'text-gray-600 hover:text-shopee-orange'}`}
                >
                  {s.label}
                </button>
              ))}
              <span className="relative sm:hidden">
                <select
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value === 'popular' ? '' : e.target.value)}
                  aria-label="Sắp xếp sản phẩm"
                  className="appearance-none border border-gray-200 rounded-[2px] pl-2 pr-6 py-1 text-xs outline-none focus:border-shopee-orange bg-white"
                >
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <ArrowDown2 size={11} variant="Linear" color="#555" className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-sm shadow-sm p-3">
          <div className="grid grid-cols-6 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
            {filtered.slice(0, visible).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-sm">Không tìm thấy sản phẩm phù hợp.</div>
              <button
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="mt-3 text-shopee-orange text-sm hover:underline"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
          {visible < filtered.length && (
            <div className="text-center mt-4">
              <button
                onClick={() => setVisible((v) => Math.min(v + 24, filtered.length))}
                className="px-8 h-9 border border-gray-300 text-gray-600 text-sm hover:border-shopee-orange hover:text-shopee-orange rounded-[2px]"
              >
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
