'use client';

import { useState, useEffect } from 'react';
import { X, CalendarDays, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Check if the user has seen the promo in this session
    const hasSeenPromo = sessionStorage.getItem('selge_promo_seen');
    
    // Check if language was just changed (we can use an event or just show it once per session)
    // For demo/aggresive marketing purposes, we show it if they haven't seen it this session.
    if (!hasSeenPromo) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      // Wait for 3 seconds of browsing
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [language]); // Show it again if they change language? No, sessionStorage prevents it. Actually, the user asked "her dil için oluşturulmuş şık kullanıcı dil seçtiğinde o pop ap gelsin". Let's show it when language changes or on first visit!

  useEffect(() => {
     // Re-trigger if language changes, maybe? Let's just use localStorage with a timestamp to not annoy too much, or sessionStorage.
     // For this request: "kullanıcı dil seçtiğinde o pop ap gelsin", we will show it whenever language changes AND on first load.
     setIsOpen(true);
  }, [language]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('selge_promo_seen', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal Window */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform scale-100 transition-transform animate-[modal-pop_0.4s_ease-out]">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 hover:bg-white hover:text-black hover:rotate-90 transition-all duration-300"
        >
          <X size={24} />
        </button>

        {/* Left Side: Image */}
        <div className="md:w-1/2 relative h-[250px] md:h-auto overflow-hidden group">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: "url('/bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white text-shadow-md">
            <div className="inline-flex items-center gap-2 bg-[#ff9800] text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-3 shadow-lg">
              <CalendarDays size={16} /> 2026 Season
            </div>
            <h3 className="text-3xl font-black leading-tight drop-shadow-xl border-l-4 border-[#ff9800] pl-4">
              Premium<br/>Ultra All Inclusive
            </h3>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-[#f8fbff] to-white">
          <div className="mb-2 uppercase tracking-widest text-[#1a6eb5] font-bold text-sm flex items-center gap-2">
            <span className="w-8 h-0.5 bg-[#1a6eb5] inline-block" />
            Special Offer
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
            {t('promo_title') || 'Yaza Özel Erken Rezervasyon Fırsatı!'}
          </h2>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {t('promo_desc') || '2 ay sonrası için şimdiden yerinizi ayırtın, Selge Beach ayrıcalıklarını %35\'e varan indirimlerle yaşayın.'}
          </p>

          <div className="space-y-4">
            <Link 
              href="/booking" 
              onClick={handleClose}
              className="group flex items-center justify-center gap-3 w-full bg-[#ff9800] text-white py-4 rounded-xl font-bold text-lg transition-all hover:bg-[#e68900] shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1"
            >
              {t('promo_btn') || 'Fiyatları İncele'}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button 
              onClick={handleClose}
              className="w-full py-3 text-gray-500 font-medium hover:text-gray-800 transition-colors"
            >
              {language === 'tr' ? 'Belki daha sonra' : language === 'en' ? 'Maybe later' : language === 'de' ? 'Vielleicht später' : language === 'ru' ? 'Может быть позже' : 'Peut-être plus tard'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
