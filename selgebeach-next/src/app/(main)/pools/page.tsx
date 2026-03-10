import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Waves, Sun, Umbrella, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Havuzlar | Selge Beach Resort',
  description: 'Selge Beach Resort\'un birbirinden güzel havuzları - ana havuz, çocuk havuzu, aquapark ve daha fazlası.',
};

const POOLS = [
  {
    name: 'Ana Havuz',
    desc: 'Büyük yüzme havuzu ve güneşlenme terası',
    depth: '1.20m - 1.80m',
    features: ['Şezlong', 'Şemsiye', 'Havuz Bar'],
  },
  {
    name: 'Çocuk Havuzu',
    desc: 'Güvenli ve eğlenceli çocuk havuzu',
    depth: '0.40m - 0.60m',
    features: ['Kaydırak', 'Oyun Alanı', 'Gözetmen'],
  },
  {
    name: 'Kadınlar Havuzu',
    desc: 'Sadece kadınların kullanımına açık özel havuz',
    depth: '1.20m - 1.60m',
    features: ['Kapalı Havuz', 'Açık Havuz', 'Jakuzi'],
  },
  {
    name: 'Erkekler Havuzu',
    desc: 'Sadece erkeklerin kullanımına açık özel havuz',
    depth: '1.20m - 1.80m',
    features: ['Kapalı Havuz', 'Şezlong', 'Duş'],
  },
  {
    name: 'Aquapark',
    desc: 'Eğlenceli su kaydırakları ve dalga havuzu',
    depth: '0.90m - 1.50m',
    features: ['Su Kaydırakları', 'Dalga Havuzu', 'Lazy River'],
  },
];

export default function PoolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Havuzlar</span>
          </div>
        </div>
      </div>

      <div className="relative h-[300px] lg:h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <Waves className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Havuzlarımız</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Her yaş ve tercihe uygun, özenle tasarlanmış havuzlarımız
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POOLS.map((pool, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Waves className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">{pool.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{pool.desc}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>Derinlik: {pool.depth}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {pool.features.map((f, j) => (
                  <span key={j} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Sun className="w-8 h-8 text-amber-500" />
              <h3 className="text-lg font-bold">Havuz Kuralları</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li>• Mayo ile girilmelidir</li>
              <li>• Havuz kenarında koşulmaz</li>
              <li>• Yiyecek/içecek havuza sokulmaz</li>
              <li>• 12 yaş altı velayetle girilmelidir</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-bold">Çalışma Saatleri</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li>• Ana Havuz: 08:00 - 20:00</li>
              <li>• Çocuk Havuzu: 09:00 - 18:00</li>
              <li>• Aquapark: 10:00 - 17:00</li>
              <li>• Kadın/Erkek Havuzları: 08:00 - 22:00</li>
            </ul>
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
