import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 bg-shopee-orange text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-shopee-red z-40"
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
