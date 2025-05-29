import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { ReactNode } from "react";

export const metadata = {
  title: "Analytics - Devva Labs",
  description: "Monitor key metrics and performance indicators for Devva Labs.",
};

export default function AnalyticsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1"> {/* Sesuaikan pl dengan lebar sidebar */}
        <Header />
        <main className="">
          {children}
        </main>
      </div>
    </div>
  );
}