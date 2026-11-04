import { useState } from 'react';
import { useTable } from './useTable.js';
import { Card, Table, Btn, Input, Modal, useConfirm } from './ui.jsx';

export default function Categories() {
  const { rows, loading, insert, update, remove: removeRow } = useTable('categories');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '' });
  const { confirm, dialog } = useConfirm();

  const openAdd = () => { setEditing(null); setForm({ name: '', slug: '' }); setOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setOpen(true); };
  const save = async () => {
    if (!form.name) return alert('Nhập tên danh mục');
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-');
    const payload = { name: form.name, slug };
    try {
      if (editing) await update(editing.id, payload);
      else await insert(payload);
      setOpen(false);
    } catch (e) { alert('Lỗi: ' + e.message); }
  };
  const remove = async (r) => {
    if (await confirm(`Xóa danh mục "${r.name}"?`)) {
      try { await removeRow(r.id); } catch (e) { alert('Lỗi: ' + e.message); }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Danh mục</h1>
        <Btn onClick={openAdd}>+ Thêm danh mục</Btn>
      </div>
      <Card>
        {loading ? <div className="text-center py-8 text-gray-400">Đang tải...</div> : (
          <Table columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Tên danh mục' },
            { key: 'slug', label: 'Slug' },
          ]} rows={rows} onEdit={openEdit} onDelete={remove} />
        )}
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Sửa danh mục' : 'Thêm danh mục'}>
        <div className="space-y-3">
          <Input label="Tên danh mục" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Slug (tùy chọn)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
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