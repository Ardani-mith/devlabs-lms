// 2. app/dashboard/webinar/components/WebinarCategoryNavigation.tsx
// Path: app/dashboard/webinar/components/WebinarCategoryNavigation.tsx

"use client";

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { LucideProps, Icon as LucideIcon, ListVideo, CalendarClock, CheckSquare, Tv2, HelpCircle } from 'lucide-react'; // Impor semua ikon yang mungkin digunakan + HelpCircle sebagai fallback

interface NavItem {
  name: string;
  href: string;
  iconName: string;
}

interface WebinarCategoryNavigationProps {
  navItems: NavItem[];
}

const iconComponents: { [key: string]: LucideIcon } = {
  ListVideo,
  CalendarClock,
  CheckSquare,
  Tv2,
};

export function WebinarCategoryNavigation({ navItems }: WebinarCategoryNavigationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentCategory = searchParams.get('category') || navItems[0]?.href || 'all';

  return (
    <nav className="bg-white dark:bg-neutral-800 p-1.5 rounded-xl shadow-md border border-gray-200 dark:border-neutral-700/80" aria-label="Navigasi Kategori Webinar">
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-1 sm:gap-1.5">
        {navItems.map((item) => {
          let IconComponent = iconComponents[item.iconName];
          const isActive = currentCategory === item.href;

          if (!IconComponent) {
            console.warn(`IconComponent tidak ditemukan untuk iconName: "${item.iconName}". Menggunakan ikon default.`);
            IconComponent = HelpCircle; // Fallback icon
          }
          
          // Pengecekan tambahan untuk memastikan IconComponent adalah fungsi (komponen React)
          if (typeof IconComponent !== 'function') {
            console.error(`IconComponent untuk "${item.iconName}" bukanlah komponen fungsi yang valid.`);
            // Render placeholder atau hanya teks jika ikon tidak valid
            return (
              <Link
                key={item.name}
                href={`${pathname}?category=${item.href}`}
                scroll={false}
                className={`
                  group flex items-center px-3.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out
                  transform hover:scale-105 hover:shadow-lg
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-neutral-800
                  bg-red-100 text-red-700 border-red-300
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <HelpCircle className="mr-2 flex-shrink-0 h-5 w-5 text-red-500" />
                <span className="truncate">{item.name} (Icon Error)</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={`${pathname}?category=${item.href}`}
              scroll={false}
              className={`
                group flex items-center px-3.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out
                transform hover:scale-105 hover:shadow-lg
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-neutral-800
                ${isActive
                  ? 'bg-gradient-to-r from-brand-purple to-purple-600 text-white shadow-xl scale-105 focus-visible:ring-purple-500'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700/70 focus-visible:ring-gray-400 dark:focus-visible:ring-neutral-500 bg-gray-50 dark:bg-neutral-700/50'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconComponent
                className={`
                  mr-2 flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200
                  ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500 dark:text-neutral-400 dark:group-hover:text-neutral-300'}
                `}
                strokeWidth={isActive ? 2.5 : 2}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}