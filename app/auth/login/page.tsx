// Path: app/login/page.tsx (atau app/auth/login/page.tsx)

"use client";

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Gunakan dari next/navigation untuk App Router
import { ArrowRightIcon, LockClosedIcon, UserIcon as AtSymbolIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { FcGoogle } from 'react-icons/fc'; // Contoh ikon Google dari react-icons
import { FaMicrosoft } from 'react-icons/fa'; // Contoh ikon Microsoft dari react-icons

// Placeholder untuk komponen Input dan Button dari Aceternity UI
// Anda perlu mengimpornya dari path yang benar jika sudah ada di proyek Anda
// import { Input } from "@/components/ui/aceternity/input"; // Contoh path
// import { Button } from "@/components/ui/aceternity/button"; // Contoh path

// Komponen Input dan Button Placeholder (Ganti dengan komponen Aceternity UI asli)
const AceternityInput = ({ id, name, type, value, onChange, placeholder, icon, required, className }: any) => (
  <div className="relative">
    {icon && <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">{icon}</div>}
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-4 py-3.5 rounded-xl border bg-white dark:bg-neutral-800/70 text-sm 
                  ${icon ? 'pl-11' : 'pl-4'} 
                  border-neutral-300 dark:border-neutral-700 
                  focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent 
                  placeholder-neutral-400 dark:placeholder-neutral-500 
                  text-neutral-900 dark:text-neutral-100 
                  transition-shadow duration-200 focus:shadow-md ${className}`}
    />
  </div>
);

const AceternityButton = ({ children, type = "submit", onClick, disabled, className, isLoading }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`w-full flex items-center justify-center px-6 py-3.5 border border-transparent 
                text-sm font-semibold rounded-xl shadow-sm text-white 
                bg-gradient-to-r from-brand-purple to-purple-600 hover:from-purple-600 hover:to-purple-700 
                dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
                dark:focus:ring-offset-neutral-900
                transition-all duration-300 ease-in-out transform hover:scale-105
                disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
  >
    {isLoading ? (
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : children}
  </button>
);
// --- Akhir Placeholder ---


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log('API URL being used:', apiUrl); // <-- Tambahkan ini
      if (!apiUrl) {
        setError("Kesalahan konfigurasi: API URL tidak ditemukan. Periksa file .env.local Anda.");
        setIsLoading(false);
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { // Pastikan NEXT_PUBLIC_API_URL sudah di-set di .env.local
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal. Periksa kembali username dan password Anda.');
      }

      // Asumsi backend mengembalikan access_token
      if (data.access_token) {
        // Simpan token (misalnya di localStorage atau state management)
        localStorage.setItem('accessToken', data.access_token);
        // Tambahkan logika untuk menyimpan info user jika ada, atau fetch dari endpoint /auth/profile
        console.log('Login berhasil, token:', data.access_token);
        // Redirect ke dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Format respons tidak sesuai.');
      }

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-black p-4 sm:p-6 lg:p-8 selection:bg-purple-500 selection:text-white">
      <div className="w-full max-w-md space-y-8">
        {/* Card Login Utama */}
        <div className="bg-white dark:bg-neutral-800/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700/70">
          <div className="text-center mb-8">
            {/* Logo LMS Anda bisa ditempatkan di sini */}
            {/* <Image src="/logo-lms.svg" alt="LMS Logo" width={150} height={50} className="mx-auto mb-4" /> */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              Selamat Datang Kembali!
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Masuk untuk melanjutkan perjalanan belajar Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <AceternityInput
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                placeholder="Username Anda"
                icon={<AtSymbolIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />}
                required
              />
            </div>

            <div className="relative">
              <AceternityInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Kata Sandi"
                icon={<LockClosedIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-sm leading-5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-2.5 rounded-md text-center">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link href="/auth/forgot-password" // Sesuaikan path jika perlu
                      className="font-medium text-brand-purple hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
                  Lupa password?
                </Link>
              </div>
            </div>

            <div>
              <AceternityButton type="submit" isLoading={isLoading} className="w-full group">
                {isLoading ? 'Memproses...' : (
                  <>
                    Masuk ke Akun Saya
                    <ArrowRightIcon className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </AceternityButton>
            </div>
          </form>

          {/* Opsi Login Lain (Opsional) */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                  Atau masuk dengan
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => alert("Simulasi: Login dengan Google")}
                  className="w-full inline-flex justify-center py-3 px-4 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-sm bg-white dark:bg-neutral-700/50 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple dark:focus:ring-offset-neutral-900"
                >
                  <FcGoogle className="h-5 w-5 mr-2" aria-hidden="true" />
                  Google
                </button>
              </div>
              <div>
                 <button
                  type="button"
                  onClick={() => alert("Simulasi: Login dengan Microsoft")}
                  className="w-full inline-flex justify-center py-3 px-4 border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-sm bg-white dark:bg-neutral-700/50 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple dark:focus:ring-offset-neutral-900"
                >
                  <FaMicrosoft className="h-5 w-5 mr-2 text-[#0078D4]" aria-hidden="true" />
                  Microsoft
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Belum punya akun?{' '}
          <Link href="/auth/register" // Sesuaikan path jika perlu
                className="font-medium text-brand-purple hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
