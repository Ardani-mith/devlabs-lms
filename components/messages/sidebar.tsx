"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,        // Untuk Dashboard
  BookOpenIcon,    // Untuk Courses
  UsersIcon,       // Untuk Teachers
  ChatBubbleLeftEllipsisIcon, // Untuk Messages (atau ChatBubbleLeftIcon)
  ChartBarIcon,    // Untuk Analytics
  CreditCardIcon,  // Untuk Payments (lebih relevan)
  CogIcon,         // Untuk Settings
  QuestionMarkCircleIcon, // Untuk Support
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/outline";
import { useTheme } from "@/hooks/use-theme"; // Pastikan hook ini sudah benar

// Daftar item navigasi utama
const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Courses", href: "/courses", icon: BookOpenIcon },
  { name: "Teachers", href: "/teachers", icon: UsersIcon }, // ✅ Simplified - /teachers handles role-based logic
  { name: "Messages", href: "/messages", icon: ChatBubbleLeftEllipsisIcon, badge: 3 },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Payments", href: "/payments", icon: CreditCardIcon }, // Menggunakan CreditCardIcon
];

// Daftar item navigasi di bagian bawah
const bottomNavigationItems = [
    { name: "Support", href: "/support", icon: QuestionMarkCircleIcon },
    { name: "Settings", href: "/settings", icon: CogIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme(); // Pastikan useTheme berfungsi

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-gray-200 dark:border-neutral-700 bg-sidebar-bg-light dark:bg-sidebar-bg-dark transition-colors duration-300">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center px-6 border-b border-gray-200 dark:border-neutral-700">
        <Link href="/dashboard" className="text-2xl font-bold text-brand-purple dark:text-purple-400">
        Devva Labs
        </Link>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              group flex items-center rounded-md px-3 py-2.5 text-sm font-medium
              ${pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)) // Logika aktif yang lebih baik
                ? "bg-brand-purple text-white dark:bg-purple-600"
                : "text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-text-light-primary dark:hover:text-text-dark-primary"
              }
              transition-all duration-200
            `}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            {item.name}
            {item.badge && (
              <span className="ml-auto inline-block rounded-full bg-pink-500 px-2 py-0.5 text-xs text-white">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Navigasi Bawah & Theme Toggle */}
      <div className="mt-auto border-t border-gray-200 dark:border-neutral-700 p-4 space-y-1">
        {bottomNavigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              group flex items-center rounded-md px-3 py-2.5 text-sm font-medium
              text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-text-light-primary dark:hover:text-text-dark-primary
              transition-all duration-200
            `}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            {item.name}
          </Link>
        ))}
        <button
          onClick={toggleTheme}
          className="group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-text-light-primary dark:hover:text-text-dark-primary transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <MoonIcon className="mr-3 h-5 w-5 flex-shrink-0" />
          ) : (
            <SunIcon className="mr-3 h-5 w-5 flex-shrink-0" />
          )}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </aside>
  );
}