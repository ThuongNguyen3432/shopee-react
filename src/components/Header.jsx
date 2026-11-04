import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Bell, Search, Globe, HelpCircle, User } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const SUGGESTIONS = ['Áo thun nam', 'Tai nghe bluetooth', 'Dép nữ', 'Balo laptop', 'Son môi', 'Ốp lưng iPhone', 'Quần jean nam', 'Kem chống nắng', 'Giày sneaker', 'Bình giữ nhiệt'];
const CATS = ['Tất cả', 'Thời Trang Nam', 'Điện Thoại', 'Thiết Bị Điện Tử', 'Máy Tính', 'Máy Ảnh', 'Đồng Hồ', 'Giày Dép', 'Gia Dụng', 'Thể Thao', 'Mẹ & Bé', 'Nhà Cửa', 'Sắc Đẹp', 'Sức Khỏe'];
const TRENDING = ['Áo thun nam', 'Tai nghe bluetooth', 'Dép nữ', 'Balo laptop', 'Son môi', 'Ốp lưng'];

export default function Header() {
  const navigate = useNavigate();
  const { items, count, total, remove } = useCart();
  const { user, signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, signInWithPhone, signUpWithPhone, signOut } = useAuth();
  const [q, setQ] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [cat, setCat] = useState('Tất cả');
  const [showCat, setShowCat] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState('email');
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggest(false);
        setShowCat(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const filtered = SUGGESTIONS.filter((s) => s.toLowerCase().includes(q.toLowerCase())).slice(0, 6);

  return (
    <>
      {/* Top bar - hidden on mobile */}
      <div className="bg-white text-xs text-gray-600 hidden md:block">
        <div className="container flex justify-between items-center h-8 px-2">
          <div className="flex items-center gap-4">
            <a href="/admin" className="hover:text-shopee-orange transition">Kênh Người Bán</a>
            <a href="/admin" className="hover:text-shopee-orange transition">Trở thành Người bán Shopee</a>
            <a href="#" className="hover:text-shopee-orange transition">Tải ứng dụng</a>
            <span className="flex items-center gap-2">
              Kết nối
              <a href="#" className="hover:text-shopee-orange transition" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="hover:text-shopee-orange transition" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotif((v) => !v)} className="hover:text-shopee-orange transition relative flex items-center gap-1">
              <Bell size={16} /> Thông Báo
              <span className="absolute -top-1 -right-2 bg-shopee-orange text-white text-[9px] px-1 rounded-full">5</span>
            </button>
            <a href="#" className="hover:text-shopee-orange transition">❓ Trợ Giúp</a>
            <a href="#" className="hover:text-shopee-orange transition flex items-center gap-0.5">🌐 Tiếng Việt <span className="text-[10px]">▾</span></a>
            {user ? (
              <button onClick={() => setShowUser((v) => !v)} className="hover:text-shopee-orange transition flex items-center gap-1.5">
                <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'U')}&background=ee4d2d&color=fff`} alt="avatar" className="w-5 h-5 rounded-full" />
                <span className="max-w-[120px] truncate">{user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}</span>
              </button>
            ) : (
              <>
                <button onClick={() => setShowLogin(true)} className="hover:text-shopee-orange transition">Đăng Nhập</button>
                <a href="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }} className="hover:text-shopee-orange transition">Đăng Ký</a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notification dropdown */}
      {showNotif && (
        <div className="absolute right-2 top-8 w-80 bg-white shadow-lg rounded z-50 text-sm">
          <div className="p-3 border-b font-medium text-gray-700">Thông Báo Mới Nhận</div>
          {['Đơn hàng #12345 đã được giao', 'Voucher giảm 50K dành cho bạn', 'Shop bạn theo dõi vừa đăng sản phẩm mới', 'Flash Sale bắt đầu lúc 12:00', 'Đánh giá sản phẩm để nhận xu'].map((n, i) => (
            <div key={i} className="px-3 py-2 hover:bg-gray-50 border-b last:border-0 cursor-pointer text-gray-700">{n}</div>
          ))}
          <a href="/" className="block p-2 text-center text-shopee-orange text-xs cursor-pointer">Xem tất cả</a>
        </div>
      )}

      {/* User dropdown */}
      {showUser && user && (
        <div className="absolute right-2 top-8 w-48 bg-white shadow-lg rounded z-50 text-sm">
          {['Tài khoản của tôi', 'Đơn mua', 'Kho voucher', 'Shopee Xu'].map((t) => (
            <div key={t} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">{t}</div>
          ))}
          <div onClick={() => { signOut(); setShowUser(false); }} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-red-500 border-t">Đăng xuất</div>
        </div>
      )}

      {/* Main header */}
      <header className="bg-gradient-to-r from-[#f53d2d] to-[#f63]">
        <div className="container flex items-center gap-2 md:gap-4 h-[60px] md:h-[80px] px-2">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 text-white font-bold text-[22px] md:text-[26px] tracking-tight shrink-0 leading-none">
            <svg width="28" height="28" className="md:w-[34px] md:h-[34px]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="12" width="36" height="24" rx="3" fill="#fff" opacity="0.18" />
              <path d="M6 12h28l-2.5 17H8.5L6 12z" fill="#fff" />
              <circle cx="14" cy="32" r="2" fill="#ee4d2d" />
              <circle cx="26" cy="32" r="2" fill="#ee4d2d" />
              <path d="M4 8h4l2 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
            <span className="hidden sm:inline">Shopee</span>
          </a>

          {/* Search */}
          <div className="flex-1 relative h-9 md:h-10 flex items-center" ref={searchRef}>
            <form onSubmit={handleSearch} className="bg-white rounded flex items-stretch h-9 md:h-10 overflow-hidden w-full">
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setShowCat((v) => !v)}
                  className="h-full px-3 text-xs text-gray-600 border-r border-gray-200 flex items-center gap-1 hover:bg-gray-50 whitespace-nowrap"
                >
                  {cat} <span className="text-[10px]">▾</span>
                </button>
                {showCat && (
                  <div className="absolute top-10 left-0 w-44 bg-white shadow-lg rounded z-40 text-xs max-h-72 overflow-y-auto">
                    {CATS.map((c) => (
                      <div
                        key={c}
                        onClick={() => { setCat(c); setShowCat(false); }}
                        className={`px-3 py-2 hover:bg-gray-50 cursor-pointer ${cat === c ? 'text-shopee-orange font-medium bg-shopee-orange-light' : 'text-gray-700'}`}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                className="flex-1 border-none outline-none px-3 text-sm h-full"
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu và tên shop"
                value={q}
                onChange={(e) => { setQ(e.target.value); setShowSuggest(true); }}
                onFocus={() => setShowSuggest(true)}
              />
              <button type="submit" className="bg-shopee-orange text-white px-6 text-sm hover:bg-shopee-red flex items-center justify-center transition">
                <Search size={18} />
              </button>
            </form>
            {showSuggest && q && filtered.length > 0 && (
              <div className="absolute top-11 left-0 right-0 bg-white shadow-lg rounded z-40 text-sm">
                {filtered.map((s) => (
                  <div
                    key={s}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700"
                    onClick={() => { setQ(s); setShowSuggest(false); }}
                  >
                    <span className="text-gray-400">🔍</span> {s}
                  </div>
                ))}
              </div>
            )}
            <div className="absolute top-full left-0 mt-1.5 hidden md:flex gap-3 text-white text-xs opacity-90 flex-wrap">
              {TRENDING.map((t) => (
                <a key={t} href="#" className="hover:underline" onClick={(e) => { e.preventDefault(); navigate(`/search?q=${encodeURIComponent(t)}`); }}>{t}</a>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="relative shrink-0">
            <button onClick={() => setShowCart((v) => !v)} className="relative text-white p-1 hover:opacity-90" aria-label="Giỏ hàng">
              <ShoppingCart size={28} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-shopee-orange text-[11px] font-bold px-1.5 rounded-full min-w-[20px] text-center leading-[18px] border border-shopee-orange">
                  {count}
                </span>
              )}
            </button>
            {showCart && (
              <div className="absolute right-0 top-10 w-96 bg-white shadow-xl rounded z-50 text-sm">
                <div className="p-3 border-b font-medium text-gray-700">Sản phẩm mới thêm</div>
                {items.length === 0 && <div className="p-6 text-center text-gray-400">Giỏ hàng trống</div>}
                <div className="max-h-72 overflow-y-auto">
                  {items.map((i) => (
                    <div key={i.id} className="flex gap-2 p-2 border-b last:border-0 items-center">
                      <img src={i.img || i.image} alt={i.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-700 line-clamp-1">{i.name}</div>
                        <div className="text-shopee-orange text-sm font-bold">₫{i.price.toLocaleString('vi-VN')}</div>
                      </div>
                      <div className="text-xs text-gray-500">x{i.qty}</div>
                      <button onClick={() => remove(i.id)} className="text-gray-400 hover:text-red-500 px-1">✕</button>
                    </div>
                  ))}
                </div>
                <div className="p-3 flex justify-between items-center bg-gray-50">
                  <div className="text-xs text-gray-500">{count} sản phẩm</div>
                  <div className="flex items-center gap-3">
                    <div className="text-shopee-orange font-bold">₫{total.toLocaleString('vi-VN')}</div>
                    <a href="/checkout" className="bg-shopee-orange text-white px-4 py-1.5 rounded text-xs hover:bg-shopee-red">Xem giỏ hàng</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Login modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLogin(false)}>
          <div className="bg-white rounded w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium text-gray-700">Đăng nhập</div>
              <button onClick={() => setShowLogin(false)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Đăng nhập để theo dõi đơn hàng, nhận voucher và nhiều ưu đãi hơn.</p>

            <div className="flex border-b border-gray-200 mb-3">
              {['email', 'phone'].map((t) => (
                <button
                  key={t}
                  onClick={() => setLoginTab(t)}
                  className={`flex-1 py-2 text-sm font-medium ${loginTab === t ? 'text-shopee-orange border-b-2 border-shopee-orange' : 'text-gray-500'}`}
                >
                  {t === 'email' ? 'Email' : 'Số điện thoại'}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mb-3 text-xs">
              <button onClick={() => setMode('signin')} className={mode === 'signin' ? 'text-shopee-orange font-bold' : 'text-gray-500'}>Đăng nhập</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => setMode('signup')} className={mode === 'signup' ? 'text-shopee-orange font-bold' : 'text-gray-500'}>Đăng ký</button>
            </div>

            <div className="space-y-2 mb-3">
              {mode === 'signup' && (
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-shopee-orange" />
              )}
              {loginTab === 'email' ? (
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-shopee-orange" />
              ) : (
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Số điện thoại (vd: +84901234567)" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-shopee-orange" />
              )}
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-shopee-orange" />
            </div>

            {authError && <div className="text-xs text-red-500 mb-2">{authError}</div>}

            <button
              disabled={authLoading}
              onClick={async () => {
                setAuthError('');
                setAuthLoading(true);
                try {
                  let res;
                  if (loginTab === 'email') {
                    res = mode === 'signin'
                      ? await signInWithEmail(email, password)
                      : await signUpWithEmail(email, password, name);
                  } else {
                    res = mode === 'signin'
                      ? await signInWithPhone(phone, password)
                      : await signUpWithPhone(phone, password, name);
                  }
                  if (res?.error) setAuthError(res.error.message);
                  else { setShowLogin(false); setEmail(''); setPhone(''); setPassword(''); setName(''); }
                } catch (e) { setAuthError(e.message); }
                finally { setAuthLoading(false); }
              }}
              className="w-full bg-shopee-orange text-white py-2.5 rounded text-sm font-medium hover:bg-shopee-red disabled:opacity-50"
            >
              {authLoading ? 'Đang xử lý...' : (mode === 'signin' ? 'Đăng nhập' : 'Đăng ký')}
            </button>

            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">hoặc</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => { signInWithGoogle(); setShowLogin(false); }}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-2.5 text-sm hover:bg-gray-50"
              >
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.3v5C9.7 39.7 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C41.3 35.5 44 30.2 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
                Tiếp tục với Google
              </button>
              <button
                onClick={() => { signInWithFacebook(); setShowLogin(false); }}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-2.5 text-sm hover:bg-gray-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Tiếp tục với Facebook
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 text-center">
              Bằng việc đăng nhập, bạn đồng ý với Điều khoản Shopee.
            </p>
          </div>
        </div>
      )}
    </>
  );
}