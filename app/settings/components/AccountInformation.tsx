// 4. app/dashboard/settings/components/AccountInformation.tsx
// Path: app/dashboard/settings/components/AccountInformation.tsx

"use client";

import React, { useState, useEffect } from 'react'; // Tambahkan useEffect
import Image from 'next/image';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext'; // <<< Impor useAuth

// AceternityInput dan AceternityButton (placeholder atau komponen asli Anda)
const AceternityInput = ({ label, id, type = "text", value, onChange, disabled, placeholder, required }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value || ''} // Pastikan value tidak undefined
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700/60 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent shadow-sm transition-colors"
    />
  </div>
);
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

// Interface UserAccountInfo bisa disesuaikan agar cocok dengan interface User di AuthContext
interface UserAccountInfo {
  name?: string; // Dibuat opsional karena bisa jadi belum ada di user context awal
  email?: string;
  role?: string;
  avatarUrl?: string;
  bio?: string;
  department?: string;
}

export default function AccountInformation() {
  const { user, isLoading: isAuthLoading, login: updateUserInContext } = useAuth(); // Dapatkan user dan isLoading
  const [isEditing, setIsEditing] = useState(false);
  
  // Inisialisasi state dengan data dari context atau string kosong jika belum ada
  const [tempUserInfo, setTempUserInfo] = useState<UserAccountInfo>({
    name: '',
    email: '',
    role: '',
    avatarUrl: '',
    bio: '',
    department: '',
  });

  // useEffect untuk mengisi form ketika data user dari context tersedia atau berubah
  useEffect(() => {
    if (user) {
      setTempUserInfo({
        name: user.name || user.username || '', // Fallback ke username jika nama tidak ada
        email: user.email || '',
        role: user.role || '',
        avatarUrl: user.avatarUrl || '', // Asumsi user object di context punya avatarUrl
        bio: user.bio || '', // Asumsi user object di context punya bio
        department: user.department || '', // Asumsi user object di context punya department
      });
    }
  }, [user]); // Jalankan efek ini ketika 'user' dari context berubah

  const handleEditToggle = () => {
    if (isEditing) {
      // Jika membatalkan, reset tempUserInfo ke data user dari context
      if (user) {
        setTempUserInfo({
            name: user.name || user.username || '',
            email: user.email || '',
            role: user.role || '',
            avatarUrl: user.avatarUrl || '',
            bio: user.bio || '',
            department: user.department || '',
        });
      }
    } else {
      // Saat mulai mengedit, pastikan tempUserInfo sudah diisi data terbaru dari context
      if (user) {
         setTempUserInfo({
            name: user.name || user.username || '',
            email: user.email || '',
            role: user.role || '',
            avatarUrl: user.avatarUrl || '',
            bio: user.bio || '',
            department: user.department || '',
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTempUserInfo({ ...tempUserInfo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return; // Seharusnya tidak terjadi jika halaman dilindungi
    console.log("Saving user info:", tempUserInfo);
    // TODO: Implementasi API call ke backend untuk menyimpan perubahan
    // Contoh:
    // try {
    //   const response = await fetch(`/api/users/${user.id}/profile`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
    //     body: JSON.stringify(tempUserInfo),
    //   });
    //   if (!response.ok) throw new Error('Gagal menyimpan perubahan');
    //   const updatedUserFromServer = await response.json();
    //   // Update user di AuthContext (jika backend mengembalikan data user yang sudah diupdate)
    //   // Anda mungkin perlu menyesuaikan fungsi login di AuthContext untuk bisa update user
    //   // atau membuat fungsi baru seperti `updateUser(updatedUserData)`
    //   // Untuk sekarang, kita update state lokal dan asumsikan AuthContext akan di-refresh
    //   // pada page reload atau navigasi berikutnya jika token masih valid.
    //   // Idealnya, AuthContext punya fungsi untuk refresh user data.
    //   alert("Perubahan berhasil disimpan (simulasi)!");
    // } catch (error) {
    //   console.error("Error saving profile:", error);
    //   alert("Gagal menyimpan perubahan.");
    // }
    alert("Simulasi: Perubahan disimpan! Anda perlu implementasi API call dan update AuthContext.");
    // Untuk sementara, kita update tampilan dengan data tempUserInfo
    // dan berharap AuthContext akan di-update pada interaksi berikutnya atau refresh
    // Jika Anda memiliki fungsi updateUser di AuthContext:
    // updateUserInContext({ ...user, ...tempUserInfo }); // Ini contoh, sesuaikan dengan fungsi update Anda
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempUserInfo({ ...tempUserInfo, avatarUrl: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 mb-6"></div>
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8">
            <div className="h-32 w-32 bg-gray-300 dark:bg-neutral-600 rounded-full"></div>
            <div className="flex-grow space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/3"></div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
            <div className="space-y-2"><div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/4"></div><div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div></div>
            <div className="space-y-2"><div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/4"></div><div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div></div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Seharusnya tidak sampai sini jika halaman settings dilindungi
    return <p className="text-center text-red-500">Gagal memuat data pengguna. Silakan coba login kembali.</p>;
  }

  // Gunakan data dari context untuk tampilan awal, dan tempUserInfo untuk form saat editing
  const displayUserInfo = isEditing ? tempUserInfo : {
    name: user.name || user.username || '',
    email: user.email || '',
    role: user.role || '',
    avatarUrl: user.avatarUrl || '',
    bio: user.bio || '', // Asumsi ada di context atau default
    department: user.department || '', // Asumsi ada di context atau default
  };


  return (
    <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-200 dark:border-neutral-700">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100">Informasi Akun</h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Perbarui foto profil dan detail pribadi Anda.</p>
        </div>
        {!isEditing ? (
          <AceternityButton onClick={handleEditToggle} variant="secondary" className="mt-4 sm:mt-0">
            <PencilIcon className="h-4 w-4 mr-2" /> Edit Profil
          </AceternityButton>
        ) : (
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <AceternityButton onClick={handleSave} variant="primary">
              <CheckIcon className="h-4 w-4 mr-2" /> Simpan Perubahan
            </AceternityButton>
            <AceternityButton onClick={handleEditToggle} variant="secondary">
              <XMarkIcon className="h-4 w-4 mr-2" /> Batal
            </AceternityButton>
          </div>
        )}
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="relative flex-shrink-0">
            <Image
              src={displayUserInfo.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserInfo.name || 'User')}&background=random&size=128&color=fff`}
              alt="User Avatar"
              width={128}
              height={128}
              className="rounded-full object-cover shadow-lg border-4 border-white dark:border-neutral-600"
              key={displayUserInfo.avatarUrl} // Tambahkan key untuk re-render jika avatar berubah
              onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserInfo.name || 'User')}&background=random&size=128&color=fff`)}
            />
            {isEditing && (
              <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-brand-purple hover:bg-purple-700 text-white p-2.5 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2">
                <PencilIcon className="h-5 w-5" />
                <input id="avatar-upload" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
              </label>
            )}
          </div>
          <div className="text-center sm:text-left flex-grow">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-neutral-100">{displayUserInfo.name}</h3>
            <p className="text-md text-gray-500 dark:text-neutral-400">{displayUserInfo.role}</p>
            {isEditing && <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2">Klik ikon pensil pada avatar untuk mengganti foto profil Anda.</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
          <AceternityInput
            label="Nama Lengkap"
            id="name"
            value={tempUserInfo.name} // Form selalu menggunakan tempUserInfo
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Masukkan nama lengkap Anda"
            required
          />
          <AceternityInput
            label="Alamat Email"
            id="email"
            type="email"
            value={tempUserInfo.email} // Form selalu menggunakan tempUserInfo
            disabled={!isEditing} // Atau true jika email tidak boleh diubah
            placeholder="email@example.com"
            required
          />
          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Bio Singkat</label>
            <textarea
                name="bio"
                id="bio"
                rows={4}
                value={tempUserInfo.bio} // Form selalu menggunakan tempUserInfo
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700/60 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent shadow-sm transition-colors min-h-[100px]"
                placeholder="Ceritakan sedikit tentang diri Anda..."
            />
          </div>
           <AceternityInput
            label="Departemen/Fakultas (Opsional)"
            id="department"
            value={tempUserInfo.department} // Form selalu menggunakan tempUserInfo
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Contoh: Fakultas Teknik Informatika"
          />
           <AceternityInput
            label="Peran"
            id="role"
            value={displayUserInfo.role} // Peran biasanya ditampilkan, tidak diedit user
            disabled={true}
          />
        </div>
      </form>
    </div>
  );
}

// --- File-file Komponen Lainnya (Security, Preferences, dll.) ---
// Implementasi untuk SecuritySettings, PreferenceSettings, NotificationSettings, IntegrationSettings, BillingSettings
// akan mengikuti pola yang sama, dengan konten dan form yang spesifik untuk masing-masing.
// Pastikan untuk membuat file-file ini di app/dashboard/settings/components/