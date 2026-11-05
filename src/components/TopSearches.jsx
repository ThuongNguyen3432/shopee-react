import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchNormal1, TrendUp } from 'iconsax-react';
import { store } from '../admin/store.js';

export default function TopSearches({ limit = 8, className = '' }) {
  const list = useMemo(() => (store.get('top_searches') || []).filter((t) => t.active !== false).sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, limit), []);
  if (list.length === 0) return null;
  return (
    <div className={`bg-white rounded-sm p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <TrendUp size={16} variant="Bold" color="#ee4d2d" />
        <span className="text-sm font-medium text-gray-800">Tìm kiếm hàng đầu</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((t, i) => (
          <Link
            key={t.id}
            to={`/search?q=${encodeURIComponent(t.keyword)}`}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-shopee-orange hover:text-shopee-orange transition flex items-center gap-1"
          >
            {i < 3 && <span className="text-shopee-orange font-bold">{i + 1}</span>}
            {t.keyword}
          </Link>
        ))}
      </div>
    </div>
  );
}
