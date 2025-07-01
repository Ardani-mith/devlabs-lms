// 2. app/dashboard/settings/components/SettingsHorizontalNavigation.tsx
// Path: app/dashboard/settings/components/SettingsHorizontalNavigation.tsx
// Komponen baru untuk navigasi horizontal di kanan atas.

"use client";

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { 
  UserIcon, 
  ShieldCheckIcon, 
  SwatchIcon as PaletteIcon, 
  PuzzlePieceIcon, 
  CreditCardIcon, 
  BellIcon
} from '@heroicons/react/24/outline';
import React from 'react';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavItem {
  name: string;
  href: string; // Ini akan menjadi nilai query param 'section'
  iconName: string;
}

interface SettingsHorizontalNavigationProps {
  navItems: NavItem[];
}

// Pemetaan dari nama string ke komponen ikon
const iconComponents: { [key: string]: IconComponent } = {
  User: UserIcon,
  ShieldCheck: ShieldCheckIcon,
  Palette: PaletteIcon,
  PuzzlePiece: PuzzlePieceIcon,
  CreditCard: CreditCardIcon,
  Bell: BellIcon,
};

export function SettingsHorizontalNavigation({ navItems }: SettingsHorizontalNavigationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSection = searchParams.get('section') || navItems[0]?.href || 'account';

  return (
    <nav className="flex flex-wrap gap-2 sm:gap-3" aria-label="Settings navigation">
      {navItems.map((item) => {
        const IconComponent = iconComponents[item.iconName];
        const isActive = currentSection === item.href;
        return (
          <Link
            key={item.name}
            href={`${pathname}?section=${item.href}`}
            scroll={false}
            className={`
              group flex items-center px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out
              transform hover:scale-105 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800
              ${isActive
                ? 'bg-brand-purple text-white shadow-lg dark:bg-purple-600 focus:ring-purple-500'
                : 'bg-white dark:bg-neutral-700/70 text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-600/80 focus:ring-gray-400 border border-gray-200 dark:border-neutral-600'
              }
            `}
            aria-current={isActive ? 'page' : undefined}
          >
            {IconComponent && (
              <IconComponent
                className={`
                  mr-1.5 sm:mr-2 flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200
                  ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-600 dark:text-neutral-400 dark:group-hover:text-neutral-200'}
                `}
                aria-hidden="true"
              />
            )}
            <span className="truncate">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}