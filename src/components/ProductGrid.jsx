import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import ProductModal from './ProductModal.jsx';
import ProductCard from './ProductCard.jsx';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { ArrowDown2, TickCircle } from 'iconsax-react';

import { PRODUCTS as products } from '../data/products.js';
const TABS = ['Gợi ý hôm nay', 'Flash Sale', 'Shopee Mall', 'Xu hướng', 'Mới nhất'];
const SORTS = [
  { value: 'popular', label: 'Phổ biến' },
  { value: 'price-asc', label: 'Giá: thấp đến cao' },
  { value: 'price-desc', label: 'Giá: cao đến thấp' },
  { value: 'rating', label: 'Đánh giá' },
];

export default function ProductGrid() {
  const { add } = useCart();
  const [list, setList] = useState(products);
  const [activeTab, setActiveTab] = useState('Gợi ý hôm nay');
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState('popular');
  const [sortOpen, setSortOpen] = useState(false);
  const [visible, setVisible] = useState(24);
  const currentSort = SORTS.find((s) => s.value === sort) ?? SORTS[0];

  const sorted = [...list].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <section className="bg-white mt-2.5 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-base font-medium pb-1.5 border-b-2 transition whitespace-nowrap ${activeTab === t ? 'text-shopee-orange border-shopee-orange' : 'text-gray-500 border-transparent hover:text-shopee-orange'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <Popover open={sortOpen} onOpenChange={setSortOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={sortOpen}
              className="h-8 w-[150px] justify-between border-gray-300 px-2 text-xs font-normal text-gray-600 hover:text-shopee-orange"
            >
              {currentSort.label}
              <ArrowDown2 size={12} variant="Linear" color="currentColor" className="shrink-0 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[190px] p-0">
            <Command>
              <CommandInput placeholder="Tìm kiếm..." className="h-9 text-xs" />
              <CommandList>
                <CommandEmpty>Không tìm thấy.</CommandEmpty>
                <CommandGroup>
                  {SORTS.map((s) => (
                    <CommandItem
                      key={s.value}
                      value={s.label}
                      onSelect={() => {
                        setSort(s.value);
                        setSortOpen(false);
                      }}
                      className="text-xs"
                    >
                      <TickCircle
                        size={14}
                        variant="Bold"
                        color="#ee4d2d"
                        className={sort === s.value ? 'opacity-100' : 'opacity-0'}
                      />
                      {s.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-6 gap-2 max-[900px]:grid-cols-3 max-[600px]:grid-cols-2">
        {sorted.slice(0, visible).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      <div className="text-center mt-4">
        {visible < sorted.length && (
          <button
            onClick={() => setVisible((v) => Math.min(v + 24, sorted.length))}
            className="px-8 py-2 border border-gray-300 text-gray-600 text-sm hover:border-shopee-orange hover:text-shopee-orange rounded-sm"
          >
            Xem thêm ({sorted.length - visible} sản phẩm)
          </button>
        )}
      </div>
      <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={add} />
    </section>
  );
}