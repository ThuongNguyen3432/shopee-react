import SeeAll from './SeeAll.jsx';

export default function VoucherBar() {
  const vouchers = [
    { label: 'Giảm 50K', sub: 'Đơn từ 200K' },
    { label: 'Freeship Xtra', sub: 'Toàn quốc' },
    { label: 'Giảm 15%', sub: 'Shopee Mall' },
    { label: 'Giảm 30K', sub: 'Đơn từ 99K' },
    { label: 'Hoàn xu 10%', sub: 'Mọi đơn' },
  ];
  return (
    <div className="bg-white mt-2.5 rounded-sm p-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
      <div className="text-shopee-orange font-bold text-sm whitespace-nowrap">Voucher của bạn</div>
      <div className="flex gap-2">
        {vouchers.map((v) => (
          <div key={v.label} className="border border-dashed border-shopee-orange rounded-sm px-3 py-1.5 text-center cursor-pointer hover:bg-shopee-orange-light min-w-[110px]">
            <div className="text-shopee-orange font-bold text-xs">{v.label}</div>
            <div className="text-gray-500 text-[10px]">{v.sub}</div>
          </div>
        ))}
      </div>
      <SeeAll to="/vouchers">Xem tất cả voucher</SeeAll>
    </div>
  );
}
