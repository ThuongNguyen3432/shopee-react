import { Card, Btn } from '../admin/ui.jsx';
import { useTable } from '../admin/useTable.js';

export default function SellerDashboard() {
  const { rows: products } = useTable('products');
  const { rows: orders } = useTable('orders');
  const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const pending = orders.filter((o) => o.status === 'pending').length;
  const shipping = orders.filter((o) => o.status === 'shipping').length;

  const stats = [
    { label: 'Doanh thu', value: revenue.toLocaleString('vi-VN') + '₫', color: 'text-shopee-orange' },
    { label: 'Đơn hàng', value: orders.length, color: 'text-blue-600' },
    { label: 'Chờ xử lý', value: pending, color: 'text-orange-500' },
    { label: 'Đang giao', value: shipping, color: 'text-blue-500' },
    { label: 'Sản phẩm', value: products.length, color: 'text-green-600' },
    { label: 'Lượt xem', value: '12.4K', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Tổng quan shop</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Đơn hàng gần đây">
          {orders.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">Chưa có đơn hàng.</div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 6).map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-800 truncate">{o.code}</div>
                    <div className="text-xs text-gray-500">{o.customer_name}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-shopee-orange font-medium">{Number(o.total).toLocaleString('vi-VN')}₫</div>
                    <div className="text-[10px] text-gray-400">{o.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card title="Sản phẩm bán chạy">
          {products.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">Chưa có sản phẩm.</div>
          ) : (
            <div className="space-y-2">
              {products.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3 text-sm border-b border-gray-100 pb-2 last:border-0">
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-500">Đã bán {p.sold || 0}</div>
                  </div>
                  <div className="text-shopee-orange font-medium shrink-0">{Number(p.price).toLocaleString('vi-VN')}₫</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
