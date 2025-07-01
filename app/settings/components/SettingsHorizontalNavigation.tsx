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
  Puzzle: PuzzlePieceIcon,
  CreditCard: CreditCardIcon,
  Bell: BellIcon,
};

export function SettingsHorizontalNavigation({ navItems }: SettingsHorizontalNavigationProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentSection = searchParams.get('section') || navItems[0]?.href || 'account';
  
    return (
      <nav className="bg-white dark:bg-neutral-800/70 p-1.5 rounded-xl shadow-md backdrop-blur-sm border border-gray-200 dark:border-neutral-700/80" aria-label="Settings navigation">
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-1 sm:gap-1.5">
          {navItems.map((item) => {
            const IconComponent = iconComponents[item.iconName];
            const isActive = currentSection === item.href;
            return (
              <Link
                key={item.name}
                href={`${pathname}?section=${item.href}`}
                scroll={false}
                className={`
                  group flex items-center px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-neutral-800
                  ${isActive
                    ? 'bg-gradient-to-r from-brand-purple to-purple-600 text-white shadow-lg scale-105 focus-visible:ring-purple-500'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700/70 focus-visible:ring-gray-400 dark:focus-visible:ring-neutral-500'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {IconComponent && (
                  <IconComponent
                    className={`
                      mr-1.5 sm:mr-2 flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200
                      ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500 dark:text-neutral-400 dark:group-hover:text-neutral-300'}
                    `}
                    aria-hidden="true"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                )}
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }
