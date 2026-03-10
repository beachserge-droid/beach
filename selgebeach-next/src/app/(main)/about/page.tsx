import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building2, Award, Users, Leaf } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hakkımızda | Selge Beach Resort',
  description: 'Selge Beach Resort - Alkolsüz, helal sertifikalı, aile konseptli 5 yıldızlı tatil köyü. Antalya\'nın en çok tercih edilen aile oteli.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Hakkımızda</span>
          </div>
        </div>
      </div>

      <div className="relative h-[300px] lg:h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <Building2 className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Hakkımızda</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              2010 yılından bu yana ailelerin güvenle tercih ettiği tatil köyü
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4">Selge Beach Resort</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Antalya Side'de, Akdeniz'in eşsiz maviliğiyle buluşan Selge Beach Resort, 
              alkolsüz ve helal sertifikalı konseptiyle ailelerin güvenle tatil yapabileceği 
              5 yıldızlı bir tatil köyüdür.
            </p>
            <p className="text-gray-700 leading-relaxed">
              2010 yılından bu yana hizmet veren tesisimiz, kadın ve erkek havuzlarının 
              ayrı olması, alkolsüz hizmet anlayışı ve İslami usullere uygun tesisleriyle 
              dikkat çekmektedir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <Award className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Helal Sertifika</h3>
              <p className="text-sm text-gray-600">TSE Helal Turizm Sertifikalı</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <Users className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">500.000+</h3>
              <p className="text-sm text-gray-600">Mutlu Misafir</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <Leaf className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Yeşil Yıldız</h3>
              <p className="text-sm text-gray-600">Çevre Dostu Otel</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">Vizyonumuz</h2>
            <p className="text-gray-700 leading-relaxed">
              İslami hassasiyetlere uygun, kaliteli ve konforlu tatil imkanı sunarak 
              misafirlerimizin huzurlu bir tatil geçirmesini sağlamak. Aile değerlerini 
              ön planda tutan, çocuk dostu ve kadınlara özel alanlarıyla güvenli bir tatil 
              ortamı oluşturmak.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Değerlerimiz</h2>
            <ul className="space-y-3">
              {[
                'Alkolsüz hizmet anlayışı',
                'Kadın ve erkek ayrı havuz/spa alanları',
                'Helal gıda standartları',
                'Aile konseptli tatil deneyimi',
                'Çevre dostu uygulamalar',
                'Misafir memnuniyeti odaklı hizmet',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span>{item}</span>
                </li>
              ))}
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
