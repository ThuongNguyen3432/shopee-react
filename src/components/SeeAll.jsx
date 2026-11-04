import { Link } from 'react-router-dom';
import { ArrowRight2 } from 'iconsax-react';
import { cn } from '@/lib/utils';

export default function SeeAll({ to, children = 'Xem tất cả', className, iconSize = 12 }) {
  return (
    <Link
      to={to}
      className={cn(
        'ml-auto inline-flex items-center gap-0.5 text-xs leading-5 text-shopee-orange whitespace-nowrap shrink-0 hover:text-shopee-red transition-colors',
        className
      )}
    >
      <span>{children}</span>
      <ArrowRight2 size={iconSize} variant="Linear" color="currentColor" className="shrink-0" />
    </Link>
  );
}
