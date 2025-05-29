import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { ReactNode } from "react";

export const metadata = {
  title: "Daftar Kursus - LMS Devlab",
  description: "Jelajahi beragam kursus untuk meningkatkan keahlian Anda.",
};

export default function CoursesLayout({
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