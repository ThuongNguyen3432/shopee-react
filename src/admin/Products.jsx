import { useState, useEffect } from 'react';
import { useTable } from './useTable.js';
import { store } from './store.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { Card, Table, Btn, Input, Select, Textarea, Modal, useConfirm } from './ui.jsx';

const empty = { name: '', price: '', old_price: '', category_id: '', image: '', stock: 0, mall: false, status: 'active', description: '', rating: 4.5, sold: 0 };

export default function Products() {
  const { rows, loading, insert, update, remove: removeRow } = useTable('products');
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const { confirm, dialog } = useConfirm();

  useEffect(() => {
    // load categories for dropdown
    (async () => {
      try {
        if (isSupabaseConfigured) {
          const { data } = await supabase.from('categories').select('*');
          setCategories(data || []);
        } else {
          setCategories(store.get('categories'));
        }
      } catch { setCategories(store.get('categories')); }
    })();
  }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setOpen(true); };

  const save = async () => {
    if (!form.name || !form.price) return alert('Vui lòng nhập tên và giá');
    const payload = { ...form, price: Number(form.price), old_price: Number(form.old_price) || 0, stock: Number(form.stock) || 0, category_id: form.category_id ? Number(form.category_id) : null };
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

  const columns = [
    { key: 'image', label: 'Ảnh', render: (r) => <img src={r.image} alt={r.name} className="w-10 h-10 object-cover rounded-sm" /> },
    { key: 'name', label: 'Tên sản phẩm', render: (r) => <div><div className="font-medium text-gray-800">{r.name}</div><div className="text-xs text-gray-400">ID: {r.id}</div></div> },
    { key: 'price', label: 'Giá', render: (r) => <span className="text-shopee-orange font-bold">{Number(r.price).toLocaleString('vi-VN')}₫</span> },
    { key: 'stock', label: 'Tồn kho' },
    { key: 'sold', label: 'Đã bán' },
    { key: 'status', label: 'Trạng thái', render: (r) => r.status === 'active' ? <span className="text-xs text-green-600">Đang bán</span> : <span className="text-xs text-gray-400">Ẩn</span> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Sản phẩm</h1>
        <Btn onClick={openAdd}>+ Thêm sản phẩm</Btn>
      </div>

      <Card>
        {loading ? <div className="text-center py-8 text-gray-400">Đang tải...</div> : (
          <Table columns={columns} rows={rows} onEdit={openEdit} onDelete={remove} />
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'} width="max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Tên sản phẩm" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} className="col-span-2" />
          <Input label="Giá bán (₫)" required type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          <Input label="Giá gốc (₫)" type="number" value={form.old_price} onChange={(v) => setForm({ ...form, old_price: v })} />
          <Select label="Danh mục" value={form.category_id} onChange={(v) => setForm({ ...form, category_id: v })} options={[{ value: '', label: '-- Chọn --' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />
          <Input label="Tồn kho" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
          <Input label="URL ảnh" value={form.image} onChange={(v) => setForm({ ...form, image: v })} className="col-span-2" />
          <Select label="Trạng thái" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: 'active', label: 'Đang bán' }, { value: 'hidden', label: 'Ẩn' }]} />
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-6">
            <input type="checkbox" checked={!!form.mall} onChange={(e) => setForm({ ...form, mall: e.target.checked })} />
            Shopee Mall
          </label>
          <Textarea label="Mô tả" value={form.description} onChange={(v) => setForm({ ...form, description: v })} className="col-span-2" />
        </div>
        {form.image && <img src={form.image} alt="preview" className="w-24 h-24 object-cover rounded-sm mt-3 border" />}
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setOpen(false)}>Hủy</Btn>
          <Btn onClick={save}>{editing ? 'Cập nhật' : 'Thêm mới'}</Btn>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}