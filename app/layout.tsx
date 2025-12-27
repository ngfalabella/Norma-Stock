import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import ClientLayout from './components/ClientLayout'; // <-- Importamos el nuevo envoltorio

// Configuración de fuentes
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'Pastelería Control',
  description: 'Sistema de gestión de stock',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${poppins.variable}`}>
        {/*
            Delegamos la tarea de mostrar/ocultar el menú 
            al ClientLayout
        */}
        <ClientLayout>
          {children}
        </ClientLayout>
        
      </body>
    </html>
  );
}