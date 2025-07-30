// hoc/withAuth.tsx
import { useAuth, User } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: Array<User['role']>
) => {
  const ComponentWithAuth = (props: P) => {
    const { user, isLoading, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !token) { // Jika loading selesai dan tidak ada token (belum login)
        router.replace('/'); // Redirect ke login
      } else if (!isLoading && user && !allowedRoles.includes(user.role)) {
        // Pengguna login tapi tidak punya peran yang diizinkan
        router.replace('/dashboard/unauthorized'); // Atau halaman error akses
      }
    }, [user, isLoading, token, router, allowedRoles]);

    if (isLoading || !user || !allowedRoles.includes(user.role)) {
      // Tampilkan loading atau null selama pemeriksaan atau jika akses ditolak sebelum redirect
      return <div className="flex justify-center items-center min-h-screen">Memeriksa akses...</div>;
    }

    return <WrappedComponent {...props} />;
  };
  return ComponentWithAuth;
};

export default withAuth;