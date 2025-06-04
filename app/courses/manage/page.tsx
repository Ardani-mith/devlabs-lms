// Contoh di halaman /dashboard/courses/manage/page.tsx
import { useAuth } from '@/contexts/AuthContext';

export default function ManageCoursesPage() {
  const { user } = useAuth();

  if (user?.role !== 'ADMIN' && user?.role !== 'INSTRUCTOR') {
    return <p>Anda tidak memiliki akses ke halaman ini.</p>; // Atau redirect
  }

  return (
    <div>
      <h1>Manajemen Kursus</h1>
      {user?.role === 'ADMIN' && (
        <button>Buat Kursus Baru untuk Instruktur Lain</button>
      )}
      {user?.role === 'INSTRUCTOR' && (
        <button>Buat Kursus Baru Saya</button>
      )}
      {/* ... Daftar kursus yang bisa dikelola ... */}
    </div>
  );
}