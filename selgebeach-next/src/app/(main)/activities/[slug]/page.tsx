import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Calendar, Users, Check } from 'lucide-react';
import scrapedData from '@/data/scraped_content.json';

interface Props {
  params: Promise<{ slug: string }>;
}

const ACTIVITIES = {
  'aksam-sovlari': {
    title: 'Akşam Şovları',
    desc: 'Her akşam canlı müzik, dans gösterileri ve eğlence programlarıyla unutulmaz geceler.',
    hours: '21:00 - 23:30',
    location: 'Amfi Tiyatro / Havuz Başı',
    features: ['Canlı Müzik', 'Dans Gösterileri', 'Animasyon', 'Tema Geceleri'],
    schedule: ['Pazartesi: Türk Gecesi', 'Salı: Jazz Night', 'Çarşamba: Latin Gecesi', 'Perşembe: Disko', 'Cuma: Özel Konser', 'Cumartesi: Gala Gecesi', 'Pazar: Karaoke'],
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-aksam-sov-90.webp',
  },
  'gunduz-aktiviteleri': {
    title: 'Gündüz Aktiviteleri',
    desc: 'Havuz oyunları, plaj voleybolu, su aerobik ve daha fazlası.',
    hours: '10:00 - 17:00',
    location: 'Havuz & Plaj Alanı',
    features: ['Su Oyunları', 'Voleybol', 'Dart', 'Su Aerobik', 'Yoga'],
    schedule: ['10:00 Havuz Oyunları', '11:00 Su Aerobik', '14:00 Plaj Voleybolu', '15:00 Dart Turnuvası', '16:00 Yoga'],
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-gunduz-aktivite-91.webp',
  },
  'oyun-merkezi': {
    title: 'Oyun Merkezi',
    desc: 'Bilardo, masa tenisi, air hockey ve video oyunları.',
    hours: '10:00 - 23:00',
    location: 'Lobi Altı',
    features: ['Bilardo', 'Masa Tenisi', 'Air Hockey', 'PlayStation', 'Xbox'],
    schedule: [],
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-oyun-merkezi-92.webp',
  },
  'aquapark': {
    title: 'Aquapark',
    desc: 'Çocuklar ve yetişkinler için su kaydırakları ve havuzlar.',
    hours: '10:00 - 18:00',
    location: 'Aquapark Alanı',
    features: ['Su Kaydırakları', 'Çocuk Havuzu', 'Lazy River', 'Dalga Havuzu'],
    schedule: [],
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-aquapark-93.webp',
  },
  'futbol': {
    title: 'Futbol',
    desc: 'Plaj futbolu sahamız ve turnuvalar.',
    hours: '09:00 - 19:00',
    location: 'Plaj Futbol Sahası',
    features: ['Plaj Futbolu', 'Turnuvalar', 'Ekipman Kiralama'],
    schedule: ['Pazartesi: Turist Turnuvası', 'Perşembe: Çocuk Turnuvası'],
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-futbol-94.webp',
  },
  'tenis': {
    title: 'Tenis',
    desc: 'Profesyonel tenis kortları ve dersler.',
    hours: '08:00 - 20:00',
    location: 'Tenis Kortları',
    features: ['2 Açık Kort', 'Ekipman Kiralama', 'Özel Ders', 'Turnuvalar'],
    schedule: ['Ücretli hizmet', 'Rezervasyon gerekli'],
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-tenis-95.webp',
  },
};

// Also inject missing activities from scraped data
Object.keys(scrapedData).forEach(slug => {
  if (['mini-kulup', 'cocuk-aktiviteleri', 'oyun-merkezi-', 'cocuk-oyun-parki'].includes(slug)) {
    if (!ACTIVITIES[slug as keyof typeof ACTIVITIES]) {
      // @ts-ignore
      ACTIVITIES[slug as keyof typeof ACTIVITIES] = {
        title: scrapedData[slug as keyof typeof scrapedData].title || slug.replace('-', ' '),
        desc: scrapedData[slug as keyof typeof scrapedData].content,
        hours: 'Gün Boyu',
        location: 'Tesis İçi',
        features: [],
        schedule: [],
        image: scrapedData[slug as keyof typeof scrapedData].image || 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-otel-hakkinda-91.webp'
      };
    }
  }
});

export async function generateStaticParams() {
  return Object.keys(ACTIVITIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const activity = ACTIVITIES[slug as keyof typeof ACTIVITIES];
  
  if (!activity) {
    return { title: 'Aktivite | Selge Beach Resort' };
  }
  
  return {
    title: `${activity.title} | Aktiviteler | Selge Beach Resort`,
    description: activity.desc.substring(0, 150),
  };
}

export default async function ActivityPage({ params }: Props) {
  const { slug } = await params;
  
  const activity = ACTIVITIES[slug as keyof typeof ACTIVITIES];
  const scraped = scrapedData[slug as keyof typeof scrapedData] as { title?: string, content?: string, image?: string } | undefined;
  
  if (!activity && !scraped) {
    notFound();
  }

  const title = activity?.title || scraped?.title || 'Aktivite';
  const desc = scraped?.content || activity?.desc || '';
  const image = scraped?.image && !scraped.image.includes('logo.svg') ? scraped.image : (activity?.image || 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-otel-hakkinda-91.webp');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/activities" className="hover:text-primary transition-colors">Aktiviteler</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{title}</span>
          </div>
        </div>
      </div>

      <div className="relative h-[300px] lg:h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="container-custom">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{title}</h1>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm mb-12">
           <h2 className="text-2xl font-bold mb-4 text-primary">Hakkında</h2>
           <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap">
             {desc}
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Clock className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-gray-500">Saatler</p>
            <p className="text-lg font-bold">{activity.hours}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <MapPin className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-gray-500">Konum</p>
            <p className="text-lg font-bold">{activity.location}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Users className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-gray-500">Katılım</p>
            <p className="text-lg font-bold">Tüm Misafirler</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Özellikler</h2>
            <div className="flex flex-wrap gap-2">
              {activity.features.map((f, i) => (
                <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {activity.schedule.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Program
              </h2>
              <ul className="space-y-2">
                {activity.schedule.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
