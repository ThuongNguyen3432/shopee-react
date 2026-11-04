import { useState } from 'react';
import { useTable } from './useTable.js';
import { Card, Table, Btn, Input, Modal, useConfirm } from './ui.jsx';

export default function Vouchers() {
  const { rows, loading, insert, update, remove: removeRow } = useTable('vouchers');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', label: '', sub: '', value: 0, min_order: 0, active: true });
  const { confirm, dialog } = useConfirm();

  const openAdd = () => { setEditing(null); setForm({ code: '', label: '', sub: '', value: 0, min_order: 0, active: true }); setOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setOpen(true); };
  const save = async () => {
    if (!form.code || !form.label) return alert('Nhập mã và tên voucher');
    const payload = { ...form, value: Number(form.value), min_order: Number(form.min_order) };
    try {
      if (editing) await update(editing.id, payload);
      else await insert(payload);
      setOpen(false);
    } catch (e) { alert('Lỗi: ' + e.message); }
  };
  const remove = async (r) => {
    if (await confirm(`Xóa voucher "${r.code}"?`)) {
      try { await removeRow(r.id); } catch (e) { alert('Lỗi: ' + e.message); }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Voucher</h1>
        <Btn onClick={openAdd}>+ Thêm voucher</Btn>
      </div>
      <Card>
        {loading ? <div className="text-center py-8 text-gray-400">Đang tải...</div> : (
          <Table columns={[
            { key: 'code', label: 'Mã', render: (r) => <span className="font-mono text-shopee-orange font-bold">{r.code}</span> },
            { key: 'label', label: 'Tên' },
            { key: 'sub', label: 'Mô tả' },
            { key: 'value', label: 'Giá trị', render: (r) => `${Number(r.value).toLocaleString('vi-VN')}₫` },
            { key: 'min_order', label: 'Đơn tối thiểu', render: (r) => `${Number(r.min_order).toLocaleString('vi-VN')}₫` },
            { key: 'active', label: 'Trạng thái', render: (r) => r.active ? <span className="text-xs text-green-600">Kích hoạt</span> : <span className="text-xs text-gray-400">Tắt</span> },
          ]} rows={rows} onEdit={openEdit} onDelete={remove} />
        )}
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Sửa voucher' : 'Thêm voucher'}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Mã voucher" required value={form.code} onChange={(v) => setForm({ ...form, code: v.toUpperCase() })} />
          <Input label="Tên hiển thị" required value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
          <Input label="Mô tả" value={form.sub} onChange={(v) => setForm({ ...form, sub: v })} className="col-span-2" />
          <Input label="Giá trị giảm (₫)" type="number" value={form.value} onChange={(v) => setForm({ ...form, value: v })} />
          <Input label="Đơn tối thiểu (₫)" type="number" value={form.min_order} onChange={(v) => setForm({ ...form, min_order: v })} />
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-6 col-span-2">
            <input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Kích hoạt
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setOpen(false)}>Hủy</Btn>
          <Btn onClick={save}>{editing ? 'Cập nhật' : 'Thêm mới'}</Btn>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}