import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CloseCircle } from 'iconsax-react';
import { store } from '../admin/store.js';

const KEY = 'shopee_popup_seen';

function shouldShow(freq) {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : {};
    const now = Date.now();
    if (freq === 'always') return true;
    if (freq === 'once') return !data.seen;
    if (freq === 'daily') {
      const last = data.last || 0;
      return now - last > 24 * 60 * 60 * 1000;
    }
    return true;
  } catch {
    return true;
  }
}

function markSeen(freq) {
  try {
    const data = freq === 'daily' ? { last: Date.now() } : { seen: true };
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export default function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const cfg = store.get('popup');
    if (!cfg || cfg.enabled === false) return;
    if (!shouldShow(cfg.frequency)) return;
    setConfig(cfg);
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (!open || !config) return null;

  const close = () => { setOpen(false); markSeen(config.frequency); };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" onClick={close}>
      <div className="bg-white rounded-sm w-full max-w-sm overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {config.image && (
          <div className="relative">
            <img src={config.image} alt={config.title} className="w-full h-44 object-cover" />
            <button onClick={close} aria-label="Đóng" className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60">
              <CloseCircle size={20} variant="Outline" color="#fff" />
            </button>
          </div>
        )}
        <div className="p-4 text-center">
          <div className="font-medium text-gray-800 text-base">{config.title}</div>
          <div className="text-sm text-gray-500 mt-1.5">{config.desc}</div>
          <Link
            to={config.button_link || '/vouchers'}
            onClick={close}
            className="mt-4 inline-block w-full h-10 leading-10 bg-shopee-orange text-white text-sm rounded-[2px] hover:bg-shopee-red"
          >
            {config.button_text || 'Nhận ngay'}
          </Link>
          <button onClick={close} className="mt-2 text-xs text-gray-400 hover:text-gray-600">Để sau</button>
        </div>
      </div>
    </div>
  );
}
