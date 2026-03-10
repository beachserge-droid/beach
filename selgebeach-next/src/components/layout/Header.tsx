'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Instagram, Facebook, MessageCircle, ChevronRight, CheckCircle2, CalendarDays, HeadphonesIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type MenuItem = {
  label: string;
  href: string;
  sections?: {
    title?: string;
    items: { label: string; href: string }[];
  }[];
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  const navData: MenuItem[] = [
    { label: t('nav_general'), href: '/about' },
    {
      label: t('nav_accommodation'),
      href: '/rooms',
      sections: [
        {
          items: [
            { label: "Jakuzi Suite Oda", href: "/rooms/jakuzi-suite-oda" },
            { label: "Deluxe Aile Odası Deniz Manzara", href: "/rooms/deluxe-aile-odasi-deniz-manzara" },
            { label: "Deluxe Oda Deniz Manzara", href: "/rooms/deluxe-oda-deniz-manzara" },
            { label: "Deluxe Aile Odası Kara Manzara", href: "/rooms/deluxe-aile-odasi-kara-manzara" },
            { label: "Deluxe Oda Kara Manzara", href: "/rooms/deluxe-oda-kara-manzara" },
            { label: "Standart Aile Odası Deniz Manzara", href: "/rooms/standart-aile-odasi-deniz-manzara" },
            { label: "Standart Oda Deniz Manzara", href: "/rooms/standart-oda-deniz-manzara" },
            { label: "Standart Aile Odası Kara Manzara", href: "/rooms/standart-aile-odasi-kara-manzara" },
            { label: "Standart Oda Kara Manzara", href: "/rooms/standart-oda-kara-manzara" },
          ]
        }
      ]
    },
    {
      label: t('nav_taste'),
      href: '/dining',
      sections: [
        {
          title: "Restoranlar",
          items: [
            { label: "Teppanyaki Alakart", href: "/dining/teppanyaki-alakart" },
            { label: "İndigo Alakart", href: "/dining/indigo-alakart" },
            { label: "Turkuaz Alakart", href: "/dining/turkuaz-alakart" },
            { label: "Ana Restoran", href: "/dining/ana-restoran" },
          ]
        },
        {
          title: "Kafeler & Pastane",
          items: [
            { label: "Pastane", href: "/dining/pastane" },
            { label: "Lobi Kafe", href: "/dining/lobi-kafe" },
            { label: "Havuz Kafe", href: "/dining/havuz-kafe" },
            { label: "Turkuaz Kafe", href: "/dining/turkuaz-kafe" },
            { label: "Garden Kafe", href: "/dining/garden-kafe" },
            { label: "Secret Garden Kafe", href: "/dining/secret-garden-kafe" },
            { label: "Osmanlı Teras Kafe", href: "/dining/osmanli-teras-kafe" },
            { label: "Kids Pool Kafe", href: "/dining/kids-pool-kafe" },
          ]
        }
      ]
    },
    {
      label: t('nav_women'),
      href: '/spa/women',
      sections: [
        { items: [
          { label: "Kadın Havuzları", href: "/pools/women" },
          { label: "Plaj", href: "/beach/women" },
          { label: "Güzellik Merkezi", href: "/spa/women/guzellik-merkezi" },
          { label: "Masaj", href: "/spa/women/masaj" },
          { label: "Jakuzi", href: "/spa/women/jakuzi" },
          { label: "Hamam", href: "/spa/women/hamam" },
          { label: "Sauna", href: "/spa/women/sauna" },
          { label: "Dinlenme Alanı", href: "/spa/women/dinlenme-alani" },
          { label: "Fitness Center", href: "/activities/fitness-women" },
          { label: "Mescit", href: "/amenities/mescit-women" },
        ]}
      ]
    },
    {
      label: t('nav_men'),
      href: '/spa/men',
      sections: [
        { items: [
          { label: "Erkek Havuzu", href: "/pools/men" },
          { label: "Plaj", href: "/beach/men" },
          { label: "Hamam", href: "/spa/men/hamam" },
          { label: "Sauna", href: "/spa/men/sauna" },
          { label: "Dinlenme Alanı", href: "/spa/men/dinlenme-alani" },
          { label: "Fitness Center", href: "/activities/fitness-men" },
          { label: "Mescit", href: "/amenities/mescit-men" },
        ]}
      ]
    },
    {
      label: t('nav_children'),
      href: '/activities/children',
      sections: [
        { items: [
          { label: "Çocuk Havuzları", href: "/pools/children" },
          { label: "Mini Kulüp", href: "/activities/mini-kulup" },
          { label: "Çocuk Aktiviteleri", href: "/activities/cocuk-aktiviteleri" },
          { label: "Çocuk Oyun Parkı", href: "/activities/oyun-parki" },
        ]}
      ]
    },
    { label: t('nav_honeymoon'), href: '/honeymoon' },
    {
      label: t('nav_activities'),
      href: '/activities',
      sections: [
        { items: [
          { label: "Akşam Şovları", href: "/activities/aksam-sovlari" },
          { label: "Gündüz Aktiviteleri", href: "/activities/gunduz-aktiviteleri" },
          { label: "Oyun Merkezi", href: "/activities/oyun-merkezi" },
          { label: "Aquapark", href: "/activities/aquapark" },
          { label: "Futbol", href: "/activities/futbol" },
          { label: "Tenis", href: "/activities/tenis" },
        ]}
      ]
    },
    { label: 'KONSERLER', href: '/concerts' },
    { label: 'TOPLANTI', href: '/meetings' },
  ];

  return (
    <header className="w-full z-50 sticky top-0 bg-white shadow-md transition-all duration-300">
      
      <div className="container-custom">
        {/* ── Top Row ── */}
        <div className="flex justify-between items-center py-2 relative min-h-[70px] md:h-24 border-b border-gray-100">
          
          {/* Left Side */}
          <div className="hidden lg:flex flex-1 items-center gap-6 text-[13px] font-semibold text-gray-700">
            <Link href="/booking" className="flex items-center gap-1.5 hover:text-[#1a6eb5] transition-colors">
              <CheckCircle2 size={16} className="text-gray-500" /> Online Check-in
            </Link>
            <Link href="/booking" className="flex items-center gap-1.5 hover:text-[#1a6eb5] transition-colors">
              <CalendarDays size={16} className="text-gray-500" /> Rezervasyon
            </Link>
          </div>

          {/* Center Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-10 top-2 h-[55px] md:h-[85px] transition-transform hover:scale-105">
            <img
              src="https://www.selgebeachhotel.com/images/logo.jpg"
              alt="Selge Beach Resort"
              className="h-full object-contain mix-blend-multiply drop-shadow-sm"
            />
          </Link>

          {/* Right Side */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-6 text-[13px] font-semibold text-gray-700">
            <a href="tel:4447261" className="flex items-center gap-2 hover:text-[#1a6eb5] transition-colors group">
              <HeadphonesIcon size={22} className="text-gray-600 group-hover:text-[#1a6eb5] transition-colors" />
              <div className="flex flex-col leading-[1.2]">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Call Center</span>
                <span className="text-[15px] font-black text-gray-800 group-hover:text-[#1a6eb5]">444 72 61</span>
              </div>
            </a>
            
            <div className="w-px h-8 bg-gray-200" />
            
            <div className="flex items-center gap-3">
              <a href="#" className="text-gray-600 hover:text-[#25D366] transition-colors"><MessageCircle size={18} /></a>
              <a href="#" className="text-gray-600 hover:text-[#E1306C] transition-colors"><Instagram size={18} /></a>
              <a href="#" className="text-gray-600 hover:text-[#1877F2] transition-colors"><Facebook size={18} /></a>
            </div>

            <div className="relative group ml-2">
              <button
                className="flex items-center gap-1 font-bold text-gray-800 hover:text-[#1a6eb5] transition-colors uppercase h-full py-2"
              >
                <img 
                  src={`https://flagcdn.com/w20/${language === 'en' ? 'gb' : language}.png`} 
                  alt={language} 
                  className="w-4 h-[11px] object-cover rounded-[1px] shadow-sm"
                />
                {language.toUpperCase()} <ChevronDown size={14} />
              </button>
              <div className="absolute top-full right-0 bg-white shadow-xl rounded-b-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col z-50 overflow-hidden min-w-[100px]">
                {(['tr', 'en', 'de', 'ru', 'fr'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-4 py-2.5 flex items-center gap-2 text-sm text-center hover:bg-gray-50 uppercase font-black transition-colors ${language === l ? 'text-[#1a6eb5] bg-blue-50/50' : 'text-gray-700'}`}
                  >
                    <img 
                      src={`https://flagcdn.com/w20/${l === 'en' ? 'gb' : l}.png`} 
                      alt={l} 
                      className="w-4 h-[11px] object-cover rounded-[1px] shadow-sm"
                    />
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded transition-colors text-gray-800 bg-gray-50 ml-auto z-20"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* ── Bottom Nav Row ── */}
        <nav className="hidden lg:flex justify-center items-center h-14 gap-1 xl:gap-4 relative">
          {navData.map((item) => (
            <div
              key={item.label}
              className="relative h-full flex items-center group"
              onMouseEnter={() => setActiveDesktopMenu(item.label)}
              onMouseLeave={() => setActiveDesktopMenu(null)}
            >
              <Link
                href={item.href}
                className={`flex items-center px-2 xl:px-3 h-full text-[10px] xl:text-[11px] font-black tracking-widest uppercase transition-colors ${
                  activeDesktopMenu === item.label || isActive(item.href) ? 'text-[#1a6eb5]' : 'text-[#444] hover:text-[#1a6eb5]'
                }`}
              >
                {item.label}
                {item.sections && <ChevronDown size={11} className="ml-1 mt-px opacity-70" />}
              </Link>

              {/* Mega Dropdown */}
              {item.sections && (
                <div
                  className={`absolute top-[100%] left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-b-xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top
                    ${activeDesktopMenu === item.label ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}
                  style={{ minWidth: item.sections.length > 1 ? '450px' : '260px', zIndex: 100 }}
                >
                  <div className="flex bg-white p-2">
                    {item.sections.map((section, idx) => (
                      <div key={idx} className="flex-1 p-4">
                        {section.title && <h3 className="text-[#1a6eb5] font-black text-[10px] uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">{section.title}</h3>}
                        <ul className="space-y-1.5 flex flex-col items-start min-w-[200px]">
                          {section.items.map((subItem) => (
                            <li key={subItem.label}>
                              <Link
                                href={subItem.href}
                                className="text-[12px] font-semibold text-gray-600 hover:text-[#1a6eb5] hover:translate-x-1 inline-block transition-transform whitespace-nowrap py-1"
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* ── Mobile Overlay Drawer ── */}
      <div className={`fixed inset-0 bg-[#1a6eb5]/95 backdrop-blur-md z-50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 delay-100 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#f8fbff]">
            <img src="https://www.selgebeachhotel.com/images/logo.jpg" alt="Logo" className="h-[40px]" />
            <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <Link href="/booking" onClick={() => setMobileMenuOpen(false)} className="w-full bg-[#ff9800] text-white text-center py-3.5 rounded-xl font-black text-sm mb-6 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
              HEMEN REZERVASYON YAP
            </Link>

            <ul className="space-y-1">
              {navData.map((item) => (
                <li key={item.label} className="border-b border-gray-50 last:border-0">
                  <div className="flex items-center justify-between w-full">
                    <Link
                      href={item.sections ? '#' : item.href}
                      onClick={(e) => {
                        if (item.sections) {
                          e.preventDefault();
                          setActiveMobileMenu(activeMobileMenu === item.label ? null : item.label);
                        } else {
                          setMobileMenuOpen(false);
                        }
                      }}
                      className="flex-1 py-3.5 text-[13px] font-bold text-gray-800 uppercase tracking-wide flex items-center justify-between"
                    >
                      {item.label}
                      {item.sections && (
                        <ChevronDown size={14} className={`text-[#1a6eb5] transition-transform ${activeMobileMenu === item.label ? 'rotate-180' : ''}`} />
                      )}
                    </Link>
                  </div>
                  {item.sections && (
                    <div className={`overflow-hidden transition-all duration-300 ${activeMobileMenu === item.label ? 'max-h-[800px] pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="bg-[#f8f9fa] rounded-xl p-3 border border-gray-100 space-y-4">
                        {item.sections.map((sec, i) => (
                          <div key={i}>
                            {sec.title && <div className="text-[10px] font-black text-[#1a6eb5] mb-2 uppercase tracking-wideset pl-2">{sec.title}</div>}
                            <ul className="space-y-1">
                              {sec.items.map(subItem => (
                                <li key={subItem.label}>
                                  <Link href={subItem.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-blue-600 px-2 py-1.5 transition-colors">
                                    <ChevronRight size={10} className="text-gray-300"/> {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
