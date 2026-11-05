import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

const BRANDS = [
  { name: 'Samsung', img: 'https://picsum.photos/seed/brand1/120/60', tag: 'Chính hãng' },
  { name: 'Apple', img: 'https://picsum.photos/seed/brand2/120/60', tag: 'Mall' },
  { name: 'Xiaomi', img: 'https://picsum.photos/seed/brand3/120/60', tag: 'Chính hãng' },
  { name: 'OPPO', img: 'https://picsum.photos/seed/brand4/120/60', tag: 'Mall' },
  { name: 'Nike', img: 'https://picsum.photos/seed/brand5/120/60', tag: 'Chính hãng' },
  { name: 'Adidas', img: 'https://picsum.photos/seed/brand6/120/60', tag: 'Mall' },
  { name: 'L\'Oreal', img: 'https://picsum.photos/seed/brand7/120/60', tag: 'Chính hãng' },
  { name: 'Unilever', img: 'https://picsum.photos/seed/brand8/120/60', tag: 'Mall' },
  { name: 'Philips', img: 'https://picsum.photos/seed/brand9/120/60', tag: 'Chính hãng' },
  { name: 'Panasonic', img: 'https://picsum.photos/seed/brand10/120/60', tag: 'Mall' },
  { name: 'Sony', img: 'https://picsum.photos/seed/brand11/120/60', tag: 'Chính hãng' },
  { name: 'LG', img: 'https://picsum.photos/seed/brand12/120/60', tag: 'Mall' },
];

const CATEGORIES = ['Điện tử', 'Thời trang', 'Làm đẹp', 'Gia dụng', 'Thể thao', 'Mẹ & Bé', 'Sách', 'Bách hóa'];

export default function MallPage() {
  const [cat, setCat] = useState('Tất cả');
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        {/* Hero */}
        <div className="bg-gradient-to-r from-[#d0011b] to-[#f53d2d] rounded-sm p-4 md:p-6 mb-3 text-white flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-2xl md:text-3xl font-bold">Shopee Mall</div>
            <div className="text-xs md:text-sm opacity-90 mt-1">Chính hãng 100% · Hoàn tiền 200% nếu hàng giả · Freeship mọi đơn · Đổi trả 15 ngày</div>
          </div>
          <div className="flex gap-2">
            <div className="bg-white/20 rounded-sm px-3 py-2 text-center">
              <div className="text-lg font-bold">200+</div>
              <div className="text-[10px] opacity-90">Thương hiệu</div>
            </div>
            <div className="bg-white/20 rounded-sm px-3 py-2 text-center">
              <div className="text-lg font-bold">10K+</div>
              <div className="text-[10px] opacity-90">Sản phẩm</div>
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="bg-white rounded-sm p-3 mb-3 flex flex-wrap gap-2">
          {['Tất cả', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${cat === c ? 'border-shopee-orange text-shopee-orange bg-shopee-orange-light' : 'border-gray-200 text-gray-600 hover:border-shopee-orange hover:text-shopee-orange'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Brand grid */}
        <div className="bg-white rounded-sm p-3 mb-3">
          <h2 className="text-base font-medium text-gray-800 mb-3">Thương hiệu nổi bật</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {BRANDS.map((b) => (
              <Link key={b.name} to="/search" className="group flex flex-col items-center gap-1.5 p-2 border border-gray-100 rounded-sm hover:border-shopee-orange hover:shadow-sm transition">
                <img src={b.img} alt={b.name} width={120} height={60} className="w-full h-12 object-contain" loading="lazy" />
                <div className="text-xs text-gray-700 group-hover:text-shopee-orange">{b.name}</div>
                <span className="text-[9px] text-white bg-shopee-orange px-1 py-px rounded-[2px]">{b.tag}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Voucher strip */}
        <div className="bg-white rounded-sm p-3 mb-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-700 font-medium">Voucher Mall:</span>
          {['Giảm ₫30K', 'Freeship Xtra', 'Giảm 10%'].map((v) => (
            <span key={v} className="text-xs border border-dashed border-shopee-orange text-shopee-orange px-2 py-1 rounded-[2px]">{v}</span>
          ))}
          <Link to="/vouchers" className="ml-auto text-xs text-shopee-orange hover:underline">Xem tất cả</Link>
        </div>

        {/* Banner grid */}
        <div className="grid grid-cols-2 gap-3">
          <img src="https://picsum.photos/seed/mall1/720/240" alt="mall1" width={720} height={240} className="w-full rounded-sm" loading="lazy" />
          <img src="https://picsum.photos/seed/mall2/720/240" alt="mall2" width={720} height={240} className="w-full rounded-sm" loading="lazy" />
          <img src="https://picsum.photos/seed/mall3/720/240" alt="mall3" width={720} height={240} className="w-full rounded-sm" loading="lazy" />
          <img src="https://picsum.photos/seed/mall4/720/240" alt="mall4" width={720} height={240} className="w-full rounded-sm" loading="lazy" />
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
