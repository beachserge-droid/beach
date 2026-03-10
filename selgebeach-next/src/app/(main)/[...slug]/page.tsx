'use client';

import Link from 'next/link';
import { use } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PAGE_CONTENTS } from '@/data/pages';
import scrapedData from '@/data/scraped_content.json';
import { Check, ArrowRight } from 'lucide-react';

const SLUG_MAP: Record<string, string> = {
  'spa/women': 'kadinlar-icin',
  'pools/women': 'kadin-havuzlari',
  'spa/women/guzellik-merkezi': 'guzellik-merkezi',
  'spa/women/masaj': 'masaj',
  'spa/women/jakuzi': 'jakuzi',
  'spa/women/hamam': 'hamam',
  'spa/women/sauna': 'sauna',
  'spa/women/dinlenme-alani': 'dinlenme-alani',
  'activities/fitness-women': 'fitness-center',
  'amenities/mescit-women': 'bayanlar-mescit',
  'beach/women': 'plaj',
  
  'spa/men': 'erkekler-icin',
  'pools/men': 'erkek-havuzu',
  'spa/men/hamam': 'hamam-',
  'spa/men/sauna': 'sauna-',
  'spa/men/dinlenme-alani': 'dinlenme-alani-',
  'activities/fitness-men': 'fitness-center-',
  'amenities/mescit-men': 'baylar-mescit-',
  'beach/men': 'plaj-',
  
  'pools/children': 'cocuk-havuzlari',
  'activities/children': 'cocuklar-icin',
  
  'dining/teppanyaki-alakart': 'teppanyaki-alakart',
  'dining/indigo-alakart': 'indigo-alakart',
  'dining/turkuaz-alakart': 'turkuaz-alakart',
  'dining/ana-restoran': 'ana-restoran',
  'dining/pastane': 'pastane-kafe',
  'dining/lobi-kafe': 'lobi-kafe',
  'dining/havuz-kafe': 'havuz-kafe',
  'dining/turkuaz-kafe': 'turkuaz-kafe',
  'dining/garden-kafe': 'garden-kafe',
  'dining/secret-garden-kafe': 'secret-garden-kafe',
  'dining/osmanli-teras-kafe': 'osmanli-teras-kafe',
  'dining/kids-pool-kafe': 'kids-pool-kafe',
};

export default function GenericPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = use(params);
  const { language } = useLanguage();
  
  if (!resolvedParams || !resolvedParams.slug) return null;

  const path = resolvedParams.slug.join('/');
  const mappedSlug = SLUG_MAP[path] || resolvedParams.slug[resolvedParams.slug.length - 1];
  
  const pageData = PAGE_CONTENTS[path];
  const scrapedPage = scrapedData[mappedSlug as keyof typeof scrapedData] as { title?: string, content?: string, image?: string } | undefined;

  // Create a readable title from the slug as fallback
  const fallbackTitle = resolvedParams.slug[resolvedParams.slug.length - 1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (!pageData && !scrapedPage) {
    // If no data exists, show the fallback Under Construction page
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('https://www.selgebeachhotel.com/photos/selge-beach-hotel-dis-mekan.webp')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative z-10 text-center text-white px-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-lg">{fallbackTitle}</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl mx-auto drop-shadow">
            Bu sayfamız için içerik hazırlıkları devam etmektedir. Çok yakında muhteşem fotoğraflar ve detaylarla burada olacağız.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#ff9800] hover:bg-[#e68900] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5"
          >
            Anasayfaya Dön <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // Rich Page Render
  const title = language === 'tr' ? (pageData?.titleTR || scrapedPage?.title) : (pageData?.titleEN || scrapedPage?.title);
  const desc = language === 'tr' ? (pageData?.descTR || scrapedPage?.content) : (pageData?.descEN || scrapedPage?.content);
  const features = language === 'tr' ? (pageData?.featuresTR || []) : (pageData?.featuresEN || []);
  const heroImg = pageData?.heroImg || (scrapedPage?.image && !scrapedPage.image.includes('logo.svg') ? scrapedPage.image : 'https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-otel-hakkinda-91.webp');
  const gallery = pageData?.gallery || [];

  return (
    <main className="min-h-screen bg-[#f8fbff] pb-24">
      {/* Hero Header */}
      <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[350px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${heroImg}')` }}
        />
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-4">
          <h1 className="text-4xl md:text-5xl font-black text-white text-center drop-shadow-xl translate-y-4 animate-[fade-in-up_0.8s_ease-out_forwards]">
            {title}
          </h1>
        </div>
      </div>

      <div className="container-custom mt-12 md:mt-20 px-4">
        
        {/* Description */}
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed text-center font-medium mb-12 max-w-4xl mx-auto">
          {desc}
        </p>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 md:p-12 relative z-10 border border-gray-100 mb-12">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                  <Check className="text-[#ff9800]" size={20} />
                </div>
                <span className="text-gray-700 font-semibold text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Widget */}
        {gallery.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <h3 className="text-3xl font-black text-[#1a6eb5] mb-8 tracking-wide text-center">
              {language === 'tr' ? 'Galeri' : 'Gallery'}
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${gallery.length > 2 ? 'lg:grid-cols-3' : ''} gap-6`}>
              {gallery.map((img: string, idx: number) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-md cursor-pointer">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${img}')` }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="text-white transform -rotate-45" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
