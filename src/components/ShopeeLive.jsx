export default function ShopeeLive() {
  const lives = [
    { title: 'Live Sale 12.12 - Giảm đến 70%', viewers: '12.3K', img: 'https://picsum.photos/seed/live1/240/320' },
    { title: 'Review mỹ phẩm hot trend', viewers: '5.1K', img: 'https://picsum.photos/seed/live2/240/320' },
    { title: 'Thời trang nữ deal sốc', viewers: '8.7K', img: 'https://picsum.photos/seed/live3/240/320' },
    { title: 'Đồ gia dụng thông minh', viewers: '3.2K', img: 'https://picsum.photos/seed/live4/240/320' },
    { title: 'Giày dép sale cuối mùa', viewers: '6.9K', img: 'https://picsum.photos/seed/live5/240/320' },
  ];
  return (
    <section className="bg-white mt-2.5 p-3 rounded-sm">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-base font-medium text-gray-600 border-b-2 border-shopee-orange pb-1">SHOPEE LIVE</span>
        <span className="text-xs text-gray-400">Xem live · Mua ngay · Nhận voucher</span>
        <a href="/live" className="ml-auto text-shopee-orange text-xs">Xem tất cả ›</a>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {lives.map((l) => (
          <div key={l.title} className="min-w-[160px] relative rounded-sm overflow-hidden cursor-pointer">
            <img src={l.img} alt={l.title} className="w-full aspect-[3/4] object-cover" loading="lazy" />
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <div className="text-white text-xs line-clamp-2">{l.title}</div>
              <div className="text-white/80 text-[10px] mt-1">👁 {l.viewers} đang xem</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
