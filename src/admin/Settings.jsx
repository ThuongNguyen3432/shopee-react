import { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase.js';
import { Card, Btn } from './ui.jsx';

export default function Settings() {
  const [msg, setMsg] = useState('');
  const reset = () => {
    localStorage.removeItem('shopee_admin_store_v1');
    setMsg('Đã reset dữ liệu về mặc định. Tải lại trang để áp dụng.');
  };
  const exportData = () => {
    const raw = localStorage.getItem('shopee_admin_store_v1');
    const blob = new Blob([raw || '{}'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'shopee_admin_backup.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Cài đặt</h1>

      <Card title="Kết nối Supabase">
        <div className="text-sm space-y-2">
          <div>Trạng thái: {isSupabaseConfigured ? <span className="text-green-600 font-medium">Đã kết nối</span> : <span className="text-yellow-600 font-medium">Chưa cấu hình (đang dùng dữ liệu local)</span>}</div>
          <p className="text-gray-500 text-xs">
            Để kết nối Supabase, tạo file <code className="bg-gray-100 px-1 rounded">.env</code> ở thư mục gốc với:
          </p>
          <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded-sm overflow-x-auto">{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...`}</pre>
          <p className="text-gray-500 text-xs">Sau đó chạy lại <code className="bg-gray-100 px-1 rounded">npm run dev</code>.</p>
        </div>
      </Card>

      <Card title="Dữ liệu">
        <div className="flex gap-2">
          <Btn variant="secondary" onClick={exportData}>⬇ Xuất dữ liệu (JSON)</Btn>
          <Btn variant="danger" onClick={reset}>↻ Reset về mặc định</Btn>
        </div>
        {msg && <div className="text-sm text-green-600 mt-3">{msg}</div>}
      </Card>

      <Card title="Hướng dẫn schema Supabase">
        <p className="text-xs text-gray-500 mb-2">Khi tạo project Supabase, tạo các bảng sau (SQL):</p>
        <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded-sm overflow-x-auto whitespace-pre-wrap">{`create table categories (id bigint primary key generated always as identity, name text, slug text, created_at timestamptz default now());
create table products (id bigint primary key generated always as identity, name text, price numeric, old_price numeric, category_id bigint references categories(id), image text, rating numeric, sold int, stock int, mall boolean, status text, description text, created_at timestamptz default now());
create table orders (id bigint primary key generated always as identity, code text, customer_name text, customer_phone text, address text, total numeric, status text, created_at timestamptz default now());
create table users (id uuid primary key default auth.uid(), name text, email text, phone text, role text default 'customer', created_at timestamptz default now());
create table vouchers (id bigint primary key generated always as identity, code text unique, label text, sub text, value numeric, min_order numeric, active boolean default true);
create table banners (id bigint primary key generated always as identity, title text, image text, link text, position text, sort_order int, active boolean default true);
create table flash_sales (id bigint primary key generated always as identity, product_id bigint references products(id), discount int, stock int, sold int, start_at timestamptz, end_at timestamptz, active boolean default true);`}</pre>
      </Card>
    </div>
  );
}