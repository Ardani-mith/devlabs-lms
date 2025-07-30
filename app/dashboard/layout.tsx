import { ReactNode } from "react";
import ProtectedLayout from "@/components/shared/ProtectedLayout";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}