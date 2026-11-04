import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { store } from '../admin/store.js';
import { PRODUCTS } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import LazyImage from '../components/LazyImage.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let p = null;
        let list = [];
        if (isSupabaseConfigured) {
          try {
            const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
            if (error) throw error;
            p = data;
            const { data: rel } = await supabase.from('products').select('*').neq('id', id).limit(6);
            setRelated(rel || []);
            setProduct(p);
            setLoading(false);
            return;
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

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-400">Đang tải...</div>;
  if (!product) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-400 mb-3">Không tìm thấy sản phẩm.</div>
        <button onClick={() => navigate('/')} className="text-shopee-orange hover:underline">Về trang chủ</button>
      </div>
    </div>
  );

  const imgSrc = product.img || product.image;
  const imgs = [imgSrc, imgSrc, imgSrc, imgSrc];
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-700 truncate">{product.name}</span>
        </div>

        {/* Main product card */}
        <div className="bg-white rounded-sm shadow-sm p-4 grid grid-cols-2 gap-6 max-[800px]:grid-cols-1">
          {/* Image gallery */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-square bg-gray-100 rounded-sm overflow-hidden mb-2">
              <LazyImage src={imgs[activeImg]} alt={product.name} className="w-full aspect-square" />
            </motion.div>
            <div className="flex gap-2">
              {imgs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-sm overflow-hidden border-2 ${activeImg === i ? 'border-shopee-orange' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-lg font-medium text-gray-800 leading-snug mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 text-sm mb-3 flex-wrap">
              <span className="text-yellow-500">★ {product.rating}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">{product.sold} đã bán</span>
              {product.mall && <span className="bg-shopee-orange text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">Mall</span>}
            </div>
            {product.location && (
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="text-gray-500 w-24 shrink-0">Vị trí</span>
                <span className="text-gray-700">📍 {product.location}</span>
              </div>
            )}

            {/* Price block */}
            <div className="bg-gray-50 rounded p-3 mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-shopee-orange text-2xl font-bold">₫{Number(product.price).toLocaleString('vi-VN')}</span>
                {product.old_price && (
                  <span className="text-gray-400 text-sm line-through">₫{Number(product.old_price).toLocaleString('vi-VN')}</span>
                )}
                {discount > 0 && (
                  <span className="bg-shopee-orange text-white text-xs px-1.5 py-0.5 rounded-sm font-bold">-{discount}%</span>
                )}
              </div>
            </div>

            {/* Voucher hint */}
            <div className="flex items-center gap-2 text-sm mb-3">
              <span className="text-gray-500 w-24 shrink-0">Vận chuyển</span>
              <span className="text-gray-700">Freeship toàn quốc · Nhận trong 2-4 ngày</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-gray-500 text-sm w-24 shrink-0">Số lượng</span>
              <div className="flex items-center border border-gray-300 rounded-sm">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5 hover:bg-gray-100">−</button>
                <span className="px-4 py-1.5 border-x border-gray-300 text-sm">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1.5 hover:bg-gray-100">+</button>
              </div>
              <span className="text-xs text-gray-400">{product.stock} sản phẩm có sẵn</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { for (let i = 0; i < qty; i++) add(product); }}
                className="flex-1 border border-shopee-orange text-shopee-orange py-3 rounded-sm hover:bg-shopee-orange-light text-sm font-medium"
              >
                🛒 Thêm vào giỏ hàng
              </button>
              <button
                onClick={() => { for (let i = 0; i < qty; i++) add(product); navigate('/checkout'); }}
                className="flex-1 bg-shopee-orange text-white py-3 rounded-sm hover:bg-shopee-red text-sm font-medium"
              >
                Mua ngay
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <div>Cam kết chính hãng · Hoàn tiền 200% nếu hàng giả</div>
              <div>Đổi trả trong 7 ngày · Bảo hành theo shop</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-sm shadow-sm p-4 mt-4">
          <h2 className="font-medium text-gray-700 mb-3 border-b pb-2">Mô tả sản phẩm</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description || 'Sản phẩm chất lượng cao, giao hàng nhanh chóng, hỗ trợ đổi trả trong 7 ngày.'}
          </p>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="bg-white rounded-sm shadow-sm p-4 mt-4">
            <h2 className="font-medium text-gray-700 mb-3 border-b pb-2">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-6 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}