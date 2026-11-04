import { useState } from 'react';
import { useTable } from './useTable.js';
import { Card, Table, Btn, Input, Select, Modal, useConfirm } from './ui.jsx';

export default function Banners() {
  const { rows, loading, insert, update, remove: removeRow } = useTable('banners');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', image: '', link: '#', position: 'main', active: true, sort_order: 0 });
  const { confirm, dialog } = useConfirm();

  const openAdd = () => { setEditing(null); setForm({ title: '', image: '', link: '#', position: 'main', active: true, sort_order: 0 }); setOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setOpen(true); };
  const save = async () => {
    if (!form.title || !form.image) return alert('Nhập tiêu đề và URL ảnh');
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
    try {
      if (editing) await update(editing.id, payload);
      else await insert(payload);
      setOpen(false);
    } catch (e) { alert('Lỗi: ' + e.message); }
  };
  const remove = async (r) => {
    if (await confirm(`Xóa banner "${r.title}"?`)) {
      try { await removeRow(r.id); } catch (e) { alert('Lỗi: ' + e.message); }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Banner</h1>
        <Btn onClick={openAdd}>+ Thêm banner</Btn>
      </div>
      <Card>
        {loading ? <div className="text-center py-8 text-gray-400">Đang tải...</div> : (
          <Table columns={[
            { key: 'image', label: 'Ảnh', render: (r) => <img src={r.image} alt={r.title} className="w-24 h-12 object-cover rounded-sm" /> },
            { key: 'title', label: 'Tiêu đề' },
            { key: 'position', label: 'Vị trí' },
            { key: 'link', label: 'Link' },
            { key: 'active', label: 'Trạng thái', render: (r) => r.active ? <span className="text-xs text-green-600">Hiển thị</span> : <span className="text-xs text-gray-400">Ẩn</span> },
          ]} rows={rows} onEdit={openEdit} onDelete={remove} />
        )}
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Sửa banner' : 'Thêm banner'} width="max-w-2xl">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Tiêu đề" required value={form.title} onChange={(v) => setForm({ ...form, title: v })} className="col-span-2" />
          <Input label="URL ảnh" required value={form.image} onChange={(v) => setForm({ ...form, image: v })} className="col-span-2" />
          <Input label="Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
          <Select label="Vị trí" value={form.position} onChange={(v) => setForm({ ...form, position: v })} options={[{ value: 'main', label: 'Banner chính' }, { value: 'side', label: 'Banner phụ' }]} />
          <Input label="Thứ tự" type="number" value={form.sort_order} onChange={(v) => setForm({ ...form, sort_order: v })} />
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-6">
            <input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Hiển thị
          </label>
        </div>
        {form.image && <img src={form.image} alt="preview" className="w-full h-24 object-cover rounded-sm mt-3 border" />}
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setOpen(false)}>Hủy</Btn>
          <Btn onClick={save}>{editing ? 'Cập nhật' : 'Thêm mới'}</Btn>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}