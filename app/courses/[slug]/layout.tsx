import { ReactNode } from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;
    const courseTitle = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return {
      title: `${courseTitle} - LMS Devlab`,
      description: `Detail lengkap untuk kursus ${courseTitle}. Pelajari lebih lanjut tentang materi, instruktur, dan cara mendaftar.`,
    };
  }

export default function CourseDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className=""> {/* Sesuaikan pl dengan lebar sidebar */}
        
        <main className="">
          {children}
        </main>
      </div>
    </div>
  );
}