'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Función auxiliar para saber si el link está activo
  // Retorna true si la ruta actual coincide con el link
  const isActive = (path: string) => pathname === path;

  // Estilos comunes para los links
  const linkStyle = {
    padding: '8px 16px',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
  };

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '10px' , marginBottom:'20px' , marginTop:'20px'}}>
      
      {/* 1. RESUMEN (Dashboard) */}
      <Link 
        href="/" 
        style={{ 
          ...linkStyle,
          color: isActive('/') ? 'white' : 'var(--text-muted)',
          backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        }}
      >
        Resumen
      </Link>

      {/* 2. MIS INSUMOS */}
      <Link 
        href="/products" 
        style={{ 
          ...linkStyle,
          color: isActive('/products') ? 'white' : 'var(--text-muted)',
          backgroundColor: isActive('/products') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        }}
      >
        Mis Insumos
      </Link>

      {/* 3. LIBRO DIARIO (Historial) */}
      <Link 
        href="/movements" 
        style={{ 
          ...linkStyle,
          color: isActive('/movements') ? 'white' : 'var(--text-muted)',
          backgroundColor: isActive('/movements') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        }}
      >
        Libro Diario
      </Link>

      {/* SEPARADOR VERTICAL SUTIL */}
      <div style={{ width: '1px', height: '24px', background: '#333', margin: '0 5px' }}></div>

      {/* 4. BOTÓN DE ACCIÓN (+ ANOTAR) 
          Este se ve diferente para invitar a la acción */}
      <Link 
        href="/movements/new" 
        style={{ 
          ...linkStyle,
          color: isActive('/movements/new') ? 'white' : 'var(--primary)', // Lavanda si no está activo
          border: `1px solid ${isActive('/movements/new') ? 'var(--primary)' : 'rgba(139, 92, 246, 0.3)'}`,
          backgroundColor: isActive('/movements/new') ? 'var(--primary)' : 'transparent',
          boxShadow: isActive('/movements/new') ? '0 0 10px rgba(139, 92, 246, 0.4)' : 'none'
        }}
      >
        + Anotar
      </Link>

    </nav>
  );
}