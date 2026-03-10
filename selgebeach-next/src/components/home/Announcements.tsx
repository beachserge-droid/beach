'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useLanguage } from '@/context/LanguageContext';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Announcements() {
  const { t, language } = useLanguage();

  const announcementsTR = [
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-erken-rezervasyon-66.webp',
      title: 'Erken Rezervasyon',
      desc: 'Ayrıcalıklı fiyatları kaçırmayın!',
    },
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-fatih-koca-konseri-19.webp',
      title: 'Fatih Koca Konseri',
      desc: '14-29 Temmuz 2026 / 12-26 Ağustos 2026',
    },
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-maher-zain-konseri-23.webp',
      title: 'Maher Zain Konseri',
      desc: '8-22 Temmuz 2026 / 5-19 Ağustos 2026',
    },
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-kurban-bayrami-28.webp',
      title: 'SPA',
      desc: 'Sakinleş, yenilen, parılda.',
    }
  ];

  const announcementsEN = [
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-erken-rezervasyon-66.webp',
      title: 'Early Booking',
      desc: 'Do not miss the exclusive prices!',
    },
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-fatih-koca-konseri-19.webp',
      title: 'Fatih Koca Concert',
      desc: '14-29 July 2026 / 12-26 August 2026',
    },
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-maher-zain-konseri-23.webp',
      title: 'Maher Zain Concert',
      desc: '8-22 July 2026 / 5-19 August 2026',
    },
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-kurban-bayrami-28.webp',
      title: 'SPA',
      desc: 'Relax, refresh, shine.',
    }
  ];

  const announcements = language === 'tr' ? announcementsTR : announcementsEN;

  return (
    <section className="section-pad bg-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-dark tracking-wider mb-4">
            {t('sec_announcements')}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-16 px-4 py-4"
        >
          {announcements.map((item, idx) => (
            <SwiperSlide key={idx} className="pb-12">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col mx-2 my-2">
                <div className="relative h-64 overflow-hidden">
                   <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${item.img}')` }} />
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-heading text-xl font-bold text-dark mb-3">{item.title}</h4>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed min-h-[40px] whitespace-pre-line">{item.desc}</p>
                  <button className="btn-outline">DETAY</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
