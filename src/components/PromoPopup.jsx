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

// Voucher codes in the description (e.g. SHOPEE50) get their own ticket chip.
function extractCode(text) {
  const match = String(text || '').match(/\b[A-Z0-9]{5,}\b/);
  return match ? match[0] : '';
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open || !config) return null;

  const close = () => { setOpen(false); markSeen(config.frequency); };
  const code = extractCode(config.desc);

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-4 backdrop-blur-[1px]"
      onClick={close}
      role="presentation"
    >
      <div
        className="relative w-full max-w-[400px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={config.title || 'Ưu đãi'}
      >
        <button
          onClick={close}
          aria-label="Đóng"
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md ring-1 ring-black/5 text-gray-500 hover:text-shopee-orange flex items-center justify-center transition"
        >
          <CloseCircle size={20} variant="Outline" color="currentColor" />
        </button>

        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
          {/* Hero */}
          <div className="relative h-[190px] bg-gradient-to-br from-[#ff8a4c] via-[#f5602f] to-[#ee4d2d] overflow-hidden">
            {config.image && (
              <img
                src={config.image}
                alt={config.title || 'Ưu đãi'}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <span className="absolute left-4 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Ưu đãi độc quyền
            </span>
          </div>

          {/* Content */}
          <div className="px-5 pt-4 pb-5 text-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-6">
              {config.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-5 text-gray-500">
              {config.desc}
            </p>

            {code && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-[12px] text-gray-400">Mã giảm giá</span>
                <span className="rounded-[3px] border border-dashed border-shopee-orange bg-shopee-orange-light px-2.5 py-1 font-mono text-[13px] font-semibold tracking-wider text-shopee-orange">
                  {code}
                </span>
              </div>
            )}

            <Link
              to={config.button_link || '/vouchers'}
              onClick={close}
              className="mt-4 flex items-center justify-center w-full h-11 rounded-[2px] bg-shopee-orange text-sm font-medium uppercase tracking-wide text-white transition hover:bg-shopee-red"
            >
              {config.button_text || 'Nhận ngay'}
            </Link>

            <button
              onClick={close}
              className="mt-3 text-[13px] text-gray-400 transition hover:text-shopee-orange"
            >
              Để sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
