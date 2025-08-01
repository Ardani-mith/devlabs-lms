import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { BackendStatusIndicator } from "@/components/shared/BackendStatusIndicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Devva Dashboard",
  description: "Modern Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-neutral-900`} suppressHydrationWarning>
        <AuthProvider>
          <CourseProvider>
            <SidebarProvider>
              <ThemeProvider>
                {children}
                <BackendStatusIndicator />
              </ThemeProvider>
            </SidebarProvider>
          </CourseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
