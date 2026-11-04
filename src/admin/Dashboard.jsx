import { useState, useEffect } from 'react';
import { useTable } from './useTable.js';
import { Card, StatCard } from './ui.jsx';

export function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Chờ xử lý', cls: 'bg-yellow-100 text-yellow-700' },
    shipping: { label: 'Đang giao', cls: 'bg-blue-100 text-blue-700' },
    done: { label: 'Hoàn thành', cls: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Đã hủy', cls: 'bg-red-100 text-red-700' },
  };
  const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-700' };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>;
}

export default function Dashboard() {
  const { rows: products } = useTable('products');
  const { rows: orders } = useTable('orders');
  const { rows: users } = useTable('users');

  const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const pending = orders.filter((o) => o.status === 'pending').length;
  const lowStock = products.filter((p) => (p.stock || 0) < 20).length;

  const recentOrders = [...orders].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2">
        <StatCard label="Doanh thu" value={revenue.toLocaleString('vi-VN') + '₫'} hint="Tổng đơn hàng" />
        <StatCard label="Đơn hàng" value={orders.length} hint={`${pending} chờ xử lý`} />
        <StatCard label="Sản phẩm" value={products.length} hint={`${lowStock} sắp hết hàng`} />
        <StatCard label="Người dùng" value={users.length} hint="Tài khoản đã đăng ký" />
      </div>

      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        <Card title="Đơn hàng gần đây">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase">
              <tr><th className="text-left py-2">Mã đơn</th><th className="text-left py-2">Khách hàng</th><th className="text-left py-2">Tổng</th><th className="text-left py-2">Trạng thái</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="py-2 text-shopee-orange font-medium">{o.code}</td>
                  <td className="py-2">{o.customer_name}</td>
                  <td className="py-2">{Number(o.total).toLocaleString('vi-VN')}₫</td>
                  <td className="py-2"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Sản phẩm bán chạy">
          <div className="space-y-3">
            {[...products].sort((a, b) => b.sold - a.sold).slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-700 truncate">{p.name}</div>
                  <div className="text-xs text-gray-400">Đã bán {p.sold}</div>
                </div>
                <div className="text-shopee-orange text-sm font-bold">{Number(p.price).toLocaleString('vi-VN')}₫</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}