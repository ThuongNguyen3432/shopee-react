import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Message, Shop, TickCircle, SearchNormal1 } from 'iconsax-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

const CONVS = [
  { id: 1, shop: 'Minh Anh Shop', avatar: 'https://picsum.photos/seed/shop1/48/48', last: 'Dạ sản phẩm vẫn còn hàng sẵn trong kho ạ.', time: '10:04', unread: 2, product: 'Tai nghe Bluetooth 5.3' },
  { id: 2, shop: 'Tech World', avatar: 'https://picsum.photos/seed/shop2/48/48', last: 'Shop freeship toàn quốc cho đơn từ 99k ạ.', time: 'Hôm qua', unread: 0, product: 'Ốp lưng iPhone 15' },
  { id: 3, shop: 'Fashion Hub', avatar: 'https://picsum.photos/seed/shop3/48/48', last: 'Bạn cho shop biết chiều cao/cân nặng nhé!', time: '2 ngày trước', unread: 1, product: 'Áo thun nam cotton' },
  { id: 4, shop: 'Beauty Care', avatar: 'https://picsum.photos/seed/shop4/48/48', last: 'Dạ shop cảm ơn bạn nhiều ạ!', time: '1 tuần trước', unread: 0, product: 'Son môi matte' },
];

export default function MessagesPage() {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(CONVS[0].id);
  const filtered = CONVS.filter((c) => c.shop.toLowerCase().includes(q.toLowerCase()) || c.last.toLowerCase().includes(q.toLowerCase()));
  const activeConv = filtered.find((c) => c.id === active) || filtered[0];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1000px]">
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Tin nhắn</span>
        </div>

        <div className="bg-white rounded-sm grid grid-cols-1 md:grid-cols-[320px_1fr] min-h-[500px] overflow-hidden">
          {/* List */}
          <div className="border-r border-gray-100">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <SearchNormal1 size={14} variant="Linear" color="#888" className="absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm kiếm"
                  aria-label="Tìm kiếm tin nhắn"
                  className="w-full h-8 pl-8 pr-3 border border-gray-200 rounded-[2px] text-sm outline-none focus:border-shopee-orange"
                />
              </div>
            </div>
            <div className="max-h-[460px] overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left border-b border-gray-100 transition ${active === c.id ? 'bg-shopee-orange-light' : 'hover:bg-gray-50'}`}
                >
                  <img src={c.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-medium text-gray-800 truncate">{c.shop}</span>
                      <span className="text-[10px] text-gray-400 shrink-0">{c.time}</span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{c.last}</div>
                    <div className="text-[10px] text-gray-400 truncate">{c.product}</div>
                  </div>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-shopee-orange text-white text-[10px] flex items-center justify-center shrink-0">{c.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Panel */}
          <div className="flex flex-col">
            {activeConv ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <img src={activeConv.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{activeConv.shop}</div>
                    <div className="text-[11px] text-green-600">Đang hoạt động</div>
                  </div>
                  <Link to="/shop/1" className="text-xs text-shopee-orange hover:underline flex items-center gap-1">
                    <Shop size={13} variant="Outline" color="currentColor" /> Xem Shop
                  </Link>
                </div>
                <div className="flex-1 bg-[#f7f7f7] p-4 overflow-y-auto">
                  <div className="flex items-end gap-1.5 justify-start mb-3">
                    <img src={activeConv.avatar} alt="" className="w-6 h-6 rounded-full" />
                    <div className="max-w-[78%] px-3 py-2 text-[13px] bg-white border border-gray-100 rounded-lg rounded-bl-sm">{activeConv.last}</div>
                  </div>
                  <div className="text-xs text-gray-400 text-center mt-4">Mở chat từ trang sản phẩm để tiếp tục trò chuyện.</div>
                </div>
                <div className="p-3 border-t border-gray-100">
                  <Link to="/product/1001" className="inline-flex items-center gap-1 h-9 px-4 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">
                    <Message size={14} variant="Outline" color="#fff" /> Mở chat với shop
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Chọn một cuộc trò chuyện</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
