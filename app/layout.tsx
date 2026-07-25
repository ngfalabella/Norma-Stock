import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from './components/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Norma Cakes · Control de stock',
  description: 'Sistema de gestión de inventario',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={inter.variable}><ClientLayout>{children}</ClientLayout></body>
    </html>
  );
}
