import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

export default function MallPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        <h1 className="text-lg font-bold text-gray-800 mb-3">Shopee Mall</h1>
        <p className="text-sm text-gray-500 mb-4">Chính hãng 100% · Hoàn tiền 200% nếu hàng giả · Freeship mọi đơn</p>
        <div className="grid grid-cols-2 gap-3">
          <img src="https://picsum.photos/seed/mall1/720/240" alt="mall1" className="w-full rounded-sm" />
          <img src="https://picsum.photos/seed/mall2/720/240" alt="mall2" className="w-full rounded-sm" />
          <img src="https://picsum.photos/seed/mall3/720/240" alt="mall3" className="w-full rounded-sm" />
          <img src="https://picsum.photos/seed/mall4/720/240" alt="mall4" className="w-full rounded-sm" />
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}