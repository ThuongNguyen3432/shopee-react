import { Card } from '../admin/ui.jsx';
import { useTable } from '../admin/useTable.js';

export default function SellerAnalytics() {
  const { rows: products } = useTable('products');
  const { rows: orders } = useTable('orders');
  const topProducts = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5);
  const topShops = null;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Phân tích</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Top sản phẩm bán chạy">
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-shopee-orange text-white text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-sm" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-500">Đã bán {p.sold || 0}</div>
                </div>
                <div className="text-shopee-orange font-medium shrink-0">{Number(p.price).toLocaleString('vi-VN')}₫</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Tổng quan">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Tổng sản phẩm</span><span className="font-medium">{products.length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tổng đơn hàng</span><span className="font-medium">{orders.length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tỷ lệ hoàn thành</span><span className="font-medium">{orders.length ? Math.round((orders.filter((o) => o.status === 'done').length / orders.length) * 100) : 0}%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Đánh giá TB</span><span className="font-medium">4.8 ⭐</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
