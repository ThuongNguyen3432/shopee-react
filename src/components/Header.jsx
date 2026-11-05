import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Notification, SearchNormal1, Global, MessageQuestion, ShoppingBag, CloseCircle, ArrowDown2 } from 'iconsax-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLogin } from '../context/LoginContext.jsx';
import SeeAll from './SeeAll.jsx';

const SUGGESTIONS = ['Áo thun nam', 'Tai nghe bluetooth', 'Dép nữ', 'Balo laptop', 'Son môi', 'Ốp lưng iPhone', 'Quần jean nam', 'Kem chống nắng', 'Giày sneaker', 'Bình giữ nhiệt'];
const CATS = ['Tất cả', 'Thời Trang Nam', 'Điện Thoại', 'Thiết Bị Điện Tử', 'Máy Tính', 'Máy Ảnh', 'Đồng Hồ', 'Giày Dép', 'Gia Dụng', 'Thể Thao', 'Mẹ & Bé', 'Nhà Cửa', 'Sắc Đẹp', 'Sức Khỏe'];
const TRENDING = ['Áo thun nam', 'Tai nghe bluetooth', 'Dép nữ', 'Balo laptop', 'Son môi', 'Ốp lưng'];
const NOTIFICATIONS = [
  'Đơn hàng #12345 đã được giao',
  'Voucher giảm 50K dành cho bạn',
  'Shop bạn theo dõi vừa đăng sản phẩm mới',
  'Flash Sale bắt đầu lúc 12:00',
  'Đánh giá sản phẩm để nhận xu',
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, count, total, remove } = useCart();
  const { user, signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, signInWithPhone, signUpWithPhone, signOut } = useAuth();
  const [q, setQ] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [cat, setCat] = useState('Tất cả');
  const [showCat, setShowCat] = useState(false);
  const { showLogin, setShowLogin } = useLogin();
  const [loginTab, setLoginTab] = useState('email');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === '1') {
      setShowLogin(true);
    }
  }, [location.search]);
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const cartRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggest(false);
        setShowCat(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
      if (cartRef.current && !cartRef.current.contains(e.target)) setShowCart(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (cat !== 'Tất cả') params.set('cat', cat);
    const qs = params.toString();
    navigate(`/search${qs ? `?${qs}` : ''}`);
  };

  const chooseCat = (c) => {
    setCat(c);
    setShowCat(false);
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (c !== 'Tất cả') params.set('cat', c);
    const qs = params.toString();
    navigate(`/search${qs ? `?${qs}` : ''}`);
  };

  useEffect(() => {
    if (location.pathname === '/search') {
      const fromUrl = new URLSearchParams(location.search).get('cat') || 'Tất cả';
      setCat(fromUrl);
    }
  }, [location.pathname, location.search]);

  const filtered = SUGGESTIONS.filter((s) => s.toLowerCase().includes(q.toLowerCase())).slice(0, 6);

  return (
    <>
      {/* Top bar - hidden on mobile */}
      <div className="bg-gradient-to-b from-[#f53d2d] to-[#f63] text-xs text-white hidden md:block">
        <div className="container flex justify-between items-center h-8 px-2">
          <div className="flex items-center gap-4">
            <a href="/admin" className="hover:underline transition text-white/90">Kênh Người Bán</a>
            <a href="/admin" className="hover:underline transition text-white/90">Trở thành Người bán Shopee</a>
            <a href="#" className="hover:underline transition text-white/90">Tải ứng dụng</a>
            <span className="flex items-center gap-2">
              Kết nối
              <a href="#" className="hover:underline transition text-white/90" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="hover:underline transition text-white/90" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
{user && (
            <div className="relative" ref={notifRef}>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setShowNotif((v) => !v)}
                      className="hover:underline transition text-white/90 relative flex items-center gap-1"
                      aria-label="Thông báo"
                    >
                      <Notification size={16} variant="Outline" color="currentColor" /> Thông Báo
                      <span className="absolute -top-1.5 right-0 bg-shopee-orange text-white text-[9px] px-1 rounded-full leading-[13px]">5</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="end">Thông báo</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-lg rounded z-50 text-sm overflow-hidden">
                  <div className="p-3 border-b font-medium text-gray-700">Thông Báo Mới Nhận</div>
                  <div className="max-h-80 overflow-y-auto">
                    {NOTIFICATIONS.map((n, i) => (
                      <div key={i} className="px-3 py-2.5 hover:bg-gray-50 border-b last:border-0 cursor-pointer text-gray-700">{n}</div>
                    ))}
                  </div>
                  <SeeAll to="/notifications" className="ml-0 w-full justify-center p-2.5 border-t" />
                </div>
              )}
            </div>
            )}
            <a href="#" className="hover:underline transition text-white/90 flex items-center gap-1"><MessageQuestion size={14} variant="Outline" color="currentColor" /> Trợ Giúp</a>
            <a href="#" className="hover:underline transition text-white/90 flex items-center gap-0.5"><Global size={14} variant="Outline" color="currentColor" /> Tiếng Việt <ArrowDown2 size={10} variant="Linear" color="currentColor" className="opacity-70" /></a>
            {user ? (
              <div className="relative" ref={userRef}>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={() => setShowUser((v) => !v)} className="hover:underline transition text-white/90 flex items-center gap-1.5" aria-label="Tài khoản">
                        <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'U')}&background=ee4d2d&color=fff`} alt="avatar" className="w-5 h-5 rounded-full" />
                        <span className="max-w-[120px] truncate">{user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="end">Tài khoản</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {showUser && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded z-50 text-sm overflow-hidden">
                    {[
                      { label: 'Tài khoản của tôi', to: '/account?tab=profile' },
                      { label: 'Yêu thích', to: '/wishlist' },
                      { label: 'Đã xem', to: '/recently-viewed' },
                      { label: 'Tin nhắn', to: '/messages' },
                      { label: 'Đơn mua', to: '/account?tab=orders' },
                      { label: 'Trả hàng/Hoàn tiền', to: '/returns' },
                      { label: 'Kho voucher', to: '/vouchers' },
                      { label: 'Shopee Xu', to: '/account?tab=coins' },
                    ].map((it) => (
                      <div key={it.label} onClick={() => { navigate(it.to); setShowUser(false); }} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">{it.label}</div>
                    ))}
                    <div onClick={() => { signOut(); setShowUser(false); }} className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-red-500 border-t">Đăng xuất</div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => setShowLogin(true)} className="hover:underline transition text-white/90">Đăng Nhập</button>
                <a href="#" onClick={(e) => { e.preventDefault(); setShowLogin(true); }} className="hover:underline transition text-white/90">Đăng Ký</a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-gradient-to-b from-[#f53d2d] to-[#f63]">
        <div className="container flex items-center gap-3 md:gap-6 h-[72px] md:h-[96px] px-2">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 text-white font-medium text-[20px] md:text-[24px] tracking-tight shrink-0 leading-none">
            <ShoppingBag size={22} variant="Bold" color="#fff" className="md:w-[24px] md:h-[24px] shrink-0" />
            <span>Shopee</span>
          </a>

          {/* Search */}
          <div className="flex-1 relative min-w-0" ref={searchRef}>
            <div className="relative h-10 md:h-12 flex items-center">
              <form onSubmit={handleSearch} className="bg-white rounded flex items-stretch h-10 md:h-12 w-full shadow-sm">
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setShowCat((v) => !v)}
                  className="h-full px-4 text-sm text-gray-600 border-r border-gray-200 flex items-center gap-1 hover:bg-gray-50 whitespace-nowrap"
                >
                  {cat} <ArrowDown2 size={10} variant="Linear" color="currentColor" className="opacity-70" />
                </button>
                {showCat && (
                  <div className="absolute top-10 left-0 w-44 bg-white shadow-lg rounded z-40 text-xs max-h-72 overflow-y-auto">
                    {CATS.map((c) => (
                      <div
                        key={c}
                        onClick={() => chooseCat(c)}
                        className={`px-3 py-2 hover:bg-gray-50 cursor-pointer ${cat === c ? 'text-shopee-orange font-medium bg-shopee-orange-light' : 'text-gray-700'}`}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <label htmlFor="header-search" className="sr-only">Tìm kiếm</label>
     <input
                id="header-search"
                name="q"
                aria-label="Tìm kiếm"
                className="flex-1 border-none outline-none px-3 text-sm h-full"
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu và tên shop"
                value={q}
                onChange={(e) => { setQ(e.target.value); setShowSuggest(true); }}
                onFocus={() => setShowSuggest(true)}
              />
              <button type="submit" className="bg-shopee-orange text-white px-6 text-sm hover:bg-shopee-red flex items-center justify-center transition">
                <SearchNormal1 size={20} variant="Linear" color="#fff" />
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
                    <SearchNormal1 size={14} variant="Linear" className="text-gray-400 shrink-0" /> {s}
                  </div>
                ))}
              </div>
            )}
            </div>
            <div className="hidden md:flex gap-3 mt-1.5 text-white text-xs leading-4 opacity-90 flex-wrap">
              {TRENDING.map((t) => (
                <a key={t} href="#" className="hover:underline" onClick={(e) => { e.preventDefault(); navigate(`/search?q=${encodeURIComponent(t)}`); }}>{t}</a>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="relative shrink-0" ref={cartRef}>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setShowCart((v) => !v)} className="relative text-white p-1 hover:opacity-90" aria-label="Giỏ hàng">
                    <ShoppingCart size={26} variant="Bold" color="#fff" />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-shopee-orange text-[11px] font-bold px-1.5 rounded-full min-w-[20px] text-center leading-[18px] border border-shopee-orange">
                        {count}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Giỏ hàng</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {showCart && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white shadow-xl rounded z-50 text-sm">
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
                      <button onClick={() => remove(i.id)} className="text-gray-400 hover:text-red-500 px-1" aria-label="Xoá">
                        <CloseCircle size={16} variant="Linear" color="currentColor" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-3 flex justify-between items-center bg-gray-50">
                  <div className="text-xs text-gray-500">{count} sản phẩm</div>
                  <div className="flex items-center gap-3">
                    <div className="text-shopee-orange font-bold">₫{total.toLocaleString('vi-VN')}</div>
                    <a href="/cart" className="bg-shopee-orange text-white px-4 py-1.5 rounded text-xs hover:bg-shopee-red">Xem giỏ hàng</a>
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
              <button onClick={() => setShowLogin(false)} className="text-gray-400 hover:text-gray-700" aria-label="Đóng">
                <CloseCircle size={22} variant="Linear" color="currentColor" />
              </button>
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
            {authSuccess && <div className="text-xs text-green-600 mb-2 bg-green-50 p-2 rounded">{authSuccess}</div>}

            <Button
              variant="shopee"
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
                  else if (mode === 'signup' && loginTab === 'email' && !res?.data?.session) {
                    setAuthSuccess('Đã gửi email xác thực. Vui lòng kiểm tra hộp thư (và spam) để kích hoạt tài khoản.');
                  } else {
                    setShowLogin(false); setEmail(''); setPhone(''); setPassword(''); setName('');
                    const redirect = new URLSearchParams(location.search).get('redirect');
                    if (redirect) navigate(redirect);
                  }
                } catch (e) { setAuthError(e.message); }
                finally { setAuthLoading(false); }
              }}
              className="w-full h-10"
            >
              {authLoading ? 'Đang xử lý...' : (mode === 'signin' ? 'Đăng nhập' : 'Đăng ký')}
            </Button>

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