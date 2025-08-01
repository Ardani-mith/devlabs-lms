import { ReactNode } from "react";
import ProtectedLayout from "@/components/shared/ProtectedLayout";

export const metadata = {
  title: "Daftar Kursus - LMS Devlab",
  description: "Jelajahi beragam kursus untuk meningkatkan keahlian Anda.",
};

export default function CoursesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}