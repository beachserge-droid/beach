'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Absolute Header overlaying the background */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
        {/* Logo */}
        <Link href="/" className="pointer-events-auto bg-white/40 p-2 rounded-xl backdrop-blur-sm shadow-sm inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://www.selgebeachhotel.com/images/logo.jpg" 
            alt="Selge Beach Resort" 
            className="h-16 md:h-20 w-auto rounded mix-blend-multiply"
          />
        </Link>

        {/* Language Selector */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur rounded p-1 shadow-md border border-gray-100 flex items-center">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as 'tr' | 'en')}
            className="text-xs font-semibold text-gray-700 bg-transparent outline-none cursor-pointer pr-4 pl-1"
          >
            <option value="tr">🇹🇷 Türkçe / Turkish</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
      </header>
      
      {/* Main Content (booking pages will have their own backgrounds) */}
      <main className="flex-grow flex flex-col relative w-full">
        {children}
      </main>
    </div>
  );
}
