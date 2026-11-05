import { useState } from 'react';
import { Card, Btn, Input, Table, Modal, useConfirm } from '../admin/ui.jsx';

const SEED = [
  { id: 1, code: 'SHOP20K', label: 'Giảm 20K', value: 20000, min_order: 99000, active: true, used: 45, total: 100 },
  { id: 2, code: 'SHOP10P', label: 'Giảm 10%', value: 30000, min_order: 100000, active: true, used: 12, total: 50 },
];

export default function SellerVouchers() {
  const [rows, setRows] = useState(SEED);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', label: '', value: 0, min_order: 0, total: 50 });
  const { confirm, dialog } = useConfirm();

  const save = () => {
    if (!form.code || !form.label) return alert('Nhập mã và tên voucher');
    setRows((r) => [...r, { ...form, id: Date.now(), value: Number(form.value), min_order: Number(form.min_order), total: Number(form.total), used: 0, active: true }]);
    setOpen(false);
    setForm({ code: '', label: '', value: 0, min_order: 0, total: 50 });
  };
  const remove = async (r) => {
    if (await confirm(`Xóa voucher ${r.code}?`)) setRows((rows) => rows.filter((x) => x.id !== r.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Voucher của shop</h1>
        <Btn onClick={() => setOpen(true)}>+ Tạo voucher</Btn>
      </div>
      <Card>
        <Table columns={[
          { key: 'code', label: 'Mã', render: (r) => <span className="font-mono text-shopee-orange">{r.code}</span> },
          { key: 'label', label: 'Tên' },
          { key: 'value', label: 'Giá trị', render: (r) => r.value.toLocaleString('vi-VN') + '₫' },
          { key: 'min_order', label: 'Đơn tối thiểu', render: (r) => r.min_order.toLocaleString('vi-VN') + '₫' },
          { key: 'used', label: 'Đã dùng', render: (r) => `${r.used}/${r.total}` },
          { key: 'active', label: 'Trạng thái', render: (r) => r.active ? <span className="text-xs text-green-600">Hoạt động</span> : <span className="text-xs text-gray-400">Tắt</span> },
        ]} rows={rows} onDelete={remove} />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Tạo voucher">
        <div className="space-y-3">
          <Input label="Mã voucher" required value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
          <Input label="Tên voucher" required value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
          <Input label="Giá trị (₫)" type="number" value={form.value} onChange={(v) => setForm({ ...form, value: v })} />
          <Input label="Đơn tối thiểu (₫)" type="number" value={form.min_order} onChange={(v) => setForm({ ...form, min_order: v })} />
          <Input label="Số lượng" type="number" value={form.total} onChange={(v) => setForm({ ...form, total: v })} />
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => setOpen(false)}>Hủy</Btn>
            <Btn onClick={save}>Tạo</Btn>
          </div>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}
