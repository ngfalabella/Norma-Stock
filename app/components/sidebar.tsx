'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import ThemeSelector from './ThemeSelector';

const navItems = [
  { href: '/', label: 'Resumen', icon: '📊' },
  { href: '/products', label: 'Productos', icon: '📦' },
  { href: '/movements', label: 'Movimientos', icon: '📋' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const logout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="sidebar" aria-label="Navegación principal">
      <Link href="/" className="brand" aria-label="Moka Pastelería, ir al resumen">
        <Image src="/moka-logo.png" width={44} height={44} alt="" className="brand-logo" priority />
        <span className="brand-copy"><strong>Moka Pastelería</strong><small>Control de stock</small></span>
      </Link>

      <nav className="main-nav">
        <span className="nav-caption">Gestión</span>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
            aria-current={isActive(item.href) ? 'page' : undefined}>
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
        <span className="nav-caption nav-caption-actions">Acciones</span>
        <Link href="/movements/new" className={`nav-link nav-action ${pathname === '/movements/new' ? 'active' : ''}`}>
          <span className="nav-icon" aria-hidden="true">📝</span>
          <span className="nav-label">Registrar movimiento</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <ThemeSelector />
        <button className="logout-button" onClick={logout}>
          <span className="nav-icon" aria-hidden="true">🚪</span>
          <span className="nav-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
