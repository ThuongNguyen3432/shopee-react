import { useState } from 'react';

export function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-sm shadow-sm border border-gray-200 ${className}`}>
      {title && <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-700">{title}</div>}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, hint, color = 'shopee-orange' }) {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-4">
      <div className="text-xs text-gray-500 uppercase">{label}</div>
      <div className={`text-2xl font-bold mt-1 text-${color}`}>{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

export function Btn({ children, onClick, variant = 'primary', className = '', type = 'button', disabled }) {
  const base = 'px-3 py-1.5 rounded-sm text-sm font-medium transition disabled:opacity-50';
  const v = {
    primary: 'bg-shopee-orange text-white hover:bg-shopee-red',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-shopee-orange hover:bg-shopee-orange-light',
  }[variant];
  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${v} ${className}`}>{children}</button>;
}

export function Input({ label, value, onChange, type = 'text', placeholder, required, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && <div className="text-xs text-gray-600 mb-1">{label}{required && <span className="text-red-500"> *</span>}</div>}
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopee-orange"
      />
    </label>
  );
}

export function Select({ label, value, onChange, options, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && <div className="text-xs text-gray-600 mb-1">{label}</div>}
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopee-orange bg-white"
      >
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </label>
  );
}

export function Textarea({ label, value, onChange, rows = 3, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && <div className="text-xs text-gray-600 mb-1">{label}</div>}
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-shopee-orange"
      />
    </label>
  );
}

export function Modal({ open, onClose, title, children, width = 'max-w-2xl' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-sm w-full ${width} max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <div className="font-medium text-gray-700">{title}</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function Table({ columns, rows, onEdit, onDelete, empty = 'Không có dữ liệu' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
          <tr>
            {columns.map((c) => <th key={c.key} className="text-left px-3 py-2 font-medium">{c.label}</th>)}
            {(onEdit || onDelete) && <th className="text-right px-3 py-2 font-medium">Thao tác</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.length === 0 && (
            <tr><td colSpan={columns.length + 1} className="text-center py-8 text-gray-400">{empty}</td></tr>
          )}
          {rows.map((r, i) => (
            <tr key={r.id ?? i} className="hover:bg-gray-50">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2.5 text-gray-700">
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-3 py-2.5 text-right space-x-2">
                  {onEdit && <button onClick={() => onEdit(r)} className="text-shopee-orange hover:underline text-xs">Sửa</button>}
                  {onDelete && <button onClick={() => onDelete(r)} className="text-red-500 hover:underline text-xs">Xóa</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function useConfirm() {
  const [state, setState] = useState(null);
  const confirm = (msg) => new Promise((res) => setState({ msg, res }));
  const dialog = state && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm p-5 max-w-sm w-full">
        <div className="text-sm text-gray-700 mb-4">{state.msg}</div>
        <div className="flex justify-end gap-2">
          <Btn variant="secondary" onClick={() => { state.res(false); setState(null); }}>Hủy</Btn>
          <Btn variant="danger" onClick={() => { state.res(true); setState(null); }}>Xác nhận</Btn>
        </div>
      </div>
    </div>
  );
  return { confirm, dialog };
}