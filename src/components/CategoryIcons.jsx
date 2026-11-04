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
  return (
    <section className="bg-white mt-2.5 p-4 rounded-sm shadow-sm">
      <div className="grid grid-cols-10 gap-y-3 gap-x-2 max-[900px]:grid-cols-5 max-[600px]:grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.name}
            to={`/category/${slugify(item.name)}`}
            className="group flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-shopee-orange-light flex items-center justify-center text-2xl transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              {item.icon}
            </div>
            <span className="text-[11px] text-gray-600 group-hover:text-shopee-orange leading-tight mt-1.5 line-clamp-2 transition-colors">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}