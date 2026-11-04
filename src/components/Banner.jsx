import { useState, useEffect } from 'react';

export default function Banner() {
  const [idx, setIdx] = useState(0);
  const slides = [
    'https://picsum.photos/seed/shopee-banner1/960/400',
    'https://picsum.photos/seed/shopee-banner2/960/400',
    'https://picsum.photos/seed/shopee-banner3/960/400',
  ];
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);
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
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </div>
      <div className="hidden md:flex md:flex-col gap-2 md:w-[280px]">
        <div className="rounded-sm overflow-hidden" style={{ aspectRatio: '2/1' }}>
          <img src="https://picsum.photos/seed/shopee-side1/560/280" alt="side1" className="w-full h-full object-cover" />
        </div>
        <div className="rounded-sm overflow-hidden" style={{ aspectRatio: '2/1' }}>
          <img src="https://picsum.photos/seed/shopee-side2/560/280" alt="side2" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
