'use client'; // Esto es vital para usar usePathname

import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Verificamos si estamos en la página de login
  const isLoginPage = pathname === '/login';

  // OPCIÓN A: SI ES LOGIN (Pantalla limpia)
  if (isLoginPage) {
    return (
      <main style={{ minHeight: '100vh', width: '100%' }}>
        {children}
      </main>
    );
  }

  // OPCIÓN B: SI ES EL SISTEMA (Con Sidebar y Margen)
  return (
    <>
      <Sidebar />
      <div style={{ 
        marginLeft: '260px', // El espacio para el Sidebar
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        transition: 'margin-left 0.3s ease' // Suavidad por si acaso
      }}>
        <div className="container">
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}