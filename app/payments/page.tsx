"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  CreditCardIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  TagIcon,
  InformationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// --- TypeScript Types ---
interface CurrentBillSummary {
  totalAmount: number;
  currency: string;
  status: "Menunggu Pembayaran" | "Sudah Dibayar" | "Gagal";
  dueDate?: string;
  paymentDate?: string;
  invoiceId: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  paymentMethod: string;
  status: "Berhasil" | "Diproses" | "Gagal";
  amount: number;
  currency: string;
  invoiceUrl?: string;
}

interface PaymentData {
  currentBill: CurrentBillSummary | null;
  paymentHistory: Transaction[];
}

// --- Helper Functions & Components ---
const getStatusPillClasses = (status: string): string => {
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

const StatusIcon = ({ status }: { status: string }) => {
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

// --- API Functions ---
const fetchPaymentData = async (userId: string): Promise<PaymentData> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/api/payments/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      return {
        currentBill: null,
        paymentHistory: []
      };
    }
  } catch (error) {
    console.error('Payment API error:', error);
    return {
      currentBill: null,
      paymentHistory: []
    };
  }
};

// --- Main Component ---
export default function PaymentsPage() {
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentData>({
    currentBill: null,
    paymentHistory: []
  });
  const [loading, setLoading] = useState(true);
  const [showPromo, setShowPromo] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Kartu Kredit/Debit");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");

  useEffect(() => {
    const loadPaymentData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchPaymentData(user.id?.toString() || '');
        setPaymentData(data);
      } catch (error) {
        console.error('Error loading payment data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentData();
  }, [user]);

  const { currentBill, paymentHistory } = paymentData;

  const totalAmountToPay = useMemo(() => {
    return currentBill?.totalAmount || 0;
  }, [currentBill]);

  const filteredHistory = useMemo(() => {
    return paymentHistory
      .filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(transaction =>
        statusFilter === "Semua" || transaction.status === statusFilter
      );
  }, [paymentHistory, searchTerm, statusFilter]);

  const handlePayNow = () => {
    // Simulasi proses pembayaran
    console.log(`Membayar ${totalAmountToPay.toLocaleString('id-ID')} ${currentBill?.currency || 'IDR'} menggunakan ${selectedPaymentMethod}`);
    alert(`Simulasi: Pembayaran sebesar ${totalAmountToPay.toLocaleString('id-ID')} ${currentBill?.currency || 'IDR'} dengan ${selectedPaymentMethod} sedang diproses.`);
    // Idealnya, ini akan redirect ke payment gateway atau memicu API call
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-6"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-neutral-700 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="text-center py-12">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Silakan login untuk mengakses halaman pembayaran.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 space-y-10 text-text-light-primary dark:text-text-dark-primary">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Pembayaran & Riwayat Transaksi
        </h1>
        <p className="text-gray-600 dark:text-neutral-400 text-lg">
          Kelola pembayaran dan lihat riwayat transaksi Anda
        </p>
      </div>

      {/* Promo Banner */}
      {showPromo && (
        <div className="relative bg-gradient-to-r from-brand-purple to-purple-700 p-6 rounded-2xl text-white shadow-xl">
          <button
            onClick={() => setShowPromo(false)}
            className="absolute top-3 right-3 text-white/80 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <CreditCardIcon className="h-8 w-8 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Promo Pembayaran!</h3>
              <p className="text-white/90">Dapatkan cashback 10% untuk semua metode pembayaran digital. Berlaku hingga akhir bulan.</p>
            </div>
          </div>
        </div>
      )}

      {/* Current Bill Summary */}
      {currentBill && (
        <div className="p-6 bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/80">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 mb-4 flex items-center">
            <CreditCardIcon className="h-6 w-6 mr-3 text-brand-purple" />
            Tagihan Saat Ini
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Invoice #{currentBill.invoiceId}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentBill.totalAmount.toLocaleString('id-ID', { style: 'currency', currency: currentBill.currency, minimumFractionDigits: 0 })}
              </p>
              {currentBill.dueDate && (
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Jatuh tempo: {new Date(currentBill.dueDate).toLocaleDateString('id-ID')}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusPillClasses(currentBill.status)}`}>
                <StatusIcon status={currentBill.status} />
                <span className="ml-2">{currentBill.status}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Form Pembayaran Baru (jika ada tagihan) */}
          {currentBill && currentBill.status === "Menunggu Pembayaran" && (
            <div className="p-6 bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/80">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 mb-5">Lakukan Pembayaran</h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
                  <span className="text-gray-700 dark:text-neutral-200 flex items-center">
                    <TagIcon className="h-4 w-4 mr-2 text-gray-400"/>
                    Invoice #{currentBill.invoiceId}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-neutral-100">
                    {currentBill.totalAmount.toLocaleString('id-ID', { style: 'currency', currency: currentBill.currency, minimumFractionDigits: 0 })}
                  </span>
                </div>
                <hr className="border-gray-200 dark:border-neutral-700" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="text-gray-800 dark:text-neutral-100">Total Bayar:</span>
                  <span className="text-brand-purple dark:text-purple-400">
                    {totalAmountToPay.toLocaleString('id-ID', { style: 'currency', currency: currentBill.currency, minimumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">Pilih Metode Pembayaran</label>
                <div className="relative">
                  <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full appearance-none pl-10 pr-8 py-3 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Kartu Kredit/Debit">Kartu Kredit/Debit</option>
                    <option value="Virtual Account">Virtual Account</option>
                    <option value="GoPay">GoPay</option>
                    <option value="OVO">OVO</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={handlePayNow}
                className="w-full bg-brand-purple hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
              >
                Bayar Sekarang
              </button>
            </div>
          )}

          {/* Riwayat Transaksi */}
          <div className="p-6 bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/80">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-100 mb-4 sm:mb-0">Riwayat Transaksi</h2>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center text-brand-purple hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Refresh
              </button>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Cari deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500"
                />
              </div>
              <div className="relative sm:w-48">
                <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Berhasil">Berhasil</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Gagal">Gagal</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((transaction) => (
                  <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/70 transition-colors">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-center mb-2">
                        <StatusIcon status={transaction.status} />
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusPillClasses(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-800 dark:text-neutral-100 text-sm">{transaction.description}</h4>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">{transaction.paymentMethod} • {transaction.date}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end">
                      <span className="font-semibold text-gray-800 dark:text-neutral-100 text-sm mr-4">
                        {transaction.amount.toLocaleString('id-ID', { style: 'currency', currency: transaction.currency, minimumFractionDigits: 0 })}
                      </span>
                      <div className="flex items-center space-x-2">
                        {transaction.invoiceUrl ? (
                          <a href={transaction.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-purple dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium p-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-700/30 transition-colors" title="Unduh Invoice">
                            <DocumentArrowDownIcon className="h-5 w-5 inline-block" />
                          </a>
                        ) : (
                          <span className="text-gray-400 dark:text-neutral-500 p-1 cursor-not-allowed" title="Invoice tidak tersedia">
                            <DocumentArrowDownIcon className="h-5 w-5 inline-block opacity-50" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-neutral-400">Tidak ada transaksi yang ditemukan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}