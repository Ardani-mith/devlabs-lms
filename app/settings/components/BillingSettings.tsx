// 9. app/dashboard/settings/components/BillingSettings.tsx
// Path: app/dashboard/settings/components/BillingSettings.tsx
"use client";
import React, { useState } from 'react';
import { CreditCardIcon as PageIcon, ArrowDownTrayIcon, CalendarDaysIcon, CheckBadgeIcon, BanknotesIcon, PencilSquareIcon, XCircleIcon as CancelIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
// Asumsikan AceternityButton sudah diimpor atau didefinisikan
const AceternityButton = ({ children, onClick, variant = "primary", className, type = "button", disabled }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-2.5 text-sm font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 flex items-center justify-center
      ${variant === 'primary' ? 'bg-brand-purple hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white focus:ring-purple-500' :
        variant === 'secondary' ? 'bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-800 dark:text-neutral-100 focus:ring-gray-400' :
        variant === 'danger' ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white focus:ring-red-500' : // Added danger variant
        'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500' // Default fallback
      } ${className}`}
  >
    {children}
  </button>
);


interface SubscriptionPlan {
  name: string;
  pricePerMonth: number;
  priceAnnual?: number; // Harga tahunan jika ada diskon
  currency: string;
  renewalDate: string;
  features: string[];
  isCurrent: boolean;
}

interface BillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'Dibayar' | 'Gagal' | 'Pending' | 'Refunded';
  invoiceUrl?: string;
}

export default function BillingSettings() {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>({
    name: "Paket Pro Tahunan",
    pricePerMonth: 125000,
    priceAnnual: 1500000,
    currency: "IDR",
    renewalDate: "2026-01-15",
    features: ["Akses semua kursus tanpa batas", "Sertifikat Profesional untuk setiap kursus", "Dukungan prioritas dari tim & pengajar", "Download materi kursus untuk belajar offline", "Akses ke webinar eksklusif bulanan"],
    isCurrent: true,
  });
  const [paymentMethod, setPaymentMethod] = useState({ type: "Kartu Kredit Visa", last4: "4242", expiry: "12/2026" });

  const billingHistory: BillingHistoryItem[] = [
    { id: "bh1", date: "2025-01-15", description: "Langganan Tahunan - Paket Pro", amount: 1500000, currency: "IDR", status: "Dibayar", invoiceUrl: "#" },
    { id: "bh2", date: "2024-12-10", description: "Pembelian Kursus: Data Science Advanced", amount: 450000, currency: "IDR", status: "Dibayar", invoiceUrl: "#" },
    { id: "bh3", date: "2024-11-15", description: "Langganan Bulanan (Gagal)", amount: 150000, currency: "IDR", status: "Gagal" },
    { id: "bh4", date: "2024-10-15", description: "Langganan Bulanan - Paket Pro", amount: 150000, currency: "IDR", status: "Pending" },
  ];
  
  const getStatusPillClasses = (status: BillingHistoryItem['status']): string => {
    switch (status) {
      case "Dibayar": return "bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300";
      case "Pending": return "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-700 dark:text-yellow-300";
      case "Gagal": return "bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300";
      case "Refunded": return "bg-blue-100 dark:bg-blue-700/30 text-blue-700 dark:text-blue-300";
      default: return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const handleChangePaymentMethod = () => alert("Simulasi: Mengarahkan ke halaman ubah metode pembayaran.");
  const handleUpgradePlan = () => alert("Simulasi: Mengarahkan ke halaman pilihan paket langganan.");
  const handleCancelSubscription = () => {
    if(confirm("Apakah Anda yakin ingin membatalkan langganan? Pembatalan akan efektif di akhir periode berjalan saat ini.")) {
        alert("Simulasi: Langganan Anda akan dibatalkan di akhir periode.");
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700/70 space-y-12">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-1">Langganan & Tagihan</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Kelola paket langganan, metode pembayaran, dan lihat riwayat tagihan Anda.</p>
      </div>

      {currentPlan ? (
        <section className="pt-6 border-t border-gray-200 dark:border-neutral-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-5">Paket Langganan Anda Saat Ini</h3>
          <div className="bg-gradient-to-tr from-brand-purple via-purple-600 to-indigo-600 dark:from-purple-800 dark:via-purple-700 dark:to-indigo-700 p-6 sm:p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
            {/* Decorative elements for Aceternity feel */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full opacity-50 dark:opacity-30"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full opacity-30 dark:opacity-20"></div>
            
            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <div>
                        <h4 className="text-2xl sm:text-3xl font-bold">{currentPlan.name}</h4>
                        <p className="text-sm opacity-90 mt-1">Diperpanjang pada: {new Date(currentPlan.renewalDate).toLocaleDateString('id-ID', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                    </div>
                    <div className="mt-3 sm:mt-0 text-left sm:text-right">
                        {currentPlan.priceAnnual ? (
                             <p className="text-3xl sm:text-4xl font-extrabold">Rp{currentPlan.priceAnnual.toLocaleString('id-ID')}<span className="text-base font-normal opacity-80">/thn</span></p>
                        ) : (
                             <p className="text-3xl sm:text-4xl font-extrabold">Rp{currentPlan.pricePerMonth.toLocaleString('id-ID')}<span className="text-base font-normal opacity-80">/bln</span></p>
                        )}
                        {currentPlan.priceAnnual && <p className="text-xs opacity-80">(Setara Rp{(currentPlan.priceAnnual / 12).toLocaleString('id-ID')} /bln)</p>}
                    </div>
                </div>
                <p className="text-sm font-medium opacity-95 mb-3 mt-5">Fitur yang Anda Dapatkan:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm opacity-90 mb-6">
                    {currentPlan.features.map(feature => (
                        <li key={feature} className="flex items-center"><CheckBadgeIcon className="h-5 w-5 mr-2 text-green-300 flex-shrink-0"/>{feature}</li>
                    ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <AceternityButton onClick={handleUpgradePlan} variant="secondary" className="bg-white/90 hover:bg-white text-brand-purple border-transparent focus:ring-purple-300 dark:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-200">
                        <PencilSquareIcon className="h-5 w-5 mr-2"/> Ubah Paket
                    </AceternityButton>
                    <AceternityButton onClick={handleCancelSubscription} variant="danger" className="bg-transparent hover:bg-red-500/20 text-red-200 border border-red-300/50 focus:ring-red-400">
                        <CancelIcon className="h-5 w-5 mr-2"/> Batalkan Langganan
                    </AceternityButton>
                </div>
            </div>
          </div>
        </section>
      ) : (
         <section className="pt-6 border-t border-gray-200 dark:border-neutral-700 text-center py-10">
            <InformationCircleIcon className="h-12 w-12 text-gray-400 dark:text-neutral-500 mx-auto mb-3"/>
            <p className="text-gray-600 dark:text-neutral-300 mb-4 text-lg">Anda saat ini tidak memiliki paket langganan aktif.</p>
            <AceternityButton onClick={handleUpgradePlan} variant="primary" className="px-8 py-3 text-base">
                Lihat Pilihan Paket Langganan
            </AceternityButton>
         </section>
      )}

      <section className="pt-8 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-5">Metode Pembayaran Tersimpan</h3>
        <div className="p-6 rounded-xl border border-gray-200 dark:border-neutral-600/80 bg-gray-50 dark:bg-neutral-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center">
            <PageIcon className="h-10 w-10 mr-4 text-brand-purple dark:text-purple-400" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-neutral-100 text-lg">{paymentMethod.type}</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Berakhir pada {paymentMethod.expiry} • Nomor: **** **** **** {paymentMethod.last4}</p>
            </div>
          </div>
          <AceternityButton onClick={handleChangePaymentMethod} variant="secondary" className="w-full sm:w-auto py-2">
            <PencilSquareIcon className="h-4 w-4 mr-2"/> Ubah
          </AceternityButton>
        </div>
      </section>

      <section className="pt-8 border-t border-gray-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-6">Riwayat Tagihan & Pembayaran</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-700/60 shadow-md">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700/60">
              <thead className="bg-gray-100 dark:bg-neutral-700/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Deskripsi</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Jumlah</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Invoice</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700/60">
                {billingHistory.length > 0 ? billingHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-neutral-700/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">{new Date(item.date).toLocaleDateString('id-ID', {day:'2-digit',month:'long',year:'numeric'})}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-neutral-100 font-medium">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-800 dark:text-neutral-100 font-semibold">{item.amount.toLocaleString('id-ID', { style: 'currency', currency: item.currency, minimumFractionDigits: 0 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPillClasses(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {item.invoiceUrl ? (
                        <a href={item.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-purple dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium p-1.5 rounded-md hover:bg-purple-100/50 dark:hover:bg-purple-700/30 transition-colors" title="Unduh Invoice">
                          <ArrowDownTrayIcon className="h-5 w-5 inline-block" />
                        </a>
                      ) : <span className="text-gray-400 dark:text-neutral-500">-</span>}
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-neutral-400">
                            <BanknotesIcon className="h-10 w-10 mx-auto text-gray-300 dark:text-neutral-600 mb-2"/>
                            Belum ada riwayat tagihan.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          {billingHistory.length > 5 && (
            <div className="mt-6 text-center">
                <AceternityButton variant="secondary" className="text-xs">Lihat Semua Riwayat</AceternityButton>
            </div>
          )}
      </section>
    </div>
  );
}