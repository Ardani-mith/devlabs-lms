// 5. app/dashboard/settings/components/SecuritySettings.tsx
// Path: app/dashboard/settings/components/SecuritySettings.tsx
"use client";
import React, { useState, ChangeEvent, useEffect } from 'react';
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon, DevicePhoneMobileIcon, ClockIcon as HistoryIcon } from '@heroicons/react/24/solid';

interface AceternityInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

interface AceternityButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const AceternityInput = ({ label, id, type = "text", value, onChange, disabled, placeholder, required }: AceternityInputProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700/60 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent shadow-sm transition-colors"
    />
  </div>
);

const AceternityButton = ({ children, onClick, variant = "primary", className, type = "button", disabled }: AceternityButtonProps) => (
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

interface LoginActivity {
  id: string;
  device: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  isCurrent?: boolean;
}

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loginActivityData, setLoginActivityData] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setLoading(true);
        // Fetch 2FA status and login activity from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/api/security`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIs2FAEnabled(data.is2FAEnabled || false);
          setLoginActivityData(data.loginActivity || []);
        }
      } catch (error) {
        console.error('Error fetching security data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, []);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!");
      return;
    }
    if (newPassword.length < 8) {
        alert("Password baru minimal 8 karakter!");
        return;
    }
    alert("Simulasi: Password berhasil diubah.");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  const handleToggle2FA = async () => {
    try {
      const newStatus = !is2FAEnabled;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/api/security/2fa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: newStatus })
      });

      if (response.ok) {
        setIs2FAEnabled(newStatus);
        alert(`Autentikasi Dua Faktor ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`);
      } else {
        alert('Gagal mengubah pengaturan 2FA. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-6"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70 space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-1">Pengaturan Keamanan</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Kelola kata sandi, autentikasi dua faktor, dan lihat aktivitas login Anda.</p>
      </div>

      {/* Ganti Password */}
      <section className="pt-6 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-4">Ubah Kata Sandi</h3>
        <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
          <div className="relative">
            <AceternityInput 
              label="Kata Sandi Saat Ini" 
              id="currentPassword" 
              type={showCurrentPassword ? "text" : "password"} 
              value={currentPassword} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)} 
              required 
              placeholder="Masukkan kata sandi Anda saat ini" 
            />
            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-[calc(1.75rem+0.625rem)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300">
              {showCurrentPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
            </button>
          </div>
          <div className="relative">
            <AceternityInput 
              label="Kata Sandi Baru" 
              id="newPassword" 
              type={showNewPassword ? "text" : "password"} 
              value={newPassword} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} 
              required 
              placeholder="Minimal 8 karakter" 
            />
             <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-[calc(1.75rem+0.625rem)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300">
              {showNewPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
            </button>
          </div>
          <div className="relative">
            <AceternityInput 
              label="Konfirmasi Kata Sandi Baru" 
              id="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"} 
              value={confirmPassword} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="Ketik ulang kata sandi baru Anda" 
            />
             <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-[calc(1.75rem+0.625rem)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300">
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
            </button>
          </div>
          <AceternityButton type="submit" variant="primary" className="w-full sm:w-auto">
            <ShieldCheckIcon className="h-5 w-5 mr-2"/> Simpan Kata Sandi Baru
          </AceternityButton>
        </form>
      </section>

      {/* Autentikasi Dua Faktor (2FA) */}
      <section className="pt-8 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-1">Autentikasi Dua Faktor (2FA)</h3>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">Tambahkan lapisan keamanan ekstra pada akun Anda.</p>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700/60 rounded-lg border border-gray-200 dark:border-neutral-600">
          <div>
            <p className="font-medium text-gray-700 dark:text-neutral-200">Status 2FA: <span className={is2FAEnabled ? "text-green-600 dark:text-green-400 font-semibold" : "text-red-600 dark:text-red-400 font-semibold"}>{is2FAEnabled ? "Aktif" : "Tidak Aktif"}</span></p>
            {is2FAEnabled && <p className="text-xs text-gray-500 dark:text-neutral-400">Anda akan diminta kode verifikasi saat login dari perangkat baru.</p>}
            {!is2FAEnabled && <p className="text-xs text-gray-500 dark:text-neutral-400">Aktifkan 2FA untuk meningkatkan keamanan akun Anda.</p>}
          </div>
          <AceternityButton onClick={handleToggle2FA} variant={is2FAEnabled ? "secondary" : "primary"}>
            {is2FAEnabled ? "Nonaktifkan 2FA" : "Aktifkan 2FA"}
          </AceternityButton>
        </div>
      </section>

      {/* Aktivitas Login */}
      <section className="pt-8 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-1">Aktivitas Login Terbaru</h3>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">Ini adalah daftar perangkat yang baru-baru ini mengakses akun Anda. Jika Anda melihat aktivitas yang mencurigakan, segera amankan akun Anda.</p>
        <div className="space-y-4">
          {loginActivityData.map(activity => (
            <div key={activity.id} className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${activity.isCurrent ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700' : 'bg-gray-50 dark:bg-neutral-700/60 border-gray-200 dark:border-neutral-600'}`}>
              <div className="flex items-center">
                <DevicePhoneMobileIcon className={`h-8 w-8 mr-3 flex-shrink-0 ${activity.isCurrent ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-neutral-500'}`} />
                <div>
                  <p className="font-medium text-sm text-gray-700 dark:text-neutral-200">{activity.device} {activity.isCurrent && <span className="text-xs text-blue-600 dark:text-blue-400 ml-1">(Sesi Saat Ini)</span>}</p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">{activity.location} • IP: {activity.ipAddress}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-neutral-400 sm:text-right flex-shrink-0 mt-2 sm:mt-0">
                <HistoryIcon className="h-4 w-4 inline mr-1"/>{activity.timestamp}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
            <AceternityButton variant="secondary" className="text-xs">Lihat Semua Aktivitas Login</AceternityButton>
        </div>
      </section>
    </div>
  );
}