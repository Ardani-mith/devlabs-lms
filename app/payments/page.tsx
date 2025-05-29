"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  CheckCircleIcon, // Untuk status Berhasil, Sudah Dibayar
  ClockIcon,       // Untuk status Diproses, Menunggu Pembayaran
  XCircleIcon,     // Untuk status Gagal
  ArrowDownTrayIcon, // Untuk download PDF
  InformationCircleIcon, // Untuk info
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  CreditCardIcon, // Untuk metode pembayaran
  BanknotesIcon,  // Untuk metode pembayaran lain
  ReceiptPercentIcon, // Untuk promo
  TagIcon, // Untuk deskripsi item
  XMarkIcon, // Untuk menutup banner
} from '@heroicons/react/24/solid'; // Menggunakan solid untuk ikon yang lebih menonjol

// --- Data Types ---
type PaymentStatus = "Sudah Dibayar" | "Menunggu Pembayaran" | "Gagal";
interface CurrentBillSummary {
  totalAmount: number;
  currency: string;
  status: PaymentStatus;
  dueDate?: string;
  invoiceId?: string;
  paymentDate?: string; // Jika sudah dibayar
}

type TransactionStatus = "Berhasil" | "Diproses" | "Gagal";
interface Transaction {
  id: string;
  date: string;
  description: string;
  paymentMethod: string;
  status: TransactionStatus;
  amount: number;
  currency: string;
  invoiceUrl?: string;
}

interface PaymentItem {
  id: string;
  name: string;
  price: number;
  currency: string;
}

// --- Placeholder Data ---
const currentBill: CurrentBillSummary | null = {
  totalAmount: 250000,
  currency: "IDR",
  status: "Menunggu Pembayaran",
  dueDate: "2025-06-05",
  invoiceId: "INV-2025-00123",
};
// Untuk simulasi sudah dibayar:
// const currentBill: CurrentBillSummary | null = { totalAmount: 0, currency: "IDR", status: "Sudah Dibayar", paymentDate: "2025-05-25", invoiceId: "INV-2025-00122"};
// Untuk simulasi gagal:
// const currentBill: CurrentBillSummary | null = { totalAmount: 150000, currency: "IDR", status: "Gagal", invoiceId: "INV-2025-00121", paymentDate: "2025-05-20"};


const paymentHistory: Transaction[] = [
  { 
    id: "txn001", 
    date: "2024-03-20", 
    description: "Kursus: UI/UX Design Masterclass", 
    paymentMethod: "Kartu Kredit (**** 5678)", 
    status: "Berhasil", 
    amount: 799000, 
    currency: "IDR", 
    invoiceUrl: "#" 
  },
  { 
    id: "txn002", 
    date: "2024-03-15", 
    description: "Langganan Premium - 3 Bulan", 
    paymentMethod: "DANA", 
    status: "Berhasil", 
    amount: 450000, 
    currency: "IDR", 
    invoiceUrl: "#" 
  },
  { 
    id: "txn003", 
    date: "2024-03-10", 
    description: "Workshop: React Native Development", 
    paymentMethod: "Bank Transfer (BCA)", 
    status: "Diproses", 
    amount: 1250000, 
    currency: "IDR" 
  },
  { 
    id: "txn004", 
    date: "2024-03-05", 
    description: "Kursus: Digital Marketing Strategy", 
    paymentMethod: "OVO", 
    status: "Gagal", 
    amount: 599000, 
    currency: "IDR" 
  },
  { 
    id: "txn005", 
    date: "2024-02-28", 
    description: "Bootcamp: Full Stack Development", 
    paymentMethod: "Kartu Kredit (**** 1234)", 
    status: "Berhasil", 
    amount: 2499000, 
    currency: "IDR", 
    invoiceUrl: "#" 
  },
  { 
    id: "txn006", 
    date: "2024-02-20", 
    description: "Kursus: Data Science Fundamentals", 
    paymentMethod: "GoPay", 
    status: "Berhasil", 
    amount: 899000, 
    currency: "IDR", 
    invoiceUrl: "#" 
  },
  { 
    id: "txn007", 
    date: "2024-02-15", 
    description: "Workshop: AWS Cloud Architecture", 
    paymentMethod: "Virtual Account (Mandiri)", 
    status: "Diproses", 
    amount: 1750000, 
    currency: "IDR" 
  },
  { 
    id: "txn008", 
    date: "2024-02-10", 
    description: "Langganan Premium - 1 Tahun", 
    paymentMethod: "Bank Transfer (BNI)", 
    status: "Berhasil", 
    amount: 1499000, 
    currency: "IDR", 
    invoiceUrl: "#" 
  }
];

const itemsToPay: PaymentItem[] = currentBill && currentBill.status === "Menunggu Pembayaran"
  ? [{ id: "bill001", name: `Tagihan Invoice #${currentBill.invoiceId}`, price: currentBill.totalAmount, currency: currentBill.currency }]
  : [];
// Atau bisa juga dari item kursus yang baru ditambahkan ke keranjang:
// const itemsToPay: PaymentItem[] = [
//   { id: "course001", name: "Kursus: Figma Masterclass", price: 450000, currency: "IDR" },
//   { id: "course002", name: "Kursus: Copywriting Essentials", price: 200000, currency: "IDR" },
// ];


const paymentMethods = ["Kartu Kredit/Debit", "Virtual Account", "GoPay", "OVO", "Bank Transfer"];

// --- Helper Functions & Components ---
const getStatusPillClasses = (status: PaymentStatus | TransactionStatus): string => {
  switch (status) {
    case "Sudah Dibayar":
    case "Berhasil":
      return "bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300";
    case "Menunggu Pembayaran":
    case "Diproses":
      return "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-700 dark:text-yellow-300 animate-pulse";
    case "Gagal":
      return "bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  }
};

const StatusIcon = ({ status }: { status: PaymentStatus | TransactionStatus }) => {
  switch (status) {
    case "Sudah Dibayar":
    case "Berhasil":
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case "Menunggu Pembayaran":
    case "Diproses":
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    case "Gagal":
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    default:
      return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
  }
};

export default function PaymentPage() {
  const [showPromo, setShowPromo] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);

  // States for filtering history
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<TransactionStatus | "Semua">("Semua");
  // const [historyDateRange, setHistoryDateRange] = useState<[Date | null, Date | null]>([null, null]); // Untuk date picker

  const totalAmountToPay = useMemo(() => {
    return itemsToPay.reduce((sum, item) => sum + item.price, 0);
  }, [itemsToPay]);

  const filteredHistory = useMemo(() => {
    return paymentHistory
      .filter(transaction =>
        transaction.description.toLowerCase().includes(historySearchTerm.toLowerCase())
      )
      .filter(transaction =>
        historyStatusFilter === "Semua" || transaction.status === historyStatusFilter
      );
    // Tambahkan filter tanggal jika menggunakan date picker
  }, [paymentHistory, historySearchTerm, historyStatusFilter]);

  const handlePayNow = () => {
    // Simulasi proses pembayaran
    console.log(`Membayar ${totalAmountToPay.toLocaleString('id-ID')} ${itemsToPay[0]?.currency || 'IDR'} menggunakan ${selectedPaymentMethod}`);
    alert(`Simulasi: Pembayaran sebesar ${totalAmountToPay.toLocaleString('id-ID')} ${itemsToPay[0]?.currency || 'IDR'} dengan ${selectedPaymentMethod} sedang diproses.`);
    // Idealnya, ini akan redirect ke payment gateway atau memicu API call
  };

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100">
          Pembayaran & Tagihan
        </h1>
        <p className="mt-2 text-md text-gray-600 dark:text-neutral-400 max-w-2xl">
          Kelola tagihan Anda, lakukan pembayaran, dan lihat riwayat transaksi dengan mudah.
        </p>
      </header>

      {/* Optional: Promo Banner */}
      {showPromo && (
        <div className="relative bg-gradient-to-r from-brand-purple to-purple-600 dark:from-purple-700 dark:to-purple-800 text-white p-5 rounded-xl shadow-lg flex items-center justify-between transition-all duration-300">
          <div className="flex items-center">
            <ReceiptPercentIcon className="h-8 w-8 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Promo Spesial Akhir Bulan!</h3>
              <p className="text-sm opacity-90">Langganan paket tahunan dan dapatkan diskon 25% + akses ke kursus premium gratis!</p>
            </div>
          </div>
          <button
            onClick={() => setShowPromo(false)}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Tutup promo"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Kolom Kiri: Ringkasan Tagihan & Form Pembayaran (jika ada tagihan) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Payment Summary Card */}
          {currentBill && (
            <div className={`p-6 rounded-2xl shadow-xl border-2 transition-all duration-300
              ${currentBill.status === "Sudah Dibayar" ? 'bg-green-50 dark:bg-green-900/40 border-green-500 dark:border-green-600' :
                currentBill.status === "Menunggu Pembayaran" ? 'bg-yellow-50 dark:bg-yellow-900/40 border-yellow-500 dark:border-yellow-600 animate-pulseSlow' :
                'bg-red-50 dark:bg-red-900/40 border-red-500 dark:border-red-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-100">Ringkasan Tagihan</h2>
                <StatusIcon status={currentBill.status} />
              </div>
              <p className={`text-sm font-medium px-3 py-1 rounded-full inline-block mb-4 ${getStatusPillClasses(currentBill.status)}`}>
                {currentBill.status}
              </p>
              {currentBill.status !== "Sudah Dibayar" && (
                <p className="text-3xl font-bold text-gray-900 dark:text-neutral-50 mb-1">
                  {currentBill.totalAmount.toLocaleString('id-ID', { style: 'currency', currency: currentBill.currency, minimumFractionDigits: 0 })}
                </p>
              )}
              {currentBill.status === "Menunggu Pembayaran" && currentBill.dueDate && (
                <p className="text-xs text-yellow-700 dark:text-yellow-300">Jatuh tempo: {new Date(currentBill.dueDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              )}
              {currentBill.status === "Sudah Dibayar" && currentBill.paymentDate && (
                 <p className="text-sm text-green-700 dark:text-green-300">Dibayar pada: {new Date(currentBill.paymentDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              )}
              {currentBill.invoiceId && <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">No. Invoice: {currentBill.invoiceId}</p>}

              {currentBill.status === "Gagal" && (
                <p className="text-sm text-red-700 dark:text-red-300 mt-2">Pembayaran terakhir gagal. Silakan coba lagi atau gunakan metode lain.</p>
              )}
            </div>
          )}

          {/* Form Pembayaran Baru (jika ada item yang akan dibayar) */}
          {itemsToPay.length > 0 && (
            <div className="p-6 bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/80">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 mb-5">Lakukan Pembayaran</h2>
              <div className="space-y-3 mb-5">
                {itemsToPay.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
                    <span className="text-gray-700 dark:text-neutral-200 flex items-center"><TagIcon className="h-4 w-4 mr-2 text-gray-400"/>{item.name}</span>
                    <span className="font-semibold text-gray-800 dark:text-neutral-100">{item.price.toLocaleString('id-ID', { style: 'currency', currency: item.currency, minimumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
              <div className="mb-5 pt-3 border-t border-gray-200 dark:border-neutral-700/60">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="text-gray-800 dark:text-neutral-100">Total Bayar:</span>
                  <span className="text-brand-purple dark:text-purple-400">{totalAmountToPay.toLocaleString('id-ID', { style: 'currency', currency: itemsToPay[0]?.currency || 'IDR', minimumFractionDigits: 0 })}</span>
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">Pilih Metode Pembayaran</label>
                <div className="relative">
                  <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                  <select
                    id="paymentMethod"
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full appearance-none pl-10 pr-8 py-3 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                </div>
              </div>
              <button
                onClick={handlePayNow}
                disabled={totalAmountToPay === 0}
                className="w-full bg-brand-purple hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bayar Sekarang
              </button>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Riwayat Pembayaran */}
        <div className="lg:col-span-2 h-full bg-white dark:bg-neutral-800/90 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/80">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6">Riwayat Pembayaran</h2>
          {/* Filter Riwayat */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              <input
                type="search"
                placeholder="Cari deskripsi..."
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500"
              />
            </div>
            <div className="relative">
               <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              <select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value as TransactionStatus | "Semua")}
                className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500"
              >
                <option value="Semua">Semua Status</option>
                <option value="Berhasil">Berhasil</option>
                <option value="Diproses">Diproses</option>
                <option value="Gagal">Gagal</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            </div>
            {/* Tambahkan Date Range Picker di sini jika perlu */}
          </div>

          {/* Tabel Riwayat */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-700/60">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700/60">
              <thead className="bg-gray-50 dark:bg-neutral-700/50">
                <tr>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Deskripsi</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Metode</th>
                  <th scope="col" className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Jumlah</th>
                  <th scope="col" className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 dark:text-neutral-300 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700/60">
                {filteredHistory.length > 0 ? filteredHistory.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-700/40 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-300">{new Date(transaction.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-neutral-100 font-medium">{transaction.description}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-300">{transaction.paymentMethod}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPillClasses(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-right text-gray-800 dark:text-neutral-100 font-semibold">{transaction.amount.toLocaleString('id-ID', { style: 'currency', currency: transaction.currency, minimumFractionDigits: 0 })}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-center">
                      {transaction.invoiceUrl ? (
                        <a href={transaction.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-purple dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium p-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-700/30 transition-colors" title="Unduh Invoice">
                          <ArrowDownTrayIcon className="h-5 w-5 inline-block" />
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-neutral-500 p-1 cursor-not-allowed" title="Invoice tidak tersedia">
                            <ArrowDownTrayIcon className="h-5 w-5 inline-block opacity-50" />
                        </span>
                      )}
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-500 dark:text-neutral-400">
                            <InformationCircleIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-neutral-600 mb-2"/>
                            Tidak ada riwayat transaksi yang cocok dengan filter Anda.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Tambahkan pagination jika perlu */}
        </div>
      </div>
    </div>
  );
}

// Untuk animasi pulse pada summary card yang menunggu pembayaran, tambahkan ke globals.css jika belum:
/*
@layer utilities {
  .animate-pulseSlow {
    animation: pulseSlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes pulseSlow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .8;
    }
  }
}
*/