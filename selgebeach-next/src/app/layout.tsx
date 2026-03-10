import type { Metadata } from 'next';
import { Jost, Playfair_Display } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import './globals.css';

const jost = Jost({ 
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600']
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: 'Selge Beach Resort & Spa | Premium Tatil Deneyimi',
  description: 'Selge Beach Resort resmi web sitesi. Doğanın huzurunu ve denizin serinliğini bir araya getiren muhafazakar bir tatil deneyimi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${jost.variable} ${playfair.variable} font-sans min-h-screen flex flex-col`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
