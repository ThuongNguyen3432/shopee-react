import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([
    { id: 1, name: 'Tai nghe Bluetooth 5.3 không dây', price: 49000, qty: 1, img: 'https://picsum.photos/seed/fp1/80/80' },
    { id: 2, name: 'Áo thun nam cotton basic form rộng', price: 79000, qty: 2, img: 'https://picsum.photos/seed/fp2/80/80' },
  ]);
  const [toast, setToast] = useState(null);

  const add = (product) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id: product.id, name: product.name, price: parseInt(product.price.replace(/\D/g, '')), qty: 1, img: product.img }];
    });
    showToast('Đã thêm vào giỏ hàng');
  };
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total, count, toast }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-5 py-3 rounded-sm shadow-lg z-50 text-sm animate-bounce">
          {toast}
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);