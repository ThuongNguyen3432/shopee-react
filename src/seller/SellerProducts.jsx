import { useState } from 'react';
import { useTable } from '../admin/useTable.js';
import { Card, Table, Btn, Input, Select, Modal, useConfirm } from '../admin/ui.jsx';

export default function SellerProducts() {
  const { rows, loading, insert, update, remove: removeRow } = useTable('products');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', old_price: '', category_id: 1, image: '', stock: 0, mall: false, status: 'active', description: '' });
  const { confirm, dialog } = useConfirm();

  const openAdd = () => { setEditing(null); setForm({ name: '', price: '', old_price: '', category_id: 1, image: '', stock: 0, mall: false, status: 'active', description: '' }); setOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setOpen(true); };
  const save = async () => {
    if (!form.name || !form.price) return alert('Nhập tên và giá');
    const payload = { ...form, price: Number(form.price), old_price: Number(form.old_price) || null, stock: Number(form.stock) || 0 };
    try {
      if (editing) await update(editing.id, payload);
      else await insert(payload);
      setOpen(false);
    } catch (e) { alert('Lỗi: ' + e.message); }
  };
  const remove = async (r) => {
    if (await confirm(`Xóa sản phẩm "${r.name}"?`)) {
      try { await removeRow(r.id); } catch (e) { alert('Lỗi: ' + e.message); }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Sản phẩm của shop</h1>
        <Btn onClick={openAdd}>+ Thêm sản phẩm</Btn>
      </div>
      <Card>
        {loading ? <div className="text-center py-8 text-gray-400">Đang tải...</div> : (
          <Table columns={[
            { key: 'image', label: 'Ảnh', render: (r) => <img src={r.image} alt={r.name} className="w-12 h-12 object-cover rounded-sm" /> },
            { key: 'name', label: 'Tên sản phẩm' },
            { key: 'price', label: 'Giá', render: (r) => <span className="font-bold text-shopee-orange">{Number(r.price).toLocaleString('vi-VN')}₫</span> },
            { key: 'stock', label: 'Kho' },
            { key: 'sold', label: 'Đã bán', render: (r) => r.sold || 0 },
            { key: 'status', label: 'Trạng thái', render: (r) => r.status === 'active' ? <span className="text-xs text-green-600">Đang bán</span> : <span className="text-xs text-gray-400">Ẩn</span> },
          ]} rows={rows} onEdit={openEdit} onDelete={remove} />
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'} width="max-w-2xl">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Tên sản phẩm" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} className="col-span-2" />
          <Input label="Giá" type="number" required value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          <Input label="Giá cũ" type="number" value={form.old_price} onChange={(v) => setForm({ ...form, old_price: v })} />
          <Input label="Tồn kho" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
          <Select label="Danh mục" value={form.category_id} onChange={(v) => setForm({ ...form, category_id: v })} options={[{ value: 1, label: 'Thời Trang Nam' }, { value: 2, label: 'Điện Thoại' }, { value: 3, label: 'Điện Tử' }]} />
          <Input label="URL ảnh" value={form.image} onChange={(v) => setForm({ ...form, image: v })} className="col-span-2" />
          <Input label="Mô tả" value={form.description} onChange={(v) => setForm({ ...form, description: v })} className="col-span-2" />
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-6">
            <input type="checkbox" checked={!!form.mall} onChange={(e) => setForm({ ...form, mall: e.target.checked })} />
            Shopee Mall
          </label>
          <Select label="Trạng thái" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: 'active', label: 'Đang bán' }, { value: 'inactive', label: 'Ẩn' }]} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setOpen(false)}>Hủy</Btn>
          <Btn onClick={save}>Lưu</Btn>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}
