import { store } from '../admin/store.js';

const DEFAULTS = {
  site_name: 'Shopee',
  logo_text: 'Shopee',
  tagline: 'Mua sắm online',
  header_trending: ['Áo thun nam', 'Tai nghe bluetooth', 'Dép nữ', 'Balo laptop', 'Son môi', 'Ốp lưng'],
  footer_copyright: '© 2025 Shopee. Tất cả các quyền được bảo lưu.',
  footer_countries: ['Singapore', 'Indonesia', 'Thái Lan', 'Malaysia', 'Việt Nam', 'Philippines', 'Brazil', 'México', 'Colombia', 'Chile'],
  home_sections: { banner: true, voucher_bar: true, category_icons: true, flash_sale: true, live: true, mall: true, product_grid: true, top_searches: true },
  preferred_badge: { enabled: true, min_rating: 4.8, min_sold: 500, show_mall: true },
  payment_methods: ['COD', 'ShopeePay', 'Thẻ tín dụng/ghi nợ', 'Chuyển khoản ngân hàng'],
  shipping_options: [
    { value: 'standard', label: 'Vận chuyển tiêu chuẩn', fee: 0, eta: '3-5 ngày' },
    { value: 'express', label: 'Vận chuyển nhanh', fee: 15000, eta: '1-2 ngày' },
  ],
  chat_quick_replies: ['Sản phẩm này còn hàng không?', 'Phí vận chuyển bao nhiêu?', 'Có mã giảm giá không shop?', 'Bao lâu thì giao hàng?', 'Có được đổi trả không?'],
  live_streams: [],
  mall_brands: [],
};

export function getSiteSettings() {
  const s = store.get('site_settings');
  if (s && typeof s === 'object') return { ...DEFAULTS, ...s, home_sections: { ...DEFAULTS.home_sections, ...(s.home_sections || {}) } };
  return { ...DEFAULTS };
}
