import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const paypalRef = useRef(null);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0 && !paid) { /* allow empty to show message */ }
    // Load PayPal SDK
    if (document.getElementById('paypal-sdk')) { setLoading(false); renderButtons(); return; }
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.onload = () => { setLoading(false); renderButtons(); };
    script.onerror = () => { setLoading(false); setError('Không tải được PayPal SDK'); };
    document.body.appendChild(script);

    function renderButtons() {
      if (!window.paypal || !paypalRef.current) return;
      paypalRef.current.innerHTML = '';
      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
        createOrder: (_data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: (total / 25000).toFixed(2) }, // convert VND -> USD approx
              description: `Shopee order - ${items.length} items`,
            }],
          });
        },
        onApprove: async (_data, actions) => {
          try {
            const details = await actions.order.capture();
            // Create order in Supabase
            if (isSupabaseConfigured) {
              const code = 'SP' + Date.now();
              const { data: order } = await supabase.from('orders').insert({
                code,
                customer_name: user?.user_metadata?.full_name || user?.email || 'Khách',
                customer_phone: '',
                address: '',
                total,
                status: 'pending',
              }).select().single();
              if (order) {
                await supabase.from('order_items').insert(
                  items.map((i) => ({ order_id: order.id, product_id: i.id, name: i.name, price: i.price, qty: i.qty }))
                ).catch(() => {});
              }
            }
            clear();
            setPaid(true);
          } catch (e) { setError('Thanh toán thất bại: ' + e.message); }
        },
        onError: (err) => { setError('Lỗi PayPal: ' + err); },
      }).render(paypalRef.current);
    }
  }, [items, total, user, clear]);

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-sm p-8 text-center shadow-sm max-w-md">
          <div className="text-5xl mb-3">✅</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
          <p className="text-gray-500 text-sm mb-4">Cảm ơn bạn đã mua hàng. Đơn hàng đang được xử lý.</p>
          <button onClick={() => navigate('/')} className="bg-shopee-orange text-white px-6 py-2 rounded-sm text-sm hover:bg-shopee-red">Về trang chủ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-2 py-6 max-w-4xl">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Thanh toán</h1>
        {items.length === 0 ? (
          <div className="bg-white rounded-sm p-8 text-center text-gray-400">
            Giỏ hàng trống. <button onClick={() => navigate('/')} className="text-shopee-orange">Mua sắm ngay</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
            <div className="bg-white rounded-sm p-4 shadow-sm">
              <h2 className="font-medium text-gray-700 mb-3">Đơn hàng ({items.length} sản phẩm)</h2>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {items.map((i) => (
                  <div key={i.id} className="flex gap-3 items-center">
                    <img src={i.img} alt={i.name} className="w-12 h-12 object-cover rounded-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 line-clamp-1">{i.name}</div>
                      <div className="text-xs text-gray-400">x{i.qty}</div>
                    </div>
                    <div className="text-shopee-orange text-sm font-bold">{(i.price * i.qty).toLocaleString('vi-VN')}₫</div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                <span>Tổng cộng</span>
                <span className="text-shopee-orange">{total.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
            <div className="bg-white rounded-sm p-4 shadow-sm">
              <h2 className="font-medium text-gray-700 mb-3">Thanh toán qua PayPal</h2>
              {!user && (
                <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded mb-3">
                  Bạn chưa đăng nhập. <button onClick={() => navigate('/')} className="underline">Đăng nhập</button> để lưu đơn hàng.
                </div>
              )}
              {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
              {loading ? <div className="text-gray-400 text-sm">Đang tải PayPal...</div> : <div ref={paypalRef} />}
              <p className="text-[11px] text-gray-400 mt-3">
                * Tỷ giá quy đổi sang USD chỉ mang tính minh họa (1 USD ≈ 25.000₫).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}