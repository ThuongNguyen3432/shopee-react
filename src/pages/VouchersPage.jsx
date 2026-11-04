import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import { store } from '../admin/store.js';

export default function VouchersPage() {
  const vouchers = store.get('vouchers');
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        <h1 className="text-lg font-bold text-gray-800 mb-3">Kho Voucher</h1>
        <div className="grid grid-cols-3 gap-3 max-[700px]:grid-cols-1">
          {vouchers.map((v) => (
            <div key={v.id} className="bg-white rounded-sm border border-dashed border-shopee-orange p-4">
              <div className="text-shopee-orange font-bold text-lg">{v.label}</div>
              <div className="text-gray-500 text-xs mt-1">{v.sub}</div>
              <div className="text-xs text-gray-400 mt-2">Mã: <span className="font-mono text-shopee-orange">{v.code}</span></div>
              <div className="text-xs text-gray-400">Đơn tối thiểu: {Number(v.min_order).toLocaleString('vi-VN')}₫</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}