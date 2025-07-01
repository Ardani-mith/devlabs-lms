import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { ReactNode } from "react";

export const metadata = {
  title: "Daftar Pengajar - LMS Devlab",
  description: "Temukan pengajar terbaik untuk kebutuhan belajar Anda.",
};

export default function TeacherDirectoryLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header />
        <main className="">
          {children}
        </main>
      </div>
    </div>
  );
} 