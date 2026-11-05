import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../lib/slugify.js';

const items = [
  { name: 'Thời Trang Nam', icon: '👕' },
  { name: 'Điện Thoại', icon: '📱' },
  { name: 'Thiết Bị Điện Tử', icon: '📺' },
  { name: 'Máy Tính & Laptop', icon: '💻' },
  { name: 'Máy Ảnh', icon: '📷' },
  { name: 'Đồng Hồ', icon: '⌚' },
  { name: 'Giày Dép Nam', icon: '👟' },
  { name: 'Thiết Bị Gia Dụng', icon: '🏠' },
  { name: 'Thể Thao', icon: '⚽' },
  { name: 'Ô Tô & Xe Máy', icon: '🚗' },
  { name: 'Mẹ & Bé', icon: '🍼' },
  { name: 'Nhà Cửa', icon: '🛋️' },
  { name: 'Sắc Đẹp', icon: '💄' },
  { name: 'Sức Khỏe', icon: '💊' },
  { name: 'Giày Dép Nữ', icon: '👠' },
  { name: 'Túi Ví Nữ', icon: '👜' },
  { name: 'Phụ Kiện', icon: '💍' },
  { name: 'Bách Hóa', icon: '🛒' },
  { name: 'Nhà Sách', icon: '📚' },
  { name: 'Thời Trang Nữ', icon: '👗' },
];

export default function CategoryIcons() {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };
  return (
    <section className="bg-white mt-2.5 rounded-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="w-1 h-4 bg-shopee-orange rounded-sm" />
        <h2 className="text-sm font-medium text-gray-800 uppercase tracking-wide">Danh mục</h2>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label="Cuộn trái" className="shrink-0 w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-600 text-xl hover:border-shopee-orange hover:text-shopee-orange hover:scale-110 transition">‹</button>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide flex-1 py-1">
            {items.map((item) => (
              <Link
                key={item.name}
                to={`/category/${slugify(item.name)}`}
                className="group flex flex-col items-center text-center cursor-pointer shrink-0 w-[72px]"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-shopee-orange-light flex items-center justify-center text-3xl transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
                  {item.icon}
                </div>
                <span className="text-xs text-gray-600 group-hover:text-shopee-orange leading-tight mt-2 line-clamp-2 h-[32px] transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
          <button type="button" onClick={() => scroll(1)} aria-label="Cuộn phải" className="shrink-0 w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-600 text-xl hover:border-shopee-orange hover:text-shopee-orange hover:scale-110 transition">›</button>
        </div>
      </div>
    </section>
  );
}
