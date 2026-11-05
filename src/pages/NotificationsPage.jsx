import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Notification, TickCircle, Trash, Box, Truck, Ticket, Star1, Heart } from 'iconsax-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'order', label: 'Đơn hàng' },
  { key: 'promo', label: 'Khuyến mãi' },
  { key: 'system', label: 'Hệ thống' },
];

const NOTIFS = [
  { id: 1, type: 'order', title: 'Đơn hàng #SP20260002 đang được vận chuyển', desc: 'Shipper sẽ giao trong 1-2 ngày. Mã vận đơn: VN123456789', time: '2 giờ trước', read: false, icon: Truck },
  { id: 2, type: 'order', title: 'Đơn hàng #SP20260003 đã giao thành công', desc: 'Hãy đánh giá sản phẩm để nhận xu thưởng.', time: '1 ngày trước', read: false, icon: Box },
  { id: 3, type: 'promo', title: 'Voucher giảm 50K dành cho bạn', desc: 'Đơn từ 200K. HSD: 30/11/2026.', time: '2 ngày trước', read: true, icon: Ticket },
  { id: 4, type: 'promo', title: 'Flash Sale 12.12 - Giảm đến 70%', desc: 'Bắt đầu lúc 12:00 hôm nay. Số lượng có hạn!', time: '3 ngày trước', read: true, icon: Star1 },
  { id: 5, type: 'system', title: 'Cập nhật chính sách bảo mật', desc: 'Shopee đã cập nhật điều khoản sử dụng. Vui lòng xem chi tiết.', time: '5 ngày trước', read: true, icon: Notification },
  { id: 6, type: 'promo', title: 'Shop bạn theo dõi vừa đăng sản phẩm mới', desc: 'Minh Anh Shop có 5 sản phẩm mới.', time: '1 tuần trước', read: true, icon: Heart },
];

export default function NotificationsPage() {
  const [tab, setTab] = useState('all');
  const [items, setItems] = useState(NOTIFS);
  const [readAll, setReadAll] = useState(false);

  const filtered = items.filter((n) => tab === 'all' || n.type === tab);
  const unread = items.filter((n) => !n.read).length;

  const markRead = (id) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => { setItems((prev) => prev.map((n) => ({ ...n, read: true }))); setReadAll(true); };
  const remove = (id) => setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[900px]">
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Thông báo</span>
        </div>

        <div className="bg-white rounded-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h1 className="text-base font-medium text-gray-800 flex items-center gap-2">
              <Notification size={18} variant="Bold" color="#ee4d2d" /> Thông báo
              {unread > 0 && <span className="text-xs text-shopee-orange">({unread} chưa đọc)</span>}
            </h1>
            <button onClick={markAllRead} className="text-xs text-shopee-orange hover:underline">Đánh dấu đã đọc tất cả</button>
          </div>

          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 text-sm">
            {TABS.map((t) => {
              const count = t.key === 'all' ? items.length : items.filter((n) => n.type === t.key).length;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 h-10 border-b-2 transition whitespace-nowrap text-sm ${active ? 'border-shopee-orange text-shopee-orange font-medium' : 'border-transparent text-gray-600 hover:text-shopee-orange'}`}
                >
                  {t.label} {count > 0 && <span className="text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>

          <div className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                <Notification size={40} variant="Linear" color="#c7c7c7" className="mx-auto mb-2" />
                Không có thông báo.
              </div>
            ) : filtered.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${n.read ? '' : 'bg-[#fffafa]'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.read ? 'bg-gray-100' : 'bg-shopee-orange-light'}`}>
                    <Icon size={18} variant="Bold" color={n.read ? '#999' : '#ee4d2d'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${n.read ? 'text-gray-700' : 'text-gray-800 font-medium'}`}>{n.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.desc}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{n.time}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-shopee-orange" />}
                    <button onClick={(e) => { e.stopPropagation(); remove(n.id); }} className="text-gray-400 hover:text-shopee-orange">
                      <Trash size={14} variant="Linear" color="currentColor" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
