import { Card } from '../admin/ui.jsx';
import { useTable } from '../admin/useTable.js';

export default function SellerRevenue() {
  const { rows: orders } = useTable('orders');
  const total = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const done = orders.filter((o) => o.status === 'done');
  const doneTotal = done.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const pending = orders.filter((o) => o.status === 'pending').reduce((s, o) => s + (Number(o.total) || 0), 0);

  const stats = [
    { label: 'Tổng doanh thu', value: total.toLocaleString('vi-VN') + '₫', color: 'text-shopee-orange' },
    { label: 'Đã hoàn thành', value: doneTotal.toLocaleString('vi-VN') + '₫', color: 'text-green-600' },
    { label: 'Chờ xử lý', value: pending.toLocaleString('vi-VN') + '₫', color: 'text-orange-500' },
    { label: 'Số đơn', value: orders.length, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Doanh thu</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</div>
          </Card>
        ))}
      </div>
      <Card title="Lịch sử giao dịch">
        <div className="space-y-2">
          {orders.slice(0, 10).map((o) => (
            <div key={o.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
              <div className="min-w-0">
                <div className="font-medium text-gray-800">{o.code}</div>
                <div className="text-xs text-gray-500">{o.customer_name} · {o.created_at?.slice(0, 10)}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-shopee-orange font-medium">{Number(o.total).toLocaleString('vi-VN')}₫</div>
                <div className="text-[10px] text-gray-400">{o.status}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
