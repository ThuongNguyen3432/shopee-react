import { useState } from 'react';
import { Card, Table, Btn, Input, Modal, useConfirm } from './ui.jsx';
import { store } from './store.js';

export default function TopSearches() {
  const [rows, setRows] = useState(() => store.get('top_searches') || []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ keyword: '', count: 0 });
  const { confirm, dialog } = useConfirm();

  const persist = (next) => { setRows(next); store.set('top_searches', next); };

  const save = () => {
    if (!form.keyword) return alert('Nhập từ khóa');
    persist([...rows, { id: Date.now(), keyword: form.keyword, count: Number(form.count) || 0, active: true }]);
    setOpen(false);
    setForm({ keyword: '', count: 0 });
  };
  const toggle = (r) => persist(rows.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)));
  const remove = async (r) => {
    if (await confirm(`Xóa "${r.keyword}"?`)) persist(rows.filter((x) => x.id !== r.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Tìm kiếm hàng đầu</h1>
        <Btn onClick={() => setOpen(true)}>+ Thêm từ khóa</Btn>
      </div>
      <Card>
        <Table columns={[
          { key: 'keyword', label: 'Từ khóa' },
          { key: 'count', label: 'Lượt tìm', render: (r) => (r.count || 0).toLocaleString('vi-VN') },
          { key: 'active', label: 'Trạng thái', render: (r) => (
            <button onClick={() => toggle(r)} className={`text-xs px-2 py-1 rounded-sm ${r.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {r.active ? 'Hiển thị' : 'Ẩn'}
            </button>
          ) },
        ]} rows={rows} onDelete={remove} />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Thêm từ khóa">
        <div className="space-y-3">
          <Input label="Từ khóa" required value={form.keyword} onChange={(v) => setForm({ ...form, keyword: v })} />
          <Input label="Lượt tìm (ước tính)" type="number" value={form.count} onChange={(v) => setForm({ ...form, count: v })} />
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => setOpen(false)}>Hủy</Btn>
            <Btn onClick={save}>Thêm</Btn>
          </div>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}
