"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, createContext, useContext } from "react";
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
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "@/hooks/use-theme";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";

// Create SidebarContext for managing collapsed state - now moved to separate context file

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
  const { isCollapsed, toggle } = useSidebar();
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
        <aside className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:h-full lg:flex-col border-r border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-all duration-300 ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
          <div className={`flex h-20 items-center ${isCollapsed ? 'justify-center px-2' : 'justify-center px-6'} border-b border-gray-200 dark:border-neutral-700`}>
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
        fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-all duration-300 shadow-lg
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className={`flex h-20 items-center border-b border-gray-200 dark:border-neutral-700 ${isCollapsed ? 'justify-center px-2' : 'justify-center px-6'}`}>
          <Link href="/dashboard" className={`flex items-center gap-2 text-2xl font-bold text-brand-purple dark:text-purple-400 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
            {isCollapsed ? (
              <div className="w-8 h-8 bg-brand-purple dark:bg-purple-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                D
              </div>
            ) : (
              <Image 
                src="/devlab-logo.svg"
                alt="DevLab Logo"
                width={160}
                height={160}
                priority
                style={{ width: 'auto', height: 'auto' }}
              />
            )}
          </Link>
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={toggle}
          className={`hidden lg:flex absolute -right-3 top-20 z-10 w-6 h-6 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full items-center justify-center hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200 shadow-sm`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-3 w-3 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeftIcon className="h-3 w-3 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Navigasi Utama */}
        <nav className={`flex-1 space-y-1.5 py-6 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {visibleNavigationItems.map((item) => {
            const isActive = pathname === item.href || 
                   (item.href !== "/" && item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group flex items-center rounded-lg text-sm font-semibold
                    transition-all duration-200 ease-in-out
                    ${isCollapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5 hover:translate-x-1'}
                    ${isActive
                      ? "bg-gradient-to-r from-brand-purple to-purple-600 text-white shadow-md dark:from-purple-600 dark:to-purple-700"
                      : "text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700/60 hover:text-gray-900 dark:hover:text-neutral-100"
                    }
                  `}
                >
                  <item.icon 
                    className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 
                    ${isCollapsed ? '' : 'mr-3'}
                    ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500 dark:text-neutral-500 dark:group-hover:text-neutral-300'}`} 
                    aria-hidden="true" 
                  />
                  {!isCollapsed && (
                    <>
                      {item.name}
                      {item.badge && (
                        <span className={`ml-auto inline-block rounded-full px-2.5 py-0.5 text-xs font-bold
                          ${isActive ? 'bg-white/20 text-white' : 'bg-pink-500 text-white'}
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                    {item.badge && (
                      <span className="ml-1 bg-pink-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Navigasi Bawah & Theme Toggle */}
        <div className={`mt-auto border-t border-gray-200 dark:border-neutral-700 space-y-1.5 ${isCollapsed ? 'p-2' : 'p-3'}`}>
          {visibleBottomNavigationItems.map((item) => {
             const isActive = item.href === "/dashboard" 
              ? pathname === item.href 
              : pathname.startsWith(item.href);
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group flex items-center rounded-lg text-sm font-semibold
                    transition-all duration-200 ease-in-out
                    ${isCollapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5 hover:translate-x-1'}
                    ${isActive
                      ? "bg-gray-100 text-brand-purple dark:bg-neutral-700 dark:text-purple-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700/60 hover:text-gray-900 dark:hover:text-neutral-100"
                    }
                  `}
                >
                  <item.icon 
                    className={`h-5 w-5 flex-shrink-0 transition-colors duration-200
                    ${isCollapsed ? '' : 'mr-3'}
                    ${isActive ? 'text-brand-purple dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-neutral-500 dark:group-hover:text-neutral-300'}`} 
                    aria-hidden="true" 
                  />
                  {!isCollapsed && item.name}
                </Link>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="relative group">
            <button
              onClick={toggleTheme}
              className={`group flex w-full items-center rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700/60 hover:text-gray-900 dark:hover:text-neutral-100 transition-all duration-200 ease-in-out
                ${isCollapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5 hover:translate-x-1'}
              `}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className={`h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-neutral-500 dark:group-hover:text-neutral-300 ${isCollapsed ? '' : 'mr-3'}`} />
              ) : (
                <SunIcon className={`h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-neutral-500 dark:group-hover:text-neutral-300 ${isCollapsed ? '' : 'mr-3'}`} />
              )}
              {!isCollapsed && <span>{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>}
            </button>
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
