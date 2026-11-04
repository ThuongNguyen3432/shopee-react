import { useState } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../lib/slugify.js';

const MEGA = {
  'Thời Trang Nam': ['Áo thun', 'Áo sơ mi', 'Quần jean', 'Quần short', 'Áo khoác', 'Đồ lót', 'Phụ kiện nam'],
  'Điện Thoại & Phụ Kiện': ['iPhone', 'Samsung', 'Xiaomi', 'Ốp lưng', 'Cáp sạc', 'Tai nghe', 'Pin dự phòng'],
  'Thiết Bị Điện Tử': ['Tivi', 'Loa', 'Máy lạnh', 'Quạt', 'Nồi cơm điện', 'Máy hút bụi'],
  'Máy Tính & Laptop': ['Laptop gaming', 'Laptop văn phòng', 'PC', 'Màn hình', 'Bàn phím', 'Chuột'],
  'Máy Ảnh & Quay Phim': ['Máy ảnh DSLR', 'Máy ảnh mirrorless', 'Action cam', 'Tripod', 'Lens'],
  'Đồng Hồ': ['Đồng hồ nam', 'Đồng hồ nữ', 'Đồng hồ thông minh', 'Dây đồng hồ'],
  'Giày Dép Nam': ['Sneaker', 'Sandal', 'Giày tây', 'Dép', 'Boots'],
  'Thiết Bị Gia Dụng': ['Nồi chiên', 'Máy xay', 'Bàn ủi', 'Máy lọc nước', 'Đèn'],
  'Thể Thao & Du Lịch': ['Quần áo thể thao', 'Giày chạy bộ', 'Balo', 'Lều', 'Vali'],
  'Ô Tô & Xe Máy': ['Mũ bảo hiểm', 'Phụ tùng', 'Dầu nhớt', 'Đồ chơi xe'],
  'Mẹ & Bé': ['Sữa', 'Bỉm', 'Đồ chơi', 'Quần áo bé', 'Xe đẩy'],
  'Nhà Cửa & Đời Sống': ['Đèn', 'Rèm', 'Thảm', 'Dụng cụ bếp', 'Hộp đựng'],
  'Sắc Đẹp': ['Son', 'Kem dưỡng', 'Nước hoa', 'Chăm sóc da', 'Trang điểm'],
  'Sức Khỏe': ['Vitamin', 'Thực phẩm chức năng', 'Khẩu trang', 'Nhiệt kế'],
  'Giày Dép Nữ': ['Sandal', 'Cao gót', 'Sneaker', 'Boots', 'Dép'],
  'Túi Ví Nữ': ['Túi xách', 'Balo', 'Ví', 'Túi đeo chéo'],
};

// slugify imported from ../lib/slugify.js

export default function CategoryNav() {
  const [active, setActive] = useState(null);
  const cats = Object.keys(MEGA);
  return (
    <nav className="bg-white border-b border-gray-200 relative">
      <div className="container flex gap-2 overflow-x-auto px-2 h-10 items-center scrollbar-hide">
        {cats.map((c) => (
          <div
            key={c}
            className="relative"
            onMouseEnter={() => setActive(c)}
            onMouseLeave={() => setActive(null)}
          >
            <Link to={`/category/${slugify(c)}`} className="text-[13px] text-gray-600 px-1.5 py-2 whitespace-nowrap hover:text-shopee-orange block">
              {c}
            </Link>
            {active === c && (
              <div className="absolute top-full left-0 bg-white shadow-xl rounded z-50 p-4 min-w-[260px] grid grid-cols-2 gap-1">
                {MEGA[c].map((sub) => (
                  <Link key={sub} to={`/search?q=${encodeURIComponent(sub)}`} className="text-xs text-gray-600 hover:text-shopee-orange py-1">{sub}</Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}