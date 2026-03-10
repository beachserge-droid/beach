import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, Square, Check, Wifi, Projector, Mic, Coffee } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

const MEETINGS = {
  'selge-salon': {
    title: 'Selge Salon',
    desc: '800 kişi kapasiteli, son teknoloji donanımlı büyük toplantı ve kongre salonumuz. Düğün, kongre, gala ve büyük organizasyonlar için ideal.',
    capacity: 800,
    area: 1200,
    features: ['Projeksiyon', 'Ses Sistemi', 'Klima', 'WiFi', 'Simultane Tercüme', 'Kürsü', 'Sahne'],
    equipment: ['4K Projektör', 'Kablosuz Mikrofon', 'Spot Işıkları', 'Flipchart', 'Whiteboard'],
    services: ['Kahve Arası', 'Öğle Yemeği', 'Kokteyl', 'Gala Yemeği'],
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-selge-salon-100.webp',
  },
  'side-salon': {
    title: 'Side Salon',
    desc: '200 kişi kapasiteli, daha küçük toplantılar, seminerler ve workshoplar için ideal salon.',
    capacity: 200,
    area: 300,
    features: ['Projeksiyon', 'Ses Sistemi', 'Klima', 'WiFi', 'Kürsü'],
    equipment: ['Projektör', 'Mikrofon', 'Flipchart', 'Whiteboard'],
    services: ['Kahve Arası', 'Öğle Yemeği', 'Kokteyl'],
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-side-salon-101.webp',
  },
};

export async function generateStaticParams() {
  return Object.keys(MEETINGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meeting = MEETINGS[slug as keyof typeof MEETINGS];
  
  if (!meeting) {
    return { title: 'Toplantı Salonu | Selge Beach Resort' };
  }
  
  return {
    title: `${meeting.title} | Toplantı & Kongre | Selge Beach Resort`,
    description: meeting.desc,
  };
}

export default async function MeetingPage({ params }: Props) {
  const { slug } = await params;
  
  const meeting = MEETINGS[slug as keyof typeof MEETINGS];
  
  if (!meeting) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/meetings" className="hover:text-primary transition-colors">Toplantı</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{meeting.title}</span>
          </div>
        </div>
      </div>

      <div className="relative h-[300px] lg:h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={meeting.image} alt={meeting.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="container-custom">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{meeting.title}</h1>
            <p className="text-white/90 text-lg max-w-2xl">{meeting.desc}</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <Users className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-3xl font-bold">{meeting.capacity}</p>
            <p className="text-sm text-gray-500">Kişi Kapasitesi</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <Square className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-3xl font-bold">{meeting.area} m²</p>
            <p className="text-sm text-gray-500">Alan</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <Wifi className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-lg font-bold">Ücretsiz</p>
            <p className="text-sm text-gray-500">Yüksek Hızlı WiFi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Projector className="w-5 h-5 text-primary" />
                Özellikler
              </h2>
              <div className="flex flex-wrap gap-2">
                {meeting.features.map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary" />
                Teknik Ekipman
              </h2>
              <ul className="grid grid-cols-2 gap-3">
                {meeting.equipment.map((e, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-primary" />
                Catering Seçenekleri
              </h2>
              <ul className="space-y-2">
                {meeting.services.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary text-white rounded-xl p-6">
              <h3 className="font-bold mb-2">Teklif Alın</h3>
              <p className="text-sm mb-4">Toplantı ve organizasyonlarınız için özel fiyat teklifi alın.</p>
              <a href="tel:4447261" className="block w-full bg-white text-primary text-center py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                444 72 61
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
