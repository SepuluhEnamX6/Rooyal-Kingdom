// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Royal Kingdom',
  description: '8 Souls, 1 Kingdom 👑',
  icons: { icon: '/uploads/logo-tanpa-bg.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
