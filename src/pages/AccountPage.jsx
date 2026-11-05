import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight2, Bag, Box, Calendar, Coin, Heart, Location, Lock, Message, Notification,
  Profile2User, Receipt, Setting2, Shop, Star1, Ticket, Truck, User, Wallet,
} from 'iconsax-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { PRODUCTS } from '../data/products.js';
import { getShopInfo } from '../lib/shop.js';
import Header from '../components/Header.jsx';
import { useSEO } from '../hooks/useSEO.js';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

const VND = (n) => Number(n || 0).toLocaleString('vi-VN');

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ thanh toán' },
  { key: 'shipping', label: 'Vận chuyển' },
  { key: 'shipped', label: 'Chờ giao hàng' },
  { key: 'done', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
  { key: 'return', label: 'Trả hàng/Hoàn tiền' },
];

const STATUS_LABEL = {
  pending: 'Chờ thanh toán',
  shipping: 'Đang vận chuyển',
  shipped: 'Chờ giao hàng',
  done: 'Hoàn thành',
  cancelled: 'Đã hủy',
  return: 'Trả hàng/Hoàn tiền',
};

const STATUS_COLOR = {
  pending: 'text-orange-500',
  shipping: 'text-blue-500',
  shipped: 'text-blue-500',
  done: 'text-green-600',
  cancelled: 'text-gray-500',
  return: 'text-gray-500',
};

function mockOrders() {
  const pick = (i) => PRODUCTS[i % PRODUCTS.length];
  return [
    { id: 1, code: 'SP20260001', status: 'pending', total: 207000, created_at: '2026-11-03T10:00:00Z', items: [{ name: pick(0).name, price: pick(0).price, qty: 1, img: pick(0).image }, { name: pick(1).name, price: pick(1).price, qty: 2, img: pick(1).image }] },
    { id: 2, code: 'SP20260002', status: 'shipping', total: 156000, created_at: '2026-11-02T14:30:00Z', items: [{ name: pick(5).name, price: pick(5).price, qty: 1, img: pick(5).image }] },
    { id: 3, code: 'SP20260003', status: 'done', total: 89000, created_at: '2026-10-28T09:15:00Z', items: [{ name: pick(10).name, price: pick(10).price, qty: 1, img: pick(10).image }] },
    { id: 4, code: 'SP20260004', status: 'cancelled', total: 45000, created_at: '2026-10-25T16:45:00Z', items: [{ name: pick(15).name, price: pick(15).price, qty: 1, img: pick(15).image }] },
    { id: 5, code: 'SP20260005', status: 'shipped', total: 312000, created_at: '2026-11-04T08:20:00Z', items: [{ name: pick(20).name, price: pick(20).price, qty: 2, img: pick(20).image }, { name: pick(22).name, price: pick(22).price, qty: 1, img: pick(22).image }] },
  ];
}

const MENU = [
  { key: 'profile', label: 'Hồ sơ của tôi', icon: User },
  { key: 'address', label: 'Địa chỉ', icon: Location },
  { key: 'orders', label: 'Đơn mua', icon: Receipt },
  { key: 'password', label: 'Đổi mật khẩu', icon: Lock },
  { key: 'notification', label: 'Thông báo', icon: Notification },
  { key: 'voucher', label: 'Kho Voucher', icon: Ticket },
  { key: 'coins', label: 'Shopee Xu', icon: Coin },
];

export default function AccountPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const tab = params.get('tab') || 'profile';
  useSEO({ title: 'Tài khoản của tôi', description: 'Quản lý tài khoản, đơn hàng, địa chỉ tại Shopee.', url: '/account', noindex: true });
  const orderStatus = params.get('status') || 'all';

  const setTab = (key) => {
    const next = new URLSearchParams(params);
    next.set('tab', key);
    if (key !== 'orders') next.delete('status');
    setParams(next, { replace: true });
  };
  const setStatus = (key) => {
    const next = new URLSearchParams(params);
    next.set('tab', 'orders');
    next.set('status', key);
    setParams(next, { replace: true });
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isSupabaseConfigured) {
        if (mounted) { setOrders(mockOrders()); setLoading(false); }
        return;
      }
      try {
        const { data: ord, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (error || !ord || ord.length === 0) {
          if (mounted) { setOrders(mockOrders()); setLoading(false); }
          return;
        }
        const ids = ord.map((o) => o.id);
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', ids);
        const byOrder = new Map();
        (items || []).forEach((it) => {
          if (!byOrder.has(it.order_id)) byOrder.set(it.order_id, []);
          byOrder.get(it.order_id).push(it);
        });
        const mapped = ord.map((o) => ({
          id: o.id,
          code: o.code,
          status: o.status || 'pending',
          total: Number(o.total) || 0,
          created_at: o.created_at,
          items: (byOrder.get(o.id) || []).map((it) => ({
            name: it.name,
            price: Number(it.price) || 0,
            qty: Number(it.qty) || 1,
            img: PRODUCTS.find((p) => p.id === it.product_id)?.image || `https://picsum.photos/seed/p${it.product_id}/80/80`,
          })),
        }));
        // ensure items non-empty
        mapped.forEach((o) => { if (!o.items.length) o.items = mockOrders()[0].items; });
        if (mounted) { setOrders(mapped); setLoading(false); }
      } catch (e) {
        if (mounted) { setOrders(mockOrders()); setLoading(false); }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredOrders = useMemo(() => {
    if (orderStatus === 'all') return orders;
    return orders.filter((o) => o.status === orderStatus);
  }, [orders, orderStatus]);

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Người dùng';
  const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ee4d2d&color=fff`;
  const email = user?.email || 'guest@shopee.vn';

  const addresses = [
    { id: 1, name: displayName, phone: '0912 345 678', line: '123 Nguyễn Trãi, Phường 2, Quận 5', city: 'TP. Hồ Chí Minh', isDefault: true },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Tài khoản của tôi</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-3">
          {/* Sidebar */}
          <aside className="bg-white rounded-sm h-fit">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              <img src={avatar} alt="" className="w-12 h-12 rounded-full border border-gray-200 object-cover" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{displayName}</div>
                <Link to="/account?tab=profile" className="text-xs text-gray-500 hover:text-shopee-orange">Sửa hồ sơ</Link>
              </div>
            </div>
            <nav className="py-2">
              {MENU.map((m) => {
                const Icon = m.icon;
                const active = tab === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setTab(m.key)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition ${active ? 'text-shopee-orange bg-shopee-orange-light font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Icon size={18} variant={active ? 'Bold' : 'Outline'} color={active ? '#ee4d2d' : '#555'} />
                    {m.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main */}
          <main className="min-w-0">
            {tab === 'profile' && (
              <div className="bg-white rounded-sm p-4 md:p-6">
                <h2 className="text-base font-medium text-gray-800 mb-4">Hồ sơ của tôi</h2>
                <div className="flex items-center gap-4 mb-6">
                  <img src={avatar} alt="" className="w-20 h-20 rounded-full border border-gray-200 object-cover" />
                  <button className="h-8 px-4 border border-gray-300 text-sm text-gray-700 rounded-[2px] hover:border-shopee-orange hover:text-shopee-orange">Chọn ảnh</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label htmlFor="acc-username" className="text-gray-500 block mb-1">Tên đăng nhập</label>
                    <input id="acc-username" name="username" autoComplete="username" value={displayName} readOnly className="w-full border border-gray-200 rounded-[2px] px-3 py-2 bg-gray-50 text-gray-700" />
                  </div>
                  <div>
                    <label htmlFor="acc-name" className="text-gray-500 block mb-1">Tên</label>
                    <input id="acc-name" name="name" autoComplete="name" defaultValue={displayName} className="w-full border border-gray-200 rounded-[2px] px-3 py-2 outline-none focus:border-shopee-orange" />
                  </div>
                  <div>
                    <label htmlFor="acc-email" className="text-gray-500 block mb-1">Email</label>
                    <input id="acc-email" name="email" autoComplete="email" value={email} readOnly className="w-full border border-gray-200 rounded-[2px] px-3 py-2 bg-gray-50 text-gray-700" />
                  </div>
                  <div>
                    <label htmlFor="acc-phone" className="text-gray-500 block mb-1">Số điện thoại</label>
                    <input id="acc-phone" name="phone" autoComplete="tel" placeholder="Chưa cập nhật" className="w-full border border-gray-200 rounded-[2px] px-3 py-2 outline-none focus:border-shopee-orange" />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Giới tính</label>
                    <div className="flex gap-4 items-center h-[38px]" role="group" aria-label="Giới tính">
                      {['Nam', 'Nữ', 'Khác'].map((g) => (
                        <label key={g} htmlFor={`gender-${g}`} className="flex items-center gap-1.5 text-gray-700 cursor-pointer">
                          <input id={`gender-${g}`} type="radio" name="gender" aria-label={g} defaultChecked={g === 'Nam'} className="accent-shopee-orange" /> {g}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="acc-birth" className="text-gray-500 block mb-1">Ngày sinh</label>
                    <input id="acc-birth" name="birth" type="date" className="w-full border border-gray-200 rounded-[2px] px-3 py-2 outline-none focus:border-shopee-orange" />
                  </div>
                </div>
                <button className="mt-6 h-9 px-8 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">Lưu</button>
              </div>
            )}

            {tab === 'address' && (
              <div className="bg-white rounded-sm p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-medium text-gray-800">Địa chỉ của tôi</h2>
                  <button className="h-8 px-4 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">+ Thêm địa chỉ mới</button>
                </div>
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <div key={a.id} className="border border-gray-200 rounded-[2px] p-4 text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800">{a.name}</span>
                        <span className="text-gray-500">{a.phone}</span>
                        {a.isDefault && <span className="text-[10px] text-shopee-orange border border-shopee-orange px-1 py-px rounded-[2px]">Mặc định</span>}
                      </div>
                      <div className="text-gray-600 mt-1">{a.line}</div>
                      <div className="text-gray-600">{a.city}</div>
                      <div className="flex gap-3 mt-2 text-xs">
                        <button className="text-shopee-orange hover:underline">Cập nhật</button>
                        <button className="text-gray-500 hover:text-shopee-orange">Xóa</button>
                        {!a.isDefault && <button className="text-shopee-orange hover:underline">Đặt làm mặc định</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'password' && (
              <div className="bg-white rounded-sm p-4 md:p-6">
                <h2 className="text-base font-medium text-gray-800 mb-4">Đổi mật khẩu</h2>
                <div className="max-w-md space-y-3 text-sm">
                  <div>
                    <label htmlFor="acc-pw-current" className="text-gray-500 block mb-1">Mật khẩu hiện tại</label>
                    <input id="acc-pw-current" name="current" autoComplete="current-password" type="password" className="w-full border border-gray-200 rounded-[2px] px-3 py-2 outline-none focus:border-shopee-orange" />
                  </div>
                  <div>
                    <label htmlFor="acc-pw-new" className="text-gray-500 block mb-1">Mật khẩu mới</label>
                    <input id="acc-pw-new" name="new" autoComplete="new-password" type="password" className="w-full border border-gray-200 rounded-[2px] px-3 py-2 outline-none focus:border-shopee-orange" />
                  </div>
                  <div>
                    <label htmlFor="acc-pw-confirm" className="text-gray-500 block mb-1">Xác nhận mật khẩu mới</label>
                    <input id="acc-pw-confirm" name="confirm" autoComplete="new-password" type="password" className="w-full border border-gray-200 rounded-[2px] px-3 py-2 outline-none focus:border-shopee-orange" />
                  </div>
                  <button className="h-9 px-8 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">Xác nhận</button>
                </div>
              </div>
            )}

            {tab === 'notification' && (
              <div className="bg-white rounded-sm p-4 md:p-6">
                <h2 className="text-base font-medium text-gray-800 mb-4">Thông báo</h2>
                <div className="space-y-3 text-sm">
                  {['Cập nhật đơn hàng', 'Khuyến mãi', 'Hoạt động tài khoản', 'Tin nhắn từ shop'].map((t) => (
                    <div key={t} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700">{t}</span>
                      <button className="w-10 h-5 rounded-full bg-shopee-orange relative"><span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'voucher' && (
              <div className="bg-white rounded-sm p-4 md:p-6">
                <h2 className="text-base font-medium text-gray-800 mb-4">Kho Voucher</h2>
                <div className="text-center py-10 text-gray-400 text-sm">
                  <Ticket size={40} variant="Linear" color="#c7c7c7" className="mx-auto mb-2" />
                  Bạn chưa có voucher nào. <Link to="/vouchers" className="text-shopee-orange hover:underline">Săn voucher ngay</Link>
                </div>
              </div>
            )}

            {tab === 'coins' && (
              <div className="bg-white rounded-sm p-4 md:p-6">
                <h2 className="text-base font-medium text-gray-800 mb-4">Shopee Xu</h2>
                <div className="bg-gradient-to-b from-[#f53d2d] to-[#f63] text-white rounded-sm p-4 mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs opacity-90">Số dư Shopee Xu</div>
                    <div className="text-2xl font-medium mt-1">120 Xu</div>
                  </div>
                  <Coin size={40} variant="Bold" color="#fff" className="opacity-80" />
                </div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Lịch sử giao dịch</h3>
                <div className="divide-y divide-gray-100">
                  {[
                    { type: '+', amount: 50, desc: 'Đánh giá sản phẩm #SP20260003', date: '28/10/2026' },
                    { type: '+', amount: 30, desc: 'Đăng nhập hàng ngày', date: '27/10/2026' },
                    { type: '-', amount: 20, desc: 'Dùng Xu thanh toán đơn #SP20260001', date: '25/10/2026' },
                    { type: '+', amount: 60, desc: 'Hoàn tiền Xu từ đơn #SP20260004', date: '20/10/2026' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                      <div className="min-w-0">
                        <div className="text-gray-800 truncate">{t.desc}</div>
                        <div className="text-[11px] text-gray-400">{t.date}</div>
                      </div>
                      <span className={`font-medium shrink-0 ${t.type === '+' ? 'text-green-600' : 'text-red-500'}`}>
                        {t.type}{t.amount} Xu
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div className="bg-white rounded-sm">
                {/* Status tabs */}
                <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 text-sm">
                  {STATUS_TABS.map((s) => {
                    const count = s.key === 'all' ? orders.length : orders.filter((o) => o.status === s.key).length;
                    const active = orderStatus === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setStatus(s.key)}
                        className={`px-3 md:px-4 h-11 border-b-2 transition whitespace-nowrap text-xs md:text-sm ${active ? 'border-shopee-orange text-shopee-orange font-medium' : 'border-transparent text-gray-600 hover:text-shopee-orange'}`}
                      >
                        {s.label} {count > 0 && <span className="text-[10px]">({count})</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 md:p-4">
                  {loading ? (
                    <div className="text-center py-10 text-gray-400 text-sm">Đang tải đơn hàng...</div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Box size={48} variant="Linear" color="#c7c7c7" className="mx-auto mb-3" />
                      <div className="text-gray-500 text-sm">Chưa có đơn hàng</div>
                      <button onClick={() => navigate('/')} className="mt-3 h-8 px-6 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">Mua sắm ngay</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredOrders.map((o) => {
                        const open = expanded[o.id];
                        return (
                          <div key={o.id} className="border border-gray-200 rounded-[2px]">
                            <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#fffafa] border-b border-gray-100 text-xs md:text-sm flex-wrap">
                              <div className="flex items-center gap-2 min-w-0">
                                <Shop size={14} variant="Outline" color="#555" />
                                <span className="text-gray-700 font-medium truncate">Shopee</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500">Mã: {o.code}</span>
                              </div>
                              <span className={`font-medium ${STATUS_COLOR[o.status] || 'text-gray-600'}`}>{STATUS_LABEL[o.status] || o.status}</span>
                            </div>

                            <div className="divide-y divide-gray-100">
                              {(open ? o.items : o.items.slice(0, 2)).map((it, idx) => (
                                <div key={idx} className="flex gap-3 px-3 py-3">
                                  <img src={it.img} alt={it.name} className="w-16 h-16 object-cover border border-gray-100 rounded-[2px] shrink-0" loading="lazy" />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm text-gray-800 line-clamp-2">{it.name}</div>
                                    <div className="text-[11px] text-gray-500 mt-0.5">x{it.qty}</div>
                                  </div>
                                  <div className="text-sm text-shopee-orange font-medium shrink-0">₫{VND(it.price * it.qty)}</div>
                                </div>
                              ))}
                            </div>

                            {o.items.length > 2 && (
                              <button
                                onClick={() => setExpanded((p) => ({ ...p, [o.id]: !open }))}
                                className="w-full text-xs text-gray-500 hover:text-shopee-orange py-1.5 border-t border-gray-100"
                              >
                                {open ? 'Thu gọn' : `Xem thêm ${o.items.length - 2} sản phẩm`}
                              </button>
                            )}

                            <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-t border-gray-100 flex-wrap">
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar size={12} variant="Linear" color="currentColor" />
                                {new Date(o.created_at).toLocaleDateString('vi-VN')}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-gray-600">Tổng:</span>
                                <span className="text-shopee-orange text-base font-medium">₫{VND(o.total)}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-gray-100 flex-wrap">
                              <button className="h-8 px-4 border border-gray-300 text-xs text-gray-700 rounded-[2px] hover:border-shopee-orange hover:text-shopee-orange">Liên hệ người bán</button>
                              <Link to={`/order/${o.code}`} className="h-8 px-4 border border-gray-300 text-xs text-gray-700 rounded-[2px] hover:border-shopee-orange hover:text-shopee-orange inline-flex items-center">Chi tiết</Link>
                              {o.status === 'done' && <button className="h-8 px-4 border border-shopee-orange text-xs text-shopee-orange rounded-[2px] hover:bg-shopee-orange-light flex items-center gap-1"><Star1 size={12} variant="Bold" color="currentColor" /> Đánh giá</button>}
                              <button className="h-8 px-4 bg-shopee-orange text-white text-xs rounded-[2px] hover:bg-shopee-red">Mua lại</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
