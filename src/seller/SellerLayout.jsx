import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Element4, Box, Bill, Message, Wallet, Setting, TicketDiscount, Flash,
  ArrowLeft, Shop, Chart, Profile2User,
} from 'iconsax-react';

const NAV = [
  { to: '/seller', label: 'Tổng quan', Icon: Element4, end: true },
  { to: '/seller/products', label: 'Sản phẩm', Icon: Box },
  { to: '/seller/orders', label: 'Đơn hàng', Icon: Bill },
  { to: '/seller/chat', label: 'Chat với khách', Icon: Message },
  { to: '/seller/vouchers', label: 'Voucher', Icon: TicketDiscount },
  { to: '/seller/promotions', label: 'Khuyến mãi', Icon: Flash },
  { to: '/seller/revenue', label: 'Doanh thu', Icon: Wallet },
  { to: '/seller/analytics', label: 'Phân tích', Icon: Chart },
  { to: '/seller/settings', label: 'Thiết lập shop', Icon: Setting },
];

export default function SellerLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-14 flex items-center px-4 border-b border-gray-200">
          <span className="text-shopee-orange font-bold text-lg">Kênh Người Bán</span>
        </div>
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <img src="https://ui-avatars.com/api/?name=Shop+1&background=ee4d2d&color=fff&size=40" alt="" className="w-10 h-10 rounded-full" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-800 truncate">Minh Anh Shop</div>
            <div className="text-[11px] text-green-600">Đang hoạt động</div>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition ${isActive ? 'bg-shopee-orange-light text-shopee-orange font-medium border-r-2 border-shopee-orange' : 'text-gray-700 hover:bg-gray-50'}`
              }
            >
              <n.Icon size={18} variant="Linear" color="currentColor" />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-shopee-orange flex items-center gap-1.5">
            <ArrowLeft size={14} variant="Linear" color="currentColor" /> Về cửa hàng
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="text-sm text-gray-500">Kênh Người Bán</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">Minh Anh Shop</span>
            <div className="w-8 h-8 rounded-full bg-shopee-orange text-white flex items-center justify-center text-xs font-bold">S</div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
