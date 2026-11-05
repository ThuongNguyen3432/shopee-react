import { useState, useEffect } from 'react';
import { Card, Btn, Input, Select } from './ui.jsx';
import { store } from './store.js';

export default function Popup() {
  const [form, setForm] = useState({
    enabled: true, title: '', desc: '', image: '', button_text: 'Nhận ngay',
    button_link: '/vouchers', frequency: 'once',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = store.get('popup') || {};
    setForm({
      enabled: p.enabled !== false,
      title: p.title || '',
      desc: p.desc || '',
      image: p.image || '',
      button_text: p.button_text || 'Nhận ngay',
      button_link: p.button_link || '/vouchers',
      frequency: p.frequency || 'once',
    });
  }, []);

  const save = () => {
    store.set('popup', { ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Popup quảng cáo</h1>
        <Btn onClick={save}>Lưu cấu hình</Btn>
      </div>
      {saved && <div className="text-sm text-green-600 bg-green-50 p-2 rounded">Đã lưu.</div>}

      <Card>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={!!form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
            Bật popup
          </label>
          <Input label="Tiêu đề" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Input label="Mô tả" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} />
          <Input label="URL ảnh" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          <Input label="Text nút" value={form.button_text} onChange={(v) => setForm({ ...form, button_text: v })} />
          <Input label="Link nút" value={form.button_link} onChange={(v) => setForm({ ...form, button_link: v })} />
          <Select label="Tần suất hiển thị" value={form.frequency} onChange={(v) => setForm({ ...form, frequency: v })} options={[
            { value: 'always', label: 'Mỗi lần vào trang' },
            { value: 'once', label: 'Chỉ lần đầu (localStorage)' },
            { value: 'daily', label: '1 lần/ngày' },
          ]} />
        </div>
        {form.image && (
          <div className="mt-4 border border-gray-200 rounded-sm p-3">
            <div className="text-xs text-gray-500 mb-2">Xem trước:</div>
            <div className="bg-white rounded-sm overflow-hidden border border-gray-100 max-w-xs">
              <img src={form.image} alt="preview" className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="font-medium text-gray-800 text-sm">{form.title}</div>
                <div className="text-xs text-gray-500 mt-1">{form.desc}</div>
                <button className="mt-2 w-full h-8 bg-shopee-orange text-white text-xs rounded-[2px]">{form.button_text}</button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
