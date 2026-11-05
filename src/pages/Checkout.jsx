import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDown2, Bank, Card, Coin, Location, Money, ShieldTick, Shop, Ticket,
  TickCircle, Trash, Truck, Wallet,
} from 'iconsax-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getShopInfo, shopPath } from '../lib/shop.js';
import Header from '../components/Header.jsx';
import { useSEO } from '../hooks/useSEO.js';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const VND = (n) => Number(n || 0).toLocaleString('vi-VN');

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb';

const DEFAULT_ADDRESSES = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0912 345 678', line: '123 Nguyễn Trãi, Phường 2, Quận 5', city: 'TP. Hồ Chí Minh', isDefault: true },
  { id: 2, name: 'Nguyễn Văn A', phone: '0987 654 321', line: '45 Lê Lợi, Phường Bến Nghé, Quận 1', city: 'TP. Hồ Chí Minh', isDefault: false },
];

const VOUCHERS = [
  { code: 'SHOPEE10', label: 'Giảm ₫10.000', amount: 10000, min: 50000 },
  { code: 'FREESHIP', label: 'Miễn phí vận chuyển', amount: 0, freeShip: true, min: 0 },
  { code: 'SHOPEE50', label: 'Giảm ₫50.000', amount: 50000, min: 200000 },
];

const SHIPPING_OPTIONS = [
  { value: 'standard', label: 'Vận chuyển tiêu chuẩn', fee: 0, eta: '3-5 ngày' },
  { value: 'express', label: 'Vận chuyển nhanh', fee: 15000, eta: '1-2 ngày' },
];

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: Money },
  { value: 'shopeepay', label: 'ShopeePay', icon: Wallet },
  { value: 'card', label: 'Thẻ tín dụng / ghi nợ (PayPal)', icon: Card },
  { value: 'bank', label: 'Chuyển khoản ngân hàng', icon: Bank },
];

function Checkbox({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`w-[18px] h-[18px] shrink-0 rounded-[2px] border flex items-center justify-center transition ${checked
        ? 'bg-shopee-orange border-shopee-orange'
        : 'bg-white border-gray-300 hover:border-shopee-orange'}`}
    >
      {checked && <TickCircle size={13} variant="Bold" color="#fff" />}
    </button>
  );
}

function Radio({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center transition ${checked ? 'border-shopee-orange' : 'border-gray-300'}`}
    >
      {checked && <span className="w-2 h-2 rounded-full bg-shopee-orange" />}
    </button>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total: cartTotal, clear } = useCart();
  useSEO({ title: 'Thanh toán', description: 'Thanh toán đơn hàng tại Shopee.', url: '/checkout', noindex: true });
  const { user } = useAuth();

  const [addresses] = useState(DEFAULT_ADDRESSES);
  const [addressId, setAddressId] = useState(DEFAULT_ADDRESSES[0].id);
  const [showAddrModal, setShowAddrModal] = useState(false);

  const groups = useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      const shop = getShopInfo(item);
      if (!map.has(shop.id)) map.set(shop.id, { shop, items: [] });
      map.get(shop.id).items.push(item);
    });
    return [...map.values()];
  }, [items]);

  const [shipMethod, setShipMethod] = useState(() =>
    Object.fromEntries(groups.map((g) => [g.shop.id, 'standard']))
  );
  const [shopVoucher, setShopVoucher] = useState(() =>
    Object.fromEntries(groups.map((g) => [g.shop.id, null]))
  );
  const [orderVoucher, setOrderVoucher] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherTarget, setVoucherTarget] = useState(null); // shop id or 'order'

  const [payment, setPayment] = useState('cod');
  const [terms, setTerms] = useState(true);
  const [note, setNote] = useState('');
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');
  const [loadingPaypal, setLoadingPaypal] = useState(false);

  const paypalRef = useRef(null);

  const subtotal = cartTotal;
  const shippingFee = groups.reduce((s, g) => {
    const opt = SHIPPING_OPTIONS.find((o) => o.value === (shipMethod[g.shop.id] || 'standard'));
    return s + (opt?.fee || 0);
  }, 0);
  const shopDiscount = groups.reduce((s, g) => {
    const v = shopVoucher[g.shop.id];
    if (!v) return s;
    const shopSub = g.items.reduce((a, i) => a + i.price * i.qty, 0);
    if (shopSub < v.min) return s;
    if (v.freeShip) return s; // handled in shipping
    return s + v.amount;
  }, 0);
  const freeShipDiscount = groups.reduce((s, g) => {
    const v = shopVoucher[g.shop.id];
    if (!v || !v.freeShip) return s;
    const opt = SHIPPING_OPTIONS.find((o) => o.value === (shipMethod[g.shop.id] || 'standard'));
    return s + (opt?.fee || 0);
  }, 0);
  const orderDiscount = orderVoucher
    ? (subtotal >= orderVoucher.min ? orderVoucher.amount : 0)
    : 0;
  const totalPay = Math.max(0, subtotal + shippingFee - shopDiscount - freeShipDiscount - orderDiscount);

  const selectedAddress = addresses.find((a) => a.id === addressId) || addresses[0];

  const applyVoucher = (v) => {
    if (voucherTarget === 'order') setOrderVoucher(v);
    else setShopVoucher((prev) => ({ ...prev, [voucherTarget]: v }));
    setShowVoucherModal(false);
    setVoucherTarget(null);
  };

  const removeVoucher = (target) => {
    if (target === 'order') setOrderVoucher(null);
    else setShopVoucher((prev) => ({ ...prev, [target]: null }));
  };

  const placeOrder = async () => {
    if (!terms) { setError('Vui lòng đồng ý với điều khoản mua hàng.'); return; }
    if (items.length === 0) return;
    setError('');
    if (isSupabaseConfigured) {
      try {
        const code = 'SP' + Date.now();
        const { data: order } = await supabase.from('orders').insert({
          code,
          customer_name: user?.user_metadata?.full_name || user?.email || selectedAddress.name,
          customer_phone: selectedAddress.phone,
          address: `${selectedAddress.line}, ${selectedAddress.city}`,
          total: totalPay,
          status: 'pending',
        }).select().single();
        if (order) {
          await supabase.from('order_items').insert(
            items.map((i) => ({ order_id: order.id, product_id: i.id, name: i.name, price: i.price, qty: i.qty }))
          ).catch(() => {});
        }
      } catch (e) { /* ignore */ }
    }
    clear();
    setPaid(true);
  };

  // PayPal
  useEffect(() => {
    if (payment !== 'card' || items.length === 0) return;
    if (document.getElementById('paypal-sdk')) { renderPaypal(); return; }
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.onload = () => renderPaypal();
    script.onerror = () => setError('Không tải được PayPal SDK');
    document.body.appendChild(script);

    function renderPaypal() {
      if (!window.paypal || !paypalRef.current) return;
      paypalRef.current.innerHTML = '';
      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
        createOrder: (_data, actions) => actions.order.create({
          purchase_units: [{ amount: { value: (totalPay / 25000).toFixed(2) }, description: `Shopee order - ${items.length} items` }],
        }),
        onApprove: async (_data, actions) => {
          try {
            await actions.order.capture();
            await placeOrder();
          } catch (e) { setError('Thanh toán thất bại: ' + e.message); }
        },
        onError: (err) => setError('Lỗi PayPal: ' + err),
      }).render(paypalRef.current);
    }
  }, [payment, items.length, totalPay]);

  if (paid) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <div className="container mx-auto px-2 py-10 max-w-[600px]">
          <div className="bg-white rounded-sm p-8 text-center shadow-sm">
            <div className="text-green-500 mb-3 flex justify-center">
              <TickCircle size={64} variant="Bold" color="#22c55e" />
            </div>
            <h1 className="text-xl font-medium text-gray-800 mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-500 text-sm mb-1">Cảm ơn bạn đã mua hàng. Đơn hàng đang được xử lý.</p>
            <p className="text-gray-400 text-xs mb-5">Mã đơn: SP{Date.now()}</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => navigate('/')} className="h-9 px-6 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">Về trang chủ</button>
              <button onClick={() => navigate('/search')} className="h-9 px-6 border border-gray-300 text-gray-700 text-sm rounded-[2px] hover:border-shopee-orange hover:text-shopee-orange">Tiếp tục mua sắm</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <div className="container mx-auto px-2 py-10 max-w-[600px]">
          <div className="bg-white rounded-sm p-8 text-center">
            <div className="text-gray-300 mb-3 flex justify-center"><Ticket size={56} variant="Linear" color="#c7c7c7" /></div>
            <div className="text-sm text-gray-700">Giỏ hàng của bạn còn trống</div>
            <button onClick={() => navigate('/')} className="mt-4 h-9 px-10 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">Mua sắm ngay</button>
          </div>
        </div>
        <Footer />
        <BackToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 mb-2 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <Link to="/cart" className="hover:text-shopee-orange">Giỏ Hàng</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Thanh Toán</span>
        </div>

        <h1 className="text-lg md:text-xl text-gray-800 mb-3">Thanh Toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3">
          {/* Left column */}
          <div className="space-y-3 min-w-0">
            {/* Address */}
            <div className="bg-white rounded-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                <Location size={18} variant="Bold" color="#ee4d2d" />
                <span className="text-shopee-orange font-medium text-sm">Địa Chỉ Nhận Hàng</span>
              </div>
              <div className="px-4 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="font-medium text-gray-800">{selectedAddress.name}</span>
                    <span className="text-gray-500">({selectedAddress.phone})</span>
                    {selectedAddress.isDefault && (
                      <span className="text-[10px] text-shopee-orange border border-shopee-orange px-1 py-px rounded-[2px]">Mặc định</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{selectedAddress.line}</div>
                  <div className="text-sm text-gray-600">{selectedAddress.city}</div>
                </div>
                <button
                  onClick={() => setShowAddrModal(true)}
                  className="text-sm text-shopee-orange hover:underline shrink-0"
                >
                  Thay đổi
                </button>
              </div>
            </div>

            {/* Products by shop */}
            {groups.map(({ shop, items: shopItems }) => {
              const shopSub = shopItems.reduce((s, i) => s + i.price * i.qty, 0);
              const v = shopVoucher[shop.id];
              const ship = SHIPPING_OPTIONS.find((o) => o.value === (shipMethod[shop.id] || 'standard'));
              return (
                <div key={shop.id} className="bg-white rounded-sm">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                    <Shop size={16} variant="Outline" color="#555" />
                    <Link to={shopPath(shopItems[0])} className="text-sm font-medium text-gray-800 hover:text-shopee-orange">
                      {shop.name}
                    </Link>
                    {shop.mall && <span className="bg-shopee-orange text-white text-[9px] font-bold px-1 py-px rounded-[2px]">Mall</span>}
                  </div>

                  <div className="divide-y divide-gray-100">
                    {shopItems.map((item) => {
                      const variant = ['Mặc định', 'Đen / M', 'Trắng / L', 'Cao cấp'][Number(String(item.id).replace(/\D/g, '')) % 4];
                      return (
                        <div key={item.id} className="flex gap-3 px-4 py-3">
                          <img src={item.img || item.image} alt={item.name} className="w-16 h-16 object-cover border border-gray-100 rounded-[2px] shrink-0" loading="lazy" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-800 line-clamp-2">{item.name}</div>
                            <div className="text-[11px] text-gray-500 mt-0.5">Phân loại: {variant}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm text-gray-800">₫{VND(item.price)}</div>
                            <div className="text-[11px] text-gray-500 mt-0.5">x{item.qty}</div>
                            <div className="text-sm text-shopee-orange font-medium mt-0.5">₫{VND(item.price * item.qty)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping method */}
                  <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3 flex-wrap">
                    <Truck size={16} variant="Bold" color="#00bfa5" />
                    <span className="text-sm text-gray-700">Đơn vị vận chuyển</span>
                    <div className="flex-1 min-w-0 flex items-center gap-2 justify-end flex-wrap">
                      <select
                        name="shipping"
                        id={`ship-${shop.id}`}
                        value={shipMethod[shop.id] || 'standard'}
                        onChange={(e) => setShipMethod((p) => ({ ...p, [shop.id]: e.target.value }))}
                        aria-label="Đơn vị vận chuyển"
                        className="border border-gray-200 rounded-[2px] px-2 py-1.5 text-sm outline-none focus:border-shopee-orange"
                      >
                        {SHIPPING_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label} - {o.fee === 0 ? 'Miễn phí' : `₫${VND(o.fee)}`} ({o.eta})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Shop voucher */}
                  <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3 flex-wrap text-sm">
                    <Ticket size={16} variant="Bold" color="#ee4d2d" />
                    <span className="text-gray-700">Voucher của Shop</span>
                    {v ? (
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-shopee-orange text-xs">{v.label}</span>
                        <button onClick={() => removeVoucher(shop.id)} className="text-gray-400 hover:text-shopee-orange">
                          <Trash size={14} variant="Linear" color="currentColor" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setVoucherTarget(shop.id); setShowVoucherModal(true); }}
                        className="ml-auto text-shopee-orange hover:underline text-xs"
                      >
                        Chọn Voucher
                      </button>
                    )}
                  </div>

                  {/* Shop subtotal */}
                  <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm bg-[#fffafa]">
                    <span className="text-gray-600">Tổng số tiền ({shopItems.length} sản phẩm):</span>
                    <span className="text-shopee-orange text-base font-medium">₫{VND(shopSub)}</span>
                  </div>
                </div>
              );
            })}

            {/* Payment method */}
            <div className="bg-white rounded-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                <Card size={18} variant="Bold" color="#ee4d2d" />
                <span className="text-shopee-orange font-medium text-sm">Phương Thức Thanh Toán</span>
              </div>
              <div className="px-4 py-3 space-y-2">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <label key={m.value} className={`flex items-center gap-3 px-3 py-2.5 border rounded-[2px] cursor-pointer transition ${payment === m.value ? 'border-shopee-orange bg-shopee-orange-light' : 'border-gray-200 hover:border-shopee-orange'}`}>
                      <Radio checked={payment === m.value} onChange={() => setPayment(m.value)} label={m.label} />
                      <Icon size={18} variant="Outline" color={payment === m.value ? '#ee4d2d' : '#555'} />
                      <span className="text-sm text-gray-700">{m.label}</span>
                    </label>
                  );
                })}
                {payment === 'card' && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {loadingPaypal ? <div className="text-gray-400 text-sm">Đang tải PayPal...</div> : <div ref={paypalRef} />}
                    {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="bg-white rounded-sm px-4 py-3">
              <label htmlFor="order-note" className="text-sm text-gray-700 block mb-1.5">Lời nhắn cho Shop</label>
              <textarea
                id="order-note"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Lưu ý cho người bán..."
                className="w-full border border-gray-200 rounded-[2px] px-3 py-2 text-sm outline-none focus:border-shopee-orange resize-none"
              />
            </div>
          </div>

          {/* Right column summary */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-white rounded-sm">
              <div className="px-4 py-3 border-b border-gray-100 text-sm font-medium text-gray-700">Tóm tắt đơn hàng</div>
              <div className="px-4 py-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng tiền hàng</span>
                  <span>₫{VND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tổng phí vận chuyển</span>
                  <span>₫{VND(shippingFee - freeShipDiscount)}</span>
                </div>
                {(shopDiscount + orderDiscount) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tổng voucher giảm giá</span>
                    <span className="text-shopee-orange">-₫{VND(shopDiscount + orderDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline">
                  <span className="text-gray-700">Tổng thanh toán</span>
                  <span className="text-shopee-orange text-xl font-medium">₫{VND(totalPay)}</span>
                </div>
              </div>

              {/* Order voucher */}
              <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2 text-sm">
                <Ticket size={16} variant="Bold" color="#ee4d2d" />
                <span className="text-gray-700">Voucher Shopee</span>
                {orderVoucher ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-shopee-orange text-xs">{orderVoucher.label}</span>
                    <button onClick={() => removeVoucher('order')} className="text-gray-400 hover:text-shopee-orange">
                      <Trash size={14} variant="Linear" color="currentColor" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setVoucherTarget('order'); setShowVoucherModal(true); }}
                    className="ml-auto text-shopee-orange hover:underline text-xs"
                  >
                    Chọn Voucher
                  </button>
                )}
              </div>

              {/* Terms */}
              <div className="px-4 py-3 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-600">
                <Checkbox checked={terms} onChange={() => setTerms((t) => !t)} label="Đồng ý điều khoản" />
                <span>Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <span className="text-shopee-orange">Điều khoản Shopee</span>.</span>
              </div>

              {error && <div className="px-4 pb-2 text-xs text-red-500">{error}</div>}

              {payment !== 'card' && (
                <div className="px-4 pb-4">
                  <button
                    onClick={placeOrder}
                    className="w-full h-11 bg-shopee-orange text-white text-sm font-medium rounded-[2px] hover:bg-shopee-red transition"
                  >
                    Đặt hàng
                  </button>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-sm mt-3 px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
              <ShieldTick size={16} variant="Bold" color="#00bfa5" />
              <span>Thông tin của bạn được bảo mật và mã hóa.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => { setShowVoucherModal(false); setVoucherTarget(null); }}>
          <div className="bg-white rounded-sm w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="font-medium text-gray-800">Chọn Voucher</span>
              <button onClick={() => { setShowVoucherModal(false); setVoucherTarget(null); }} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
              {VOUCHERS.map((v) => {
                const eligible = subtotal >= v.min;
                return (
                  <button
                    key={v.code}
                    disabled={!eligible}
                    onClick={() => applyVoucher(v)}
                    className={`w-full text-left px-3 py-2.5 border rounded-[2px] transition ${eligible ? 'border-gray-200 hover:border-shopee-orange' : 'border-gray-100 opacity-50 cursor-not-allowed'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Ticket size={16} variant="Bold" color="#ee4d2d" />
                      <span className="text-sm font-medium text-gray-800">{v.code}</span>
                      <span className="text-xs text-gray-500 ml-auto">{v.label}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">Đơn tối thiểu ₫{VND(v.min)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Address modal */}
      {showAddrModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAddrModal(false)}>
          <div className="bg-white rounded-sm w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="font-medium text-gray-800">Địa chỉ của tôi</span>
              <button onClick={() => setShowAddrModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <div className="p-3 space-y-2">
              {addresses.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setAddressId(a.id); setShowAddrModal(false); }}
                  className={`w-full text-left px-3 py-2.5 border rounded-[2px] transition ${a.id === addressId ? 'border-shopee-orange bg-shopee-orange-light' : 'border-gray-200 hover:border-shopee-orange'}`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-800">{a.name}</span>
                    <span className="text-gray-500">{a.phone}</span>
                    {a.isDefault && <span className="text-[10px] text-shopee-orange border border-shopee-orange px-1 py-px rounded-[2px]">Mặc định</span>}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{a.line}, {a.city}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 flex items-center justify-between gap-3 z-40">
        <div className="min-w-0">
          <div className="text-[11px] text-gray-500">Tổng thanh toán</div>
          <div className="text-shopee-orange text-lg font-medium">₫{VND(totalPay)}</div>
        </div>
        {payment !== 'card' && (
          <button onClick={placeOrder} className="h-10 px-8 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red shrink-0">
            Đặt hàng
          </button>
        )}
      </div>
      <div className="lg:hidden h-16" />

      <Footer />
      <BackToTop />
    </div>
  );
}
