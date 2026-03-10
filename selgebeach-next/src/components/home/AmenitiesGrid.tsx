'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AmenitiesGrid() {
  const { t } = useLanguage();

  const amenities = [
    { text: t('amenity_ala_carte'), img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-alakartlar-86.webp', colSpan: false },
    { text: t('amenity_pools'), img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-havuzlar-24-90.webp', colSpan: true },
    { text: t('amenity_beach'), img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-plaj-34.webp', colSpan: false },
    { text: t('amenity_activities'), img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-aksam-sovlari-64.webp', colSpan: true },
    { text: t('amenity_spa'), img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-dinlenme-alani.webp', colSpan: false },
    { text: t('amenity_masjid'), img: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-baylar-mescit-67.webp', colSpan: false },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-dark uppercase tracking-widest mb-4">
            {t('sec_amenities')}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[2px] rounded-xl overflow-hidden aspect-[16/10] md:aspect-auto">
          {amenities.map((amenity, idx) => (
            <Link 
              href="#" 
              key={idx}
              className={`group relative overflow-hidden bg-gray-100 ${amenity.colSpan ? 'md:col-span-2' : ''} h-[200px] md:h-[250px] lg:h-[300px]`}
            >
              {/* Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${amenity.img}')` }}
              />
              
              {/* Overlay Base */}
              <div className="absolute inset-0 bg-dark/30 group-hover:bg-primary/70 transition-colors duration-500" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 lg:p-8">
                <h3 className="font-heading text-xl lg:text-2xl font-bold text-white tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {amenity.text}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
