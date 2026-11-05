import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft2, Box, Camera, Refresh, TickCircle, Truck } from 'iconsax-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

const REASONS = [
  'Sản phẩm không đúng mô tả',
  'Sản phẩm bị lỗi/hư hỏng',
  'Thiếu phụ kiện/sản phẩm',
  'Không còn nhu cầu',
  'Giao sai sản phẩm',
  'Khác',
];

const RETURNS = [
  { id: 1, code: 'RR20260001', order: 'SP20260003', status: 'processing', reason: 'Sản phẩm bị lỗi/hư hỏng', amount: 89000, created: '2026-11-01' },
  { id: 2, code: 'RR20260002', order: 'SP20260001', status: 'done', reason: 'Giao sai sản phẩm', amount: 49000, created: '2026-10-28' },
];

const STATUS_LABEL = { processing: 'Đang xử lý', done: 'Hoàn tiền thành công', rejected: 'Từ chối' };
const STATUS_COLOR = { processing: 'text-orange-500', done: 'text-green-600', rejected: 'text-red-500' };

export default function ReturnRefundPage() {
  const [showForm, setShowForm] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [reason, setReason] = useState(REASONS[0]);
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); setOrderCode(''); setDesc(''); }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[900px]">
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <Link to="/account?tab=orders" className="hover:text-shopee-orange">Đơn mua</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Trả hàng/Hoàn tiền</span>
        </div>

        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h1 className="text-lg md:text-xl text-gray-800 flex items-center gap-2">
            <Refresh size={20} variant="Bold" color="#ee4d2d" /> Trả hàng / Hoàn tiền
          </h1>
          <button onClick={() => setShowForm(true)} className="h-9 px-4 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">
            + Tạo yêu cầu
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-sm mb-3">
          <div className="px-4 py-3 border-b border-gray-100 text-sm font-medium text-gray-700">Yêu cầu của tôi</div>
          {RETURNS.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              <Box size={40} variant="Linear" color="#c7c7c7" className="mx-auto mb-2" />
              Chưa có yêu cầu trả hàng.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {RETURNS.map((r) => (
                <div key={r.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-sm">
                      <span className="text-gray-500">Mã yêu cầu: </span>
                      <span className="font-mono text-shopee-orange">{r.code}</span>
                      <span className="text-gray-400 mx-2">|</span>
                      <span className="text-gray-500">Đơn: </span>
                      <Link to={`/order/${r.order}`} className="text-shopee-orange hover:underline">{r.order}</Link>
                    </div>
                    <span className={`text-sm font-medium ${STATUS_COLOR[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{r.reason}</div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span>Ngày tạo: {r.created}</span>
                    <span>Hoàn tiền: <span className="text-shopee-orange font-medium">₫{r.amount.toLocaleString('vi-VN')}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Policy */}
        <div className="bg-white rounded-sm p-4 text-sm text-gray-600">
          <h2 className="font-medium text-gray-800 mb-2">Chính sách trả hàng</h2>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Hỗ trợ trả hàng trong vòng 7 ngày kể từ ngày nhận hàng.</li>
            <li>Sản phẩm phải còn nguyên tem, hộp, phụ kiện.</li>
            <li>Hoàn tiền trong 3-5 ngày làm việc sau khi shop nhận hàng trả.</li>
            <li>Chi phí vận chuyển trả hàng do shop chịu nếu lỗi từ shop.</li>
          </ul>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-sm w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="font-medium text-gray-800">Tạo yêu cầu trả hàng</span>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            {submitted ? (
              <div className="p-8 text-center">
                <TickCircle size={48} variant="Bold" color="#22c55e" className="mx-auto mb-2" />
                <div className="text-sm text-gray-700">Đã gửi yêu cầu thành công!</div>
              </div>
            ) : (
              <form onSubmit={submit} className="p-4 space-y-3 text-sm">
                <div>
                  <label className="text-gray-500 block mb-1">Mã đơn hàng</label>
                  <input value={orderCode} onChange={(e) => setOrderCode(e.target.value)} required placeholder="SP20260001" className="w-full border border-gray-200 rounded-[2px] px-3 py-2 outline-none focus:border-shopee-orange" />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Lý do trả hàng</label>
                  <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-gray-200 rounded-[2px] px-3 py-2 outline-none focus:border-shopee-orange">
                    {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Mô tả chi tiết</label>
                  <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} required className="w-full border border-gray-200 rounded-[2px] px-3 py-2 outline-none focus:border-shopee-orange resize-none" />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Hình ảnh bằng chứng</label>
                  <button type="button" className="w-full h-20 border-2 border-dashed border-gray-300 rounded-[2px] text-gray-400 text-xs flex flex-col items-center justify-center gap-1 hover:border-shopee-orange hover:text-shopee-orange">
                    <Camera size={20} variant="Linear" color="currentColor" />
                    Tải ảnh lên (tối đa 5 ảnh)
                  </button>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-9 border border-gray-300 text-gray-700 text-sm rounded-[2px] hover:border-shopee-orange">Hủy</button>
                  <button type="submit" className="flex-1 h-9 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red">Gửi yêu cầu</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
}
