"use client";

import { Fragment } from 'react';
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon, HeartIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  const { user, logout } = useAuth();
  const { toggle, isCollapsed } = useSidebar();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 flex-shrink-0 items-center justify-between border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Left Section - Sidebar Toggle & Search */}
      <div className="flex flex-1 items-center">
        {/* Desktop Sidebar Toggle */}
        <button
          onClick={toggle}
          className="hidden lg:flex p-2 rounded-lg text-gray-400 dark:text-neutral-400 hover:text-gray-600 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200 mr-4"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        <form className="relative hidden w-full md:block md:max-w-md lg:max-w-lg" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-2 h-full w-5 text-gray-400 dark:text-neutral-500"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-2 pl-10 pr-3 text-text-light-primary dark:text-text-dark-primary bg-transparent placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:ring-0 sm:text-sm"
            placeholder="Search for specific subjects and find the teachers..."
            type="search"
            name="search"
          />
        </form>
        
        {/* Mobile search button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-gray-400 dark:text-neutral-400 hover:text-gray-500 dark:hover:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
        >
          <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">Search</span>
        </button>
      </div>

      {/* Right Section: Buttons, Notifications, User Menu */}
      <div className="ml-4 flex items-center md:ml-6 space-x-2 md:space-x-4">
        {/* Activate Button - Hidden on small screens */}
        <button
          type="button"
          className="hidden sm:inline-flex rounded-md bg-brand-purple px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple transition-colors"
        >
          Activate teacher account
        </button>

        {/* Heart Button */}
        <button className="relative rounded-full p-1 text-gray-400 dark:text-neutral-400 hover:text-gray-500 dark:hover:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
            <HeartIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Notifications Button */}
        <button
          type="button"
          className="relative rounded-full p-1 text-gray-400 dark:text-neutral-400 hover:text-gray-500 dark:hover:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {/* Badge notifikasi jika ada */}
          {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white dark:ring-neutral-800" /> */}
        </button>

        {/* User Dropdown */}
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="relative flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Open user menu</span>
              {/* Display user avatar if available, otherwise use default icon */}
              {user?.avatarUrl && user.avatarUrl.startsWith('http') ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name || user.username}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback to default icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallbackIcon = document.createElement('div');
                    fallbackIcon.innerHTML = `<svg class="h-8 w-8 rounded-full text-gray-400 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
                    target.parentNode?.insertBefore(fallbackIcon.firstChild!, target);
                  }}
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 rounded-full text-gray-400 dark:text-neutral-400" />
              )}
              <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400 dark:text-neutral-400 hidden sm:block" aria-hidden="true" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-neutral-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/settings"
                    className={`${active ? 'bg-gray-100 dark:bg-neutral-600' : ''} block px-4 py-2 text-sm text-text-light-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors`}
                  >
                    Settings
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${active ? 'bg-gray-100 dark:bg-neutral-600' : ''} block w-full text-left px-4 py-2 text-sm text-text-light-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors`}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}