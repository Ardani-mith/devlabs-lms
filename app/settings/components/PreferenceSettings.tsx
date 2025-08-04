// 6. app/dashboard/settings/components/PreferenceSettings.tsx
// Path: app/dashboard/settings/components/PreferenceSettings.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { PaletteIcon, MoonIcon, SunIcon, LanguagesIcon, CheckIcon as CheckMarkIcon, ChevronDownIcon } from 'lucide-react';
// Asumsikan AceternityButton sudah diimpor atau didefinisikan
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


export default function PreferenceSettings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('id');

  useEffect(() => {
    const applyTheme = (currentTheme: typeof theme) => {
      if (currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    const storedTheme = localStorage.getItem('theme') as typeof theme | null;
    if (storedTheme) {
        setTheme(storedTheme);
        applyTheme(storedTheme);
    } else {
        applyTheme(theme); // Apply default or system preference
    }
    
    // Listener untuk perubahan preferensi sistem
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
            applyTheme('system');
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);

  }, [theme]);

  const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'system') => {
    setTheme(selectedTheme);
    if (selectedTheme !== 'system') {
        localStorage.setItem('theme', selectedTheme);
    } else {
        localStorage.removeItem('theme'); // Biarkan sistem yang menentukan
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    alert(`Simulasi: Bahasa diubah ke ${e.target.options[e.target.selectedIndex].text}`);
  };
  
  const handleSavePreferences = () => {
    alert("Simulasi: Preferensi berhasil disimpan!");
  };

  return (
    <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70 space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-1">Preferensi Tampilan & Bahasa</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Sesuaikan tampilan platform dan bahasa sesuai keinginan Anda.</p>
      </div>

      <section className="pt-6 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-1">Tema Tampilan</h3>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-5">Pilih tema terang, gelap, atau ikuti pengaturan sistem Anda.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['system', 'light', 'dark'] as const).map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => handleThemeChange(themeOption)}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800
                ${theme === themeOption ? 'border-brand-purple dark:border-purple-500 ring-2 ring-brand-purple dark:ring-purple-500 shadow-xl scale-105' : 'border-gray-300 dark:border-neutral-600 hover:border-gray-400 dark:hover:border-neutral-500 hover:shadow-lg'}
                ${themeOption === 'light' ? 'bg-white dark:bg-neutral-100 text-black' : themeOption === 'dark' ? 'bg-neutral-900 text-white' : 'bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-neutral-200'}
              `}
            >
              <div className="flex flex-col items-center justify-center h-24">
                {themeOption === 'light' && <SunIcon className="h-8 w-8 mb-2 text-yellow-500" />}
                {themeOption === 'dark' && <MoonIcon className="h-8 w-8 mb-2 text-indigo-400" />}
                {themeOption === 'system' && <PaletteIcon className="h-8 w-8 mb-2 text-gray-500 dark:text-neutral-400" />}
                <span className="text-sm font-semibold capitalize">{themeOption === 'system' ? 'Sistem' : themeOption === 'light' ? 'Terang' : 'Gelap'}</span>
              </div>
              {theme === themeOption && (
                <div className="absolute top-2 right-2 bg-brand-purple dark:bg-purple-500 text-white rounded-full p-0.5">
                    <CheckMarkIcon className="h-4 w-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="pt-8 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-1">Bahasa</h3>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-5">Pilih bahasa yang ingin Anda gunakan di platform ini.</p>
        <div className="max-w-xs">
          <div className="relative">
            <LanguagesIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <select
              id="language"
              name="language"
              value={language}
              onChange={handleLanguageChange}
              className="w-full appearance-none pl-12 pr-10 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700/60 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent shadow-sm"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English (US)</option>
            </select>
            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
          </div>
        </div>
      </section>
      
      <div className="pt-8 border-t border-gray-200 dark:border-neutral-700 flex justify-end">
        <AceternityButton onClick={handleSavePreferences} variant="primary">
          Simpan Preferensi
        </AceternityButton>
      </div>
    </div>
  );
}