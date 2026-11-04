import { CloseCircle, Star1, Minus, Add } from 'iconsax-react';

export default function ProductModal({ product, onClose, onAdd }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-sm max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-3 border-b">
          <div className="font-medium text-gray-700">Xem nhanh sản phẩm</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Đóng">
            <CloseCircle size={22} variant="Linear" color="currentColor" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <img src={(product.img || product.image || '').replace('400/400', '600/600')} alt={product.name} className="w-full aspect-square object-cover rounded-sm" />
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://picsum.photos/seed/${product.name}${i}/80/80`} alt="" className="w-16 h-16 object-cover rounded-sm cursor-pointer border hover:border-shopee-orange" />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">{product.name}</h2>
            <div className="flex items-center gap-2 mb-3 text-sm">
              <span className="text-yellow-600 flex items-center gap-1"><Star1 size={14} variant="Bold" color="#f5c518" /> {product.rating}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">Đã bán {product.sold}</span>
              {product.mall && <span className="bg-shopee-orange text-white text-[10px] px-1 rounded-sm">Mall</span>}
            </div>
            <div className="bg-gray-50 p-3 rounded-sm mb-3">
              <span className="text-shopee-orange text-2xl font-bold">₫{product.price}</span>
              <span className="text-gray-400 text-sm line-through ml-2">₫{(parseInt(product.price.replace(/\D/g, '')) * 1.5).toLocaleString('vi-VN')}</span>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              <div className="flex gap-2 mb-1"><span className="w-20 text-gray-400">Vận chuyển</span><span>Freeship toàn quốc</span></div>
              <div className="flex gap-2 mb-1"><span className="w-20 text-gray-400">Số lượng</span>
                <div className="flex items-center border border-gray-300">
                  <button className="px-2 py-0.5 hover:bg-gray-100"><Minus size={12} variant="Linear" color="currentColor" /></button>
                  <span className="px-3 py-0.5 border-x border-gray-300">1</span>
                  <button className="px-2 py-0.5 hover:bg-gray-100"><Add size={12} variant="Linear" color="currentColor" /></button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => onAdd(product)} className="flex-1 border border-shopee-orange text-shopee-orange py-2.5 rounded-sm hover:bg-shopee-orange-light text-sm">
                Thêm vào giỏ hàng
              </button>
              <button className="flex-1 bg-shopee-orange text-white py-2.5 rounded-sm hover:bg-shopee-red text-sm">
                Mua ngay
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              Cam kết chính hãng · Hoàn tiền 200% nếu hàng giả · Đổi trả trong 7 ngày
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
