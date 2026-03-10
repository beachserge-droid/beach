'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Facebook, Instagram, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container-custom">
        {/* Awards Section */}
        <div className="mb-12 pb-12 border-b border-gray-100">
          <h4 className="text-center text-[#1a6eb5] text-sm font-bold tracking-widest uppercase mb-8">ÖDÜLLERİMİZ VE SERTİFİKALARIMIZ</h4>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { img: 'https://www.selgebeachhotel.com/Photos/selge-beach-hotel-halal-booking-2024-misafir-memnuniyet-sertifikasi-55.webp', title: 'Halal Booking 2025' },
              { img: 'https://www.selgebeachhotel.com/Photos/selge-beach-hotel-tatilbudur-2024-parlayan-yildiz-memnuniyet-odulu-56.webp', title: 'TatilBudur 2024' },
              { img: 'https://www.selgebeachhotel.com/Photos/selge-beach-hotel-2021-trip-advisor-winner-3.webp', title: 'Trip Advisor Winner' },
            ].map((award, idx) => (
              <div key={idx} className="text-center">
                <img 
                  src={award.img} 
                  alt={award.title} 
                  className="h-24 object-contain mx-auto grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-gray-100">
          
          {/* Col 1 - About */}
          <div>
            <img
              src="https://www.selgebeachhotel.com/images/logo.jpg"
              alt="Selge Beach Resort"
              className="h-12 object-contain mb-4"
            />
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Selge Beach Resort & Spa, Antalya'nın Side bölgesinde denize sıfır konumuyla huzurlu bir tatil deneyimi sunar.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-[#1a6eb5] text-white flex items-center justify-center hover:bg-[#155a9a] transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#E1306C] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <Instagram size={16} />
              </a>
            </div>
          </div>
          
          {/* Col 2 - Quick Links */}
          <div>
            <h4 className="text-gray-900 text-sm font-bold tracking-widest uppercase mb-5">KURUMSAL</h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Hakkımızda', href: '/about' },
                { label: 'Odalar', href: '/rooms/jakuzi-suite-oda' },
                { label: 'Restoranlar', href: '/dining/ana-restoran' },
                { label: 'Spa', href: '/spa/women/kadin-havuzlari' },
                { label: 'Aktiviteler', href: '/activities/aksam-sovlari' },
                { label: 'Kariyer', href: '/career' },
              ].map((linkItem) => (
                <li key={linkItem.label}>
                  <Link href={linkItem.href} className="text-gray-500 text-sm hover:text-[#1a6eb5] transition-colors">
                    {linkItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Col 3 - Legal */}
          <div>
            <h4 className="text-gray-900 text-sm font-bold tracking-widest uppercase mb-5">YASAL</h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'KVKK', href: '/kvkk' },
                { label: 'Bilgi Güvenliği', href: '/security' },
                { label: 'Sertifikalar', href: '/certificates' },
                { label: 'Sürdürülebilirlik', href: '/sustainability' },
                { label: 'Factsheet', href: '/factsheet' },
              ].map((linkItem) => (
                <li key={linkItem.label}>
                  <Link href={linkItem.href} className="text-gray-500 text-sm hover:text-[#1a6eb5] transition-colors">
                    {linkItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Contact */}
          <div>
            <h4 className="text-gray-900 text-sm font-bold tracking-widest uppercase mb-5">İLETİŞİM</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#1a6eb5] mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">
                  Side Mah. 1132 Sok. No:1<br />
                  Manavgat / Antalya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#1a6eb5] flex-shrink-0" />
                <span className="text-gray-500 text-sm">444 72 61</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#1a6eb5] flex-shrink-0" />
                <span className="text-gray-500 text-sm">info@selgebeachhotel.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs text-center md:text-left">
            © 2024 Selge Beach Resort. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4 items-center">
            <img src="https://www.selgebeachhotel.com/Photos/selge-beach-hotel-ta-8.webp" alt="TA" className="h-6 grayscale opacity-50" />
            <img src="https://www.selgebeachhotel.com/Photos/selge-beach-hotel-hc-10.webp" alt="HC" className="h-6 grayscale opacity-50" />
            <img src="https://www.selgebeachhotel.com/Photos/selge-beach-hotel-op-11.webp" alt="OP" className="h-6 grayscale opacity-50" />
          </div>
        </div>
      </div>
      
      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/905520489983" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </a>
    </footer>
  );
}
