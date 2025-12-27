'use client';

import Link from 'next/link';
import Image from 'next/image'; // <-- 1. IMPORTAR ESTO
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [backupLoading, setBackupLoading] = useState(false);
  const router = useRouter(); // Agrega esto
  // ... tus otros estados ...

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

  const isActive = (path: string) => pathname === path;

  const handleBackup = async () => {
    if (!confirm('¿Querés guardar una copia de seguridad ahora?')) return;
    setBackupLoading(true);
    try {
      const res = await fetch('/api/backup');
      if (res.ok) alert('✅ ¡Listo! Copia guardada.');
      else alert('❌ Hubo un error.');
    } catch (e) { alert('❌ Error de conexión.'); }
    finally { setBackupLoading(false); }
  };

  const linkStyle = (path: string) => ({
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
    borderRadius: '12px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500,
    marginBottom: '8px', transition: 'all 0.2s ease',
    backgroundColor: isActive(path) ? 'var(--primary)' : 'transparent',
    color: isActive(path) ? '#ffffff' : 'var(--text-muted)',
    boxShadow: isActive(path) ? '0 4px 12px rgba(139, 92, 246, 0.4)' : 'none',
  });

  return (
    <aside style={{
      width: '260px', height: '100vh', backgroundColor: '#18181b',
      borderRight: '1px solid var(--border-subtle)', padding: '30px 20px',
      display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 100
    }}>

      {/* 1. LOGO PERSONALIZADO */}
      <div style={{ marginBottom: '30px', paddingLeft: '10px' }}>

        {/* Contenedor del logo con borde elegante */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px', // Bordes redondeados modernos
          overflow: 'hidden',   // Recorta la imagen si es muy grande
          marginBottom: '15px',
          border: '2px solid rgba(255,255,255,0.1)', // Borde sutil
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',   // Sombra para profundidad
          position: 'relative'
        }}>
          <Image
            src="/image.png"       // <-- Asegúrate que coincida con el nombre en 'public'
            alt="Logo Pastelería"
            fill                  // Ocupa todo el contenedor
            style={{ objectFit: 'cover' }} // Se adapta sin deformarse
            priority              // Carga inmediata
          />
        </div>

        <h1 style={{
          fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-poppins)', color: 'var(--text-main)'
        }}>
          NormaCakes
        </h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Control de Stock
        </span>
      </div>

      {/* 2. NAVEGACIÓN */}
      <nav style={{ flex: 1 }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#52525b', fontWeight: 700, letterSpacing: '1px', paddingLeft: '10px', marginBottom: '10px' }}>
          Menu Principal
        </p>
        <Link href="/" style={linkStyle('/')}><span>📊</span> Inicio</Link>
        <Link href="/products" style={linkStyle('/products')}><span>📦</span> Stock Actual </Link>
        <Link href="/movements" style={linkStyle('/movements')}><span>📖</span> Ultimos Movimientos </Link>

        <div style={{ height: '20px' }}></div>

        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#52525b', fontWeight: 700, letterSpacing: '1px', paddingLeft: '10px', marginBottom: '10px' }}>
          Acciones Rápidas
        </p>
        <Link href="/movements/new" style={{
          ...linkStyle('/movements/new'),
          border: '1px solid var(--border-subtle)',
          backgroundColor: isActive('/movements/new') ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
        }}>
          <span>✍️</span> Nuevo Movimiento
        </Link>

        <button
          onClick={handleLogout}
          style={{
            background: 'transparent', border: '1px solid #333', color: '#F87171',
            padding: '10px', borderRadius: '8px', marginTop: '10px', width: '100%',
            cursor: 'pointer', fontSize: '0.85rem'
          }}
        >
          Cerrar Sesión
        </button>
      </nav>

      {/* 3. FOOTER: BOTÓN DE BACKUP */}
      <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={handleBackup}
          disabled={backupLoading}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white', border: 'none', borderRadius: '12px',
            cursor: backupLoading ? 'wait' : 'pointer',
            fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-poppins)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
            transition: 'transform 0.2s ease, filter 0.2s ease',
            opacity: backupLoading ? 0.7 : 1
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
        >
          <span style={{ fontSize: '1.2rem' }}>{backupLoading ? '⏳' : '☁️'}</span>
          {backupLoading ? 'GUARDANDO...' : 'FORZAR RESPALDO'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'lime', marginTop: '10px' }}>
          Hacer antes de cerrar.
        </p>
      </div>
    </aside>
  );
}