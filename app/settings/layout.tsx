import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { ReactNode, Suspense } from 'react';

export const metadata = {
  title: "Pengaturan Akun - LMS Skillzone",
  description: "Kelola akun, keamanan, preferensi, dan langganan Anda di LMS Skillzone.",
};

export default function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header />
        <Suspense fallback={
          <div className="min-h-[400px] bg-white dark:bg-neutral-800/50 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700/70 p-8 animate-pulse flex items-center justify-center">
            <p className="text-gray-500 dark:text-neutral-400">Memuat pengaturan...</p>
          </div>
        }>
          <main className="flex-1">
            {children}
          </main>
        </Suspense>
      </div>
    </div>
  );
}