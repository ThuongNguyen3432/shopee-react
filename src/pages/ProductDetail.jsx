import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShoppingCart, Star1, Location, Minus, Add, ArrowLeft2, ArrowRight2,
  Heart, Truck, Refresh, ShieldTick, Message, Shop, ArrowDown2, Clock,
  Verify, Like, Link as LinkIcon, DiscountShape,
} from 'iconsax-react';
import { useCart } from '../context/CartContext.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { store } from '../admin/store.js';
import { PRODUCTS } from '../data/products.js';
import { slugify } from '../lib/slugify.js';
import ProductCard from '../components/ProductCard.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import ChatBox from '../components/ChatBox.jsx';
import { getShopInfo, shopPath } from '../lib/shop.js';

const VND = (n) => Number(n || 0).toLocaleString('vi-VN');

function formatShort(n) {
  const num = Number(String(n ?? '').replace(/[^\d]/g, ''));
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace('.0', '').replace('.', ',')}tr`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace('.0', '').replace('.', ',')}k`;
  return String(num);
}

const SHIPPING_CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương'];

const REVIEW_POOL = [
  {
    name: 'ng*****3', rating: 5, date: '2025-10-28 14:32', variant: 'Màu sắc: Đen, Kích thước: M',
    likes: 24, avatar: 'https://i.pravatar.cc/64?img=12', verified: true,
    text: 'Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm đúng mô tả, chất lượng tốt hơn mình mong đợi so với giá tiền. Sẽ ủng hộ shop tiếp.',
  },
  {
    name: 'tr*****8', rating: 5, date: '2025-10-21 09:05', variant: 'Màu sắc: Trắng, Kích thước: L',
    likes: 11, avatar: 'https://i.pravatar.cc/64?img=32', verified: true,
    text: 'Nhận hàng sau 3 ngày, hàng đẹp y hình, shop tư vấn nhiệt tình. Đóng gói kỹ, shipper thân thiện. 5 sao cho shop.',
  },
  {
    name: 'ha*****1', rating: 4, date: '2025-10-02 20:47', variant: 'Màu sắc: Be, Kích thước: S',
    likes: 3, avatar: 'https://i.pravatar.cc/64?img=45', verified: true,
    text: 'Chất lượng ổn trong tầm giá, mẫu mã xinh. Trừ 1 sao vì giao hàng hơi chậm so với dự kiến.',
  },
];

function getVariants(category = '') {
  if (/Giày|Dép/i.test(category)) {
    return [{ label: 'Kích thước', options: ['36', '37', '38', '39', '40', '41'] }];
  }
  if (/Thời Trang|Túi|Phụ Kiện|Sắc Đẹp|Nhà Cửa|Bách Hóa/i.test(category)) {
    return [
      { label: 'Màu sắc', options: ['Đen', 'Trắng', 'Be', 'Xanh navy'] },
      { label: 'Kích thước', options: ['S', 'M', 'L', 'XL'] },
    ];
  }
  if (/Điện Thoại|Máy Tính|Thiết Bị|Máy Ảnh|Đồng Hồ|Ô Tô|Xe Máy/i.test(category)) {
    return [
      { label: 'Phân loại', options: ['Tiêu chuẩn', 'Cao cấp'] },
      { label: 'Bảo hành', options: ['12 tháng', '24 tháng'] },
    ];
  }
  return [{ label: 'Phân loại', options: ['Loại 1', 'Loại 2', 'Combo 2 món'] }];
}

function getGallery(src) {
  if (!src) return ['https://picsum.photos/seed/shopee/600/600'];
  const base = src.match(/picsum\.photos\/seed\/([^/]+)/)?.[1];
  if (base) {
    return [base, 'a', 'b', 'c', 'd'].map((s) => `https://picsum.photos/seed/${base}${s === base ? '' : s}/600/600`);
  }
  return [src];
}

function Stars({ value = 5, size = 14, activeColor = '#ee4d2d' }) {
  const full = Math.round(Number(value) || 0);
  return (
    <span className="inline-flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star1
          key={i}
          size={size}
          variant={i <= full ? 'Bold' : 'Linear'}
          color={i <= full ? activeColor : '#d9d9d9'}
        />
      ))}
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [related, setRelated] = useState([]);
  const [liked, setLiked] = useState(false);
  const [selected, setSelected] = useState({});
  const [reviewFilter, setReviewFilter] = useState('all');
  const [shipTo, setShipTo] = useState('Hà Nội');
  const [showShip, setShowShip] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let p = null;
        let list = [];
        if (isSupabaseConfigured) {
          try {
            const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
            if (error) throw error;
            if (data) {
              p = data;
              const { data: rel } = await supabase.from('products').select('*').neq('id', id).limit(6);
              setRelated(rel || []);
              setProduct(p);
              setLoading(false);
              return;
            }
          } catch (e) {
            // fall through to local/shared data
          }
        }
        if (!p) {
          list = store.get('products');
          if (!list || list.length === 0) list = PRODUCTS;
          p = list.find((x) => String(x.id) === String(id));
          if (!p) p = PRODUCTS.find((x) => String(x.id) === String(id));
          setRelated((list.length ? list : PRODUCTS).filter((x) => String(x.id) !== String(id)).slice(0, 6));
        }
        setProduct(p);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setQty(1);
    setActiveImg(0);
    setLiked(false);
    setReviewFilter('all');
    setSelected(Object.fromEntries(getVariants(product.category).map((v) => [v.label, v.options[0]])));
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <div className="container mx-auto px-2 py-4 max-w-[1200px]">
          <div className="h-3 w-64 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="bg-white rounded-sm p-4 grid md:grid-cols-[380px_minmax(0,1fr)] gap-6">
            <div className="aspect-square bg-gray-100 animate-pulse" />
            <div className="space-y-3">
              <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
              <div className="h-16 bg-gray-100 rounded animate-pulse" />
              {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-3">Không tìm thấy sản phẩm.</div>
          <button onClick={() => navigate('/')} className="text-shopee-orange hover:underline">Về trang chủ</button>
        </div>
      </div>
    );
  }

  const imgSrc = product.img || product.image || 'https://picsum.photos/seed/shopee/600/600';
  const images = Array.isArray(product.images) && product.images.length ? product.images : getGallery(imgSrc);
  const price = Number(product.price) || 0;
  const oldPrice = Number(product.old_price) || 0;
  const discount = oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;
  const seed = Number(String(product.id).replace(/\D/g, '')) || 1;
  const stock = Number(product.stock) || 120 + (seed % 380);
  const rating = Number(product.rating) || 4.8;
  const reviewCount = 800 + ((seed * 37) % 4200);
  const soldText = typeof product.sold === 'string' ? product.sold : formatShort(product.sold || seed * 31);
  const variants = getVariants(product.category);
  const shop = getShopInfo(product);
  const shopName = shop.name;
  const shopAvatar = shop.avatar;
  const categorySlug = slugify(product.category || '');
  const shipFromDate = new Date();
  shipFromDate.setDate(shipFromDate.getDate() + 3);
  const shipToDate = new Date();
  shipToDate.setDate(shipToDate.getDate() + 5);
  const dateLabel = (d) => `${d.getDate()} Th${d.getMonth() + 1}`;

  const reviewStars = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: star === 5 ? Math.round(reviewCount * 0.82)
      : star === 4 ? Math.round(reviewCount * 0.12)
        : star === 3 ? Math.round(reviewCount * 0.04)
          : star === 2 ? Math.round(reviewCount * 0.01) : 0,
  }));
  const shownReviews = REVIEW_POOL.filter((r) => reviewFilter === 'all' || r.rating === Number(reviewFilter));
  const reviewImgs = [1, 2, 3].map((i) => `https://picsum.photos/seed/r${seed}${i}/120/120`);

  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);
  const addToCart = () => {
    for (let i = 0; i < qty; i++) add({ ...product, img: imgSrc });
  };
  const buyNow = () => {
    addToCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 mb-3 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-shopee-orange">Shopee</Link>
          <span className="text-gray-400">›</span>
          {product.category && (
            <>
              <Link to={`/category/${categorySlug}`} className="hover:text-shopee-orange">{product.category}</Link>
              <span className="text-gray-400">›</span>
            </>
          )}
          <span className="text-gray-700 truncate max-w-full">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
          <div className="min-w-0 space-y-4">
            {/* Product card */}
            <div className="bg-white rounded-sm">
              <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-6 p-4">
                {/* Gallery */}
                <div className="min-w-0 w-full max-w-[440px] mx-auto lg:max-w-none">
                  <div className="relative group border border-gray-100 bg-white">
                    <div className="aspect-square overflow-hidden">
                      <motion.img
                        key={images[activeImg]}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        src={images[activeImg]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                      />
                    </div>
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImg}
                          aria-label="Ảnh trước"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-14 bg-black/20 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        >
                          <ArrowLeft2 size={18} color="#fff" />
                        </button>
                        <button
                          onClick={nextImg}
                          aria-label="Ảnh sau"
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-14 bg-black/20 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        >
                          <ArrowRight2 size={18} color="#fff" />
                        </button>
                      </>
                    )}
                    {product.mall && (
                      <span className="absolute left-0 top-0 bg-shopee-orange text-white text-[10px] font-bold px-2 py-0.5">
                        Shopee Mall
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-hide">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        aria-label={`Ảnh ${i + 1}`}
                        className={`w-[62px] h-[62px] shrink-0 border-2 overflow-hidden transition ${activeImg === i ? 'border-shopee-orange' : 'border-transparent hover:border-gray-300'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 text-xs text-gray-600">
                    <button
                      onClick={() => setLiked((v) => !v)}
                      className={`flex items-center gap-1.5 ${liked ? 'text-shopee-orange' : 'hover:text-shopee-orange'}`}
                    >
                      <Heart size={18} variant={liked ? 'Bold' : 'Linear'} color={liked ? '#ee4d2d' : 'currentColor'} />
                      Yêu thích ({formatShort(1200 + (seed % 800))})
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Chia sẻ:</span>
                      <button
                        onClick={async () => {
                          try { await navigator.clipboard.writeText(window.location.href); } catch (e) { /* ignore */ }
                        }}
                        aria-label="Sao chép liên kết"
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <LinkIcon size={13} color="#555" />
                      </button>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank" rel="noreferrer" aria-label="Chia sẻ Facebook"
                        className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[11px] font-bold"
                      >
                        f
                      </a>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {product.mall && (
                      <span className="bg-[#d0011b] text-white text-[10px] font-bold px-1.5 py-px rounded-[2px]">Mall</span>
                    )}
                    <span className="border border-shopee-orange text-shopee-orange text-[10px] px-1.5 py-px rounded-[2px]">Yêu thích+</span>
                    <span className="bg-[#f5f5f5] text-gray-600 text-[10px] px-1.5 py-px rounded-[2px]">Chính hãng 100%</span>
                  </div>

                  <h1 className="text-lg md:text-xl font-medium leading-7 text-gray-800">{product.name}</h1>

                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm mt-2">
                    <span className="flex items-center gap-1.5">
                      <span className="text-shopee-orange underline underline-offset-2 decoration-shopee-orange/40 font-medium">
                        {rating.toFixed(1)}
                      </span>
                      <Stars value={rating} size={14} />
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-700">{formatShort(reviewCount)} Đánh giá</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-700">{soldText} Đã bán</span>
                    {product.location && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Location size={13} variant="Linear" color="currentColor" /> {product.location}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div className="bg-[#fafafa] px-4 py-3 mt-4 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-shopee-orange text-base leading-none">₫</span>
                      <span className="text-shopee-orange text-[30px] leading-none font-medium">{VND(price)}</span>
                      {oldPrice > price && (
                        <span className="text-gray-400 text-sm line-through">₫{VND(oldPrice)}</span>
                      )}
                      {discount > 0 && (
                        <span className="bg-shopee-orange text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px]">-{discount}%</span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 leading-4 text-right">Giá đã bao gồm VAT</div>
                  </div>

                  {/* Vouchers */}
                  <div className="flex items-start gap-4 mt-4 text-sm">
                    <span className="w-[104px] shrink-0 text-gray-500">Mã Giảm Giá</span>
                    <div className="flex flex-wrap items-center gap-2">
                      {['Giảm ₫20k', 'Giảm ₫50k', 'Giảm 10%'].map((v) => (
                        <span key={v} className="flex items-center gap-1 border border-dashed border-[#f6b6a8] bg-shopee-orange-light text-shopee-orange text-xs px-2 py-0.5 rounded-[2px]">
                          <DiscountShape size={12} variant="Bold" color="currentColor" /> {v}
                        </span>
                      ))}
                      <Link to="/vouchers" className="text-shopee-orange text-xs hover:underline">Xem tất cả</Link>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="flex items-start gap-4 mt-4 text-sm">
                    <span className="w-[104px] shrink-0 text-gray-500">Vận chuyển</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1.5">
                        <Truck size={18} variant="Bold" color="#00bfa5" />
                        <span className="text-gray-600">Vận chuyển tới</span>
                        <div className="relative">
                          <button
                            onClick={() => setShowShip((v) => !v)}
                            className="flex items-center gap-1 text-gray-800 font-medium hover:text-shopee-orange"
                          >
                            {shipTo} <ArrowDown2 size={12} variant="Linear" color="currentColor" />
                          </button>
                          {showShip && (
                            <div className="absolute top-7 left-0 bg-white shadow-lg rounded-[2px] w-44 py-1 z-30 text-sm">
                              {SHIPPING_CITIES.map((c) => (
                                <button
                                  key={c}
                                  onClick={() => { setShipTo(c); setShowShip(false); }}
                                  className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${shipTo === c ? 'text-shopee-orange' : 'text-gray-700'}`}
                                >
                                  {c}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-600">Phí vận chuyển</span>
                        <span className="text-gray-800 font-medium">₫0</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                        <Clock size={13} variant="Linear" color="currentColor" /> Nhận hàng dự kiến
                        <span className="text-gray-800">{dateLabel(shipFromDate)} - {dateLabel(shipToDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Variants */}
                  {variants.map((group) => (
                    <div key={group.label} className="flex items-start gap-4 mt-4 text-sm">
                      <span className="w-[104px] shrink-0 text-gray-500 pt-1.5">{group.label}</span>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((opt) => {
                          const active = selected[group.label] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => setSelected((s) => ({ ...s, [group.label]: opt }))}
                              className={`min-w-[64px] px-3 py-1.5 text-sm border rounded-[2px] transition ${
                                active
                                  ? 'border-shopee-orange text-shopee-orange bg-shopee-orange-light'
                                  : 'border-gray-300 text-gray-700 hover:border-shopee-orange'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mt-5 text-sm">
                    <span className="w-[104px] shrink-0 text-gray-500">Số lượng</span>
                    <div className="flex items-stretch h-8">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                        aria-label="Giảm số lượng"
                        className="w-8 border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus size={12} variant="Linear" color="currentColor" />
                      </button>
                      <input
                        value={qty}
                        onChange={(e) => {
                          const v = parseInt(e.target.value.replace(/\D/g, ''), 10) || 1;
                          setQty(Math.min(stock, Math.max(1, v)));
                        }}
                        inputMode="numeric"
                        id="quantity"
                        name="quantity"
                        aria-label="Số lượng"
                        className="w-12 border-y border-gray-300 text-center text-sm outline-none focus:border-shopee-orange"
                      />
                      <button
                        onClick={() => setQty((q) => Math.min(stock, q + 1))}
                        disabled={qty >= stock}
                        aria-label="Tăng số lượng"
                        className="w-8 border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Add size={12} variant="Linear" color="currentColor" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">{VND(stock)} sản phẩm có sẵn</span>
                  </div>

                  {/* Actions - Shopee-sized buttons, not full width */}
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={addToCart}
                      className="flex-1 sm:flex-none sm:w-[200px] h-11 md:h-12 flex items-center justify-center gap-2 border border-shopee-orange bg-shopee-orange-light text-shopee-orange text-[13px] md:text-sm font-medium rounded-[2px] hover:bg-[#ffe8e1] transition whitespace-nowrap"
                    >
                      <ShoppingCart size={18} variant="Outline" color="currentColor" />
                      Thêm Vào Giỏ Hàng
                    </button>
                    <button
                      onClick={buyNow}
                      className="flex-1 sm:flex-none sm:w-[200px] h-11 md:h-12 bg-shopee-orange text-white text-[13px] md:text-sm font-medium rounded-[2px] hover:bg-shopee-red transition whitespace-nowrap"
                    >
                      Mua Ngay
                    </button>
                  </div>

                  {/* Policies */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-gray-100 text-[11px] text-gray-600">
                    <span className="flex items-center gap-1.5"><ShieldTick size={16} variant="Bold" color="#ee4d2d" /> Chính hãng 100%</span>
                    <span className="flex items-center gap-1.5"><Refresh size={16} variant="Linear" color="#ee4d2d" /> Trả hàng miễn phí 15 ngày</span>
                    <span className="flex items-center gap-1.5"><Truck size={16} variant="Linear" color="#ee4d2d" /> Miễn phí vận chuyển</span>
                    <span className="flex items-center gap-1.5"><Verify size={16} variant="Linear" color="#ee4d2d" /> Thanh toán khi nhận hàng</span>
                  </div>

                  {/* Shop strip (mobile/tablet) */}
                  <div className="flex xl:hidden items-center gap-2 border-t border-gray-100 mt-4 pt-3">
                    <img src={shopAvatar} alt={shopName} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                    <span className="text-sm text-gray-800 truncate">{shopName}</span>
                    <span className="text-[10px] text-green-600 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
                    </span>
                    <button
                      onClick={() => navigate(shopPath(product))}
                      className="ml-auto shrink-0 text-xs border border-shopee-orange text-shopee-orange px-3 py-1 rounded-[2px] hover:bg-shopee-orange-light"
                    >
                      Xem Shop
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-sm">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-base md:text-lg font-medium text-gray-800">Chi tiết sản phẩm</h2>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-700 space-y-2.5">
                  <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2">
                    <span className="text-gray-500">Danh Mục</span>
                    <span>{product.category || 'Khác'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2">
                    <span className="text-gray-500">Thương hiệu</span>
                    <span>{product.brand || 'No Brand'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2">
                    <span className="text-gray-500">Xuất xứ</span>
                    <span>Việt Nam</span>
                  </div>
                  <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2">
                    <span className="text-gray-500">Gửi từ</span>
                    <span>{product.location || 'Hà Nội'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2">
                    <span className="text-gray-500">Kho hàng</span>
                    <span>{VND(stock)} sản phẩm</span>
                  </div>
                </div>

                <h3 className="text-base font-medium text-gray-800 mt-6 mb-3">Mô tả sản phẩm</h3>
                <p className="text-sm text-gray-700 leading-6 whitespace-pre-line">
                  {product.description || `${product.name} - sản phẩm chất lượng cao, giao hàng nhanh chóng, hỗ trợ đổi trả trong 7 ngày.`}
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-sm">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-base md:text-lg font-medium text-gray-800">Đánh giá sản phẩm</h2>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6">
                <div>
                  <div className="flex items-baseline text-shopee-orange">
                    <span className="text-3xl font-medium">{rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-700 ml-1.5">trên 5</span>
                  </div>
                  <div className="mt-2"><Stars value={rating} size={18} /></div>
                  <div className="text-xs text-gray-500 mt-1">{formatShort(reviewCount)} đánh giá</div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={() => setReviewFilter('all')}
                      className={`border px-2 py-2 text-xs rounded-[2px] text-center ${reviewFilter === 'all' ? 'border-shopee-orange text-shopee-orange' : 'border-gray-200 text-gray-600 hover:border-shopee-orange'}`}
                    >
                      Tất cả ({formatShort(reviewCount)})
                    </button>
                    {reviewStars.slice(0, 3).map(({ star, count }) => (
                      <button
                        key={star}
                        onClick={() => setReviewFilter(String(star))}
                        className={`border px-2 py-2 text-xs rounded-[2px] text-center ${reviewFilter === String(star) ? 'border-shopee-orange text-shopee-orange' : 'border-gray-200 text-gray-600 hover:border-shopee-orange'}`}
                      >
                        {star} Sao ({formatShort(count)})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {shownReviews.length === 0 && (
                    <div className="text-sm text-gray-400 py-8 text-center">Chưa có đánh giá nào cho mức sao này.</div>
                  )}
                  {shownReviews.map((r, i) => (
                    <div key={r.name} className="py-4 first:pt-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" loading="lazy" />
                        <span className="text-sm text-gray-800">{r.name}</span>
                        <Stars value={r.rating} size={11} />
                        {r.verified && (
                          <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                            <Verify size={11} variant="Bold" color="currentColor" /> Đã mua hàng
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {r.date} | Phân loại hàng: {r.variant}
                      </div>
                      <p className="text-sm text-gray-700 leading-6 mt-2">{r.text}</p>
                      {i === 0 && (
                        <div className="flex gap-2 mt-2">
                          {reviewImgs.map((img) => (
                            <img key={img} src={img} alt="" className="w-16 h-16 object-cover rounded-[2px] border border-gray-100" loading="lazy" />
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <Like size={13} variant="Linear" color="currentColor" /> Hữu ích ({r.likes})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related products */}
            {related.length > 0 && (
              <div className="bg-white rounded-sm">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-base md:text-lg font-medium text-gray-800">Sản phẩm tương tự</h2>
                </div>
                <div className="p-4 grid grid-cols-6 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
                  {related.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Shop sidebar */}
          <aside className="hidden xl:block space-y-4 xl:sticky xl:top-4">
            <div className="bg-white rounded-sm p-4">
              <div className="flex items-center gap-3">
                <img src={shopAvatar} alt={shopName} className="w-[72px] h-[72px] rounded-full object-cover border border-gray-100" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-medium text-gray-800 truncate">{shopName}</span>
                    {product.mall && (
                      <span className="bg-shopee-orange text-white text-[9px] font-bold px-1 py-px rounded-[2px]">Mall</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-green-600 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online 5 phút trước
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5 truncate">{product.location || 'Hà Nội'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                {[
                  ['Sản phẩm', '1,2k'],
                  ['Đánh giá', formatShort(reviewCount)],
                  ['Tỉ lệ phản hồi', '98%'],
                  ['Tham gia', '4 năm trước'],
                ].map(([k, v]) => (
                  <div key={k} className="border border-gray-100 rounded-[2px] px-2 py-1.5 flex items-center justify-between gap-1">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-gray-800">{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setChatOpen(true)}
                  className="flex-1 h-9 border border-shopee-orange text-shopee-orange text-sm flex items-center justify-center gap-1.5 rounded-[2px] hover:bg-shopee-orange-light transition"
                >
                  <Message size={15} variant="Outline" color="currentColor" /> Chat
                </button>
                <button
                  onClick={() => navigate(shopPath(product))}
                  className="flex-1 h-9 bg-shopee-orange text-white text-sm flex items-center justify-center gap-1.5 rounded-[2px] hover:bg-shopee-red transition"
                >
                  <Shop size={15} variant="Outline" color="#fff" /> Xem Shop
                </button>
              </div>
            </div>

            <div className="bg-white rounded-sm p-4 hidden lg:block">
              <h3 className="text-sm font-medium text-gray-800 mb-3">Ưu đãi của Shop</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <DiscountShape size={16} variant="Bold" color="#ee4d2d" /> Giảm ₫20k cho đơn từ ₫150k
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <DiscountShape size={16} variant="Bold" color="#ee4d2d" /> Giảm ₫50k cho đơn từ ₫500k
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Truck size={16} variant="Bold" color="#00bfa5" /> Freeship toàn quốc
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
      <BackToTop />

      {/* Mobile sticky action bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex items-stretch h-14 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => setChatOpen(true)}
          className="w-16 flex flex-col items-center justify-center gap-0.5 text-[10px] text-gray-600 border-r border-gray-100"
        >
          <Message size={19} variant="Outline" color="currentColor" /> Chat
        </button>
        <button
          onClick={addToCart}
          className="flex-1 m-1.5 mr-1 flex items-center justify-center gap-1.5 border border-shopee-orange text-shopee-orange bg-shopee-orange-light text-[13px] font-medium rounded-[2px]"
        >
          <ShoppingCart size={17} variant="Outline" color="currentColor" /> Thêm vào giỏ
        </button>
        <button
          onClick={buyNow}
          className="flex-1 m-1.5 ml-0 bg-shopee-orange text-white text-[13px] font-medium rounded-[2px]"
        >
          Mua ngay
        </button>
      </div>
      <div className="lg:hidden h-14" />

      <ChatBox
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        shop={shop}
        product={{ ...product, img: imgSrc }}
      />
    </div>
  );
}
