import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Info, Users, Check, Sparkles } from 'lucide-react';

interface Props {
  params: Promise<{ section: string; slug: string }>;
}

const SPA_DATA: Record<string, Record<string, {
  title: string;
  section: string;
  desc: string;
  hours: string;
  location: string;
  features: string[];
  rules: string[];
  image: string;
}>> = {
  women: {
    'kadın-havuzlari': {
      title: 'Kadın Havuzları',
      section: 'Kadınlar İçin',
      desc: 'Kadın misafirlerimiz için özel tasarlanmış, yeterli gizlilik ve konfor sunan kapalı ve açık havuzlarımız. Sadece kadınların kullanımına açık bu alanlarda huzurlu bir deniz keyfi yaşayabilirsiniz.',
      hours: '08:00 - 22:00',
      location: 'Bayanlar Bölümü',
      features: ['Kapalı Havuz', 'Açık Havuz', 'Jakuzi', 'Şezlong Alanı', 'Ücretsiz Havlu'],
      rules: ['Sadece kadın misafirler', 'Mayo giyme zorunluluğu', '12 yaş altı kabul edilmez'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-kadin-havuzlari-70.webp',
    },
    'plaj': {
      title: 'Plaj',
      section: 'Kadınlar İçin',
      desc: 'Kadınlara özel plajımızda denizin ve güneşin tadını doyasıya çıkarın. Tamamen korunaklı ve özel tasarımıyla rahat bir tatil deneyimi sunar.',
      hours: '08:00 - 19:00',
      location: 'Bayanlar Plajı',
      features: ['Şezlong', 'Şemsiye', 'Duş', 'Giyinme Kabini', 'Güneşlenme Alanı'],
      rules: ['Sadece kadın misafirler', 'Burkini giyme önerilir', 'Erkek refakatçi kabul edilmez'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-bayanlar-plaji-71.webp',
    },
    'guzellik-merkezi': {
      title: 'Güzellik Merkezi',
      section: 'Kadınlar İçin',
      desc: 'Profesyonel kadromuz ve premium ürünlerimizle cilt bakımı, saç bakımı ve güzellik uygulamaları sunan özel merkezimiz.',
      hours: '10:00 - 20:00',
      location: 'Bayanlar Bölümü',
      features: ['Cilt Bakımı', 'Saç Bakımı', 'Manikür', 'Pedikür', 'Makyaj'],
      rules: ['Randevu gerekli', 'Ücretli hizmet'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-guzellik-merkezi-72.webp',
    },
    'masaj': {
      title: 'Masaj',
      section: 'Kadınlar İçin',
      desc: 'Uzman terapistlerimizin uyguladığı klasik, aromaterapi ve özel masaj hizmetleriyle yenilenin.',
      hours: '10:00 - 22:00',
      location: 'Bayanlar Bölümü',
      features: ['Klasik Masaj', 'Aromaterapi', 'Sırt Masajı', 'Ayak Masajı', 'Tam Vücut'],
      rules: ['Randevu gerekli', 'Ücretli hizmet', '12 yaş altı kabul edilmez'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-masaj-73.webp',
    },
    'jakuzi': {
      title: 'Jakuzi',
      section: 'Kadınlar İçin',
      desc: 'Rahatlatıcı jakuzi havuzlarımızda stresinizi atın.',
      hours: '08:00 - 22:00',
      location: 'Bayanlar Bölümü - Havuz Alanı',
      features: ['Isıtmalı Su', 'Hidromasaj', 'Şezlong Alanı'],
      rules: ['Sadece kadın misafirler', 'Maksimum 20 dakika'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-jakuzi-74.webp',
    },
    'hamam': {
      title: 'Hamam',
      section: 'Kadınlar İçin',
      desc: 'Geleneksel Türk hamamı deneyimiyle arınma ve dinlenme.',
      hours: '10:00 - 22:00',
      location: 'Bayanlar Bölümü',
      features: ['Kese', 'Köpük Masajı', 'Sıcaklik Tası', 'Göbek Taşı'],
      rules: ['Randevu önerilir', 'Ücretli hizmetler'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-hamam-75.webp',
    },
    'sauna': {
      title: 'Sauna',
      section: 'Kadınlar İçin',
      desc: 'Sauna odalarımızda toksinlerinizden arının.',
      hours: '08:00 - 22:00',
      location: 'Bayanlar Bölümü',
      features: ['Fin Sauna', 'Buğulu Oda', 'Soğuk Duş'],
      rules: ['Sadece kadın misafirler', 'Maksimum 15 dakika', '12 yaş altı kabul edilmez'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-sauna-76.webp',
    },
    'dinlenme-alani': {
      title: 'Dinlenme Alanı',
      section: 'Kadınlar İçin',
      desc: 'Hamam ve sauna sonrası dinlenme için özel alan.',
      hours: '08:00 - 22:00',
      location: 'Bayanlar Bölümü',
      features: ['Şezlong', 'Çay Servisi', 'Sessiz Ortam'],
      rules: ['Sessizlik rica olunur', 'Sadece kadın misafirler'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-dinlenme-alani-77.webp',
    },
    'fitness-center': {
      title: 'Fitness Center',
      section: 'Kadınlar İçin',
      desc: 'Kadınlara özel fitness salonumuzda spor yapabilirsiniz.',
      hours: '07:00 - 21:00',
      location: 'Bayanlar Bölümü',
      features: ['Kardiyo', 'Ağırlık', 'Egzersiz Aletleri'],
      rules: ['Sadece kadın misafirler', '12 yaş altı refakatli girebilir'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-fitness-78.webp',
    },
    'mescit': {
      title: 'Mescit',
      section: 'Kadınlar İçin',
      desc: 'Namaz kılma ve ibadet alanı.',
      hours: '24 Saat',
      location: 'Bayanlar Bölümü',
      features: ['Abdesthane', 'Secde', 'Kuran'],
      rules: ['Sadece kadın misafirler', 'Sessizlik'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-mescit-79.webp',
    },
  },
  men: {
    'erkek-havuzu': {
      title: 'Erkek Havuzu',
      section: 'Erkekler İçin',
      desc: 'Erkek misafirlerimiz için özel havuz alanı.',
      hours: '08:00 - 22:00',
      location: 'Baylar Bölümü',
      features: ['Kapalı Havuz', 'Şezlong', 'Duş'],
      rules: ['Sadece erkek misafirler'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-erkek-havuzu-80.webp',
    },
    'plaj': {
      title: 'Plaj',
      section: 'Erkekler İçin',
      desc: 'Erkeklere özel plaj alanı.',
      hours: '08:00 - 19:00',
      location: 'Baylar Plajı',
      features: ['Şezlong', 'Şemsiye', 'Duş'],
      rules: ['Sadece erkek misafirler'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-baylar-plaji-81.webp',
    },
    'hamam': {
      title: 'Hamam',
      section: 'Erkekler İçin',
      desc: 'Erkeklere özel hamam hizmetleri.',
      hours: '10:00 - 22:00',
      location: 'Baylar Bölümü',
      features: ['Kese', 'Köpük Masajı', 'Göbek Taşı'],
      rules: ['Randevu önerilir'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-erkek-hamam-82.webp',
    },
    'sauna': {
      title: 'Sauna',
      section: 'Erkekler İçin',
      desc: 'Sauna ve dinlenme alanı.',
      hours: '08:00 - 22:00',
      location: 'Baylar Bölümü',
      features: ['Fin Sauna', 'Soğuk Duş'],
      rules: ['Sadece erkek misafirler'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-erkek-sauna-83.webp',
    },
    'dinlenme-alani': {
      title: 'Dinlenme Alanı',
      section: 'Erkekler İçin',
      desc: 'Hamam sonrası dinlenme alanı.',
      hours: '08:00 - 22:00',
      location: 'Baylar Bölümü',
      features: ['Şezlong', 'Çay Servisi'],
      rules: ['Sadece erkek misafirler'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-erkek-dinlenme-84.webp',
    },
    'fitness-center': {
      title: 'Fitness Center',
      section: 'Erkekler İçin',
      desc: 'Erkeklere özel fitness salonu.',
      hours: '07:00 - 21:00',
      location: 'Baylar Bölümü',
      features: ['Kardiyo', 'Ağırlık'],
      rules: ['Sadece erkek misafirler'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-erkek-fitness-85.webp',
    },
    'mescit': {
      title: 'Mescit',
      section: 'Erkekler İçin',
      desc: 'Namaz kılma alanı.',
      hours: '24 Saat',
      location: 'Baylar Bölümü',
      features: ['Abdesthane', 'Secde'],
      rules: ['Sadece erkek misafirler'],
      image: 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-erkek-mescit-86.webp',
    },
  },
};

export async function generateStaticParams() {
  const params: { section: string; slug: string }[] = [];
  Object.entries(SPA_DATA).forEach(([section, items]) => {
    Object.keys(items).forEach((slug) => {
      params.push({ section, slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params;
  const item = SPA_DATA[section]?.[slug];
  
  if (!item) {
    return { title: 'Spa | Selge Beach Resort' };
  }
  
  return {
    title: `${item.title} | ${item.section} | Selge Beach Resort`,
    description: item.desc,
  };
}

export default async function SpaPage({ params }: Props) {
  const { section, slug } = await params;
  
  const item = SPA_DATA[section]?.[slug];
  
  if (!item) {
    notFound();
  }

  const isWomen = section === 'women';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/spa" className="hover:text-primary transition-colors">Spa & Wellness</Link>
            <span>/</span>
            <span className="text-gray-500">{item.section}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{item.title}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[300px] lg:h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="container-custom">
            <span className={`inline-block px-3 py-1 text-white text-sm rounded-full mb-3 ${isWomen ? 'bg-pink-500' : 'bg-blue-500'}`}>
              {item.section}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{item.title}</h1>
            <p className="text-white/90 text-lg max-w-2xl">{item.desc}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Çalışma Saatleri
              </h2>
              <p className="text-lg font-medium">{item.hours}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Konum
              </h2>
              <p className="text-lg font-medium">{item.location}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Özellikler
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.features.map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                Kurallar & Bilgiler
              </h2>
              <ul className="space-y-3">
                {item.rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Önemli:</strong> Tüm spa ve wellness alanlarımız helal sertifikalı olup 
                aile konseptimize uygun olarak tasarlanmıştır. Kadın ve erkek bölümleri tamamen 
                ayrılmıştır.
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
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
