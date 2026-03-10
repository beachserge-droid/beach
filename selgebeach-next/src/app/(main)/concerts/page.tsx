import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Music, Calendar, Users, Mic2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Konserler & Etkinlikler | Selge Beach Resort',
  description: 'Selge Beach Resort\'ta düzenlenen canlı konserler, etkinlikler ve özel gösteriler.',
};

const CONCERTS = [
  {
    date: '15 Haziran 2025',
    artist: 'Maher Zain',
    type: 'Konser',
    location: 'Amfi Tiyatro',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-maher-zain-110.webp',
  },
  {
    date: '22 Temmuz 2025',
    artist: 'Sami Yusuf',
    type: 'Konser',
    location: 'Amfi Tiyatro',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-sami-yusuf-111.webp',
  },
  {
    date: 'Her Cuma',
    artist: 'Canlı Müzik',
    type: 'Gala Gecesi',
    location: 'Havuz Başı',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-canli-muzik-112.webp',
  },
];

export default function ConcertsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Konserler</span>
          </div>
        </div>
      </div>

      <div className="relative h-[300px] lg:h-[400px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <Music className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Konserler & Etkinlikler</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Unutulmaz yaz geceleri için düzenlediğimiz özel konserler ve etkinlikler
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONCERTS.map((concert, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="h-48 bg-gray-200 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={concert.image} alt={concert.artist} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-primary text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{concert.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{concert.artist}</h3>
                <p className="text-gray-500 text-sm mb-3">{concert.type}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mic2 className="w-4 h-4" />
                  <span>{concert.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm text-center">
          <Users className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tüm Konserler Ücretsiz!</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Konserlerimiz otelimizde konaklayan tüm misafirlerimiz için ücretsizdir. 
            Özel konserler için önceden rezervasyon yapmanızı öneririz.
          </p>
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
