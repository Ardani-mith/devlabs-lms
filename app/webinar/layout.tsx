import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { ReactNode, Suspense } from 'react';
import { WebinarCategoryNavigation } from './components/WebinarCategoryNavigation';
// Impor ikon tidak lagi diperlukan di sini jika kita meneruskan nama sebagai string

export const metadata = {
  title: "Webinar - LMS Skillzone",
  description: "Jelajahi, ikuti webinar langsung, atau tonton rekaman webinar yang telah berlangsung di LMS Skillzone.",
};

// Ubah 'icon' menjadi string nama ikon
const webinarNavItems = [
  { name: 'Semua Webinar', href: 'all', iconName: 'ListVideo' },
  { name: 'Live & Akan Datang', href: 'upcoming', iconName: 'CalendarClock' },
  { name: 'Webinar Selesai', href: 'past', iconName: 'CheckSquare' },
  // { name: 'Webinar Saya', href: 'my-webinars', iconName: 'Tv2' }, // Contoh tambahan
];

export default function WebinarLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1">
      <Header />
        <header className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-neutral-50">
                Pusat Webinar
              </h1>
              <p className="mt-2 text-base text-gray-600 dark:text-neutral-400 max-w-2xl">
                Tingkatkan pengetahuan Anda dengan sesi interaktif dari para ahli di bidangnya.
              </p>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 mb-8 sticky top-[var(--header-height,4rem)] z-20 bg-gray-100/80 dark:bg-neutral-900/80 backdrop-blur-md py-3 rounded-b-xl shadow-sm">
           <Suspense fallback={<div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded-lg animate-pulse"></div>}>
            <WebinarCategoryNavigation navItems={webinarNavItems} />
          </Suspense>
        </div>

        <main className="px-4 sm:px-6 lg:px-8 pb-12">
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-white dark:bg-neutral-800/50 rounded-xl shadow-lg animate-pulse"></div>
              ))}
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}