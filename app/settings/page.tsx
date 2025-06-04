// 3. app/dashboard/settings/page.tsx
// Path: app/dashboard/settings/page.tsx
// Halaman utama settings yang akan merender konten berdasarkan query param 'section'.

"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SettingsHorizontalNavigation } from './components/SettingsHorizontalNavigation'; // Menggunakan navigasi horizontal

// Impor komponen-komponen untuk setiap section
import AccountInformation from './components/AccountInformation';
import SecuritySettings from './components/SecuritySettings';
import PreferenceSettings from './components/PreferenceSettings';
import NotificationSettings from './components/NotificationSettings';
import IntegrationSettings from './components/IntegrationSettings';
import BillingSettings from './components/BillingSettings';

const settingsNavItems = [
  { name: 'Akun', href: 'account', iconName: 'User' },
  { name: 'Keamanan', href: 'security', iconName: 'ShieldCheck' },
  { name: 'Preferensi', href: 'preferences', iconName: 'Palette' },
  { name: 'Notifikasi', href: 'notifications', iconName: 'Bell' },
  { name: 'Integrasi', href: 'integrations', iconName: 'PuzzlePiece' },
  { name: 'Tagihan', href: 'billing', iconName: 'CreditCard' },
];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'account'; // Default ke 'account'

  const renderSection = () => {
    switch (section) {
      case 'account':
        return <AccountInformation />;
      case 'security':
        return <SecuritySettings />;
      case 'preferences':
        return <PreferenceSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'billing':
        return <BillingSettings />;
      default:
        return <AccountInformation />;
    }
  };

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 pb-8 border-b border-gray-200 dark:border-neutral-700/80">
            <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-neutral-50">
                    Pengaturan Akun
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-neutral-400 max-w-2xl">
                    Sesuaikan profil, keamanan, dan preferensi platform Anda untuk pengalaman belajar yang optimal.
                </p>
            </div>
            {/* Navigasi Section dipindahkan ke sini, di kanan atas */}
            <div className="absolute top-72 w-full md:w-auto flex-shrink-0">
                <SettingsHorizontalNavigation navItems={settingsNavItems} />
            </div>
        </header>

        <main className="min-w-0 mt-28">
            <Suspense fallback={
              <div className="min-h-[400px] bg-white dark:bg-neutral-800/50 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700/70 p-8 animate-pulse flex items-center justify-center">
                <p className="text-gray-500 dark:text-neutral-400">Memuat bagian pengaturan...</p>
              </div>
            }>
              {renderSection()}
            </Suspense>
        </main>
    </div>
  );
}