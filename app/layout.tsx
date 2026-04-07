import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Vatika – Jai Kalubai | Plant a Tree, Celebrate Life',
  description:
    'Vatika is a non-profit tree donation and plantation tracking platform by Jai Kalubai. Plant trees for birthdays, anniversaries, memorials, and track their growth over time.',
  keywords: ['tree donation', 'plant a tree', 'Jai Kalubai', 'Vatika', 'environment', 'Maharashtra'],
  openGraph: {
    title: 'Vatika – Jai Kalubai | Plant a Tree, Celebrate Life',
    description: 'Rooted in Faith, Growing for Future 🌳 — Non-profit tree donation platform',
    url: 'https://vatika.jaikalubai.in',
    siteName: 'Vatika – Jai Kalubai',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vatika – Jai Kalubai',
    description: 'Plant a tree, celebrate life. Non-profit plantation tracking platform.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://vatika.jaikalubai.in'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
