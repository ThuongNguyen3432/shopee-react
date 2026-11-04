import { supabase } from '../lib/supabase.js';

const KEY = 'shopee_admin_store_v1';

const seed = {
  categories: [
    { id: 1, name: 'Thời Trang Nam', slug: 'thoi-trang-nam' },
    { id: 2, name: 'Điện Thoại & Phụ Kiện', slug: 'dien-thoai' },
    { id: 3, name: 'Thiết Bị Điện Tử', slug: 'thiet-bi-dien-tu' },
    { id: 4, name: 'Máy Tính & Laptop', slug: 'may-tinh' },
    { id: 5, name: 'Sắc Đẹp', slug: 'sac-dep' },
  ],
  products: [
    { id: 101, name: 'Quần jean nam ống rộng wash xanh', price: 149000, old_price: 299000, category_id: 1, image: 'https://picsum.photos/seed/p1/400/400', rating: 4.8, sold: 2300, stock: 120, mall: true, status: 'active', description: 'Quần jean nam form rộng, wash xanh thời trang.', location: 'Hà Nội' },
    { id: 102, name: 'Sạc dự phòng 10000mAh PD 20W', price: 159000, old_price: 319000, category_id: 2, image: 'https://picsum.photos/seed/p2/400/400', rating: 4.9, sold: 8100, stock: 50, mall: false, status: 'active', description: 'Pin dự phòng 10000mAh sạc nhanh PD 20W.', location: 'TP. Hồ Chí Minh' },
    { id: 103, name: 'Váy maxi hoa nhí vintage', price: 199000, old_price: 399000, category_id: 1, image: 'https://picsum.photos/seed/p3/400/400', rating: 4.7, sold: 1200, stock: 80, mall: true, status: 'active', description: '', location: 'Đà Nẵng' },
    { id: 104, name: 'Kem chống nắng SPF50+', price: 89000, old_price: 179000, category_id: 5, image: 'https://picsum.photos/seed/p4/400/400', rating: 4.8, sold: 5600, stock: 200, mall: false, status: 'active', description: '', location: 'Hà Nội' },
  ],
  orders: [
    { id: 1, code: 'SP20250001', customer_name: 'Nguyễn Văn A', customer_phone: '0901234567', address: 'Hà Nội', total: 308000, status: 'pending', created_at: '2025-11-01' },
    { id: 2, code: 'SP20250002', customer_name: 'Trần Thị B', customer_phone: '0912345678', address: 'TP.HCM', total: 159000, status: 'shipping', created_at: '2025-11-02' },
    { id: 3, code: 'SP20250003', customer_name: 'Lê Văn C', customer_phone: '0923456789', address: 'Đà Nẵng', total: 89000, status: 'done', created_at: '2025-11-03' },
  ],
  users: [
    { id: 1, name: 'Admin', email: 'admin@shopee.vn', phone: '0900000000', role: 'admin', created_at: '2025-01-01' },
    { id: 2, name: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0901234567', role: 'customer', created_at: '2025-10-01' },
    { id: 3, name: 'Trần Thị B', email: 'b@gmail.com', phone: '0912345678', role: 'customer', created_at: '2025-10-15' },
  ],
  vouchers: [
    { id: 1, code: 'GIAM50K', label: 'Giảm 50K', sub: 'Đơn từ 200K', value: 50000, min_order: 200000, active: true },
    { id: 2, code: 'FREESHIP', label: 'Freeship Xtra', sub: 'Toàn quốc', value: 30000, min_order: 0, active: true },
  ],
  banners: [
    { id: 1, title: 'Banner chính 1', image: 'https://picsum.photos/seed/shopee-banner1/960/400', link: '#', position: 'main', active: true },
    { id: 2, title: 'Side 1', image: 'https://picsum.photos/seed/shopee-side1/560/280', link: '#', position: 'side', active: true },
  ],
  flash_sales: [
    { id: 1, product_id: 101, discount: 75, stock: 100, sold: 82, start_at: '2025-11-04 12:00', end_at: '2025-11-04 14:00', active: true },
    { id: 2, product_id: 102, discount: 50, stock: 50, sold: 33, start_at: '2025-11-04 12:00', end_at: '2025-11-04 14:00', active: true },
  ],
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(KEY, JSON.stringify(seed));
  return JSON.parse(JSON.stringify(seed));
}
function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

export const store = {
  get: (table) => {
    const data = load();
    return data[table] || [];
  },
  set: (table, rows) => {
    const data = load();
    data[table] = rows;
    save(data);
  },
  insert: (table, row) => {
    const data = load();
    const rows = data[table] || [];
    const id = row.id ?? (rows.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1);
    const newRow = { ...row, id };
    rows.push(newRow);
    data[table] = rows;
    save(data);
    return newRow;
  },
  update: (table, id, patch) => {
    const data = load();
    const rows = data[table] || [];
    const idx = rows.findIndex((r) => r.id === id);
    if (idx >= 0) rows[idx] = { ...rows[idx], ...patch };
    data[table] = rows;
    save(data);
    return rows[idx];
  },
  remove: (table, id) => {
    const data = load();
    data[table] = (data[table] || []).filter((r) => r.id !== id);
    save(data);
  },
  nextId: (table) => {
    const rows = store.get(table);
    return rows.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1;
  },
};

// Supabase-backed async helpers (used when configured). For now CMS uses local store;
// these helpers let us swap to Supabase later without rewriting pages.
export async function sbList(table) {
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).select('*').order('id', { ascending: false });
  if (error) throw error;
  return data;
}
export async function sbInsert(table, row) {
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  return data;
}
export async function sbUpdate(table, id, patch) {
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
export async function sbDelete(table, id) {
  if (!supabase) return null;
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}