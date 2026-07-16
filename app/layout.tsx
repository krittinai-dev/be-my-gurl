import type { Metadata, Viewport } from 'next';
import './globals.css';
import Hearts from './Hearts';

export const metadata: Metadata = {
  title: 'be my gurl 💕',
  description: 'อัลบั้มความทรงจำของเราสองคน',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <Hearts />
        {children}
      </body>
    </html>
  );
}
