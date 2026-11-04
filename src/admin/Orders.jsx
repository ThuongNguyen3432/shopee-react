import { useState } from 'react';
import { useTable } from './useTable.js';
import { Card, Table, Btn, Select, Modal, useConfirm } from './ui.jsx';
import { StatusBadge } from './Dashboard.jsx';

const STATUSES = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'done', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export default function Orders() {
  const { rows, loading, update, remove: removeRow } = useTable('orders');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { confirm, dialog } = useConfirm();

  const updateStatus = async (r, status) => {
    try { await update(r.id, { status }); setSelected({ ...r, status }); } catch (e) { alert('Lỗi: ' + e.message); }
  };

  const remove = async (r) => {
    if (await confirm(`Xóa đơn hàng ${r.code}?`)) {
      try { await removeRow(r.id); } catch (e) { alert('Lỗi: ' + e.message); }
    }
  };

  const columns = [
    { key: 'code', label: 'Mã đơn', render: (r) => <span className="text-shopee-orange font-medium">{r.code}</span> },
    { key: 'customer_name', label: 'Khách hàng' },
    { key: 'customer_phone', label: 'SĐT' },
    { key: 'address', label: 'Địa chỉ' },
    { key: 'total', label: 'Tổng tiền', render: (r) => <span className="font-bold">{Number(r.total).toLocaleString('vi-VN')}₫</span> },
    { key: 'status', label: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'created_at', label: 'Ngày' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Đơn hàng</h1>
      <Card>
        {loading ? <div className="text-center py-8 text-gray-400">Đang tải...</div> : (
          <Table columns={columns} rows={rows} onEdit={(r) => { setSelected(r); setOpen(true); }} onDelete={remove} />
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={`Đơn hàng ${selected?.code || ''}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Khách:</span> {selected.customer_name}</div>
              <div><span className="text-gray-500">SĐT:</span> {selected.customer_phone}</div>
              <div className="col-span-2"><span className="text-gray-500">Địa chỉ:</span> {selected.address}</div>
              <div><span className="text-gray-500">Tổng:</span> <span className="text-shopee-orange font-bold">{Number(selected.total).toLocaleString('vi-VN')}₫</span></div>
            </div>
            <Select label="Cập nhật trạng thái" value={selected.status} onChange={(v) => updateStatus(selected, v)} options={STATUSES} />
          </div>
        )}
      </Modal>
      {dialog}
    </div>
  );
}