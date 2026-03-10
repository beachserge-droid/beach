import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Utensils, Clock, MapPin, Phone, ArrowLeft, ChefHat, Info } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

// Dining data - matching original site structure
const DINING_TR = [
  {
    slug: 'teppanyaki-alakart',
    title: 'Teppanyaki Alakart',
    category: 'Alakart Restoran',
    desc: 'Japon mutfağının eşsiz lezzetlerini teppanyaki stilinde sunan özel restoranımız. Şeflerimizin gösteri şeklinde hazırladığı yemekler unutulmaz bir deneyim sunar.',
    hours: '19:00 - 23:00',
    location: 'Ana Bina - 2. Kat',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-teppanyaki-alakart-43.webp',
    features: ['Rezervasyon Gerekli', '18+ Yaş', 'Akşam Yemeği', 'Japon Mutfağı'],
    menu: ['Sushi', 'Sashimi', 'Teppanyaki Et', 'Teppanyaki Deniz Ürünleri'],
  },
  {
    slug: 'indigo-alakart',
    title: 'İndigo Alakart',
    category: 'Alakart Restoran',
    desc: 'Akdeniz mutfağının en seçkin örneklerini sunan İndigo Alakart, romantik atmosferi ve özel menüsüyle unutulmaz akşam yemekleri vaat ediyor.',
    hours: '19:00 - 23:00',
    location: 'Plaj Kenarı',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-indigo-alakart-42.webp',
    features: ['Rezervasyon Gerekli', '18+ Yaş', 'Akşam Yemeği', 'Akdeniz Mutfağı'],
    menu: ['Deniz Ürünleri', 'Izgara Et', 'Makarna', 'Salata'],
  },
  {
    slug: 'turkuaz-alakart',
    title: 'Turkuaz Alakart',
    category: 'Alakart Restoran',
    desc: 'Türk mutfağının geleneksel lezzetlerini modern sunumlarla birleştiren Turkuaz Alakart, otantik atmosferiyle dikkat çekiyor.',
    hours: '19:00 - 23:00',
    location: 'Bahçe Katı',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-turkuaz-alakart-44.webp',
    features: ['Rezervasyon Gerekli', 'Tüm Yaşlar', 'Akşam Yemeği', 'Türk Mutfağı'],
    menu: ['Kebap', 'Meze', 'Pide', 'Baklava'],
  },
  {
    slug: 'ana-restoran',
    title: 'Ana Restoran',
    category: 'Ana Restoran',
    desc: 'Tüm gün açık olan ana restoranımızda kahvaltı, öğle ve akşam yemeklerinde zengin açık büfe seçenekleri sunulmaktadır. Helal sertifikalı mutfağımızda her damak zevkine uygun lezzetler bulabilirsiniz.',
    hours: '07:00 - 22:00',
    location: 'Ana Bina - Zemin Kat',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-ana-restoran-47.webp',
    features: ['Açık Büfe', 'Tüm Yaşlar', 'Kahvaltı-Öğle-Akşam', 'Uluslararası Mutfak'],
    menu: ['Kahvaltı Büfesi', 'Öğle Menüsü', 'Akşam Büfesi', 'Canlı Pişirme'],
  },
  {
    slug: 'pastane-kafe',
    title: 'Pastane Kafe',
    category: 'Kafe',
    desc: 'Günün her saati taze pastalar, kekler ve tatlılar eşliğinde kahve keyfi yapabileceğiniz nezih bir ortam.',
    hours: '09:00 - 23:00',
    location: 'Lobi Yanı',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-pastane-kafe-48.webp',
    features: ['Ücretsiz', 'Tüm Yaşlar', 'Gün Boyu', 'Tatlı & Kafe'],
    menu: ['Pasta', 'Kek', 'Kahve', 'Çay'],
  },
  {
    slug: 'lobi-kafe',
    title: 'Lobi Kafe',
    category: 'Kafe',
    desc: 'Otele girişte karşılayan lobi kafemiz, gün boyu hafif atıştırmalıklar ve içecekler sunar.',
    hours: '24 Saat',
    location: 'Lobi',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-lobi-kafe-49.webp',
    features: ['24 Saat', 'Tüm Yaşlar', 'Gün Boyu', 'Atıştırmalık'],
    menu: ['Sandviç', 'Kahve', 'Çay', 'İçecek'],
  },
  {
    slug: 'havuz-kafe',
    title: 'Havuz Kafe',
    category: 'Kafe',
    desc: 'Havuz başında serinletici içecekler ve hafif yiyeceklerle tatilin keyfini çıkarın.',
    hours: '10:00 - 18:00',
    location: 'Havuz Kenarı',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-havuz-kafe-50.webp',
    features: ['Ücretsiz', 'Tüm Yaşlar', 'Gündüz', 'İçecek & Atıştırmalık'],
    menu: ['Kokteyl', 'Dondurma', 'Hamburger', 'İçecek'],
  },
  {
    slug: 'turkuaz-kafe',
    title: 'Turkuaz Kafe',
    category: 'Kafe',
    desc: 'Plaj kenarında deniz manzaralı kafemiz, taze meyve suları ve serinletici içecekler sunar.',
    hours: '10:00 - 18:00',
    location: 'Plaj',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-turkuaz-kafe-51.webp',
    features: ['Ücretsiz', 'Tüm Yaşlar', 'Gündüz', 'Plaj & Deniz'],
    menu: ['Meyve Suyu', 'Kokteyl', 'Dondurma', 'Atıştırmalık'],
  },
  {
    slug: 'garden-kafe',
    title: 'Garden Kafe',
    category: 'Kafe',
    desc: 'Bahçe içinde huzurlu bir ortamda kahve ve çay keyfi yapabileceğiniz kafemiz.',
    hours: '09:00 - 22:00',
    location: 'Bahçe',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-garden-kafe-52.webp',
    features: ['Ücretsiz', 'Tüm Yaşlar', 'Gün Boyu', 'Bahçe'],
    menu: ['Kahve', 'Çay', 'Atıştırmalık', 'Dondurma'],
  },
  {
    slug: 'secret-garden-kafe',
    title: 'Secret Garden Kafe',
    category: 'Kafe',
    desc: 'Gizli bahçede sakin bir ortamda özel anlar yaşayabileceğiniz butik kafemiz.',
    hours: '10:00 - 20:00',
    location: 'Gizli Bahçe',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-secret-garden-kafe-53.webp',
    features: ['Ücretsiz', 'Tüm Yaşlar', 'Gündüz', 'Gizli Bahçe'],
    menu: ['Kahve', 'Çay', 'Tatlı', 'Atıştırmalık'],
  },
  {
    slug: 'osmanli-teras-kafe',
    title: 'Osmanlı Teras Kafe',
    category: 'Kafe',
    desc: 'Teras katında Osmanlı motifleriyle süslenmiş, geleneksel Türk kahvesi ve tatlıları sunan kafemiz.',
    hours: '16:00 - 23:00',
    location: 'Teras Kat',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-osmanli-teras-kafe-54.webp',
    features: ['Ücretsiz', 'Tüm Yaşlar', 'Akşam', 'Osmanlı Konsepti'],
    menu: ['Türk Kahvesi', 'Baklava', 'Lokum', 'Çay'],
  },
  {
    slug: 'kids-pool-kafe',
    title: 'Kids Pool Kafe',
    category: 'Kafe',
    desc: 'Çocuk havuzu yanında çocuklara özel menüler sunan eğlenceli kafemiz.',
    hours: '10:00 - 18:00',
    location: 'Çocuk Havuzu Yanı',
    phone: '444 72 61',
    image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-kids-pool-kafe-55.webp',
    features: ['Ücretsiz', 'Çocuklar', 'Gündüz', 'Çocuk Menüsü'],
    menu: ['Hamburger', 'Patates Kızartması', 'Dondurma', 'Meyve Suyu'],
  },
];

export async function generateStaticParams() {
  return DINING_TR.map((dining) => ({
    slug: dining.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dining = DINING_TR.find(d => d.slug === slug);
  
  if (!dining) {
    return {
      title: 'Restoran Bulunamadı | Selge Beach Resort',
    };
  }
  
  return {
    title: `${dining.title} | Selge Beach Resort`,
    description: dining.desc,
  };
}

export default async function DiningPage({ params }: Props) {
  const { slug } = await params;
  
  const dining = DINING_TR.find(d => d.slug === slug);
  
  if (!dining) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/dining" className="hover:text-primary transition-colors">Restoranlar</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{dining.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[350px] lg:h-[450px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dining.image}
          alt={dining.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="container-custom">
            <span className="inline-block px-3 py-1 bg-primary text-white text-sm rounded-full mb-3">
              {dining.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{dining.title}</h1>
            <p className="text-white/90 text-lg max-w-2xl">{dining.desc}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Çalışma Saatleri</p>
                  <p className="font-bold">{dining.hours}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Konum</p>
                  <p className="font-bold">{dining.location}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-bold">{dining.phone}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Özellikler
              </h2>
              <div className="flex flex-wrap gap-2">
                {dining.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Menü Önerileri
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dining.menu.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg text-center text-sm font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Not:</strong> Alakart restoranlarımızda rezervasyon zorunludur. 
                Rezervasyon için lobi danışma veya 444 72 61 numaralı hattı arayabilirsiniz.
              </p>
            </div>
          </div>

          {/* Right Column - CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Rezervasyon</h3>
              <p className="text-sm text-gray-600 mb-4">
                {dining.category.includes('Alakart') 
                  ? 'Alakart restoranımızda yerinizi ayırtın.'
                  : 'Daha fazla bilgi için bize ulaşın.'}
              </p>
              <Link
                href="tel:4447261"
                className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-3 rounded-xl font-bold transition-colors"
              >
                Hemen Ara
              </Link>
              <div className="mt-4 text-center">
                <Link
                  href="/booking"
                  className="text-sm text-primary hover:underline"
                >
                  Oda Rezervasyonu Yap
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
