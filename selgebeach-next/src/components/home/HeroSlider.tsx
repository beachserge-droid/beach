'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { useLanguage } from '@/context/LanguageContext';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HeroSlider() {
  const { language } = useLanguage();

  const slidesContentTR = [
    '/sliders/tr/imgi_30_selge-beach-hotel-yenileniyoruz-99.webp',
    '/sliders/tr/imgi_31_selge-beach-hotel-erken-rezevasyon-104.webp',
    '/sliders/tr/imgi_27_selge-beach-hotel-maher-zain-tr-33.webp',
    '/sliders/tr/imgi_28_selge-beach-hotel-fatih-koca-tr.webp',
    '/sliders/tr/imgi_29_selge-beach-hotel-della-miles-tr.webp',
  ];

  const slidesContentEN = [
    '/sliders/en/imgi_30_selge-beach-hotel--101.webp',
    '/sliders/en/imgi_31_selge-beach-hotel--105.webp',
    '/sliders/en/imgi_27_selge-beach-hotel--98.webp',
    '/sliders/en/imgi_28_selge-beach-hotel-26.webp',
    '/sliders/en/imgi_29_selge-beach-hotel-28.webp',
  ];

  const slidesContent = language === 'tr' ? slidesContentTR : slidesContentEN;

  return (
    <div className="w-full">
      <div className="relative w-full h-[400px] md:h-[450px] lg:h-[550px]">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1500}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation
          loop
          className="w-full h-full"
        >
          {slidesContent.map((src, idx) => (
            <SwiperSlide key={idx} className="w-full h-full">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${src}')` }}
              />
              {/* Bottom gradient for contrast against the booking widget */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Booking Widget – pinned to bottom of slider, extends below */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[95%] max-w-5xl z-10">
          <BookingWidget />
        </div>
      </div>

      {/* Spacer so content below widget isn't hidden behind it */}
      <div className="h-24 md:h-16" />
    </div>
  );
}

function BookingWidget() {
  const router = useRouter();
  const { t } = useLanguage();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({
      checkIn,
      checkOut,
      adults,
      children,
    });
    router.push(`/booking?${q.toString()}`);
  };

  return (
    <div className="bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden">
      <form
        onSubmit={handleBooking}
        className="flex flex-col md:flex-row items-stretch"
      >
        {/* Check-in */}
        <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('check_in')}</label>
          <input
            type="date"
            required
            value={checkIn}
            onChange={e => {
              const newCheckIn = e.target.value;
              setCheckIn(newCheckIn);
              if (newCheckIn) {
                const nextDay = new Date(newCheckIn);
                nextDay.setDate(nextDay.getDate() + 1);
                setCheckOut(nextDay.toISOString().split('T')[0]);
              }
            }}
            className="w-full text-sm font-semibold text-dark bg-transparent outline-none cursor-pointer"
          />
        </div>

        {/* Check-out */}
        <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('check_out')}</label>
          <input
            type="date"
            required
            value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
            className="w-full text-sm font-semibold text-dark bg-transparent outline-none cursor-pointer"
          />
        </div>

        {/* Adults */}
        <div className="px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100 w-full md:w-32">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('adult')}</label>
          <select
            value={adults}
            onChange={e => setAdults(e.target.value)}
            className="w-full text-sm font-semibold text-dark bg-transparent outline-none cursor-pointer"
          >
            {[1, 2, 3, 4].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>

        {/* Children */}
        <div className="px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100 w-full md:w-32">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('child')}</label>
          <select
            value={children}
            onChange={e => setChildren(e.target.value)}
            className="w-full text-sm font-semibold text-dark bg-transparent outline-none cursor-pointer"
          >
            {[0, 1, 2, 3].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-[#ff9800] hover:bg-[#e68900] text-white px-8 py-4 font-bold text-sm tracking-widest uppercase transition-colors whitespace-nowrap"
        >
          {t('book_now')}
        </button>
      </form>
    </div>
  );
}
