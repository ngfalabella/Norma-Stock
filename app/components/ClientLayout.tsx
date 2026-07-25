'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') return <main className="login-shell">{children}</main>;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}
