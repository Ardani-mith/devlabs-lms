//---------------------------------------------------------------------
// FILE 2 (UPDATED): app/settings/components/AccountInformation.tsx
// Path: app/dashboard/settings/components/AccountInformation.tsx

"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { PencilIcon, CheckIcon, XMarkIcon, UserCircleIcon as DefaultAvatarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircleIcon as CheckCircleLucide, XCircleIcon as XCircleLucide } from 'lucide-react'; // Menggunakan Lucide untuk konsistensi notifikasi

// Placeholder Komponen UI (ganti dengan komponen Aceternity UI asli Anda)
const InputField = ({ label, id, type = "text", value, name, onChange, disabled, placeholder, required, error, helperText }: { label: string, id: string, type?: string, value: string, name: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, disabled?: boolean, placeholder?: string, required?: boolean, error?: string, helperText?: string }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
    <input type={type} id={id} name={name} value={value || ''} onChange={onChange} disabled={disabled} placeholder={placeholder} required={required} className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-neutral-700/60 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-shadow duration-200 focus:shadow-md ${error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : 'border-gray-300 dark:border-neutral-600 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent'}`} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}/>
    {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    {helperText && !error && <p className="mt-1.5 text-xs text-gray-500 dark:text-neutral-400">{helperText}</p>}
  </div>
);
const Button = ({ children, onClick, variant = "primary", className, type = "button", disabled, isLoading }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "secondary" | "danger", className?: string, type?: "button" | "submit" | "reset", disabled?: boolean, isLoading?: boolean }) => (
  <button type={type} onClick={onClick} disabled={disabled || isLoading} className={`px-6 py-3 text-sm font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 flex items-center justify-center ${variant === 'primary' ? 'bg-gradient-to-r from-brand-purple to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white focus:ring-purple-500' : variant === 'secondary' ? 'bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-800 dark:text-neutral-100 focus:ring-gray-400' : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'} ${isLoading ? 'opacity-70 cursor-wait' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
    {isLoading ? <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : children}
  </button>
);

// --- Interfaces ---
interface UserProfileForm {
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarFile?: File | null;
  avatarPreview?: string | null;
  department?: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  general?: string;
}

export default function AccountInformation() {
  const { user, isLoading: isAuthLoading, login: refreshUserProfile, updateUserContext } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileForm>({ name: '', username: '', email: '', bio: '', department: '', avatarFile: null, avatarPreview: null });
  const [initialFormData, setInitialFormData] = useState<UserProfileForm | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (user) {
      const initialData: UserProfileForm = {
        name: user.name || user.username || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        department: user.department || '',
        avatarFile: null,
        avatarPreview: user.avatarUrl || null,
      };
      setFormData(initialData);
      setInitialFormData(initialData);
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nama lengkap tidak boleh kosong.";
    if (!formData.username.trim()) newErrors.username = "Username tidak boleh kosong.";
    else if (formData.username.length < 3) newErrors.username = "Username minimal 3 karakter.";
    else if (!/^[a-zA-Z0-9_.]+$/.test(formData.username)) newErrors.username = "Username hanya boleh berisi huruf, angka, titik, dan underscore.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof UserProfileForm; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
    setSaveStatus(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatarFile: "Ukuran file maksimal 2MB." }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
      setErrors(prev => ({ ...prev, avatarFile: undefined }));
      setSaveStatus(null);
    }
  };

  const handleEditToggle = () => {
    if (isEditing && initialFormData) {
      setFormData(initialFormData);
      setErrors({});
    }
    setIsEditing(!isEditing);
    setSaveStatus(null);
  };

  const handleSave = async () => {
    if (!validateForm() || !user) return;

    setIsSaving(true);
    setSaveStatus(null);
    setErrors({});

    const profileDataToSubmit = {
      name: formData.name,
      username: formData.username,
      bio: formData.bio,
      department: formData.department,
    };

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error("Token autentikasi tidak ditemukan.");

      // 1. Kirim data ke backend
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileDataToSubmit),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.message || 'Gagal menyimpan perubahan profil.');
      }
      const updatedProfileFromBackend = await profileResponse.json();

      // 2. (Opsional) Update UI secara optimistik dengan data dari form
      //    Ini akan membuat UI terasa lebih cepat.
      if (typeof updateUserContext === 'function') {
        updateUserContext({
            name: formData.name,
            username: formData.username,
            bio: formData.bio,
            department: formData.department,
            avatarUrl: formData.avatarPreview || user.avatarUrl,
        });
      }

      // 3. Refresh data dari backend untuk memastikan konsistensi
      if (typeof refreshUserProfile === 'function') {
        await refreshUserProfile(token);
      }
      
      setSaveStatus("success");
      setIsEditing(false);

    } catch (error: any) {
      console.error("Error saving profile:", error);
      setErrors({ general: error.message || "Terjadi kesalahan." });
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };
  
  const hasChanges = initialFormData ? JSON.stringify(formData) !== JSON.stringify(initialFormData) : false;

  if (isAuthLoading) {
    return ( <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70 animate-pulse"> <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 mb-6"></div> <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8"> <div className="h-32 w-32 bg-gray-300 dark:bg-neutral-600 rounded-full"></div> <div className="flex-grow space-y-3"> <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div> <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/3"></div> </div> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-neutral-700"> <div className="space-y-2"><div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/4"></div><div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div></div> <div className="space-y-2"><div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/4"></div><div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div></div> </div> </div> );
  }
  if (!user) {
    return <p className="text-center text-red-500 p-10">Gagal memuat data pengguna. Silakan coba login kembali.</p>;
  }

  const displayAvatar = isEditing ? formData.avatarPreview : user.avatarUrl;
  const displayName = isEditing ? formData.name : (user.name || user.username);

  return (
    <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-200 dark:border-neutral-700">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100">Informasi Akun</h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">Perbarui foto profil dan detail pribadi Anda.</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEditToggle} variant="secondary" className="mt-4 sm:mt-0">
            <PencilIcon className="h-4 w-4 mr-2" /> Edit Profil
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
            <Button onClick={handleSave} variant="primary" isLoading={isSaving} disabled={!hasChanges || isSaving}>
              <CheckIcon className="h-5 w-5 mr-2" /> Simpan Perubahan
            </Button>
            <Button onClick={handleEditToggle} variant="secondary" disabled={isSaving}>
              <XMarkIcon className="h-5 w-5 mr-2" /> Batal
            </Button>
          </div>
        )}
      </div>

      {saveStatus && (
        <div className={`mb-6 p-3 rounded-md text-sm flex items-center shadow-md ${
            saveStatus === 'success' ? 'bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300' : 
                                       'bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300'}`}>
          {saveStatus === 'success' ? <CheckCircleLucide className="h-5 w-5 mr-2"/> : <XCircleLucide className="h-5 w-5 mr-2"/>}
          {saveStatus === 'success' ? 'Profil berhasil diperbarui!' : errors.general || "Gagal menyimpan perubahan."}
        </div>
      )}

      <form onSubmit={(e) => {e.preventDefault(); if(isEditing) handleSave();}} className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="relative flex-shrink-0">
            {displayAvatar ? (
                <Image src={displayAvatar} alt="User Avatar" width={128} height={128} className="rounded-full object-cover shadow-lg border-4 border-white dark:border-neutral-600" key={displayAvatar} onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=random&size=128&color=fff`)}/>
            ) : (
                <DefaultAvatarIcon className="h-32 w-32 text-gray-300 dark:text-neutral-600 bg-gray-100 dark:bg-neutral-700 rounded-full p-3 border-4 border-white dark:border-neutral-600"/>
            )}
            {isEditing && (
              <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-brand-purple hover:bg-purple-700 text-white p-2.5 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2">
                <PencilIcon className="h-5 w-5" />
                <input id="avatar-upload" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
              </label>
            )}
          </div>
          <div className="text-center sm:text-left flex-grow">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-neutral-100">{displayName}</h3>
            <p className="text-md text-gray-500 dark:text-neutral-400">{user.role}</p>
            {isEditing && <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2">Klik ikon pensil pada avatar untuk mengganti foto profil Anda.</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 pt-6 border-t border-gray-200 dark:border-neutral-700">
          <InputField label="Nama Lengkap" id="name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} placeholder="Masukkan nama lengkap Anda" required error={errors.name}/>
          <InputField label="Username" id="username" name="username" value={formData.username} onChange={handleChange} disabled={!isEditing} placeholder="Username unik Anda" required error={errors.username} helperText={isEditing ? "Minimal 3 karakter, hanya huruf, angka, titik, underscore." : "Ubah username dapat memengaruhi cara Anda login."}/>
          <InputField label="Alamat Email" id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={true} placeholder="email@example.com" required helperText={"Email tidak dapat diubah."}/>
          <InputField label="Departemen/Fakultas (Opsional)" id="department" name="department" value={formData.department || ''} onChange={handleChange} disabled={!isEditing} placeholder="Contoh: Fakultas Teknik Informatika"/>
          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-1.5">Bio Singkat</label>
            <textarea name="bio" id="bio" rows={4} value={formData.bio} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700/60 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent shadow-sm transition-colors min-h-[100px] placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-900 dark:text-neutral-100" placeholder="Ceritakan sedikit tentang diri Anda..."/>
          </div>
           <div className="md:col-span-2"> <InputField label="Peran" id="role" name="role" value={user.role || ''} disabled={true}/> </div>
        </div>
      </form>
    </div>
  );
}

// --- File-file Komponen Lainnya (Security, Preferences, dll.) ---
// Implementasi untuk SecuritySettings, PreferenceSettings, NotificationSettings, IntegrationSettings, BillingSettings
// akan mengikuti pola yang sama, dengan konten dan form yang spesifik untuk masing-masing.
// Pastikan untuk membuat file-file ini di app/dashboard/settings/components/