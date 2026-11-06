import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { useAuth, authErrorMessage } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) { setError('Supabase chưa được cấu hình.'); return; }
    // The recovery link lands here with a session in the URL; supabase-js parses it.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.');
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
    if (password !== confirm) { setError('Mật khẩu xác nhận không khớp.'); return; }
    setLoading(true);
    const { error: err } = await updatePassword(password);
    setLoading(false);
    if (err) { setError(authErrorMessage(err)); return; }
    setSuccess('Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...');
    setTimeout(() => navigate('/?login=1'), 1200);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-10 max-w-[420px]">
        <div className="bg-white rounded-sm p-6 shadow-sm">
          <h1 className="text-lg font-medium text-gray-800 mb-1">Đặt lại mật khẩu</h1>
          <p className="text-[13px] text-gray-500 mb-5">Nhập mật khẩu mới cho tài khoản của bạn.</p>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label htmlFor="new-password" className="block text-[13px] text-gray-600 mb-1">Mật khẩu mới</label>
              <div className="relative">
                <input
                  id="new-password"
                  type={show ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-[2px] px-3 py-2 pr-14 text-sm outline-none focus:border-shopee-orange"
                  required
                />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] text-gray-500 hover:text-shopee-orange">
                  {show ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-[13px] text-gray-600 mb-1">Xác nhận mật khẩu</label>
              <input
                id="confirm-password"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-gray-300 rounded-[2px] px-3 py-2 text-sm outline-none focus:border-shopee-orange"
                required
              />
            </div>
            {error && <div className="text-[13px] text-red-500">{error}</div>}
            {success && <div className="text-[13px] text-green-600">{success}</div>}
            {ready && (
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red disabled:opacity-60"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
