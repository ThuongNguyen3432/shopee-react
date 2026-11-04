import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';

const lives = [
  { title: 'Live Sale 12.12 - Giảm đến 70%', viewers: '12.3K', img: 'https://picsum.photos/seed/live1/240/320' },
  { title: 'Review mỹ phẩm hot trend', viewers: '5.1K', img: 'https://picsum.photos/seed/live2/240/320' },
  { title: 'Thời trang nữ deal sốc', viewers: '8.7K', img: 'https://picsum.photos/seed/live3/240/320' },
  { title: 'Đồ gia dụng thông minh', viewers: '3.2K', img: 'https://picsum.photos/seed/live4/240/320' },
  { title: 'Giày dép sale cuối mùa', viewers: '6.9K', img: 'https://picsum.photos/seed/live5/240/320' },
  { title: 'Live công nghệ - Giảm 50%', viewers: '9.4K', img: 'https://picsum.photos/seed/live6/240/320' },
  { title: 'Thời trang nam hot', viewers: '4.2K', img: 'https://picsum.photos/seed/live7/240/320' },
  { title: 'Mỹ phẩm Hàn Quốc', viewers: '7.8K', img: 'https://picsum.photos/seed/live8/240/320' },
];

export default function LivePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-2 py-4 max-w-[1200px]">
        <h1 className="text-lg font-bold text-gray-800 mb-3">Shopee Live</h1>
        <div className="grid grid-cols-5 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
          {lives.map((l) => (
            <div key={l.title} className="relative rounded-sm overflow-hidden cursor-pointer">
              <img src={l.img} alt={l.title} className="w-full aspect-[3/4] object-cover" />
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
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}