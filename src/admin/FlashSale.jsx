import { useState, useEffect } from 'react';
import { useTable } from './useTable.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { store } from './store.js';
import { Card, Table, Btn, Input, Select, Modal, useConfirm } from './ui.jsx';

export default function FlashSaleAdmin() {
  const { rows, loading, insert, update, remove: removeRow } = useTable('flash_sales');
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ product_id: '', discount: 50, stock: 100, sold: 0, start_at: '', end_at: '', active: true });
  const { confirm, dialog } = useConfirm();

  useEffect(() => {
    (async () => {
      try {
        if (isSupabaseConfigured) {
          const { data } = await supabase.from('products').select('*');
          setProducts(data || []);
        } else {
          setProducts(store.get('products'));
        }
      } catch { setProducts(store.get('products')); }
    })();
  }, []);

  const openAdd = () => { setEditing(null); setForm({ product_id: products[0]?.id || '', discount: 50, stock: 100, sold: 0, start_at: '', end_at: '', active: true }); setOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setOpen(true); };
  const save = async () => {
    if (!form.product_id) return alert('Chọn sản phẩm');
    const payload = { ...form, product_id: Number(form.product_id), discount: Number(form.discount), stock: Number(form.stock), sold: Number(form.sold) };
    try {
      if (editing) await update(editing.id, payload);
      else await insert(payload);
      setOpen(false);
    } catch (e) { alert('Lỗi: ' + e.message); }
  };
  const remove = async (r) => {
    if (await confirm('Xóa flash sale này?')) {
      try { await removeRow(r.id); } catch (e) { alert('Lỗi: ' + e.message); }
    }
  };

  const productName = (id) => products.find((p) => p.id === id)?.name || `#${id}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Flash Sale</h1>
        <Btn onClick={openAdd}>+ Thêm flash sale</Btn>
      </div>
      <Card>
        {loading ? <div className="text-center py-8 text-gray-400">Đang tải...</div> : (
          <Table columns={[
            { key: 'product_id', label: 'Sản phẩm', render: (r) => productName(r.product_id) },
            { key: 'discount', label: 'Giảm', render: (r) => `-${r.discount}%` },
            { key: 'stock', label: 'Tồn' },
            { key: 'sold', label: 'Đã bán' },
            { key: 'start_at', label: 'Bắt đầu' },
            { key: 'end_at', label: 'Kết thúc' },
            { key: 'active', label: 'Trạng thái', render: (r) => r.active ? <span className="text-xs text-green-600">Đang chạy</span> : <span className="text-xs text-gray-400">Tắt</span> },
          ]} rows={rows} onEdit={openEdit} onDelete={remove} />
        )}
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Sửa flash sale' : 'Thêm flash sale'}>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Sản phẩm" value={form.product_id} onChange={(v) => setForm({ ...form, product_id: v })} options={products.map((p) => ({ value: p.id, label: p.name }))} className="col-span-2" />
          <Input label="Giảm giá (%)" type="number" value={form.discount} onChange={(v) => setForm({ ...form, discount: v })} />
          <Input label="Tồn kho" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
          <Input label="Đã bán" type="number" value={form.sold} onChange={(v) => setForm({ ...form, sold: v })} />
          <Input label="Bắt đầu (YYYY-MM-DD HH:MM)" value={form.start_at} onChange={(v) => setForm({ ...form, start_at: v })} />
          <Input label="Kết thúc (YYYY-MM-DD HH:MM)" value={form.end_at} onChange={(v) => setForm({ ...form, end_at: v })} />
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