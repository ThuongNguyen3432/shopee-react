import { useState, useEffect } from 'react';
import { store } from '../admin/store.js';

export default function Banner() {
  const [idx, setIdx] = useState(0);
  const [mainBanners, setMainBanners] = useState([]);
  const [sideBanners, setSideBanners] = useState([]);

  useEffect(() => {
    const all = (store.get('banners') || []).filter((b) => b.active !== false);
    setMainBanners(all.filter((b) => b.position === 'main' || !b.position));
    setSideBanners(all.filter((b) => b.position === 'side'));
  }, []);

  const slides = mainBanners.length ? mainBanners.map((b) => b.image) : [
    'https://picsum.photos/seed/shopee-banner1/960/400',
    'https://picsum.photos/seed/shopee-banner2/960/400',
    'https://picsum.photos/seed/shopee-banner3/960/400',
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  const side = sideBanners.length ? sideBanners : [
    { image: 'https://picsum.photos/seed/shopee-side1/560/280', link: '#' },
    { image: 'https://picsum.photos/seed/shopee-side2/560/280', link: '#' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-2 mt-2">
      <div className="relative flex-1 rounded-sm overflow-hidden" style={{ aspectRatio: '2.4/1' }}>
        <div className="flex transition-transform duration-500 h-full" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {slides.map((s, i) => (
            <div key={i} className="min-w-full h-full">
              <img src={s} alt={`banner${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="hidden md:flex md:flex-col gap-2 md:w-[280px]">
        {side.slice(0, 2).map((b, i) => (
          <a key={i} href={b.link || '#'} className="rounded-sm overflow-hidden block" style={{ aspectRatio: '2/1' }}>
            <img src={b.image} alt={`side${i}`} className="w-full h-full object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}
