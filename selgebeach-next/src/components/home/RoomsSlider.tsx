'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const roomsTR = [
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-jakuzi-suite-oda-23.webp', title: 'Jakuzi Suite Oda', desc: 'Suit odalarımız, sizi lüksün kollarına alır, konforun yumuşaklığıyla sarar.' },
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-deluxe-aile-odasi-deniz-manzara-22.webp', title: 'Deluxe Aile Odası Deniz Manzara', desc: 'Denizin kucakladığı manzarasıyla göz kamaştıran odamız.' },
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-deluxe-oda-deniz-manzara-20.webp', title: 'Deluxe Oda Deniz Manzaralı', desc: 'Eşsiz zarafeti ve Akdeniz´in büyüleyici manzarası.' },
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-deluxe-aile-odasi-kara-manzara-21.webp', title: 'Deluxe Aile Odası Kara Manzara', desc: 'Ailenizle birlikte konfor ve sadeliğin tadını çıkarın.' },
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-deluxe-oda-kara-manzara-19.webp', title: 'Deluxe Oda Kara Manzara', desc: 'Huzur ve konforun birleştiği nokta.' },
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-standart-aile-odasi-deniz-manzara-18.webp', title: 'Standart Aile Odası Deniz Manzara', desc: 'Aileniz için ideal ve ferah ortam.' },
];

const roomsEN = [
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-jakuzi-suite-oda-23.webp', title: 'Jacuzzi Suite Room', desc: 'Our suite rooms embrace you in the arms of luxury, wrap you in the softness of comfort.' },
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-deluxe-aile-odasi-deniz-manzara-22.webp', title: 'Deluxe Family Room Sea View', desc: 'Our room, dazzling with its sea-embraced view.' },
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-deluxe-oda-deniz-manzara-20.webp', title: 'Deluxe Room Sea View', desc: 'Combining unique elegance with the enchanting view of the Mediterranean.' },
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-deluxe-aile-odasi-kara-manzara-21.webp', title: 'Deluxe Family Room Land View', desc: 'Enjoy comfort and simplicity with your family.' },
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-deluxe-oda-kara-manzara-19.webp', title: 'Deluxe Room Land View', desc: 'Where peace and comfort meet.' },
  { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-standart-aile-odasi-deniz-manzara-18.webp', title: 'Standard Family Room Sea View', desc: 'Ideal and spacious environment for your family.' },
];

export default function RoomsSlider() {
  const { t, language } = useLanguage();
  const currentRooms = language === 'tr' ? roomsTR : roomsEN;

  return (
    <section className="section-pad">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold tracking-wider text-dark mb-4">{t('sec_rooms')}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-gray-600 leading-relaxed font-medium">
            {t('sec_rooms_desc')}
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          speed={1000}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 20 },
            1024: { slidesPerView: 1.5, spaceBetween: 30 },
          }}
          className="w-full"
        >
          {currentRooms.map((room, idx) => (
            <SwiperSlide key={idx} className="transition-transform duration-500 pb-10">
              {({ isActive }) => (
                <div 
                  className={`relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
                    style={{ backgroundImage: `url('${room.img}')` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12 text-center items-center group">
                    <h4 className="text-3xl md:text-5xl font-heading text-white mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {room.title}
                    </h4>
                    <p className="text-gray-200 md:text-lg mb-8 max-w-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {room.desc}
                    </p>
                    <button className="btn-primary opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                      {t('booking_inspect_btn')}
                    </button>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
