import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Element4,
  Box,
  Category,
  Bill,
  Profile2User,
  TicketDiscount,
  Image,
  Flash,
  Setting,
  ArrowLeft,
  SearchNormal1,
} from 'iconsax-react';

const NAV = [
  { to: '/admin', label: 'Dashboard', Icon: Element4, end: true },
  { to: '/admin/products', label: 'Sản phẩm', Icon: Box },
  { to: '/admin/categories', label: 'Danh mục', Icon: Category },
  { to: '/admin/orders', label: 'Đơn hàng', Icon: Bill },
  { to: '/admin/users', label: 'Người dùng', Icon: Profile2User },
  { to: '/admin/vouchers', label: 'Voucher', Icon: TicketDiscount },
  { to: '/admin/banners', label: 'Banner', Icon: Image },
  { to: '/admin/flash-sale', label: 'Flash Sale', Icon: Flash },
  { to: '/admin/popup', label: 'Popup quảng cáo', Icon: Image },
  { to: '/admin/top-searches', label: 'Tìm kiếm hàng đầu', Icon: SearchNormal1 },
  { to: '/admin/site-settings', label: 'Cấu hình site', Icon: Setting },
  { to: '/admin/settings', label: 'Cài đặt', Icon: Setting },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-gray-200 flex flex-col shrink-0">
        <div className="h-14 flex items-center px-4 border-b border-gray-800">
          <span className="text-shopee-orange font-bold text-lg">Shopee Admin</span>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition ${isActive ? 'bg-shopee-orange text-white' : 'hover:bg-gray-800 hover:text-white'}`
              }
            >
              <n.Icon size={18} variant="Linear" color="currentColor" />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft size={14} variant="Linear" color="currentColor" /> Về cửa hàng
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="text-sm text-gray-500">Bảng điều khiển quản trị</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">admin@shopee.vn</span>
            <div className="w-8 h-8 rounded-full bg-shopee-orange text-white flex items-center justify-center text-xs font-bold">A</div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
