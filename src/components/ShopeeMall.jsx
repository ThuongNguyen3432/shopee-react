export default function ShopeeMall() {
  return (
    <section className="bg-white mt-2.5 p-3 rounded-sm">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-base font-medium text-gray-600 border-b-2 border-shopee-orange pb-1">SHOPEE MALL</span>
        <span className="text-xs text-gray-400">Chính hãng 100% · Hoàn tiền 200% nếu hàng giả · Freeship mọi đơn</span>
      </div>
      <div className="flex gap-2">
        <a href="/mall" className="flex-1 rounded-sm overflow-hidden block" style={{ aspectRatio: '3/1' }}>
          <img src="https://picsum.photos/seed/mall1/720/240" alt="mall1" className="w-full h-full object-cover" />
        </a>
        <a href="/mall" className="flex-1 rounded-sm overflow-hidden block" style={{ aspectRatio: '3/1' }}>
          <img src="https://picsum.photos/seed/mall2/720/240" alt="mall2" className="w-full h-full object-cover" />
        </a>
      </div>
    </section>
  );
}
