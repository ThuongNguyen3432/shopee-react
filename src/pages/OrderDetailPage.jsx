import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft2, Box, Calendar, Location, Message, Receipt, Shop, Star1, TickCircle, Truck, Wallet,
} from 'iconsax-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { PRODUCTS } from '../data/products.js';

const VND = (n) => Number(n || 0).toLocaleString('vi-VN');

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

const STEPS = [
  { key: 'placed', label: 'Đã đặt hàng', desc: 'Đơn hàng đã được tạo' },
  { key: 'confirmed', label: 'Đã xác nhận', desc: 'Shop đã xác nhận đơn' },
  { key: 'shipping', label: 'Đang vận chuyển', desc: 'Đơn hàng đang trên đường' },
  { key: 'delivered', label: 'Đã giao hàng', desc: 'Shipper đã giao hàng' },
  { key: 'done', label: 'Hoàn thành', desc: 'Đơn hàng hoàn tất' },
];

function stepIndex(status) {
  switch (status) {
    case 'pending': return 0;
    case 'shipping': return 2;
    case 'shipped': return 3;
    case 'done': return 4;
    case 'cancelled': return -1;
    case 'return': return 4;
    default: return 0;
  }
}

function mockOrder(code) {
  return {
    id: 1,
    code,
    status: 'shipping',
    total: 207000,
    shipping_fee: 0,
    discount: 10000,
    created_at: '2026-11-03T10:00:00Z',
    customer_name: 'Nguyễn Văn A',
    customer_phone: '0912 345 678',
    address: '123 Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh',
    payment: 'COD',
    tracking: 'VN123456789',
    carrier: 'Giao Hàng Nhanh',
    items: [
      { name: 'Tai nghe Bluetooth 5.3 không dây', price: 49000, qty: 1, img: 'https://picsum.photos/seed/fp1/80/80' },
      { name: 'Áo thun nam cotton basic form rộng', price: 79000, qty: 2, img: 'https://picsum.photos/seed/fp2/80/80' },
    ],
  };
}

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { code } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isSupabaseConfigured) {
        if (mounted) { setOrder(mockOrder(code)); setLoading(false); }
        return;
      }
      try {
        const { data: ord } = await supabase.from('orders').select('*').eq('code', code).maybeSingle();
        if (!ord) {
          if (mounted) { setOrder(mockOrder(code)); setLoading(false); }
          return;
        }
        const { data: items } = await supabase.from('order_items').select('*').eq('order_id', ord.id);
        const mapped = {
          id: ord.id,
          code: ord.code,
          status: ord.status || 'pending',
          total: Number(ord.total) || 0,
          shipping_fee: 0,
          discount: 0,
          created_at: ord.created_at,
          customer_name: ord.customer_name,
          customer_phone: ord.customer_phone,
          address: ord.address,
          payment: 'COD',
          tracking: 'VN' + String(ord.id).padStart(9, '0'),
          carrier: 'Giao Hàng Nhanh',
          items: (items || []).map((it) => ({
            name: it.name,
            price: Number(it.price) || 0,
            qty: Number(it.qty) || 1,
            img: PRODUCTS.find((p) => p.id === it.product_id)?.image || `https://picsum.photos/seed/p${it.product_id}/80/80`,
          })),
        };
        if (!mapped.items.length) mapped.items = mockOrder(code).items;
        if (mounted) { setOrder(mapped); setLoading(false); }
      } catch (e) {
        if (mounted) { setOrder(mockOrder(code)); setLoading(false); }
      }
    })();
    return () => { mounted = false; };
  }, [code]);

  const currentStep = order ? stepIndex(order.status) : 0;
  const isCancelled = order?.status === 'cancelled';
  const isReturn = order?.status === 'return';

  const subtotal = order ? order.items.reduce((s, i) => s + i.price * i.qty, 0) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <div className="container mx-auto px-2 py-10 max-w-[900px] text-center text-gray-400 text-sm">Đang tải đơn hàng...</div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <div className="container mx-auto px-2 py-10 max-w-[900px] text-center">
          <div className="text-gray-500 text-sm">Không tìm thấy đơn hàng.</div>
          <Link to="/account?tab=orders" className="mt-3 inline-block text-shopee-orange hover:underline text-sm">Quay lại đơn mua</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1000px]">
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <Link to="/account?tab=orders" className="hover:text-shopee-orange">Đơn mua</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">{order.code}</span>
        </div>

        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h1 className="text-lg md:text-xl text-gray-800">Chi tiết đơn hàng</h1>
          <span className={`text-sm font-medium ${STATUS_COLOR[order.status] || 'text-gray-600'}`}>{STATUS_LABEL[order.status] || order.status}</span>
        </div>

        {/* Tracking timeline */}
        {!isCancelled && !isReturn && (
          <div className="bg-white rounded-sm p-4 md:p-6 mb-3">
            <h2 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Truck size={18} variant="Bold" color="#00bfa5" /> Theo dõi vận chuyển
            </h2>
            <div className="relative rounded-sm overflow-hidden mb-4 border border-gray-100" style={{ aspectRatio: '16/7' }}>
              <img src="https://picsum.photos/seed/maptrack/800/350" alt="Bản đồ" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <Truck size={20} variant="Bold" color="#ee4d2d" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-white/90 text-[11px] text-gray-700 px-2 py-1 rounded-sm shadow">
                {order.carrier} · {order.tracking}
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />
              {STEPS.map((step, idx) => {
                const done = idx <= currentStep;
                const active = idx === currentStep;
                return (
                  <div key={step.key} className="relative flex gap-3 pb-4 last:pb-0">
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-shopee-orange text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {done ? <TickCircle size={14} variant="Bold" color="#fff" /> : <span className="w-2 h-2 rounded-full bg-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${active ? 'text-shopee-orange' : done ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</div>
                      <div className="text-xs text-gray-500">{step.desc}</div>
                      {active && (
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Calendar size={11} variant="Linear" color="currentColor" />
                          {new Date(order.created_at).toLocaleString('vi-VN')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 flex flex-wrap gap-3">
              <span>Đơn vị vận chuyển: <span className="text-gray-800">{order.carrier}</span></span>
              <span>Mã vận đơn: <span className="font-mono text-shopee-orange">{order.tracking}</span></span>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-white rounded-sm p-4 mb-3 text-center">
            <div className="text-gray-500 text-sm">Đơn hàng đã bị hủy.</div>
          </div>
        )}
        {isReturn && (
          <div className="bg-white rounded-sm p-4 mb-3 text-center">
            <div className="text-gray-500 text-sm">Đơn hàng đang xử lý trả hàng/hoàn tiền.</div>
          </div>
        )}

        {/* Address */}
        <div className="bg-white rounded-sm p-4 mb-3">
          <h2 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Location size={16} variant="Bold" color="#ee4d2d" /> Địa chỉ nhận hàng
          </h2>
          <div className="text-sm text-gray-800 font-medium">{order.customer_name} ({order.customer_phone})</div>
          <div className="text-sm text-gray-600 mt-1">{order.address}</div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-sm mb-3">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <Shop size={16} variant="Outline" color="#555" />
            <span className="text-sm font-medium text-gray-800">Shopee</span>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex gap-3 px-4 py-3">
                <img src={it.img} alt={it.name} className="w-16 h-16 object-cover border border-gray-100 rounded-[2px] shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800 line-clamp-2">{it.name}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">x{it.qty}</div>
                </div>
                <div className="text-sm text-shopee-orange font-medium shrink-0">₫{VND(it.price * it.qty)}</div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-100 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tổng tiền hàng</span>
              <span>₫{VND(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển</span>
              <span>₫{VND(order.shipping_fee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Voucher giảm giá</span>
                <span className="text-shopee-orange">-₫{VND(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-1.5 border-t border-gray-100">
              <span className="text-gray-700 font-medium">Tổng thanh toán</span>
              <span className="text-shopee-orange text-lg font-medium">₫{VND(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment & meta */}
        <div className="bg-white rounded-sm p-4 mb-3 text-sm">
          <div className="flex justify-between text-gray-600 mb-1.5">
            <span>Phương thức thanh toán</span>
            <span className="text-gray-800">{order.payment}</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-1.5">
            <span>Mã đơn hàng</span>
            <span className="font-mono text-shopee-orange">{order.code}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Thời gian đặt hàng</span>
            <span className="text-gray-800">{new Date(order.created_at).toLocaleString('vi-VN')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 flex-wrap">
          <button onClick={() => navigate('/account?tab=orders')} className="h-9 px-4 border border-gray-300 text-sm text-gray-700 rounded-[2px] hover:border-shopee-orange hover:text-shopee-orange">Quay lại</button>
          <button className="h-9 px-4 border border-gray-300 text-sm text-gray-700 rounded-[2px] hover:border-shopee-orange hover:text-shopee-orange flex items-center gap-1">
            <Message size={14} variant="Outline" color="currentColor" /> Liên hệ người bán
          </button>
          {order.status === 'pending' && (
            <button className="h-9 px-4 border border-gray-300 text-sm text-gray-700 rounded-[2px] hover:border-red-400 hover:text-red-500">Hủy đơn</button>
          )}
          {order.status === 'done' && (
            <button className="h-9 px-4 border border-shopee-orange text-sm text-shopee-orange rounded-[2px] hover:bg-shopee-orange-light flex items-center gap-1">
              <Star1 size={14} variant="Bold" color="currentColor" /> Đánh giá
            </button>
          )}
          <button className="h-9 px-4 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">Mua lại</button>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
