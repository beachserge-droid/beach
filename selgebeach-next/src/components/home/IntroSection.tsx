'use client';

import { useLanguage } from '@/context/LanguageContext';
export default function IntroSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-[#f6f4eb]">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Video Container */}
          <div className="relative aspect-video rounded-tr-[4rem] rounded-bl-[4rem] overflow-hidden shadow-2xl shadow-primary/20 border-8 border-white group">
            <iframe 
              src="https://www.youtube.com/embed/zEgBKH2nOUk?si=K0obd2sD9ZuFKLL" 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            ></iframe>
            <div className="absolute inset-0 border-2 border-primary/20 rounded-tr-[3.5rem] rounded-bl-[3.5rem] pointer-events-none" />
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold text-dark mb-2 leading-tight">
              {t('intro_title1')} <br />
              <span className="text-primary italic font-normal text-4xl lg:text-6xl mt-2 block">{t('intro_title2')}</span>
            </h2>
            
            <div className="w-20 h-1 bg-primary my-8 rounded-full" />
            
            <p className="text-gray-600 mb-6 leading-relaxed font-medium">
              {t('intro_p1')}
            </p>
            
            <p className="text-gray-600 mb-10 leading-relaxed">
              {t('intro_p2')}
            </p>
            
            <a 
              href="#" 
              className="inline-block border border-primary text-primary px-10 py-4 font-heading font-semibold tracking-widest hover:bg-primary hover:text-white transition-all duration-300 rounded"
            >
              {t('explore_hotel')}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
