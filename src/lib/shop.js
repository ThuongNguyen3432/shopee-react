const SHOP_PREFIXES = [
  'Minh Anh', 'TechZone', 'Style Việt', 'Home & Life', 'Beauty Corner',
  'Thiên Phú', 'An Nhiên', 'Fashion Hub', 'Digital World', 'Gia Dụng Việt',
  'Mẹ & Bé', 'Sách & Quà', 'Thể Thao Pro', 'Phụ Kiện Xinh', 'Điện Máy',
  'Thực Phẩm Sạch', 'Đồ Chơi', 'Nội Thất', 'Văn Phòng Phẩm', 'Y Tế',
];

const SHOP_SUFFIXES = ['', ' Official', ' Store', ' Shop', ' Mall', ' Center'];

const SHOP_LOCATIONS = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng',
  'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'Khánh Hòa',
  'Nghệ An', 'Thanh Hóa', 'Quảng Ninh', 'Lâm Đồng',
];

export const SHOP_COUNT = 1000;

export const SHOP_NAMES = Array.from({ length: SHOP_COUNT }, (_, i) => {
  const prefix = SHOP_PREFIXES[i % SHOP_PREFIXES.length];
  const suffix = SHOP_SUFFIXES[(i * 7) % SHOP_SUFFIXES.length];
  const num = Math.floor(i / SHOP_PREFIXES.length) + 1;
  return num > 1 ? `${prefix}${suffix} ${num}` : `${prefix}${suffix}`.trim();
});

function seedOf(value) {
  return Number(String(value ?? '').replace(/\D/g, '')) || 1;
}

/** Chỉ số shop (0..999) suy ra từ id sản phẩm, dùng chung cho mọi nơi. */
export function shopIndexOf(product = {}) {
  return seedOf(product.id ?? product.shopId ?? 1) % SHOP_NAMES.length;
}

function buildShop(id, name, extra = {}) {
  const seed = id + 1;
  return {
    id,
    name,
    avatar: extra.avatar
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ee4d2d&color=fff&size=140`,
    banner: extra.banner || `https://picsum.photos/seed/shopbanner${id}/1200/220`,
    location: extra.location || SHOP_LOCATIONS[id % SHOP_LOCATIONS.length],
    mall: !!extra.mall || (id % 7 === 0),
    category: extra.category || '',
    online: '5 phút trước',
    products: 1200 + (seed * 137) % 800,
    rating: Number((4.7 + (seed % 30) / 100).toFixed(2)),
    ratingCount: 800 + (seed * 37) % 4200,
    followers: 5000 + (seed * 97) % 40000,
    joined: `${2 + (seed % 5)} năm trước`,
    responseRate: `${90 + (seed % 10)}%`,
    responseTime: `${1 + (seed % 5)} giờ`,
    shipTime: `${1 + (seed % 3)} ngày`,
  };
}

export function getShopInfo(product = {}) {
  const id = shopIndexOf(product);
  const name = product.shop_name || SHOP_NAMES[id];
  return buildShop(id, name, {
    avatar: product.shop_avatar,
    location: product.location,
    mall: product.mall,
    category: product.category,
  });
}

export function getShopById(shopId, overrides = {}) {
  const parsed = Math.abs(parseInt(shopId, 10));
  const id = Number.isFinite(parsed) ? parsed % SHOP_NAMES.length : 0;
  return buildShop(id, overrides.name || SHOP_NAMES[id], {
    location: overrides.location,
    mall: overrides.mall,
    category: overrides.category,
  });
}

export function shopPath(product = {}) {
  const shop = getShopInfo(product);
  const params = new URLSearchParams();
  if (shop.location) params.set('location', shop.location);
  if (shop.mall) params.set('mall', '1');
  const qs = params.toString();
  return `/shop/${shop.id}${qs ? `?${qs}` : ''}`;
}
