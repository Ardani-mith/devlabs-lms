// 7. app/dashboard/settings/components/NotificationSettings.tsx
// Path: app/dashboard/settings/components/NotificationSettings.tsx
"use client";
import React, { useState } from 'react';
import { BellAlertIcon as PageIcon, EnvelopeIcon, BellIcon as InAppIcon } from '@heroicons/react/24/solid';
// Asumsikan CustomToggle dan AceternityButton sudah diimpor atau didefinisikan
const AceternityButton = ({ children, onClick, variant = "primary", className, type = "button", disabled }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-2.5 text-sm font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 flex items-center justify-center
      ${variant === 'primary' ? 'bg-brand-purple hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white focus:ring-purple-500' :
        variant === 'secondary' ? 'bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-800 dark:text-neutral-100 focus:ring-gray-400' :
        'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
      } ${className}`}
  >
    {children}
  </button>
);

const CustomToggle = ({ label, enabled, setEnabled, description }: { label: string, enabled: boolean, setEnabled: (enabled: boolean) => void, description?: string }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-neutral-700/60 last:border-b-0">
    <div>
      <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">{label}</span>
      {description && <p className="text-xs text-gray-500 dark:text-neutral-400 max-w-xs">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`${enabled ? 'bg-brand-purple dark:bg-purple-600' : 'bg-gray-200 dark:bg-neutral-600'}
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 dark:focus:ring-offset-neutral-800`}
      role="switch"
      aria-checked={enabled}
    >
      <span className="sr-only">Gunakan pengaturan</span>
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-neutral-300 shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);


interface NotificationChannelPreferences {
  email: boolean;
  inApp: boolean;
}

interface NotificationPreferences {
  courseUpdates: NotificationChannelPreferences;
  newMessages: NotificationChannelPreferences;
  assignmentReminders: NotificationChannelPreferences;
  forumActivity: NotificationChannelPreferences;
  platformAnnouncements: NotificationChannelPreferences;
  promotions: NotificationChannelPreferences;
}

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    courseUpdates: { email: true, inApp: true },
    newMessages: { email: true, inApp: true },
    assignmentReminders: { email: true, inApp: false },
    forumActivity: { email: false, inApp: true },
    platformAnnouncements: { email: true, inApp: true },
    promotions: { email: false, inApp: false },
  });

  const handleToggle = (category: keyof NotificationPreferences, channel: keyof NotificationChannelPreferences) => {
    setPrefs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel],
      }
    }));
  };
  
  const handleSaveNotifications = () => {
    alert("Simulasi: Preferensi notifikasi berhasil disimpan!");
  };

  const notificationCategories: Array<{ key: keyof NotificationPreferences; label: string; description: string }> = [
    { key: "courseUpdates", label: "Pembaruan Kursus", description: "Info materi baru, perubahan jadwal, atau pengumuman dari pengajar." },
    { key: "newMessages", label: "Pesan Baru", description: "Notifikasi untuk pesan pribadi atau balasan di forum." },
    { key: "assignmentReminders", label: "Pengingat Tugas & Ujian", description: "Pengingat untuk tenggat waktu tugas dan jadwal ujian." },
    { key: "forumActivity", label: "Aktivitas Forum", description: "Notifikasi untuk postingan baru atau balasan di forum yang Anda ikuti." },
    { key: "platformAnnouncements", label: "Pengumuman Platform", description: "Informasi penting terkait pembaruan sistem atau fitur baru." },
    { key: "promotions", label: "Promo & Penawaran", description: "Dapatkan info terbaru tentang diskon, kursus gratis, atau penawaran spesial." },
  ];

  return (
    <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70 space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-1">Pengaturan Notifikasi</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Pilih jenis notifikasi yang ingin Anda terima dan melalui saluran mana.</p>
      </div>

      <div className="space-y-8">
        {notificationCategories.map(categoryItem => (
          <section key={categoryItem.key} className="pt-6 border-t border-gray-200 dark:border-neutral-700 first:border-t-0 first:pt-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 mb-1">{categoryItem.label}</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mb-3">{categoryItem.description}</p>
            <div className="space-y-1 pl-2">
              <CustomToggle
                label="Notifikasi Email"
                enabled={prefs[categoryItem.key].email}
                setEnabled={(enabled) => handleToggle(categoryItem.key, 'email')}
                description={`Terima notifikasi ${categoryItem.label.toLowerCase()} melalui email.`}
              />
              <CustomToggle
                label="Notifikasi Dalam Aplikasi"
                enabled={prefs[categoryItem.key].inApp}
                setEnabled={(enabled) => handleToggle(categoryItem.key, 'inApp')}
                description={`Tampilkan notifikasi ${categoryItem.label.toLowerCase()} di platform.`}
              />
            </div>
          </section>
        ))}
      </div>
      
      <div className="pt-8 border-t border-gray-200 dark:border-neutral-700 flex justify-end">
        <AceternityButton onClick={handleSaveNotifications} variant="primary">
          Simpan Pengaturan Notifikasi
        </AceternityButton>
      </div>
    </div>
  );
}