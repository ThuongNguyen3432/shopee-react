import { useState } from 'react';
import { Card, Btn, Input } from '../admin/ui.jsx';

export default function SellerSettings() {
  const [form, setForm] = useState({
    name: 'Minh Anh Shop',
    desc: 'Shop chuyên đồ thời trang và phụ kiện.',
    location: 'Hà Nội',
    phone: '0912 345 678',
    email: 'minhanh@shop.vn',
  });
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-800">Thiết lập shop</h1>
      <Card>
        <div className="space-y-3">
          <Input label="Tên shop" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Mô tả shop" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} />
          <Input label="Địa chỉ" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <Input label="Số điện thoại" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <div className="flex justify-end">
            <Btn onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>Lưu thay đổi</Btn>
          </div>
          {saved && <div className="text-sm text-green-600">Đã lưu.</div>}
        </div>
      </Card>
    </div>
  );
}
