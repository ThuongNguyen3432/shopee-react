import { useState, useEffect } from 'react';
import { Card, Btn, Input } from './ui.jsx';
import { store } from './store.js';

const DEFAULT = {
  site_name: 'Shopee', logo_text: 'Shopee', tagline: 'Mua sắm online',
  header_trending: ['Áo thun nam', 'Tai nghe bluetooth', 'Dép nữ', 'Balo laptop', 'Son môi', 'Ốp lưng'],
  footer_copyright: '© 2025 Shopee. Tất cả các quyền được bảo lưu.',
  footer_countries: ['Singapore', 'Indonesia', 'Thái Lan', 'Malaysia', 'Việt Nam', 'Philippines'],
  home_sections: { banner: true, voucher_bar: true, category_icons: true, flash_sale: true, live: true, mall: true, product_grid: true, top_searches: true },
  payment_methods: ['COD', 'ShopeePay', 'Thẻ tín dụng/ghi nợ', 'Chuyển khoản ngân hàng'],
  shipping_options: [
    { value: 'standard', label: 'Vận chuyển tiêu chuẩn', fee: 0, eta: '3-5 ngày' },
    { value: 'express', label: 'Vận chuyển nhanh', fee: 15000, eta: '1-2 ngày' },
  ],
  chat_quick_replies: ['Sản phẩm này còn hàng không?', 'Phí vận chuyển bao nhiêu?', 'Có mã giảm giá không shop?', 'Bao lâu thì giao hàng?', 'Có được đổi trả không?'],
  live_streams: [{ title: 'Live Sale 12.12', viewers: '12.3K', img: 'https://picsum.photos/seed/live1/240/320' }],
  mall_brands: [{ name: 'Samsung', img: 'https://picsum.photos/seed/brand1/120/60', tag: 'Chính hãng' }],
};

export default function SiteSettings() {
  const [form, setForm] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = store.get('site_settings');
    if (s && typeof s === 'object') setForm({ ...DEFAULT, ...s });
  }, []);

  const save = () => {
    store.set('site_settings', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateList = (key, value) => {
    setForm((f) => ({ ...f, [key]: value.split('\n').map((x) => x.trim()).filter(Boolean) }));
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Cấu hình site</h1>
        <Btn onClick={save}>Lưu cấu hình</Btn>
      </div>
      {saved && <div className="text-sm text-green-600 bg-green-50 p-2 rounded">Đã lưu. Tải lại trang để áp dụng.</div>}

      <Card title="Thông tin chung">
        <div className="space-y-3">
          <Input label="Tên site" value={form.site_name} onChange={(v) => setForm({ ...form, site_name: v })} />
          <Input label="Logo text" value={form.logo_text} onChange={(v) => setForm({ ...form, logo_text: v })} />
          <Input label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
          <Input label="Copyright footer" value={form.footer_copyright} onChange={(v) => setForm({ ...form, footer_copyright: v })} />
        </div>
      </Card>

      <Card title="Từ khóa tìm kiếm header (mỗi dòng 1 từ)">
        <textarea
          value={(form.header_trending || []).join('\n')}
          onChange={(e) => updateList('header_trending', e.target.value)}
          rows={6}
          className="w-full border border-gray-200 rounded-[2px] px-3 py-2 text-sm outline-none focus:border-shopee-orange resize-none"
        />
      </Card>

      <Card title="Quốc gia footer (mỗi dòng 1 nước)">
        <textarea
          value={(form.footer_countries || []).join('\n')}
          onChange={(e) => updateList('footer_countries', e.target.value)}
          rows={6}
          className="w-full border border-gray-200 rounded-[2px] px-3 py-2 text-sm outline-none focus:border-shopee-orange resize-none"
        />
      </Card>

      <Card title="Hiển thị các section trang chủ">
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(form.home_sections || {}).map((k) => (
            <label key={k} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={!!(form.home_sections || {})[k]}
                onChange={(e) => setForm({ ...form, home_sections: { ...form.home_sections, [k]: e.target.checked } })}
              />
              {k}
            </label>
          ))}
        </div>
      </Card>

      <Card title="Phương thức thanh toán (mỗi dòng 1 phương thức)">
        <textarea
          value={(form.payment_methods || []).join('\n')}
          onChange={(e) => updateList('payment_methods', e.target.value)}
          rows={5}
          className="w-full border border-gray-200 rounded-[2px] px-3 py-2 text-sm outline-none focus:border-shopee-orange resize-none"
        />
      </Card>

      <Card title="Chat quick replies (mỗi dòng 1 câu)">
        <textarea
          value={(form.chat_quick_replies || []).join('\n')}
          onChange={(e) => updateList('chat_quick_replies', e.target.value)}
          rows={5}
          className="w-full border border-gray-200 rounded-[2px] px-3 py-2 text-sm outline-none focus:border-shopee-orange resize-none"
        />
      </Card>

      <Card title="Live streams (JSON)">
        <textarea
          value={JSON.stringify(form.live_streams || [], null, 2)}
          onChange={(e) => { try { setForm({ ...form, live_streams: JSON.parse(e.target.value) }); } catch {} }}
          rows={8}
          className="w-full border border-gray-200 rounded-[2px] px-3 py-2 text-xs font-mono outline-none focus:border-shopee-orange resize-none"
        />
      </Card>

      <Card title="Mall brands (JSON)">
        <textarea
          value={JSON.stringify(form.mall_brands || [], null, 2)}
          onChange={(e) => { try { setForm({ ...form, mall_brands: JSON.parse(e.target.value) }); } catch {} }}
          rows={8}
          className="w-full border border-gray-200 rounded-[2px] px-3 py-2 text-xs font-mono outline-none focus:border-shopee-orange resize-none"
        />
      </Card>
      <Card title="Badge Yêu thích (tiêu chí hiển thị)">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={!!(form.preferred_badge || {}).enabled} onChange={(e) => setForm({ ...form, preferred_badge: { ...(form.preferred_badge || {}), enabled: e.target.checked } })} />
            Bật badge Yêu thích
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={(form.preferred_badge || {}).show_mall !== false} onChange={(e) => setForm({ ...form, preferred_badge: { ...(form.preferred_badge || {}), show_mall: e.target.checked } })} />
            Hiện cho sản phẩm Mall
          </label>
          <Input label="Rating tối thiểu" type="number" value={(form.preferred_badge || {}).min_rating ?? 4.8} onChange={(v) => setForm({ ...form, preferred_badge: { ...(form.preferred_badge || {}), min_rating: Number(v) } })} />
          <Input label="Đã bán tối thiểu" type="number" value={(form.preferred_badge || {}).min_sold ?? 500} onChange={(v) => setForm({ ...form, preferred_badge: { ...(form.preferred_badge || {}), min_sold: Number(v) } })} />
        </div>
      </Card>
    </div>
  );
}
