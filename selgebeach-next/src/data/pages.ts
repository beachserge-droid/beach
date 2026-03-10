export const PAGE_CONTENTS: Record<string, {
  titleTR: string;
  titleEN: string;
  descTR: string;
  descEN: string;
  heroImg: string;
  gallery: string[];
  featuresTR: string[];
  featuresEN: string[];
}> = {
  // --- WOMEN'S SECTION ---
  'pools/women': {
    titleTR: 'Kadınlara Özel Havuzlar',
    titleEN: 'Women\'s Pools',
    descTR: 'Sadece kadın misafirlerimize özel tasarlanmış, etrafı dışarıdan görünmeyecek şekilde izole edilmiş tatlı ve tuzlu su havuzlarımız. Tatilinizin keyfini tam mahremiyet içinde doyasıya yaşayın.',
    descEN: 'Specially designed sweet and salt water pools exclusively for our female guests, isolated to ensure complete privacy. Enjoy your holiday to the fullest.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-kadinlar-havuzu-32.webp',
    gallery: [
      'https://www.selgebeachhotel.com/photos/selge-beach-hotel-kadinlar-havuzu-32.webp',
      'https://www.selgebeachhotel.com/photos/selge-beach-hotel-havuzlar-24-90.webp'
    ],
    featuresTR: ['100% Mahremiyet', 'Tuzlu Su Havuzu', 'Çocuk Havuzu (Bitişik)', 'Şezlong & Şemsiye Ücretsiz', 'Kafeterya Hizmeti'],
    featuresEN: ['100% Privacy', 'Salt Water Pool', 'Children\'s Pool (Adjacent)', 'Free Sunbeds & Umbrellas', 'Cafeteria Service']
  },
  'beach/women': {
    titleTR: 'Kadınlara Özel Plaj',
    titleEN: 'Women\'s Beach',
    descTR: 'Akdeniz\'in masmavi sularıyla buluşacağınız, kadın misafirlerimiz için özel olarak ayrılmış güneşlenme alanlarına sahip muhteşem kum plajımız.',
    descEN: 'Our magnificent sandy beach with sunbathing areas exclusively reserved for our female guests, meeting the deep blue waters of the Mediterranean.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-plaj-34.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-plaj-34.webp'],
    featuresTR: ['Kumlu Plaj', 'Kadınlara Özel Bölüm', 'Cankurtaran', 'Plaj Havlusu', 'İçecek Servisi'],
    featuresEN: ['Sandy Beach', 'Women\'s Exclusive Area', 'Lifeguard', 'Beach Towels', 'Beverage Service']
  },
  'spa/women/guzellik-merkezi': {
    titleTR: 'Güzellik Merkezi',
    titleEN: 'Beauty Center',
    descTR: 'Siz tatilinizi yaparken, uzman kadromuz ile cildinize ve bedeninize özel profesyonel bakımlarla yenilenin. Gençleşmenin ve parıldamanın tam zamanı.',
    descEN: 'While enjoying your holiday, rejuvenate with professional treatments tailored to your skin and body by our expert staff. It is time to shine.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-guzellik-salonu-86.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-guzellik-salonu-86.webp'],
    featuresTR: ['Cilt Bakımı', 'Kuaför Hizmetleri', 'Manikür & Pedikür', 'Anti-Aging Bakımlar', 'Profesyonel Ürünler'],
    featuresEN: ['Skin Care', 'Hairdresser Services', 'Manicure & Pedicure', 'Anti-Aging Treatments', 'Professional Products']
  },
  'spa/women/masaj': {
    titleTR: 'Terapi ve Masajlar',
    titleEN: 'Therapies & Massages',
    descTR: 'Uzakdoğu ve dünya masaj tekniklerini harmanlayan uzman terapistlerimiz eşliğinde günün tüm yorgunluğunu atın.',
    descEN: 'Relieve all the tiredness of the day with our expert therapists blending Far Eastern and world massage techniques.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-dinlenme-alani.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-dinlenme-alani.webp'],
    featuresTR: ['Aromaterapi', 'Bali Masajı', 'Sıcak Taş Masajı', 'Thai Masajı', 'Sertifikalı Terapistler'],
    featuresEN: ['Aromatherapy', 'Bali Massage', 'Hot Stone Massage', 'Thai Massage', 'Certified Therapists']
  },
  'spa/women/jakuzi': {
    titleTR: 'Jakuzi',
    titleEN: 'Jacuzzi',
    descTR: 'Suyun iyileştirici gücüyle tanışın. Kapalı alanlarımızda bulunan geniş jakuzilerimizde rahatlayın ve kaslarınızı dinlendirin.',
    descEN: 'Meet the healing power of water. Relax and rest your muscles in our spacious jacuzzis located in indoor areas.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-kapali-havuz.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-kapali-havuz.webp'],
    featuresTR: ['Kapalı Alan', 'Sıcak Su', 'Hidroterapi', 'Sessiz Ortam'],
    featuresEN: ['Indoor Area', 'Hot Water', 'Hydrotherapy', 'Quiet Environment']
  },
  'spa/women/hamam': {
    titleTR: 'Türk Hamamı',
    titleEN: 'Turkish Bath',
    descTR: 'Osmanlı mimarisinden esinlenerek tasarlanmış geleneksel Türk hamamımızda, kese ve köpük masajı ile pamuk gibi bir cilde kavuşun.',
    descEN: 'Get cotton-like skin with peeling and foam massage in our traditional Turkish bath inspired by Ottoman architecture.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-turk-hamami.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-turk-hamami.webp'],
    featuresTR: ['Isıtmalı Göbektaşı', 'Kese Odası', 'Köpük Masajı', 'Klasik Müzik', 'Doğal Sabunlar'],
    featuresEN: ['Heated Marble', 'Peeling Room', 'Foam Massage', 'Classical Music', 'Natural Soaps']
  },
  'spa/women/sauna': {
    titleTR: 'Sauna',
    titleEN: 'Sauna',
    descTR: 'Özel yapım ahşap saunalarımızda toksinlerden arının, rahat bir nefes alarak yenilendiğinizi hissedin.',
    descEN: 'Purify from toxins in our custom-made wooden saunas, feel refreshed by taking a deep breath.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-sauna.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-sauna.webp'],
    featuresTR: ['80-90°C Sıcaklık', 'Kuru Isı', 'Dinlenme Alanına Yakın', 'Duş İmkanı'],
    featuresEN: ['80-90°C Temperature', 'Dry Heat', 'Close to Rest Area', 'Shower Access']
  },
  'spa/women/dinlenme-alani': {
    titleTR: 'Dinlenme Alanı',
    titleEN: 'Relaxation Area',
    descTR: 'Hamam veya sauna sonrasında, hafif müzik eşliğinde özel çaylarınızı yudumlarken ruhunuzu dinlendireceğiniz huzurlu alan.',
    descEN: 'A peaceful area where you can rest your soul while sipping special teas accompanied by soft music after a bath or sauna.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-dinlenme-alani.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-dinlenme-alani.webp'],
    featuresTR: ['Bitki Çayları', 'Uzanma Koltukları', 'Sessiz Alan', 'Hafif Müzik'],
    featuresEN: ['Herbal Teas', 'Loungers', 'Quiet Zone', 'Soft Music']
  },
  'activities/fitness-women': {
    titleTR: 'Fitness Merkezi',
    titleEN: 'Fitness Center',
    descTR: 'Tatiliniz boyunca formunuzu koruyun. En son teknoloji kardiyo ve ağırlık ekipmanlarıyla donatılmış kadınlara özel fitness merkezimiz sizleri bekliyor.',
    descEN: 'Keep in shape during your holiday. Our women-only fitness center equipped with state-of-the-art cardio and weight equipment awaits you.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-fitness-center.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-fitness-center.webp'],
    featuresTR: ['Koşu Bantları', 'Ağırlık İstasyonları', 'Klimalı Ortam', 'Profesyonel Antrenör', 'Ücretsiz Kullanım'],
    featuresEN: ['Treadmills', 'Weight Stations', 'Air Conditioned', 'Professional Trainer', 'Free Access']
  },

  // --- MEN'S SECTION ---
  'pools/men': {
    titleTR: 'Erkek Havuzu',
    titleEN: 'Men\'s Pool',
    descTR: 'Aquapark ve ana aktivite merkezlerine yakın konumlandırılmış, geniş ve ferah erkeklere özel yüzme havuzumuz.',
    descEN: 'Our spacious men\'s pool located close to the aquapark and main activity centers.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-erkek-havuzu.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-erkek-havuzu.webp'],
    featuresTR: ['Büyük Havuz', 'Aquapark Bağlantısı', 'Animasyon Etkinlikleri', 'Havuz Bar', 'Şezlong Ücretsiz'],
    featuresEN: ['Large Pool', 'Aquapark Connection', 'Animation Events', 'Pool Bar', 'Free Sunbeds']
  },
  'beach/men': {
    titleTR: 'Ortak & Erkek Özel Plaj',
    titleEN: 'Common & Men\'s Beach',
    descTR: 'Ailenizle birlikte veya kendi başınıza denizin ve güneşin tadını çıkarabileceğiniz, geniş ve uzun kumsal plajımız.',
    descEN: 'Our long and wide sandy beach where you can enjoy the sea and the sun with your family or on your own.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-plaj-34.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-plaj-34.webp'],
    featuresTR: ['Kum Plaj', 'Voleybol Sahası', 'İskele', 'Cankurtaran', 'Su Sporları (Ücretli)'],
    featuresEN: ['Sandy Beach', 'Volleyball Court', 'Pier', 'Lifeguard', 'Water Sports (Extra)']
  },
  'spa/men/hamam': {
    titleTR: 'Erkeklere Özel Türk Hamamı',
    titleEN: 'Men\'s Turkish Bath',
    descTR: 'Erkek misafirlerimize özel olarak ayrılmış tarihi dokuya sahip Türk hamamımızda unutulmaz bir kese ve köpük masajı.',
    descEN: 'An unforgettable peeling and foam massage in our Turkish bath with a historical texture reserved exclusively for our male guests.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-baylar-turk-hamami-88.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-baylar-turk-hamami-88.webp'],
    featuresTR: ['Erkeklere Özel', 'Kese ve Köpük', 'Geleneksel Masajlar', 'Dinlenme Alanları'],
    featuresEN: ['Men Only', 'Peeling and Foam', 'Traditional Massages', 'Rest Areas']
  },
  'spa/men/sauna': {
    titleTR: 'Sauna',
    titleEN: 'Sauna',
    descTR: 'Sıcağın dinlendirici gücüyle bütün kaslarınızı gevşetin ve tatilde yenilenin.',
    descEN: 'Relax all your muscles with the relaxing power of heat and get refreshed on holiday.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-baylar-sauna-89.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-baylar-sauna-89.webp'],
    featuresTR: ['Ahşap Tasarım', 'Kuru Isı', 'Erkeklere Özel', 'Duş Alanları'],
    featuresEN: ['Wooden Design', 'Dry Heat', 'Men Only', 'Shower Areas']
  },
  'spa/men/dinlenme-alani': {
    titleTR: 'Dinlenme Alanı',
    titleEN: 'Relaxation Area',
    descTR: 'Hamam, sauna ve masaj terapilerinizin ardından rahatça uzanıp dinlenebileceğiniz sessiz alanlar.',
    descEN: 'Quiet areas where you can lie down and relax comfortably after your bath, sauna, and massage therapies.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-dinlenme-alani.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-dinlenme-alani.webp'],
    featuresTR: ['Ücretsiz Çay Servisi', 'Şezlonglar', 'Sessizlik', 'Gazete ve Dergi Okuma Alanı'],
    featuresEN: ['Free Tea Service', 'Loungers', 'Silence', 'Reading Area']
  },
  'activities/fitness-men': {
    titleTR: 'Erkek Fitness Merkezi',
    titleEN: 'Men\'s Fitness Center',
    descTR: 'Tatil yaparken sporundan ödün vermek istemeyen erkek misafirlerimize özel olarak ayrılmış geniş fitness salonu.',
    descEN: 'A spacious fitness center exclusively reserved for our male guests who do not want to compromise on their sports while on holiday.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-fitness-center.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-fitness-center.webp'],
    featuresTR: ['Ağırlık Makineleri', 'Serbest Ağırlık', 'Kardiyo Bölümü', 'Erkeklere Özel', 'Havlu Temini'],
    featuresEN: ['Weight Machines', 'Free Weights', 'Cardio Section', 'Men Only', 'Towel Service']
  },
  'amenities/mescit-women': {
    titleTR: 'Kadın Mescit',
    titleEN: 'Women\'s Prayer Room',
    descTR: 'Kadın misafirlerimizin ibadetlerini huzur, sükunet ve mahremiyet içinde yapabilecekleri mescidimiz.',
    descEN: 'Our prayer room where our female guests can perform their worship in peace, tranquility, and privacy.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-bayanlar-mescit-68.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-bayanlar-mescit-68.webp'],
    featuresTR: ['Bayanlara Özel', 'Ayrı Abdesthane', 'Geniş Alan', 'Sürekli Açık'],
    featuresEN: ['Women Only', 'Separate Ablution Area', 'Spacious', 'Always Open']
  },
  'amenities/mescit-men': {
    titleTR: 'Erkek Mescit',
    titleEN: 'Men\'s Prayer Room',
    descTR: 'Otel içerisinde kolay ulaşılabilir bir noktada yer alan geniş, ferah erkekler mescidi.',
    descEN: 'A spacious men\'s prayer room located at an easily accessible point within the hotel.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-baylar-mescit-67.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-baylar-mescit-67.webp'],
    featuresTR: ['Cemaat Alanı', 'Klimalı Ortam', 'Abdesthane', 'Cuma Namazı İmkânı'],
    featuresEN: ['Congregation Area', 'Air Conditioned', 'Ablution Area', 'Friday Prayer Available']
  },

  // --- CHILDREN'S SECTION ---
  'pools/children': {
    titleTR: 'Çocuk Havuzları',
    titleEN: 'Children\'s Pools',
    descTR: 'Eğlenceli su kaydırakları (aquapark) ve çocuklara özel sığ havuzlarla küçük misafirlerimizin yüzü hep gülüyor.',
    descEN: 'Our little guests are always smiling with fun water slides (aquapark) and shallow pools specially for children.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-cocuk-havuz-kaydirak-91.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-cocuk-havuz-kaydirak-91.webp', 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-aquapark-63.webp'],
    featuresTR: ['Kaydıraklar', 'Sığ Su (40cm)', 'Gözetmen Cankurtaran', 'Eğlenceli Su Oyunları'],
    featuresEN: ['Slides', 'Shallow Water (40cm)', 'Lifeguard', 'Fun Water Games']
  },
  'activities/mini-kulup': {
    titleTR: 'Mini Kulüp (4-12 Yaş)',
    titleEN: 'Mini Club (4-12 Years)',
    descTR: 'Uzman çocuk gelişimcileri eşliğinde, çocuklarınız hem eğlenip hem öğrenirken siz tatilinizi eşinizle baş başa geçirebilirsiniz.',
    descEN: 'Accompanied by expert child development specialists, your children can have fun and learn while you spend your holiday alone with your spouse.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-mini-club.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-mini-club.webp'],
    featuresTR: ['Yüz Boyama', 'Mini Disko', 'El İşi Çalışmaları', 'Oyun Alanları', 'Sertifikalı Personel'],
    featuresEN: ['Face Painting', 'Mini Disco', 'Handcrafts', 'Playgrounds', 'Certified Staff']
  },
  'activities/cocuk-aktiviteleri': {
    titleTR: 'Günlük Çocuk Aktiviteleri',
    titleEN: 'Daily Children\'s Activities',
    descTR: 'Günün her saati birbirinden eğlenceli yarışmalar, olimpiyatlar ve kostüm şovlarıyla çocuklarınız unutulmaz anılar biriktirecek.',
    descEN: 'Your children will collect unforgettable memories with fun competitions, olympiads, and costume shows at any time of the day.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-gunduz-aktiviteleri-65.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-gunduz-aktiviteleri-65.webp'],
    featuresTR: ['Yarışmalar', 'Pandomim', 'Tişört Boyama', 'Korsan Günü'],
    featuresEN: ['Competitions', 'Pantomime', 'T-shirt Painting', 'Pirate Day']
  },
  'activities/oyun-parki': {
    titleTR: 'Dış Mekan Oyun Parkı',
    titleEN: 'Outdoor Playground',
    descTR: 'Doğayla iç içe, bol oksijenli güvenli park alanlarımızda salıncak, kaydırak ve tırmanma alanlarıyla sınırsız eğlence.',
    descEN: 'Unlimited fun with swings, slides, and climbing areas in our safe park areas immersed in nature with plenty of oxygen.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-oyun-parki.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-oyun-parki.webp'],
    featuresTR: ['Doğa İçinde', 'Güvenli Zemin', 'Salıncak ve Kaydıraklar', 'Kamelyalar'],
    featuresEN: ['In Nature', 'Safe Grounding', 'Swings and Slides', 'Camellias']
  },

  // --- GENERAL ACTIVITIES & ENTERTAINMENT ---
  'activities/aksam-sovlari': {
    titleTR: 'Akşam Şovları',
    titleEN: 'Evening Shows',
    descTR: 'Profesyonel ekipler, ünlü sanatçılar ve muhteşem koreografiler eşliğinde amfi tiyatromuzda her akşam yeni bir sürprize hazır olun.',
    descEN: 'Get ready for a new surprise every evening in our amphitheater accompanied by professional teams, famous artists, and magnificent choreographies.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-aksam-sovlari-64.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-aksam-sovlari-64.webp'],
    featuresTR: ['Amfi Tiyatro', 'Akrobasi Gösterileri', 'Ünlü Sanatçılar', 'Sihirbazlık Şovları', 'Aile Boyu Eğlence'],
    featuresEN: ['Amphitheater', 'Acrobatic Shows', 'Famous Artists', 'Magic Shows', 'Family Entertainment']
  },
  'activities/gunduz-aktiviteleri': {
    titleTR: 'Gündüz Aktiviteleri',
    titleEN: 'Daily Activities',
    descTR: 'Animasyon ekibimizle havuz oyunları, yarışmalar ve turnuvalarla zamanın nasıl geçtiğini anlamayacaksınız.',
    descEN: 'You will not realize how time flies with pool games, competitions, and tournaments with our animation team.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-gunduz-aktiviteleri-65.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-gunduz-aktiviteleri-65.webp'],
    featuresTR: ['Havuz Oyunları', 'Masa Tenisi Turvunası', 'Dart', 'Boccia', 'Pilates / Yoga'],
    featuresEN: ['Pool Games', 'Table Tennis Tournaments', 'Darts', 'Boccia', 'Pilates / Yoga']
  },
  'activities/oyun-merkezi': {
    titleTR: 'Oyun Merkezi & Atari',
    titleEN: 'Game Center',
    descTR: 'Bilardo, bowling ve heyecan verici atari makinelerinin yer aldığı geniş oyun salonumuz tüm yaş grupları için mükemmel bir alternatiftir.',
    descEN: 'Our spacious game center featuring billiards, bowling, and exciting arcade machines is a perfect alternative for all age groups.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-oyun-merkezi.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-oyun-merkezi.webp'],
    featuresTR: ['Bilardo', 'Bowling (Ücretli)', 'Atari Makineleri (Ücretli)', 'Masa Futbolu', 'İklimlendirilmiş Alan'],
    featuresEN: ['Billiards', 'Bowling (Extra)', 'Arcade Machines (Extra)', 'Table Football', 'Air Conditioned']
  },
  'activities/aquapark': {
    titleTR: 'Aquapark',
    titleEN: 'Aquapark',
    descTR: 'Ailenizin tüm bireyleri için her seviyeye uygun tasarlanmış heyecan verici su kaydıraklarımızla adrenalin ve eğlencenin tadını çıkarın.',
    descEN: 'Enjoy adrenaline and fun with our exciting water slides designed for every level for all members of your family.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-aquapark-63.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-aquapark-63.webp'],
    featuresTR: ['Dev Kaydıraklar', 'Düşme Havuzları', 'Gözetmen Onaylı', 'Ücretsiz Kullanım'],
    featuresEN: ['Giant Slides', 'Drop Pools', 'Lifeguard Approved', 'Free Access']
  },
  'activities/futbol': {
    titleTR: 'Futbol Sahası',
    titleEN: 'Football Pitch',
    descTR: 'Profesyonel standartlara ve zemin yapısına sahip sahamızda ister amatör maçlar yapın ister mini turnuvalara katılın.',
    descEN: 'Whether playing amateur matches or joining mini-tournaments, our pitch has professional standards and turf structure.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-spor-aktiviteleri.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-spor-aktiviteleri.webp'],
    featuresTR: ['Suni Çim', 'Tel Örgülü', 'Animasyon Turnuvaları', 'Top Temini'],
    featuresEN: ['Artificial Turf', 'Fenced', 'Animation Tournaments', 'Ball Provided']
  },
  'activities/tenis': {
    titleTR: 'Tenis Kortu',
    titleEN: 'Tennis Court',
    descTR: 'Raketlerinizi hazırlayın! Sert zeminli tenis kortlarımızda spor tutkunuzu tatilde de sürdürün.',
    descEN: 'Get your rackets ready! Continue your passion for sports on holiday in our hard-court tennis courts.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-spor-aktiviteleri.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-spor-aktiviteleri.webp'],
    featuresTR: ['Sert Zemin', 'Otel İçi Konum', 'Raket / Top Kiralama', 'Işıklandırma Seçeneği'],
    featuresEN: ['Hard Court', 'In-Hotel Location', 'Racket/Ball Rentals', 'Lighting Available']
  },

  // --- SPECIAL PAGES ---
  'honeymoon': {
    titleTR: 'Ayrıcalıklı Balayı Konsepti',
    titleEN: 'Exclusive Honeymoon Concept',
    descTR: 'Hayatınızın en mutlu günlerini unutulmaz kılmak için her detayı özenle düşündük. Özel oda dekorasyonundan sürpriz ikramlara, alakart restoranlarda mum ışığında romantik yemeğe kadar sayısız ayrıcalık balayı çiftlerimizi bekliyor.',
    descEN: 'We have carefully considered every detail to make the happiest days of your life unforgettable. Numerous privileges await our honeymoon couples, from special room decoration to surprise treats and romantic candlelight dinners in a la carte restaurants.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-romantik-balayi-97.webp',
    gallery: ['https://www.selgebeachhotel.com/photos/selge-beach-hotel-romantik-balayi-97.webp'],
    featuresTR: ['Odaya Meyve Sepeti & Çikolata', 'Özel Yatak Süslemesi', 'Alakart Restoran Rezervasyon Önceliği', 'Odaya Kahvaltı (1 Kez)', 'Bornoz ve Terlik'],
    featuresEN: ['Fruit Basket & Chocolates to Room', 'Special Bed Decoration', 'A\'la Carte Restaurant Priority', 'Breakfast to Room (Once)', 'Bathrobe and Slippers']
  },
  'concerts': {
    titleTR: '2026 Yaz Konserleri',
    titleEN: '2026 Summer Concerts',
    descTR: 'Della Miles, Maher Zain ve Fatih Koca gibi dünyaca ünlü yıldızlarla yaz tatiliniz boyunca müzik ziyafetine hazır olun.',
    descEN: 'Get ready for a musical feast throughout your summer holiday with world-famous stars such as Della Miles, Maher Zain, and Fatih Koca.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-maher-zain-konseri-23.webp',
    gallery: [
      'https://www.selgebeachhotel.com/photos/selge-beach-hotel-della-miles-konseri-65.webp',
      'https://www.selgebeachhotel.com/photos/selge-beach-hotel-maher-zain-konseri-23.webp',
      'https://www.selgebeachhotel.com/photos/selge-beach-hotel-fatih-koca-konseri-19.webp'
    ],
    featuresTR: ['Bilet Tüm Konuklara Ücretsiz', 'Amfi Tiyatro Gösterimleri', 'Muhteşem Işık ve Sahne', 'Dünya Yıldızları'],
    featuresEN: ['Tickets Free for All Guests', 'Amphitheater Showings', 'Magnificent Stage & Lights', 'World Stars']
  },
  'meetings': {
    titleTR: 'Toplantı & Kongre Organizasyonları',
    titleEN: 'Meeting & Congress Events',
    descTR: 'Kurumsal toplantılardan büyük bayii buluşmalarına kadar her türlü etkinlik için tam donanımlı salonlarımız ve profesyonel ekibimizle hizmetinizdeyiz.',
    descEN: 'We are at your service with our fully equipped halls and professional team for all kinds of events, from corporate meetings to large dealer gatherings.',
    heroImg: 'https://www.selgebeachhotel.com/photos/selge-beach-hotel-toplanti-salonu-95.webp',
    gallery: [
      'https://www.selgebeachhotel.com/photos/selge-beach-hotel-toplanti-salonu-95.webp',
      'https://www.selgebeachhotel.com/photos/selge-beach-hotel-sinema-duzeni.webp'
    ],
    featuresTR: ['Tam Donanımlı Teknik Ekipman', 'Sinevizyon ve Ses Sistemi', 'Farklı Oturma Düzenleri (Sınıf, U-Düzen vb.)', 'Coffee Break İkramları'],
    featuresEN: ['Fully Equipped Technical Gear', 'Cine-vision and Audio System', 'Various Seating (Class, U-shape)', 'Coffee Break Catering']
  }
};
