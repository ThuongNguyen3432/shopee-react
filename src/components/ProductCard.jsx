import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import LazyImage from './LazyImage.jsx';

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { add } = useCart();
  const img = product.img || product.image;
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : (20 + (product.id * 7) % 50);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white cursor-pointer hover:shadow-lg transition-all duration-200 relative overflow-hidden rounded-lg border border-gray-200 hover:border-shopee-orange"
    >
      <div className="relative">
        <LazyImage src={img} alt={product.name} className="w-full aspect-square" />
        {/* Discount badge */}
        <div className="absolute top-0 right-0 bg-shopee-orange text-white text-[11px] font-bold px-1.5 py-0.5 rounded-bl-sm">
          -{discount}%
        </div>
        {/* Yêu thích badge */}
        <div className="absolute top-1 left-1 bg-white text-shopee-orange text-[9px] px-1.5 py-0.5 rounded-sm font-medium border border-shopee-orange">
          Yêu thích
        </div>
        {/* Mall + Freeship badges */}
        <div className="absolute bottom-1 left-1 flex gap-1">
          {product.mall && (
            <span className="bg-shopee-orange text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold">Mall</span>
          )}
          <span className="bg-white/90 text-gray-600 text-[9px] px-1.5 py-0.5 rounded-sm">Freeship</span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition flex items-end justify-center opacity-0 group-hover:opacity-100">
          <div className="w-full bg-white/90 py-1.5 text-center text-xs text-gray-700 hover:text-shopee-orange">
            Tìm sản phẩm tương tự
          </div>
        </div>
      </div>
      <div className="px-2 pt-2 pb-2">
        <div className="text-xs text-gray-800 leading-snug h-[34px] overflow-hidden line-clamp-2">{product.name}</div>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-shopee-orange text-[11px]">₫</span>
          <span className="text-shopee-orange text-base font-medium">{Number(product.price).toLocaleString('vi-VN')}</span>
          {product.old_price && (
            <span className="text-gray-400 text-[11px] line-through ml-1">₫{Number(product.old_price).toLocaleString('vi-VN')}</span>
          )}
        </div>
        <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1.5">
          <span className="flex items-center gap-0.5">
            <span className="text-yellow-500">★</span> {product.rating}
          </span>
          <span>Đã bán {product.sold}</span>
        </div>
        {product.location && (
          <div className="text-[10px] text-gray-400 mt-1 truncate">📍 {product.location}</div>
        )}
      </div>
    </motion.div>
  );
}