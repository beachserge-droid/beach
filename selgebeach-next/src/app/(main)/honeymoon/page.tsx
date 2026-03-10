import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Heart, Sparkles, Wine, Gift, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Balayı Paketleri | Selge Beach Resort',
  description: 'Unutulmaz balayı deneyimi için özel paketlerimiz. Romantik akşam yemekleri, oda süslemeleri ve özel sürprizler sizi bekliyor.',
};

const PACKAGES = [
  {
    name: 'Klasik Balayı Paketi',
    price: 'Ücretsiz',
    features: ['Oda Süsleme', 'Meyve Sepeti', 'Şarap (Alkolsüz)', 'Geç Çıkış'],
  },
  {
    name: 'Romantik Balayı Paketi',
    price: '1.500 TL',
    features: ['Gül Yapraklı Oda', 'Jakuzi Süsleme', 'Özel Akşam Yemeği', 'Spa Paketi', 'Fotoğraf Çekimi'],
  },
  {
    name: 'VIP Balayı Paketi',
    price: '3.500 TL',
    features: ['Suite Oda', 'Özel Butler', 'Tüm Alakartlar', 'Tam Spa Paketi', 'Havaalanı Transferi', 'Özel Tur'],
  },
];

export default function HoneymoonPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Balayı</span>
          </div>
        </div>
      </div>

      <div className="relative h-[350px] lg:h-[450px]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Balayı Paketleri</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hayatınızın en özel anlarından birini unutulmaz kılın. Romantik atmosfer, özel sürprizler ve kusursuz hizmet.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {PACKAGES.map((pkg, i) => (
            <div key={i} className={`rounded-xl p-6 shadow-lg ${i === 1 ? 'bg-primary text-white' : 'bg-white'}`}>
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <p className={`text-3xl font-bold mb-4 ${i === 1 ? 'text-white' : 'text-primary'}`}>{pkg.price}</p>
              <ul className="space-y-2">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 ${i === 1 ? 'text-white' : 'text-green-500'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Paket İçeriği
            </h2>
            <ul className="space-y-3">
              {['Özel oda süslemesi', 'Meyve ve çikolata sepeti', 'Romantik akşam yemeği', 'Spa indirimi', 'Geç çıkış imkanı'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Özel Sürprizler
            </h2>
            <ul className="space-y-3">
              {['Evlilik cüzdanı kontrolünde otomatik aktivasyon', 'Oda tesliminde süslemeli oda', 'İlk gece özel akşam yemeği', 'Fotoğraf çekimi fırsatı'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-pink-50 rounded-xl border border-pink-200 text-center">
          <p className="text-pink-800">
            <strong>Not:</strong> Balayı paketlerinden yararlanmak için rezervasyon sırasında evlilik cüzdanınızı göstermeniz yeterlidir.
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
