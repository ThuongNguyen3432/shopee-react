import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, TicketDiscount, Shop, Truck, Coin, TickCircle } from 'iconsax-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import { store } from '../admin/store.js';

const VND = (n) => Number(n || 0).toLocaleString('vi-VN');

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'shopee', label: 'Voucher Shopee' },
  { key: 'shop', label: 'Voucher của Shop' },
  { key: 'saved', label: 'Của tôi' },
];

const MOCK_VOUCHERS = [
  { id: 101, code: 'SHOPEE10', label: 'Giảm ₫10.000', sub: 'Đơn từ ₫50.000', value: 10000, min_order: 50000, type: 'shopee', expiry: '30/11/2026', img: 'shopee' },
  { id: 102, code: 'FREESHIP', label: 'Miễn phí vận chuyển', sub: 'Toàn quốc, đơn từ ₫0', value: 0, min_order: 0, type: 'shopee', freeShip: true, expiry: '15/12/2026', img: 'shopee' },
  { id: 103, code: 'SHOPEE50', label: 'Giảm ₫50.000', sub: 'Đơn từ ₫200.000', value: 50000, min_order: 200000, type: 'shopee', expiry: '31/12/2026', img: 'shopee' },
  { id: 104, code: 'SHOP20K', label: 'Giảm ₫20.000', sub: 'Đơn từ ₫99.000', value: 20000, min_order: 99000, type: 'shop', shop: 'Minh Anh Shop', expiry: '20/11/2026', img: 'shop' },
  { id: 105, code: 'SHOP10P', label: 'Giảm 10%', sub: 'Tối đa ₫30.000', value: 30000, min_order: 100000, type: 'shop', shop: 'Tech World', percent: 10, expiry: '25/11/2026', img: 'shop' },
];

export default function VouchersPage() {
  const [tab, setTab] = useState('all');
  const [saved, setSaved] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('savedVouchers') || '[]')); } catch { return new Set(); }
  });

  const adminVouchers = (store.get('vouchers') || []).map((v) => ({
    id: v.id + 1000,
    code: v.code,
    label: v.label,
    sub: v.sub,
    value: v.value || 0,
    min_order: v.min_order || 0,
    type: 'shopee',
    expiry: '31/12/2026',
    img: 'shopee',
  }));

  const all = [...MOCK_VOUCHERS, ...adminVouchers];

  const filtered = all.filter((v) => {
    if (tab === 'all') return true;
    if (tab === 'shopee') return v.type === 'shopee';
    if (tab === 'shop') return v.type === 'shop';
    if (tab === 'saved') return saved.has(v.id);
    return true;
  });

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem('savedVouchers', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Voucher</span>
        </div>

        <div className="bg-white rounded-sm mb-3">
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 text-sm">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 h-11 border-b-2 transition whitespace-nowrap text-sm ${tab === t.key ? 'border-shopee-orange text-shopee-orange font-medium' : 'border-transparent text-gray-600 hover:text-shopee-orange'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((v) => {
            const isSaved = saved.has(v.id);
            return (
              <div key={v.id} className="bg-white rounded-sm flex overflow-hidden border border-gray-100 hover:shadow-sm transition">
                <div className={`w-24 shrink-0 flex flex-col items-center justify-center text-white ${v.type === 'shopee' ? 'bg-gradient-to-b from-[#f53d2d] to-[#f63]' : 'bg-gradient-to-b from-[#00bfa5] to-[#00897b]'}`}>
                  {v.freeShip ? <Truck size={26} variant="Bold" color="#fff" /> : <Ticket size={26} variant="Bold" color="#fff" />}
                  <div className="text-[10px] mt-1 opacity-90">{v.type === 'shopee' ? 'Shopee' : 'Shop'}</div>
                </div>
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-shopee-orange font-bold text-base">{v.label}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{v.sub}</div>
                      {v.shop && <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1"><Shop size={11} variant="Outline" color="currentColor" /> {v.shop}</div>}
                    </div>
                    <button
                      onClick={() => toggleSave(v.id)}
                      className={`shrink-0 h-8 px-3 text-xs rounded-[2px] border transition ${isSaved ? 'border-gray-300 text-gray-500' : 'border-shopee-orange text-shopee-orange hover:bg-shopee-orange-light'}`}
                    >
                      {isSaved ? 'Đã lưu' : 'Lưu'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
                    <span>Mã: <span className="font-mono text-shopee-orange">{v.code}</span></span>
                    <span>HSD: {v.expiry}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Đơn tối thiểu: ₫{VND(v.min_order)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-sm py-12 text-center text-gray-400 text-sm">
            <TicketDiscount size={40} variant="Linear" color="#c7c7c7" className="mx-auto mb-2" />
            {tab === 'saved' ? 'Bạn chưa lưu voucher nào.' : 'Không có voucher.'}
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/cart" className="inline-flex items-center gap-1 h-9 px-6 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">
            Dùng ngay <TickCircle size={14} variant="Bold" color="#fff" />
          </Link>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
