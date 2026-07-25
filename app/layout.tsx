import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from './components/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Moka Pastelería · Control de stock',
  description: 'Sistema de gestión de inventario',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var theme = localStorage.getItem('norma-stock-theme');
            document.documentElement.dataset.theme =
              theme === 'light' || theme === 'wine' ? theme : 'dark';
          } catch (_) {
            document.documentElement.dataset.theme = 'dark';
          }
        ` }} />
      </head>
      <body className={inter.variable}><ClientLayout>{children}</ClientLayout></body>
    </html>
  );
}
