import { useState } from 'react';
import { Card, Btn, Input } from '../admin/ui.jsx';

const SEED = [
  { id: 1, name: 'Flash Sale 12.12', discount: 50, product: 'Tai nghe Bluetooth', start: '2026-12-12 00:00', end: '2026-12-12 23:59', active: true },
  { id: 2, name: 'Giảm giá cuối tuần', discount: 20, product: 'Áo thun nam', start: '2026-11-15 00:00', end: '2026-11-17 23:59', active: true },
];

export default function SellerPromotions() {
  const [rows, setRows] = useState(SEED);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', discount: 10, product: '', start: '', end: '' });

  const save = () => {
    if (!form.name || !form.product) return alert('Nhập tên và sản phẩm');
    setRows((r) => [...r, { ...form, id: Date.now(), discount: Number(form.discount), active: true }]);
    setOpen(false);
    setForm({ name: '', discount: 10, product: '', start: '', end: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Khuyến mãi</h1>
        <Btn onClick={() => setOpen(true)}>+ Tạo khuyến mãi</Btn>
      </div>
      <Card>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 border border-gray-100 rounded-sm p-3">
              <div className="min-w-0">
                <div className="font-medium text-gray-800">{r.name}</div>
                <div className="text-xs text-gray-500">{r.product} · -{r.discount}%</div>
                <div className="text-[11px] text-gray-400">{r.start} → {r.end}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-sm ${r.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {r.active ? 'Đang chạy' : 'Tắt'}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" style={{ display: open ? 'flex' : 'none' }} onClick={() => setOpen(false)}>
        <div className="bg-white rounded-sm w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
          <h2 className="font-medium text-gray-800 mb-3">Tạo khuyến mãi</h2>
          <div className="space-y-3">
            <Input label="Tên chương trình" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Sản phẩm" value={form.product} onChange={(v) => setForm({ ...form, product: v })} />
            <Input label="Giảm giá (%)" type="number" value={form.discount} onChange={(v) => setForm({ ...form, discount: v })} />
            <Input label="Bắt đầu" value={form.start} onChange={(v) => setForm({ ...form, start: v })} />
            <Input label="Kết thúc" value={form.end} onChange={(v) => setForm({ ...form, end: v })} />
            <div className="flex justify-end gap-2">
              <Btn variant="secondary" onClick={() => setOpen(false)}>Hủy</Btn>
              <Btn onClick={save}>Tạo</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
