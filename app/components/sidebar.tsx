'use client';

import Link from 'next/link';
// Si usas la imagen con <img> normal, no hace falta importar Image de next
// import Image from 'next/image'; 
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  // Función para salir
  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const linkStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: isActive(path) ? 'var(--primary)' : 'transparent',
    color: isActive(path) ? '#ffffff' : 'var(--text-muted)',
    boxShadow: isActive(path) ? '0 4px 12px rgba(139, 92, 246, 0.4)' : 'none',
  });

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      backgroundColor: '#18181b',
      borderRight: '1px solid var(--border-subtle)',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      
      {/* 1. MARCA / LOGO */}
      <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
         {/* Contenedor del logo */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '15px',
          border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          position: 'relative',
          backgroundColor: '#fff' 
        }}>
          {/* Si tienes el logo.png en public, descomenta esto: */}
          {/* <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
          
          {/* Placeholder mientras no haya logo */}
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', background: '#333' }}>🍰</div>
        </div>

        <h1 style={{ 
          fontSize: '1.2rem', 
          margin: 0, 
          fontFamily: 'var(--font-poppins)',
          color: 'var(--text-main)' 
        }}>
          Pastelería
        </h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Panel de Control
        </span>
      </div>

      {/* 2. NAVEGACIÓN */}
      <nav style={{ flex: 1 }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#52525b', fontWeight: 700, letterSpacing: '1px', paddingLeft: '10px', marginBottom: '10px' }}>
          Menu Principal
        </p>
        <Link href="/" style={linkStyle('/')}><span>📊</span> Resumen</Link>
        <Link href="/products" style={linkStyle('/products')}><span>📦</span> Mis Insumos</Link>
        <Link href="/movements" style={linkStyle('/movements')}><span>📖</span> Libro Diario</Link>

        <div style={{ height: '20px' }}></div>

        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#52525b', fontWeight: 700, letterSpacing: '1px', paddingLeft: '10px', marginBottom: '10px' }}>
          Acciones Rápidas
        </p>
        <Link href="/movements/new" style={{
          ...linkStyle('/movements/new'),
          border: '1px solid var(--border-subtle)',
          backgroundColor: isActive('/movements/new') ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
        }}>
          <span>✍️</span> Anotar / Mover
        </Link>
      </nav>

      {/* 3. FOOTER: BOTÓN DE CERRAR SESIÓN (Ya no backup) */}
      <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
         <button 
           onClick={handleLogout}
           style={{
             width: '100%',
             padding: '12px',
             background: 'transparent', 
             border: '1px solid #ef4444', 
             color: '#ef4444',
             borderRadius: '12px',
             cursor: 'pointer',
             fontSize: '0.9rem',
             fontWeight: 600,
             fontFamily: 'var(--font-poppins)',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '8px',
             transition: 'all 0.2s ease',
           }}
           className="hover:bg-red-900/20" // Si usaras tailwind, si no, usa style hover
           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
         >
           🚪 Cerrar Sesión
         </button>
      </div>
    </aside>
  );
}