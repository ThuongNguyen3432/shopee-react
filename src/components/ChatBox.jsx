import { useEffect, useRef, useState } from 'react';
import { CloseCircle, Message, Send2, Shop, Verify } from 'iconsax-react';

const QUICK_REPLIES = [
  'Sản phẩm này còn hàng không?',
  'Phí vận chuyển bao nhiêu?',
  'Có mã giảm giá không shop?',
  'Bao lâu thì giao hàng?',
  'Có được đổi trả không?',
];

const VND = (n) => Number(n || 0).toLocaleString('vi-VN');

function timeLabel() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function replyFor(text, shop, product) {
  const t = text.toLowerCase();
  const name = product?.name ? `“${product.name}”` : 'sản phẩm';
  if (/giá|bao nhiêu|rẻ/.test(t)) {
    return `Dạ ${name} đang có giá ${product ? `₫${VND(product.price)}` : 'tốt nhất'} ạ. Shop đang có thêm mã giảm giá cho đơn đầu tiên, bạn chốt luôn nhé!`;
  }
  if (/ship|vận chuyển|giao|phí/.test(t)) {
    return `Dạ shop freeship toàn quốc cho đơn từ ₫99k ạ. Đơn của bạn dự kiến giao trong ${shop.shipTime || '2 ngày'}, shipper sẽ gọi trước khi giao.`;
  }
  if (/còn hàng|hết hàng|kho/.test(t)) {
    return 'Dạ sản phẩm vẫn còn hàng sẵn trong kho ạ. Bạn đặt sớm để shop chuẩn bị và gửi đi trong hôm nay nhé!';
  }
  if (/đổi trả|hoàn|bảo hành|lỗi/.test(t)) {
    return 'Dạ shop hỗ trợ đổi trả trong 7 ngày và bảo hành theo chính sách ạ. Nếu hàng lỗi, bạn gửi ảnh cho shop, shop xử lý ngay nhé.';
  }
  if (/size|kích thước|màu|mẫu/.test(t)) {
    return 'Dạ shop còn đủ size và màu ạ. Bạn cho shop biết chiều cao/cân nặng để shop tư vấn size chuẩn nhất nhé!';
  }
  if (/cảm ơn|thanks|ok/.test(t)) {
    return 'Dạ shop cảm ơn bạn nhiều ạ! Nếu cần thêm gì bạn cứ nhắn shop nhé 💛';
  }
  return `Dạ ${shop.name} đã nhận được tin nhắn của bạn. Shop sẽ phản hồi ngay trong ít phút ạ. Bạn cần tư vấn thêm về ${name} không ạ?`;
}

export default function ChatBox({ open, onClose, shop, product }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setMessages((prev) => (
      prev.length
        ? prev
        : [{
          id: 'greeting',
          from: 'shop',
          text: `Chào bạn 👋 ${shop.name} xin chào! Shop có thể tư vấn gì cho bạn hôm nay ạ?`,
          time: timeLabel(),
        }]
    ));
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [open, shop.name]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  if (!open) return null;

  const send = (raw, image = null, sticker = null) => {
    const text = String(raw ?? input).trim();
    if (!text && !image && !sticker) return;
    clearTimeout(timerRef.current);
    setMessages((m) => [...m, { id: `me-${Date.now()}`, from: 'me', text, image, sticker, time: timeLabel() }]);
    setInput('');
    setTyping(true);
    timerRef.current = setTimeout(() => {
      setMessages((m) => [...m, {
        id: `shop-${Date.now()}`,
        from: 'shop',
        text: sticker ? 'Dạ shop cảm ơn bạn ạ! 😊' : replyFor(text || 'hình ảnh', shop, product),
        time: timeLabel(),
      }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Chat với ${shop.name}`}
      className="fixed z-[80] inset-0 sm:inset-auto sm:bottom-4 sm:right-4 w-full h-full sm:w-[360px] sm:h-[540px] bg-white flex flex-col sm:rounded-lg overflow-hidden shadow-2xl sm:border sm:border-gray-200"
    >
      {/* Header */}
      <div className="bg-gradient-to-b from-[#f53d2d] to-[#f63] text-white px-3 py-2.5 flex items-center gap-2 shrink-0">
        <img src={shop.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-white/60" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium truncate">{shop.name}</span>
            {shop.mall && (
              <span className="bg-white text-shopee-orange text-[9px] font-bold px-1 rounded-[2px] shrink-0">Mall</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300" /> Đang hoạt động
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Đóng chat"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition"
        >
          <CloseCircle size={20} variant="Outline" color="#fff" />
        </button>
      </div>

      {/* Product context */}
      {product && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-[#fffafa] shrink-0">
          <img src={product.img || product.image} alt="" className="w-10 h-10 rounded-[2px] object-cover border border-gray-100" />
          <div className="min-w-0 flex-1">
            <div className="text-xs text-gray-800 line-clamp-1">{product.name}</div>
            <div className="text-shopee-orange text-sm font-medium">₫{VND(product.price)}</div>
          </div>
          <Shop size={16} variant="Linear" color="#ee4d2d" className="shrink-0" />
        </div>
      )}

      {/* Messages */}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto bg-[#f7f7f7] px-3 py-3 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex items-end gap-1.5 ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            {m.from === 'shop' && (
              <img src={shop.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
            )}
            <div className={`max-w-[78%] px-3 py-2 text-[13px] leading-5 rounded-lg ${m.from === 'me'
              ? 'bg-shopee-orange text-white rounded-br-sm'
              : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'}`}
            >
              {m.sticker && <div className="text-3xl">{m.sticker}</div>}
              {m.image && <img src={m.image} alt="" className="max-w-full rounded-md mb-1" />}
              {m.text && <div>{m.text}</div>}
            </div>
            <span className="text-[10px] text-gray-400 shrink-0 mb-0.5">{m.time}</span>
          </div>
        ))}
        {typing && (
          <div className="flex items-end gap-1.5 justify-start">
            <img src={shop.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
            <div className="bg-white border border-gray-100 rounded-lg rounded-bl-sm px-3 py-2.5 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div className="flex gap-1.5 px-2 py-2 overflow-x-auto scrollbar-hide border-t border-gray-100 shrink-0">
        {QUICK_REPLIES.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="shrink-0 text-[11px] px-2.5 py-1.5 rounded-full border border-shopee-orange/40 text-shopee-orange bg-shopee-orange-light hover:bg-[#ffe8e1] transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Stickers */}
      <div className="flex gap-1.5 px-2 py-1.5 overflow-x-auto scrollbar-hide border-t border-gray-100 shrink-0">
        {['😊','😂','❤️','👍','🎉','🔥','😍','🙏'].map((st) => (
          <button key={st} type="button" onClick={() => send('', null, st)} className="shrink-0 text-lg hover:scale-125 transition">{st}</button>
        ))}
        <label className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-shopee-orange hover:text-shopee-orange cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) send('', URL.createObjectURL(f));
            e.target.value = '';
          }} />
          📷
        </label>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="flex items-center gap-2 px-2 py-2 border-t border-gray-100 shrink-0"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          aria-label="Nội dung tin nhắn"
          className="flex-1 h-9 border border-gray-200 rounded-full px-3 text-sm outline-none focus:border-shopee-orange"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Gửi tin nhắn"
          className="w-9 h-9 rounded-full bg-shopee-orange text-white flex items-center justify-center disabled:opacity-40 hover:bg-shopee-red transition shrink-0"
        >
          <Send2 size={17} variant="Bold" color="#fff" />
        </button>
      </form>

      <div className="hidden sm:flex items-center justify-center gap-1 text-[10px] text-gray-400 pb-1.5 shrink-0">
        <Verify size={11} variant="Bold" color="#bbb" /> Tin nhắn được bảo mật bởi Shopee
      </div>
    </div>
  );
}
