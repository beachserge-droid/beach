'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useLanguage } from '@/context/LanguageContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function DiningSlider() {
  const { t, language } = useLanguage();

  const diningTR = [
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-teppanyaki-alakart.webp',
      title: 'Teppanyaki Alakart',
      desc: 'Gurme tatlarını deneyimlerken aynı zamanda şeflerimizin ustalığına tanık olacak, gözlerinizin önünde lezzet dolu bir şölen yaşayacaksınız.'
    },
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-indigo-alakart.webp',
      title: 'İndigo Alakart',
      desc: 'En taze ve en kaliteli etlerle hazırlanan lezzetlerimizde, her ısırıkta zengin aromaların dansını hissedeceksiniz.'
    },
    { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-turkuaz-alakart.webp', title: 'Turkuaz Alakart', desc: 'Otelimizin a’la carte restoranı, konuklarımıza kusursuz bir hizmet sunarak eşsiz lezzetlerin keyfini çıkarmalarını sağlar.' }
  ];

  const diningEN = [
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-teppanyaki-alakart.webp',
      title: "Teppanyaki A'La Carte",
      desc: 'While experiencing gourmet flavors, you will also witness the mastery of our chefs and experience a feast full of flavor right before your eyes.'
    },
    {
      img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-indigo-alakart.webp',
      title: "Indigo A'La Carte",
      desc: 'In our delicacies prepared with the freshest and highest quality meats, you will feel the dance of rich aromas in every bite.'
    },
    { img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-turkuaz-alakart.webp', title: "Turquoise A'La Carte", desc: "Our hotel's a la carte restaurant offers our guests impeccable service, allowing them to enjoy unique flavors." }
  ];

  const dining = language === 'tr' ? diningTR : diningEN;

  return (
    <section className="section-pad bg-light">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold tracking-wider text-dark mb-4">{t('sec_dining')}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-gray-600 leading-relaxed font-medium">
            {t('sec_dining_desc')}
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Navigation]}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          speed={1000}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          navigation
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 20 },
            1024: { slidesPerView: 1.5, spaceBetween: 30 },
          }}
          className="w-full"
        >
          {dining.map((rest, idx) => (
            <SwiperSlide key={idx} className="transition-transform duration-500 pb-10">
              {({ isActive }) => (
                <div 
                  className={`relative h-[550px] w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}
                >
                  {/* Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[8s] hover:scale-110"
                    style={{ backgroundImage: `url('${rest.img}')` }}
                  />
                  
                  {/* Fixed Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent p-10 flex flex-col justify-end text-center transition-all">
                    <h4 className="text-3xl lg:text-4xl font-heading font-extrabold text-white mb-3 drop-shadow-lg">
                      {rest.title}
                    </h4>
                    <p className="text-gray-200 mb-6 max-w-xl mx-auto drop-shadow-md font-medium">
                      {rest.desc}
                    </p>
                    <div>
                      <button className="btn-outline border-white text-white hover:bg-white hover:text-dark">
                        {t('booking_inspect_btn') || 'RESTORANI KEŞFET'}
                      </button>
                    </div>
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
