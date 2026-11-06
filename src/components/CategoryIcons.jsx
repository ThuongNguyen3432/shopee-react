import { Link } from 'react-router-dom';
import { ArrowRight2 } from 'iconsax-react';
import { slugify } from '../lib/slugify.js';

// Category layout mirrors shopee.vn: two rows of 10 items.
const ROW1 = [
  { name: 'Thời Trang Nam', icon: '👕' },
  { name: 'Điện Thoại & Phụ Kiện', icon: '📱' },
  { name: 'Thiết Bị Điện Tử', icon: '📺' },
  { name: 'Máy Tính & Laptop', icon: '💻' },
  { name: 'Máy Ảnh & Quay Phim', icon: '📷' },
  { name: 'Đồng Hồ', icon: '⌚' },
  { name: 'Giày Dép Nam', icon: '👟' },
  { name: 'Thiết Bị Gia Dụng', icon: '🏠' },
  { name: 'Thể Thao & Du Lịch', icon: '⚽' },
  { name: 'Ô Tô & Xe Máy', icon: '🚗' },
];

const ROW2 = [
  { name: 'Thời Trang Nữ', icon: '👗' },
  { name: 'Mẹ & Bé', icon: '🍼' },
  { name: 'Nhà Cửa & Đời Sống', icon: '🛋️' },
  { name: 'Sắc Đẹp', icon: '💄' },
  { name: 'Sức Khỏe', icon: '💊' },
  { name: 'Giày Dép Nữ', icon: '👠' },
  { name: 'Túi Ví Nữ', icon: '👜' },
  { name: 'Phụ Kiện & Trang Sức', icon: '💍' },
  { name: 'Bách Hóa Online', icon: '🛒' },
  { name: 'Nhà Sách Online', icon: '📚' },
];

function CategoryItem({ item }) {
  return (
    <Link
      to={`/category/${slugify(item.name)}`}
      className="group flex-1 min-w-0 flex flex-col items-center text-center"
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-gray-50 border border-gray-100 group-hover:bg-shopee-orange-light group-hover:border-shopee-orange/30 flex items-center justify-center text-xl sm:text-2xl transition-all duration-200 group-hover:-translate-y-0.5">
        {item.icon}
      </div>
      <span className="text-[11px] sm:text-[12px] text-gray-600 group-hover:text-shopee-orange leading-4 mt-1.5 line-clamp-2 h-8 transition-colors">
        {item.name}
      </span>
    </Link>
  );
}

export default function CategoryIcons() {
  return (
    <section className="bg-white mt-2.5 rounded-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="w-1 h-4 bg-shopee-orange rounded-sm" />
        <h2 className="text-sm font-medium text-gray-800 uppercase tracking-wide">Danh mục</h2>
      </div>
      <div className="relative px-3 md:px-4 py-3 md:py-4">
        <div className="space-y-3 md:space-y-4 pr-4">
          <div className="flex items-start gap-0.5 sm:gap-1">
            {ROW1.map((item) => <CategoryItem key={item.name} item={item} />)}
          </div>
          <div className="flex items-start gap-0.5 sm:gap-1">
            {ROW2.map((item) => <CategoryItem key={item.name} item={item} />)}
          </div>
        </div>
        <button
          type="button"
          aria-label="Xem thêm danh mục"
          className="absolute right-0.5 top-1/2 -translate-y-1/2 hidden sm:flex w-6 h-6 md:w-7 md:h-7 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-shopee-orange hover:border-shopee-orange transition"
        >
          <ArrowRight2 size={13} variant="Linear" color="currentColor" />
        </button>
      </div>
    </section>
  );
}
