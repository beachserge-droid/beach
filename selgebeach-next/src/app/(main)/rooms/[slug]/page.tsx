'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { ROOMS_TR, ROOMS_EN } from '@/data/rooms';
import { Users, Wifi, Wind, Tv, Check, ArrowLeft, Bed, Maximize, Ruler, Shield, Coffee } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function RoomPageClient({ params }: Props) {
  const resolvedParams = use(params);
  const { language, t } = useLanguage();

  const ROOMS = language === 'tr' ? ROOMS_TR : ROOMS_EN;
  const room = ROOMS.find(r => r.slug === resolvedParams.slug);

  if (!room) {
    notFound();
  }

  // Define dynamic icons to map our rich features list
  const getIconForFeature = (feature: string) => {
    const f = feature.toLowerCase();
    if (f.includes('wifi')) return <Wifi className="w-5 h-5" />;
    if (f.includes('klima') || f.includes('air')) return <Wind className="w-5 h-5" />;
    if (f.includes('tv')) return <Tv className="w-5 h-5" />;
    if (f.includes('manzara') || f.includes('view')) return <Maximize className="w-5 h-5" />;
    if (f.includes('emanet') || f.includes('safe')) return <Shield className="w-5 h-5" />;
    if (f.includes('çay') || f.includes('tea') || f.includes('kahve') || f.includes('coffee') || f.includes('minibar')) return <Coffee className="w-5 h-5" />;
    if (f.includes('oda') || f.includes('room') || f.includes('yatak') || f.includes('bed')) return <Bed className="w-5 h-5" />;
    return <Check className="w-5 h-5" />;
  };

  const isTr = language === 'tr';

  return (
    <div className="min-h-screen bg-[#f8fbff] pb-24">
      {/* ─── Modern Hero Header ─── */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${room.img}')` }}
        />
        {/* Soft dark gradient mask for text readability */}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4 container-custom">
          
          {/* Breadcrumb over hero */}
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-6 drop-shadow-md z-10 animate-[fade-in-up_0.6s_ease-out_forwards]">
            <Link href="/" className="hover:text-white transition-colors">{isTr ? 'Ana Sayfa' : 'Home'}</Link>
            <span>/</span>
            <Link href="/rooms" className="hover:text-white transition-colors">{isTr ? 'Konaklama' : 'Accommodation'}</Link>
            <span>/</span>
            <span className="text-white font-medium">{room.title}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-xl animate-[fade-in-up_0.8s_ease-out_forwards]">
            {room.title}
          </h1>
        </div>
      </div>

      <div className="container-custom mt-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Detailed Description */}
            <div className="bg-white rounded-3xl p-8 xl:p-10 shadow-xl shadow-blue-900/5 border border-gray-100">
              <h2 className="text-2xl font-black text-[#1a6eb5] mb-6">{isTr ? 'Oda Hakkında' : 'About the Room'}</h2>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                {room.desc}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="text-center p-4 bg-[#f8fbff] rounded-2xl">
                  <Ruler className="w-8 h-8 mx-auto text-[#ff9800] mb-2" />
                  <p className="text-sm text-gray-500 font-semibold mb-1">{isTr ? 'Büyüklük' : 'Size'}</p>
                  <p className="font-bold text-gray-800">{room.size}</p>
                </div>
                <div className="text-center p-4 bg-[#f8fbff] rounded-2xl">
                  <Users className="w-8 h-8 mx-auto text-[#ff9800] mb-2" />
                  <p className="text-sm text-gray-500 font-semibold mb-1">{isTr ? 'Kapasite' : 'Capacity'}</p>
                  <p className="font-bold text-gray-800">{room.capacity} {isTr ? 'Kişi' : 'Pax'}</p>
                </div>
                <div className="text-center p-4 bg-[#f8fbff] rounded-2xl">
                  <Bed className="w-8 h-8 mx-auto text-[#ff9800] mb-2" />
                  <p className="text-sm text-gray-500 font-semibold mb-1">{isTr ? 'Yatak Tipi' : 'Bed Type'}</p>
                  <p className="font-bold text-gray-800 text-xs leading-tight mt-1">{room.bedType}</p>
                </div>
                <div className="text-center p-4 bg-[#f8fbff] rounded-2xl">
                  <Maximize className="w-8 h-8 mx-auto text-[#ff9800] mb-2" />
                  <p className="text-sm text-gray-500 font-semibold mb-1">{isTr ? 'Manzara' : 'View'}</p>
                  <p className="font-bold text-gray-800">{room.view}</p>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="bg-white rounded-3xl p-8 xl:p-10 shadow-xl shadow-blue-900/5 border border-gray-100">
              <h2 className="text-2xl font-black text-[#1a6eb5] mb-8">{isTr ? 'Oda Özellikleri' : 'Room Features'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {room.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors text-[#ff9800]">
                      {getIconForFeature(feature)}
                    </div>
                    <span className="text-gray-700 font-bold text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="bg-white rounded-3xl p-8 xl:p-10 shadow-xl shadow-blue-900/5 border border-gray-100">
              <h2 className="text-2xl font-black text-[#1a6eb5] mb-8">{isTr ? 'Fotoğraf Galerisi' : 'Photo Gallery'}</h2>
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${room.gallery.length > 2 ? 'md:grid-cols-3' : ''} gap-4`}>
                {room.gallery.map((img, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-md cursor-pointer">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${img}')` }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Booking Widget Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 flex flex-col items-center">
              
              <div className="text-center w-full pb-6 border-b border-gray-100 mb-6">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {isTr ? 'Gecelik Başlangıç' : 'Starting From'}
                </p>
                <div className="flex justify-center items-start gap-1 text-[#ff9800]">
                  <span className="text-2xl font-bold mt-1">₺</span>
                  <span className="text-5xl font-black tracking-tight">{room.basePrice.toLocaleString('tr-TR')}</span>
                </div>
                <p className="text-[11px] font-bold text-gray-400 mt-2 uppercase tracking-wider">
                  {isTr ? 'Alkolsüz Ultra Her Şey Dahil' : 'Non-Alcoholic Ultra All Incl.'}
                </p>
              </div>

              <div className="w-full space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 font-semibold">{isTr ? 'Online Rezervasyon İndirimi' : 'Online Booking Discount'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 font-semibold">{isTr ? 'Ücretsiz Wi-Fi & Otopark' : 'Free Wi-Fi & Parking'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 font-semibold">{isTr ? 'Şartsız İptal Güvencesi' : 'Free Cancellation Guarantee'}</span>
                </div>
              </div>

              <Link
                href={`/booking?roomId=${room.id}&roomName=${room.title}`}
                className="w-full bg-[#1a6eb5] hover:bg-[#155993] hover:-translate-y-1 shadow-lg shadow-blue-900/20 text-white text-center py-4 rounded-xl font-black tracking-wider uppercase transition-all"
              >
                {t('book_now')}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
