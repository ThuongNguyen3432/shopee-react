import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowDown2, Clock, DiscountShape, Location, Message, Shop,
  Star1, TickCircle, Truck, Verify,
} from 'iconsax-react';
import { PRODUCTS } from '../data/products.js';
import { getShopById, shopIndexOf } from '../lib/shop.js';
import ProductCard from '../components/ProductCard.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import ChatBox from '../components/ChatBox.jsx';

const VND = (n) => Number(n || 0).toLocaleString('vi-VN');

const SORTS = [
  { value: 'popular', label: 'Phổ biến' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'sold', label: 'Bán chạy' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
];

const REVIEWS = [
  { name: 'ng*****3', rating: 5, date: '2025-10-28 14:32', variant: 'Phân loại: Mặc định', likes: 24, avatar: 'https://i.pravatar.cc/64?img=12', verified: true, text: 'Shop đóng gói rất kỹ, hàng đúng mô tả. Nhắn tin shop trả lời nhanh, tư vấn nhiệt tình. Sẽ quay lại mua tiếp.' },
  { name: 'tr*****8', rating: 5, date: '2025-10-21 09:05', variant: 'Phân loại: Cao cấp', likes: 11, avatar: 'https://i.pravatar.cc/64?img=32', verified: true, text: 'Giao nhanh hơn dự kiến, chất lượng tốt trong tầm giá. 5 sao cho shop.' },
  { name: 'ha*****1', rating: 4, date: '2025-10-02 20:47', variant: 'Phân loại: Mặc định', likes: 3, avatar: 'https://i.pravatar.cc/64?img=45', verified: true, text: 'Hàng ổn, mẫu mã xinh. Trừ 1 sao vì shipper giao hơi trễ so với dự kiến.' },
  { name: 'qu*****7', rating: 5, date: '2025-09-19 11:20', variant: 'Phân loại: Cao cấp', likes: 8, avatar: 'https://i.pravatar.cc/64?img=15', verified: true, text: 'Mua lần thứ 3 rồi, lần nào cũng ưng ý. Shop có tặng kèm một món nhỏ, dễ thương.' },
  { name: 'ly*****9', rating: 4, date: '2025-09-08 16:02', variant: 'Phân loại: Mặc định', likes: 2, avatar: 'https://i.pravatar.cc/64?img=23', verified: true, text: 'Sản phẩm giống hình, giá hợp lý. Sẽ ủng hộ shop lần sau.' },
];

const VOUCHERS = ['Giảm ₫20k', 'Giảm ₫50k', 'Freeship 30k', 'Giảm 10%'];

function Stars({ value = 5, size = 13 }) {
  const full = Math.round(Number(value) || 0);
  return (
    <span className="inline-flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star1
          key={i}
          size={size}
          variant={i <= full ? 'Bold' : 'Linear'}
          color={i <= full ? '#ee4d2d' : '#d9d9d9'}
        />
      ))}
    </span>
  );
}

function soldNumber(value) {
  const raw = String(value ?? '');
  if (/k$/i.test(raw)) return parseFloat(raw) * 1000;
  if (/tr$/i.test(raw)) return parseFloat(raw) * 1000000;
  return Number(raw.replace(/\D/g, '')) || 0;
}

export default function ShopPage() {
  const { shopId } = useParams();
  const [params] = useSearchParams();
  const shop = getShopById(shopId, {
    location: params.get('location') || undefined,
    mall: params.get('mall') === '1',
  });

  const [tab, setTab] = useState('products');
  const [sort, setSort] = useState('popular');
  const [visible, setVisible] = useState(30);
  const [followed, setFollowed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const shopProducts = useMemo(() => {
    const list = PRODUCTS.filter((p) => shopIndexOf(p) === shop.id);
    const sorted = [...list];
    switch (sort) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'sold': sorted.sort((a, b) => soldNumber(b.sold) - soldNumber(a.sold)); break;
      case 'newest': sorted.sort((a, b) => b.id - a.id); break;
      default: sorted.sort((a, b) => (b.sold_raw || soldNumber(b.sold)) - (a.sold_raw || soldNumber(a.sold)));
    }
    return sorted;
  }, [shop.id, sort]);

  const shown = shopProducts.slice(0, visible);
  const chatProduct = shopProducts[0];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-shopee-orange">Shopee</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700 truncate max-w-full">{shop.name}</span>
        </div>

        {/* Banner */}
        <div className="bg-white rounded-sm overflow-hidden">
          <img src={shop.banner} alt={`Banner ${shop.name}`} className="w-full h-[120px] md:h-[180px] object-cover" />
          <div className="px-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 -mt-8 sm:-mt-10">
              <img
                src={shop.avatar}
                alt={shop.name}
                className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full object-cover border-4 border-white bg-white shrink-0"
              />
              <div className="min-w-0 flex-1 sm:pt-8">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-base md:text-lg font-medium text-gray-800 truncate">{shop.name}</h1>
                  {shop.mall && (
                    <span className="bg-shopee-orange text-white text-[9px] font-bold px-1 py-px rounded-[2px]">Mall</span>
                  )}
                  <span className="flex items-center gap-0.5 text-[10px] text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online {shop.online}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1"><Location size={13} variant="Linear" color="currentColor" /> {shop.location}</span>
                  <span className="flex items-center gap-1"><Star1 size={13} variant="Bold" color="#f5c518" /> {shop.rating} ({shop.ratingCount.toLocaleString('vi-VN')} đánh giá)</span>
                  <span>{shop.followers.toLocaleString('vi-VN')} người theo dõi</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 sm:pt-8">
                <button
                  onClick={() => setChatOpen(true)}
                  className="h-9 px-4 border border-shopee-orange text-shopee-orange bg-shopee-orange-light text-sm flex items-center justify-center gap-1.5 rounded-[2px] hover:bg-[#ffe8e1] transition"
                >
                  <Message size={15} variant="Outline" color="currentColor" /> Chat Ngay
                </button>
                <button
                  onClick={() => setFollowed((v) => !v)}
                  className={`h-9 px-4 text-sm flex items-center justify-center gap-1.5 rounded-[2px] transition ${followed
                    ? 'bg-gray-100 text-gray-600 border border-gray-200'
                    : 'bg-shopee-orange text-white hover:bg-shopee-red'}`}
                >
                  {followed ? <><TickCircle size={15} variant="Bold" color="currentColor" /> Đang Theo Dõi</> : <><Shop size={15} variant="Outline" color="currentColor" /> Theo Dõi</>}
                </button>
              </div>
            </div>

            {/* Shop stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-xs">
              {[
                ['Sản phẩm', shop.products.toLocaleString('vi-VN')],
                ['Đánh giá', shop.ratingCount.toLocaleString('vi-VN')],
                ['Tỉ lệ phản hồi', shop.responseRate],
                ['Tham gia', shop.joined],
              ].map(([k, v]) => (
                <div key={k} className="border border-gray-100 rounded-[2px] px-2.5 py-2 flex items-center justify-between gap-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="text-gray-800 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vouchers */}
        <div className="bg-white rounded-sm mt-3 px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600 flex items-center gap-1.5 shrink-0">
            <DiscountShape size={16} variant="Bold" color="#ee4d2d" /> Mã giảm giá của Shop
          </span>
          {VOUCHERS.map((v) => (
            <span key={v} className="border border-dashed border-[#f6b6a8] bg-shopee-orange-light text-shopee-orange text-xs px-2 py-1 rounded-[2px]">
              {v}
            </span>
          ))}
          <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
            <Truck size={14} variant="Bold" color="#00bfa5" /> Freeship toàn quốc
          </span>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-sm mt-3">
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 text-sm">
            {[
              ['products', `Sản phẩm (${shopProducts.length})`],
              ['reviews', `Đánh giá (${shop.ratingCount.toLocaleString('vi-VN')})`],
              ['info', 'Thông tin shop'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 md:px-6 h-11 border-b-2 transition whitespace-nowrap ${tab === key
                  ? 'border-shopee-orange text-shopee-orange font-medium'
                  : 'border-transparent text-gray-600 hover:text-shopee-orange'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'products' && (
            <div className="p-3">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <span className="text-xs text-gray-500">{shopProducts.length} sản phẩm</span>
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  Sắp xếp theo
                  <span className="relative">
                    <select
                      value={sort}
                      onChange={(e) => { setSort(e.target.value); setVisible(30); }}
                      aria-label="Sắp xếp sản phẩm"
                      className="appearance-none border border-gray-200 rounded-[2px] pl-2 pr-6 py-1.5 text-xs text-gray-800 outline-none focus:border-shopee-orange bg-white"
                    >
                      {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <ArrowDown2 size={11} variant="Linear" color="#555" className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-6 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
                {shown.map((p, i) => (
                  <ProductCard key={p.id} product={{ ...p, shop_name: shop.name }} index={i} />
                ))}
              </div>

              {visible < shopProducts.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setVisible((v) => Math.min(v + 30, shopProducts.length))}
                    className="px-8 h-9 border border-gray-300 text-gray-600 text-sm hover:border-shopee-orange hover:text-shopee-orange rounded-[2px]"
                  >
                    Xem thêm ({shopProducts.length - visible} sản phẩm)
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6">
              <div>
                <div className="flex items-baseline text-shopee-orange">
                  <span className="text-3xl font-medium">{shop.rating}</span>
                  <span className="text-sm text-gray-700 ml-1.5">trên 5</span>
                </div>
                <div className="mt-2"><Stars value={shop.rating} size={18} /></div>
                <div className="text-xs text-gray-500 mt-1">{shop.ratingCount.toLocaleString('vi-VN')} đánh giá</div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {[['Tất cả', shop.ratingCount], ['5 Sao', Math.round(shop.ratingCount * 0.82)], ['4 Sao', Math.round(shop.ratingCount * 0.12)], ['3 Sao', Math.round(shop.ratingCount * 0.04)]].map(([label, count]) => (
                    <div key={label} className="border border-gray-200 rounded-[2px] px-2 py-2 text-xs text-center text-gray-600">
                      {label} ({count.toLocaleString('vi-VN')})
                    </div>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {REVIEWS.map((r) => (
                  <div key={r.name} className="py-4 first:pt-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" loading="lazy" />
                      <span className="text-sm text-gray-800">{r.name}</span>
                      <Stars value={r.rating} size={11} />
                      {r.verified && (
                        <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                          <Verify size={11} variant="Bold" color="currentColor" /> Đã mua hàng
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">{r.date} | {r.variant}</div>
                    <p className="text-sm text-gray-700 leading-6 mt-2">{r.text}</p>
                    <div className="text-xs text-gray-500 mt-2">Hữu ích ({r.likes})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'info' && (
            <div className="p-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 max-w-3xl">
                {[
                  ['Tên shop', shop.name],
                  ['Người tham gia', shop.joined],
                  ['Sản phẩm', `${shop.products.toLocaleString('vi-VN')} sản phẩm`],
                  ['Đánh giá', `${shop.rating} / 5 (${shop.ratingCount.toLocaleString('vi-VN')} đánh giá)`],
                  ['Tỉ lệ phản hồi', shop.responseRate],
                  ['Thời gian phản hồi', shop.responseTime],
                  ['Địa chỉ', shop.location],
                  ['Thời gian chuẩn bị hàng', shop.shipTime],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[150px_minmax(0,1fr)] gap-2 border-b border-gray-50 pb-2">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 mt-6 text-xs text-gray-500 bg-[#fafafa] p-3 rounded-[2px]">
                <Clock size={15} variant="Linear" color="#888" className="shrink-0 mt-px" />
                Shop thường phản hồi trong {shop.responseTime}. Thời gian giao hàng dự kiến {shop.shipTime} sau khi shop gửi hàng.
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <BackToTop />

      <ChatBox open={chatOpen} onClose={() => setChatOpen(false)} shop={shop} product={chatProduct} />
    </div>
  );
}
