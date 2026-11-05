import { useState } from 'react';
import { Message, Shop, TickCircle } from 'iconsax-react';

const CONVS = [
  { id: 1, buyer: 'Nguyễn Văn A', avatar: 'https://ui-avatars.com/api/?name=A&background=ee4d2d&color=fff', last: 'Sản phẩm này còn hàng không?', time: '10:04', unread: 2, product: 'Tai nghe Bluetooth 5.3' },
  { id: 2, buyer: 'Trần Thị B', avatar: 'https://ui-avatars.com/api/?name=B&background=00bfa5&color=fff', last: 'Phí ship bao nhiêu ạ?', time: 'Hôm qua', unread: 0, product: 'Ốp lưng iPhone 15' },
  { id: 3, buyer: 'Lê Văn C', avatar: 'https://ui-avatars.com/api/?name=C&background=f5c518&color=fff', last: 'Có mã giảm giá không shop?', time: '2 ngày trước', unread: 1, product: 'Áo thun nam cotton' },
];

export default function SellerChat() {
  const [active, setActive] = useState(CONVS[0].id);
  const [reply, setReply] = useState('');
  const conv = CONVS.find((c) => c.id === active);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Chat với khách hàng</h1>
      <div className="bg-white rounded-sm grid grid-cols-1 md:grid-cols-[300px_1fr] min-h-[500px] overflow-hidden">
        <div className="border-r border-gray-100">
          <div className="max-h-[500px] overflow-y-auto">
            {CONVS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left border-b border-gray-100 transition ${active === c.id ? 'bg-shopee-orange-light' : 'hover:bg-gray-50'}`}
              >
                <img src={c.avatar} alt="" className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800 truncate">{c.buyer}</span>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{c.last}</div>
                  <div className="text-[10px] text-gray-400 truncate">{c.product}</div>
                </div>
                {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-shopee-orange text-white text-[10px] flex items-center justify-center shrink-0">{c.unread}</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          {conv && (
            <>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <img src={conv.avatar} alt="" className="w-9 h-9 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{conv.buyer}</div>
                  <div className="text-[11px] text-gray-500">{conv.product}</div>
                </div>
              </div>
              <div className="flex-1 bg-[#f7f7f7] p-4 overflow-y-auto">
                <div className="flex items-end gap-1.5 justify-start mb-3">
                  <img src={conv.avatar} alt="" className="w-6 h-6 rounded-full" />
                  <div className="max-w-[78%] px-3 py-2 text-[13px] bg-white border border-gray-100 rounded-lg rounded-bl-sm">{conv.last}</div>
                </div>
                <div className="text-xs text-gray-400 text-center mt-4">Trả lời để hỗ trợ khách hàng.</div>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); if (reply.trim()) { setReply(''); } }} className="flex gap-2 p-3 border-t border-gray-100">
                <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-1 h-9 border border-gray-200 rounded-[2px] px-3 text-sm outline-none focus:border-shopee-orange" />
                <button type="submit" className="h-9 px-4 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">Gửi</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
