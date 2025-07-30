// lms-high-end/components/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  BookOpenIcon,
  UsersIcon,
  ChartBarIcon,
  CreditCardIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  SunIcon,
  MoonIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  AcademicCapIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "@/hooks/use-theme";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles: Array<'ADMIN' | 'TEACHER' | 'USER' | string>; // ✅ Changed INSTRUCTOR to TEACHER
}

const allNavigationItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, roles: ['ADMIN', 'TEACHER', 'USER'] },
  { name: "Courses", href: "/courses", icon: BookOpenIcon, roles: ['ADMIN', 'TEACHER', 'USER'] },
  { name: "Manage Courses", href: "/manage-course", icon: AcademicCapIcon, roles: ['ADMIN', 'TEACHER'] },
  { name: "Teachers", href: "/teachers", icon: UsersIcon, roles: ['USER'] },
  // { name: "Webinar", href: "/webinar", icon: VideoCameraIcon, roles: ['ADMIN', 'TEACHER', 'USER'] },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon, roles: ['ADMIN', 'TEACHER'] },
  { name: "Payments", href: "/payments", icon: CreditCardIcon, roles: ['USER'] },
  // Contoh item khusus Admin
  { name: "Manajemen Pengguna", href: "/admin/users", icon: UserGroupIcon, roles: ['ADMIN'] },
  { name: "Pengaturan Platform", href: "/admin/platform-settings", icon: ShieldCheckIcon, roles: ['ADMIN'] },
];

// Daftar SEMUA item navigasi di bagian bawah beserta peran yang diizinkan
const allBottomNavigationItems: NavItem[] = [
    { name: "Support", href: "/support", icon: QuestionMarkCircleIcon, roles: ['ADMIN', 'TEACHER', 'USER'] },
    { name: "Settings", href: "/settings", icon: CogIcon, roles: ['ADMIN', 'TEACHER', 'USER'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const visibleNavigationItems = isLoading ? [] : (user ? allNavigationItems.filter(item => item.roles.includes(user.role)) : []);
  const visibleBottomNavigationItems = isLoading ? [] : (user ? allBottomNavigationItems.filter(item => item.roles.includes(user.role)) : []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return (
      <>
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-700 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:h-full lg:w-64 lg:flex-col border-r border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-colors duration-300">
          <div className="flex h-20 items-center justify-center px-6 border-b border-gray-200 dark:border-neutral-700">
            <div className="h-10 w-32 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>
          <div className="flex-1 space-y-1 px-4 py-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-neutral-700 rounded-md animate-pulse mb-2"></div>
            ))}
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-gray-200 dark:border-neutral-700"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-all duration-300 shadow-lg
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex h-20 items-center justify-center px-6 border-b border-gray-200 dark:border-neutral-700">
          <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-brand-purple dark:text-purple-400">
            <Image 
              src="/devlab-logo.svg"
              alt="DevLab Logo"
              width={160}
              height={160}
              priority
            />
          </Link>
        </div>

        {/* Navigasi Utama */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          {visibleNavigationItems.map((item) => {
            const isActive = pathname === item.href || 
                   (item.href !== "/" && item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group flex items-center rounded-lg px-3 py-2.5 text-sm font-semibold
                  transition-all duration-200 ease-in-out transform hover:translate-x-1
                  ${isActive
                    ? "bg-gradient-to-r from-brand-purple to-purple-600 text-white shadow-md dark:from-purple-600 dark:to-purple-700"
                    : "text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700/60 hover:text-gray-900 dark:hover:text-neutral-100"
                  }
                `}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 
                  ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500 dark:text-neutral-500 dark:group-hover:text-neutral-300'}`} 
                  aria-hidden="true" 
                />
                {item.name}
                {item.badge && (
                  <span className={`ml-auto inline-block rounded-full px-2.5 py-0.5 text-xs font-bold
                    ${isActive ? 'bg-white/20 text-white' : 'bg-pink-500 text-white'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Navigasi Bawah & Theme Toggle */}
        <div className="mt-auto border-t border-gray-200 dark:border-neutral-700 p-3 space-y-1.5">
          {visibleBottomNavigationItems.map((item) => {
             const isActive = item.href === "/dashboard" 
              ? pathname === item.href 
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group flex items-center rounded-lg px-3 py-2.5 text-sm font-semibold
                  transition-all duration-200 ease-in-out transform hover:translate-x-1
                  ${isActive
                    ? "bg-gray-100 text-brand-purple dark:bg-neutral-700 dark:text-purple-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700/60 hover:text-gray-900 dark:hover:text-neutral-100"
                  }
                `}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200
                  ${isActive ? 'text-brand-purple dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-neutral-500 dark:group-hover:text-neutral-300'}`} 
                  aria-hidden="true" 
                />
                {item.name}
              </Link>
            );
          })}
          
          <button
            onClick={toggleTheme}
            className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700/60 hover:text-gray-900 dark:hover:text-neutral-100 transition-all duration-200 ease-in-out transform hover:translate-x-1"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <MoonIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-neutral-500 dark:group-hover:text-neutral-300" />
            ) : (
              <SunIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-neutral-500 dark:group-hover:text-neutral-300" />
            )}
            <span>{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
