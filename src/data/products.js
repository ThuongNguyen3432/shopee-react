const LOCATIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Nghệ An', 'Thanh Hóa'];

const CATEGORIES = [
  'Thời Trang Nam', 'Điện Thoại & Phụ Kiện', 'Thiết Bị Điện Tử', 'Máy Tính & Laptop',
  'Máy Ảnh & Quay Phim', 'Đồng Hồ', 'Giày Dép Nam', 'Thiết Bị Gia Dụng',
  'Thể Thao & Du Lịch', 'Ô Tô & Xe Máy', 'Mẹ & Bé', 'Nhà Cửa & Đời Sống',
  'Sắc Đẹp', 'Sức Khỏe', 'Giày Dép Nữ', 'Túi Ví Nữ', 'Phụ Kiện', 'Bách Hóa',
  'Nhà Sách', 'Thời Trang Nữ',
];

const ADJECTIVES = ['Cao cấp', 'Chính hãng', 'Chất lượng', 'Tiện dụng', 'Thời trang', 'Thông minh', 'Bền bỉ', 'Sang trọng', 'Năng động', 'Đa năng'];
const NOUNS = ['Áo thun', 'Quần jean', 'Giày sneaker', 'Túi xách', 'Tai nghe', 'Ốp lưng', 'Bình nước', 'Kem chống nắng', 'Son môi', 'Balo', 'Đồng hồ', 'Nồi chiên', 'Chuột máy tính', 'Bàn phím', 'Màn hình', 'Laptop', 'Điện thoại', 'Máy ảnh', 'Quạt', 'Đèn LED', 'Gối', 'Chăn', 'Khăn', 'Ví', 'Mũ', 'Kính râm', 'Dây lưng', 'Tất', 'Vớ', 'Dép'];

function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const PRODUCTS = [];
for (let i = 1; i <= 3000; i++) {
  const cat = CATEGORIES[i % CATEGORIES.length];
  const adj = ADJECTIVES[i % ADJECTIVES.length];
  const noun = NOUNS[i % NOUNS.length];
  const name = `${adj} ${noun} ${String(i).padStart(4, '0')}`;
  const price = Math.round((50 + seededRand(i) * 950) * 1000);
  const oldPrice = Math.round(price * (1.2 + seededRand(i + 1) * 0.8));
  const rating = (4 + seededRand(i + 2) * 1).toFixed(1);
  const sold = Math.floor(seededRand(i + 3) * 10000);
  const stock = Math.floor(seededRand(i + 4) * 200) + 1;
  const mall = seededRand(i + 5) > 0.7;
  const location = LOCATIONS[Math.floor(seededRand(i + 6) * LOCATIONS.length)];
  PRODUCTS.push({
    id: 1000 + i,
    name,
    price,
    old_price: oldPrice,
    sold: sold > 1000 ? (Math.floor(sold / 1000) + 'k') : sold,
    rating: Number(rating),
    img: `https://picsum.photos/seed/prod${i}/400/400`,
    mall,
    category: cat,
    location,
    description: `${name} - sản phẩm chất lượng cao, giao hàng nhanh, hỗ trợ đổi trả 7 ngày.`,
  });
}

export { PRODUCTS, CATEGORIES };