import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight2, DiscountShape, Minus, Add, SearchNormal1, Shop,
  ShoppingCart, Ticket, TickCircle, Trash,
} from 'iconsax-react';
import { useCart } from '../context/CartContext.jsx';
import { PRODUCTS } from '../data/products.js';
import { getShopInfo, shopPath } from '../lib/shop.js';
import ProductCard from '../components/ProductCard.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

const VND = (n) => Number(n || 0).toLocaleString('vi-VN');

const VARIANTS = ['Mặc định', 'Đen / M', 'Trắng / L', 'Cao cấp', 'Be / S'];

function oldPriceOf(item) {
  return Number(item.old_price) || Math.round(Number(item.price) * 1.25);
}

function Checkbox({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`w-[18px] h-[18px] shrink-0 rounded-[2px] border flex items-center justify-center transition ${checked
        ? 'bg-shopee-orange border-shopee-orange'
        : 'bg-white border-gray-300 hover:border-shopee-orange'}`}
    >
      {checked && <TickCircle size={13} variant="Bold" color="#fff" />}
    </button>
  );
}

function QtyStepper({ qty, onChange }) {
  return (
    <div className="flex items-stretch h-8">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        disabled={qty <= 1}
        aria-label="Giảm số lượng"
        className="w-7 border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus size={11} variant="Linear" color="currentColor" />
      </button>
      <input
        name="qty"
        value={qty}
        onChange={(e) => onChange(parseInt(e.target.value.replace(/\D/g, ''), 10) || 1)}
        inputMode="numeric"
        aria-label="Số lượng"
        className="w-10 border-y border-gray-300 text-center text-sm outline-none focus:border-shopee-orange"
      />
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        disabled={qty >= 99}
        aria-label="Tăng số lượng"
        className="w-7 border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Add size={11} variant="Linear" color="currentColor" />
      </button>
    </div>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeMany, updateQty } = useCart();
  const [excluded, setExcluded] = useState(() => new Set());

  const groups = useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      const shop = getShopInfo(item);
      if (!map.has(shop.id)) map.set(shop.id, { shop, items: [] });
      map.get(shop.id).items.push(item);
    });
    return [...map.values()];
  }, [items]);

  const selectedItems = items.filter((i) => !excluded.has(i.id));
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const selectedCount = selectedItems.reduce((s, i) => s + i.qty, 0);
  const totalPay = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);
  const saved = selectedItems.reduce((s, i) => s + Math.max(0, oldPriceOf(i) - i.price) * i.qty, 0);

  const toggle = (id) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setExcluded(allSelected ? new Set(items.map((i) => i.id)) : new Set());
  };

  const toggleShop = (shopItems) => {
    const allInShop = shopItems.every((i) => !excluded.has(i.id));
    setExcluded((prev) => {
      const next = new Set(prev);
      shopItems.forEach((i) => {
        if (allInShop) next.add(i.id);
        else next.delete(i.id);
      });
      return next;
    });
  };

  const deleteSelected = () => {
    removeMany(selectedItems.map((i) => i.id));
    setExcluded(new Set());
  };

  const suggestions = PRODUCTS.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        {/* Breadcrumb + title */}
        <div className="text-[13px] text-gray-500 mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-shopee-orange">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Giỏ Hàng</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <h1 className="text-lg md:text-xl text-gray-800">Giỏ Hàng</h1>
          <span className="text-sm text-gray-500">{items.length} sản phẩm</span>
        </div>

        {items.length === 0 ? (
          <>
            <div className="bg-white rounded-sm py-14 px-4 text-center">
              <div className="flex justify-center text-gray-300 mb-3">
                <ShoppingCart size={64} variant="Linear" color="#c7c7c7" />
              </div>
              <div className="text-sm text-gray-700">Giỏ hàng của bạn còn trống</div>
              <button
                onClick={() => navigate('/')}
                className="mt-4 h-9 px-10 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red transition"
              >
                Mua ngay
              </button>
            </div>

            <div className="bg-white rounded-sm mt-3 p-3">
              <h2 className="text-sm text-gray-700 mb-3">Có thể bạn cũng thích</h2>
              <div className="grid grid-cols-6 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
                {suggestions.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Voucher strip */}
            <div className="bg-white rounded-sm mb-3 px-3 py-2 flex items-center gap-2 text-xs">
              <Ticket size={16} variant="Bold" color="#ee4d2d" />
              <span className="text-gray-700">Shopee Voucher</span>
              <Link to="/vouchers" className="text-shopee-orange hover:underline flex items-center gap-0.5">
                Chọn hoặc nhập mã <ArrowRight2 size={10} variant="Linear" color="currentColor" />
              </Link>
              <span className="ml-auto text-gray-500 hidden sm:inline">Giảm thêm đến ₫50k cho đơn hàng của bạn</span>
            </div>

            {/* Column header (desktop) */}
            <div className="hidden md:flex items-center bg-white rounded-sm px-3 h-9 text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-3 w-[calc(100%-500px)] min-w-[280px]">
                <Checkbox checked={allSelected} onChange={toggleAll} label="Chọn tất cả sản phẩm" />
                <span>Sản phẩm</span>
              </div>
              <div className="w-[110px] text-center">Đơn giá</div>
              <div className="w-[120px] text-center">Số lượng</div>
              <div className="w-[120px] text-center">Số tiền</div>
              <div className="w-[70px] text-center">Thao tác</div>
            </div>

            {/* Shop groups */}
            <div className="space-y-2">
              {groups.map(({ shop, items: shopItems }) => {
                const allInShop = shopItems.every((i) => !excluded.has(i.id));
                return (
                  <div key={shop.id} className="bg-white rounded-sm">
                    {/* Shop header */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 text-sm">
                      <Checkbox checked={allInShop} onChange={() => toggleShop(shopItems)} label={`Chọn sản phẩm của ${shop.name}`} />
                      <Link to={shopPath(shopItems[0])} className="flex items-center gap-1.5 font-medium text-gray-800 hover:text-shopee-orange min-w-0">
                        <Shop size={15} variant="Outline" color="currentColor" className="shrink-0" />
                        <span className="truncate">{shop.name}</span>
                      </Link>
                      {shop.mall && (
                        <span className="bg-shopee-orange text-white text-[9px] font-bold px-1 py-px rounded-[2px] shrink-0">Mall</span>
                      )}
                      <span className="hidden sm:flex items-center gap-1 text-[11px] text-shopee-orange border border-dashed border-shopee-orange/40 bg-shopee-orange-light px-1.5 py-0.5 rounded-[2px]">
                        <DiscountShape size={11} variant="Bold" color="currentColor" /> Giảm ₫20k
                      </span>
                    </div>

                    {/* Items */}
                    {shopItems.map((item) => {
                      const checked = !excluded.has(item.id);
                      const lineTotal = item.price * item.qty;
                      const oldPrice = oldPriceOf(item);
                      const discount = oldPrice > item.price ? Math.round((1 - item.price / oldPrice) * 100) : 0;
                      const variant = VARIANTS[Number(String(item.id).replace(/\D/g, '')) % VARIANTS.length];
                      return (
                        <div
                          key={item.id}
                          className={`flex items-start gap-2 md:gap-3 px-3 py-3 border-b border-gray-100 last:border-0 ${checked ? '' : 'opacity-60'}`}
                        >
                          <div className="pt-1">
                            <Checkbox checked={checked} onChange={() => toggle(item.id)} label={`Chọn ${item.name}`} />
                          </div>

                          <Link to={`/product/${item.id}`} className="shrink-0">
                            <img
                              src={item.img || item.image}
                              alt={item.name}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover border border-gray-100 rounded-[2px]"
                              loading="lazy"
                            />
                          </Link>

                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item.id}`} className="text-xs md:text-sm text-gray-800 line-clamp-2 hover:text-shopee-orange leading-5">
                              {item.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 flex-wrap">
                              <span>Phân loại hàng: {variant}</span>
                              <span className="text-gray-300">|</span>
                              <span className="text-shopee-orange border border-shopee-orange/40 bg-shopee-orange-light px-1 rounded-[2px] text-[10px]">Yêu thích</span>
                            </div>

                            {/* Mobile price + qty */}
                            <div className="flex items-center justify-between gap-2 mt-2 md:hidden">
                              <div className="flex items-baseline gap-1">
                                <span className="text-shopee-orange text-sm font-medium">₫{VND(item.price)}</span>
                                <span className="text-gray-400 text-[11px] line-through">₫{VND(oldPrice)}</span>
                              </div>
                              <QtyStepper qty={item.qty} onChange={(v) => updateQty(item.id, v)} />
                            </div>
                            <div className="flex items-center justify-between mt-2 md:hidden">
                              <button
                                onClick={() => removeMany([item.id])}
                                className="text-xs text-gray-500 hover:text-shopee-orange flex items-center gap-1"
                              >
                                <Trash size={13} variant="Linear" color="currentColor" /> Xoá
                              </button>
                              <span className="text-shopee-orange text-sm font-medium">₫{VND(lineTotal)}</span>
                            </div>
                          </div>

                          {/* Desktop columns */}
                          <div className="hidden md:block w-[110px] text-center text-sm">
                            <div className="text-gray-800">₫{VND(item.price)}</div>
                            {oldPrice > item.price && (
                              <div className="flex items-center justify-center gap-1 mt-0.5">
                                <span className="text-gray-400 text-[11px] line-through">₫{VND(oldPrice)}</span>
                                {discount > 0 && <span className="text-[10px] text-shopee-orange">-{discount}%</span>}
                              </div>
                            )}
                          </div>
                          <div className="hidden md:flex w-[120px] justify-center">
                            <QtyStepper qty={item.qty} onChange={(v) => updateQty(item.id, v)} />
                          </div>
                          <div className="hidden md:block w-[120px] text-center text-shopee-orange text-sm font-medium">
                            ₫{VND(lineTotal)}
                          </div>
                          <div className="hidden md:flex w-[70px] flex-col items-center gap-1">
                            <button
                              onClick={() => removeMany([item.id])}
                              className="text-xs text-gray-500 hover:text-shopee-orange flex items-center gap-1"
                            >
                              <Trash size={13} variant="Linear" color="currentColor" /> Xoá
                            </button>
                            <Link to={`/search?q=${encodeURIComponent(item.name.split(' ').slice(0, 3).join(' '))}`} className="text-[10px] text-shopee-orange hover:underline text-center leading-4">
                              Tìm sản phẩm tương tự
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-sm mt-3 sticky bottom-0 z-30 border-t-2 border-shopee-orange shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-3 py-2.5">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={allSelected} onChange={toggleAll} label="Chọn tất cả sản phẩm" />
                    <span className="text-xs md:text-sm text-gray-700">Chọn tất cả ({items.length})</span>
                  </div>
                  <button
                    onClick={deleteSelected}
                    disabled={selectedItems.length === 0}
                    className="text-xs md:text-sm text-gray-500 hover:text-shopee-orange disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Xoá
                  </button>
                  <Link to="/search" className="hidden lg:flex items-center gap-1 text-xs text-gray-500 hover:text-shopee-orange">
                    <SearchNormal1 size={13} variant="Linear" color="currentColor" /> Tiếp tục mua sắm
                  </Link>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5">
                  <div className="text-right">
                    <div className="text-[11px] text-gray-500">
                      Tiết kiệm <span className="text-shopee-orange">₫{VND(saved)}</span>
                    </div>
                    <div className="flex items-baseline justify-end gap-1.5">
                      <span className="text-xs md:text-sm text-gray-700">Tổng thanh toán ({selectedCount} sản phẩm):</span>
                      <span className="text-shopee-orange text-lg md:text-xl font-medium">₫{VND(totalPay)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/checkout')}
                    disabled={selectedItems.length === 0}
                    className="h-10 md:h-11 w-[150px] md:w-[200px] bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    Mua Hàng
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
