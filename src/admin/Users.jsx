import { useState } from 'react';
import { useTable } from './useTable.js';
import { Card, Table, Btn, Input, Select, Modal, useConfirm } from './ui.jsx';

export default function Users() {
  const { rows, loading, insert, update, remove: removeRow } = useTable('users');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'customer' });
  const { confirm, dialog } = useConfirm();

  const openAdd = () => { setEditing(null); setForm({ name: '', email: '', phone: '', role: 'customer' }); setOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setOpen(true); };
  const save = async () => {
    if (!form.name || !form.email) return alert('Nhập tên và email');
    try {
      if (editing) await update(editing.id, form);
      else await insert(form);
      setOpen(false);
    } catch (e) { alert('Lỗi: ' + e.message); }
  };
  const remove = async (r) => {
    if (r.role === 'admin') return alert('Không thể xóa admin');
    if (await confirm(`Xóa người dùng "${r.name}"?`)) {
      try { await removeRow(r.id); } catch (e) { alert('Lỗi: ' + e.message); }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Người dùng</h1>
        <Btn onClick={openAdd}>+ Thêm người dùng</Btn>
      </div>
      <Card>
        {loading ? <div className="text-center py-8 text-gray-400">Đang tải...</div> : (
          <Table columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Tên' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'SĐT' },
            { key: 'role', label: 'Vai trò', render: (r) => r.role === 'admin' ? <span className="text-xs bg-shopee-orange/10 text-shopee-orange px-2 py-0.5 rounded-full">Admin</span> : <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Khách hàng</span> },
            { key: 'created_at', label: 'Ngày tạo' },
          ]} rows={rows} onEdit={openEdit} onDelete={remove} />
        )}
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Sửa người dùng' : 'Thêm người dùng'}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Tên" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Input label="SĐT" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Select label="Vai trò" value={form.role} onChange={(v) => setForm({ ...form, role: v })} options={[{ value: 'customer', label: 'Khách hàng' }, { value: 'admin', label: 'Admin' }]} />
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