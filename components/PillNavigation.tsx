'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { label: 'New Evaluation', href: '/dashboard' },
  { label: 'By Criteria', href: '/dashboard/by-criteria' },
  { label: 'By Address', href: '/dashboard/by-address' },
  { label: 'Compare', href: '/dashboard/compare' },
];

export default function PillNavigation() {
  const pathname = usePathname();

  return (
    <div className="bg-[#ececf0] rounded-[14px] p-[2px] flex items-center gap-0 w-fit">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              px-[9px] py-[5px] h-[29px] rounded-[14px]
              flex items-center justify-center
              font-['Inter'] font-medium text-[14px] leading-[20px]
              tracking-[-0.1504px] text-neutral-950 text-center
              transition-colors whitespace-nowrap
              ${isActive ? 'bg-white' : 'hover:bg-white/50'}
            `}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
