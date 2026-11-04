import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
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

export default function CategoryNav() {
  const [mega, setMega] = useState(null);
  const closeTimer = useRef(null);
  const cats = Object.keys(MEGA);

  const open = (cat, e) => {
    clearTimeout(closeTimer.current);
    const r = e.currentTarget.getBoundingClientRect();
    const width = 320;
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    setMega({ cat, left, top: r.bottom + 2 });
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(null), 160);
  };

  return (
    <nav className="bg-white border-b border-gray-200 relative">
      <div className="container px-2 py-1.5">
        <Marquee pauseOnHover speed={26} gradient={false} autoFill className="overflow-hidden">
          {cats.map((c) => (
            <Link
              key={c}
              to={`/category/${slugify(c)}`}
              onMouseEnter={(e) => open(c, e)}
              onMouseLeave={scheduleClose}
              className="text-[13px] text-gray-600 px-3 py-2 whitespace-nowrap hover:text-shopee-orange block shrink-0"
            >
              {c}
            </Link>
          ))}
        </Marquee>
      </div>

      {mega && (
        <div
          onMouseEnter={() => clearTimeout(closeTimer.current)}
          onMouseLeave={scheduleClose}
          style={{ left: mega.left, top: mega.top, width: 320 }}
          className="fixed bg-white shadow-xl rounded border border-gray-100 z-[60] p-4 grid grid-cols-2 gap-1"
        >
          {MEGA[mega.cat].map((sub) => (
            <Link
              key={sub}
              to={`/search?q=${encodeURIComponent(sub)}`}
              className="text-xs text-gray-600 hover:text-shopee-orange py-1"
            >
              {sub}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
