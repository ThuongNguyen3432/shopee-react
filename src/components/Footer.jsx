import { Link } from 'react-router-dom';
export default function Footer() {
  const pays = ['Visa', 'Mastercard', 'JCB', 'COD', 'ShopeePay'];
  const ships = ['GHN', 'GHTK', 'Viettel Post', 'J&T', 'VNPost'];
  const countries = ['Singapore', 'Indonesia', 'Thái Lan', 'Malaysia', 'Việt Nam', 'Philippines'];
  return (
    <footer className="bg-white mt-5 pt-10 pb-5 text-xs text-gray-600">
      <div className="container px-2">
        <div className="grid grid-cols-5 gap-6 mb-8">
          <div>
            <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">Chăm sóc khách hàng</h4>
            {['Trung tâm trợ giúp', 'Shopee Blog', 'Shopee Mall', 'Hướng dẫn mua hàng', 'Hướng dẫn bán hàng', 'Ví ShopeePay', 'Shopee Xu', 'Trả hàng & Hoàn tiền'].map((t) => (
              <Link key={t} to={t === 'Shopee Mall' ? '/mall' : t === 'Flash Sale' ? '/flash-sale' : '/'} className="block mb-1.5 hover:text-shopee-orange">{t}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">Về Shopee</h4>
            {['Giới thiệu về Shopee', 'Tuyển dụng', 'Điều khoản Shopee', 'Chính sách bảo mật', 'Shopee Mall', 'Kênh Người Bán', 'Flash Sale', 'Liên hệ với chúng tôi'].map((t) => (
              <Link key={t} to={t === 'Shopee Mall' ? '/mall' : t === 'Flash Sale' ? '/flash-sale' : '/'} className="block mb-1.5 hover:text-shopee-orange">{t}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">Thanh toán</h4>
            <div className="flex flex-wrap gap-2">
              {pays.map((p) => <span key={p} className="px-2 py-1 border border-gray-300 rounded text-xs">{p}</span>)}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">Đơn vị vận chuyển</h4>
            <div className="flex flex-wrap gap-2">
              {ships.map((s) => <span key={s} className="px-2 py-1 border border-gray-300 rounded text-xs">{s}</span>)}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">Theo dõi chúng tôi</h4>
            {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((t) => (
              <Link key={t} to="/" className="block mb-1.5 hover:text-shopee-orange">{t}</Link>
            ))}
            <h4 className="text-xs font-bold text-gray-600 mb-2 mt-4 uppercase">Tải ứng dụng Shopee</h4>
            <div className="flex gap-2">
              <img src="https://picsum.photos/seed/qr/80/80" alt="qr" className="w-[70px] h-[70px]" />
              <div className="flex flex-col gap-1">
                <img src="https://picsum.photos/seed/appstore/90/28" alt="appstore" className="w-[90px] h-7" />
                <img src="https://picsum.photos/seed/googleplay/90/28" alt="googleplay" className="w-[90px] h-7" />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-gray-400">
          <div>© 2025 Shopee. Tất cả các quyền được bảo lưu.</div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Quốc gia & Khu vực:</span>
            {countries.map((c) => <Link key={c} to="/" className="text-gray-400 hover:text-shopee-orange">{c}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
