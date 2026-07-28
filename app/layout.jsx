import './globals.css';
import { ThemeProvider } from '@/lib/ThemeContext';

export const metadata = {
  title: 'BMT Maslahah - Syariah Menjadikan Berkah',
  description: 'Koperasi syariah yang amanah dan profesional dalam mengelola keuangan untuk meningkatkan kesejahteraan anggota dan masyarakat.',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
