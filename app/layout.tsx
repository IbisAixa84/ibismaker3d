import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IbisMaker 3D',
  description: 'Diseños personalizados e impresión 3D para eventos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
