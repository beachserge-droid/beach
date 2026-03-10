'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Calendar, Users, Baby, Search, Lock, ChevronDown, ChevronUp,
  User, Mail, Phone, MapPin, FileText, Shield, CreditCard, CheckCircle, X, ShieldCheck
} from 'lucide-react';
import { ROOMS_TR } from '@/data/rooms';
import { useLanguage } from '@/context/LanguageContext';

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-base">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500"/>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 text-sm text-gray-700 leading-relaxed space-y-4">
          {children}
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="bg-[#1a6eb5] hover:bg-[#155a9a] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
            Okudum, Anladım
          </button>
        </div>
      </div>
    </div>
  );
}

function VisaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label="Visa" className={className}>
      <path
        fill="#1A1F71"
        d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"
      />
    </svg>
  );
}

function MastercardLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" role="img" aria-label="Mastercard" className={className}>
      <circle cx="12" cy="10" r="8" fill="#EB001B" />
      <circle cx="20" cy="10" r="8" fill="#F79E1B" />
      <path d="M16 3.4a8.7 8.7 0 0 0 0 13.2 8.7 8.7 0 0 0 0-13.2Z" fill="#FF5F00" />
    </svg>
  );
}

function TroyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 20" role="img" aria-label="Troy" className={className}>
      <rect x="0" y="0" width="52" height="20" rx="4" fill="#1A1F71"/>
      <path fill="#fff" d="M8.1 6.1h3.2c1.7 0 2.7.7 2.7 2.1 0 1.6-1.1 2.6-3 2.6h-.9v3.1H8.1V6.1Zm2 1.6v1.6h1c.6 0 1-.3 1-.8 0-.6-.4-.8-1-.8h-1ZM14.8 6.1h5.6v1.7h-3.6v1.2h3.3v1.6h-3.3v1.4h3.7v1.7h-5.7V6.1ZM21.6 6.1h2.1l1.7 6.4 1.7-6.4h2l-2.8 9.6h-2L21.6 6.1ZM33.4 6.1h2l3.1 9.6h-2.1l-.5-1.6h-3l-.5 1.6h-2.1l3.1-9.6Zm0 6.4h2l-1-3.2-1 3.2ZM39.4 6.1h2v7.9H45v1.7h-5.6V6.1Z"/>
      <path fill="#FF5F00" d="M46.7 13.8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2Z"/>
    </svg>
  );
}

function AmexLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label="American Express" className={className}>
      <path
        fill="#006FCF"
        d="M16.015 14.378c0-.32-.135-.496-.344-.622-.21-.12-.464-.135-.81-.135h-1.543v2.82h.675v-1.027h.72c.24 0 .39.024.478.125.12.13.104.38.104.55v.35h.66v-.555c-.002-.25-.017-.376-.108-.516-.06-.08-.18-.18-.33-.234l.02-.008c.18-.072.48-.297.48-.747zm-.87.407l-.028-.002c-.09.053-.195.058-.33.058h-.81v-.63h.824c.12 0 .24 0 .33.05.098.048.156.147.15.255 0 .12-.045.215-.134.27zM20.297 15.837H19v.6h1.304c.676 0 1.05-.278 1.05-.884 0-.28-.066-.448-.187-.582-.153-.133-.392-.193-.73-.207l-.376-.015c-.104 0-.18 0-.255-.03-.09-.03-.15-.105-.15-.21 0-.09.017-.166.09-.21.083-.046.177-.066.272-.06h1.23v-.602h-1.35c-.704 0-.958.437-.958.84 0 .9.776.855 1.407.87.104 0 .18.015.225.06.046.03.082.106.082.18 0 .077-.035.15-.08.18-.06.053-.15.07-.277.07zM0 0v10.096L.81 8.22h1.75l.225.464V8.22h2.043l.45 1.02.437-1.013h6.502c.295 0 .56.057.756.236v-.23h1.787v.23c.307-.17.686-.23 1.12-.23h2.606l.24.466v-.466h1.918l.254.465v-.466h1.858v3.948H20.87l-.36-.6v.585h-2.353l-.256-.63h-.583l-.27.614h-1.213c-.48 0-.84-.104-1.08-.24v.24h-2.89v-.884c0-.12-.03-.12-.105-.135h-.105v1.036H6.067v-.48l-.21.48H4.69l-.202-.48v.465H2.235l-.256-.624H1.4l-.256.624H0V24h23.786v-7.108c-.27.135-.613.18-.973.18H21.09v-.255c-.21.165-.57.255-.914.255H14.71v-.9c0-.12-.018-.12-.12-.12h-.075v1.022h-1.8v-1.066c-.298.136-.643.15-.928.136h-.214v.915h-2.18l-.54-.617-.57.6H4.742v-3.93h3.61l.518.602.554-.6h2.412c.28 0 .74.03.942.225v-.24h2.177c.202 0 .644.045.903.225v-.24h3.265v.24c.163-.164.508-.24.803-.24h1.89v.24c.194-.15.464-.24.84-.24h1.176V0H0zM21.156 14.955c.004.005.006.012.01.016.01.01.024.01.032.02l-.042-.035zM23.828 13.082h.065v.555h-.065zM23.865 15.03v-.005c-.03-.025-.046-.048-.075-.07-.15-.153-.39-.215-.764-.225l-.36-.012c-.12 0-.194-.007-.27-.03-.09-.03-.15-.105-.15-.21 0-.09.03-.16.09-.204.076-.045.15-.05.27-.05h1.223v-.588h-1.283c-.69 0-.96.437-.96.84 0 .9.78.855 1.41.87.104 0 .18.015.224.06.046.03.076.106.076.18 0 .07-.034.138-.09.18-.045.056-.136.07-.27.07h-1.288v.605h1.287c.42 0 .734-.118.9-.36h.03c.09-.134.135-.3.135-.523 0-.24-.045-.39-.135-.526zM18.597 14.208v-.583h-2.235V16.458h2.235v-.585h-1.57v-.57h1.533v-.584h-1.532v-.51M13.51 8.787h.685V11.6h-.684zM13.126 9.543l-.007.006c0-.314-.13-.5-.34-.624-.217-.125-.47-.135-.81-.135H10.43v2.82h.674v-1.034h.72c.24 0 .39.03.487.12.122.136.107.378.107.548v.354h.677v-.553c0-.25-.016-.375-.11-.516-.09-.107-.202-.19-.33-.237.172-.07.472-.3.472-.75zm-.855.396h-.015c-.09.054-.195.056-.33.056H11.1v-.623h.825c.12 0 .24.004.33.05.09.04.15.128.15.25s-.047.22-.134.266zM15.92 9.373h.632v-.6h-.644c-.464 0-.804.105-1.02.33-.286.3-.362.69-.362 1.11 0 .512.123.833.36 1.074.232.238.645.31.97.31h.78l.255-.627h1.39l.262.627h1.36v-2.11l1.272 2.11h.95l.002.002V8.786h-.684v1.963l-1.18-1.96h-1.02V11.4L18.11 8.744h-1.004l-.943 2.22h-.3c-.177 0-.362-.03-.468-.134-.125-.15-.186-.36-.186-.662 0-.285.08-.51.194-.63.133-.135.272-.165.516-.165zm1.668-.108l.464 1.118v.002h-.93l.466-1.12zM2.38 10.97l.254.628H4V9.393l.972 2.205h.584l.973-2.202.015 2.202h.69v-2.81H6.118l-.807 1.904-.876-1.905H3.343v2.663L2.205 8.787h-.997L.01 11.597h.72l.26-.626h1.39zm-.688-1.705l.46 1.118-.003.002h-.915l.457-1.12zM11.856 13.62H9.714l-.85.923-.825-.922H5.346v2.82H8l.855-.932.824.93h1.302v-.94h.838c.6 0 1.17-.164 1.17-.945l-.006-.003c0-.78-.598-.93-1.128-.93zM7.67 15.853l-.014-.002H6.02v-.557h1.47v-.574H6.02v-.51H7.7l.733.82-.764.824zm2.642.33l-1.03-1.147 1.03-1.108v2.253zm1.553-1.258h-.885v-.717h.885c.24 0 .42.098.42.344 0 .243-.15.372-.42.372zM9.967 9.373v-.586H7.73V11.6h2.237v-.58H8.4v-.564h1.527V9.88H8.4v-.507"
      />
    </svg>
  );
}

function CardBrandRow({ className }: { className?: string }) {
  return (
    <div className={className}>
      <VisaLogo className="h-5 w-auto" />
      <MastercardLogo className="h-5 w-auto" />
      <AmexLogo className="h-5 w-auto" />
      <TroyLogo className="h-5 w-auto" />
    </div>
  );
}

function TrustPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
      <span className="text-gray-500">{icon}</span>
      <span className="text-[11px] font-bold text-gray-700 tracking-wide">{text}</span>
    </div>
  );
}

// Room images per roomId
const getRoomData = (id: string) => {
  return ROOMS_TR.find(r => r.id.toString() === id) || ROOMS_TR[0];
};

function DetailedCheckout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  const roomId    = searchParams.get('roomId')     || '1';
  const roomName  = searchParams.get('roomName')   || 'Standart Oda';
  const totalPrice= searchParams.get('totalPrice') || '0';
  const checkIn   = searchParams.get('checkIn')    || '';
  const checkOut  = searchParams.get('checkOut')   || '';
  const adults    = parseInt(searchParams.get('adults')   || '2', 10);
  const children  = parseInt(searchParams.get('children') || '0', 10);

  const roomData = getRoomData(roomId);
  const photos   = roomData.gallery || [roomData.img];
  const [photoIdx, setPhotoIdx] = useState(0);

  const [contactInfo, setContactInfo] = useState({
    firstName:'', lastName:'', email:'', mobile:'', phone:'',
    country:'Türkiye', city:'İstanbul', address:'', tcNo:'',
    nonCitizen:false, diffInvoice:false, requests:'',
  });

  const [agreements, setAgreements]     = useState({ konaklama:false, kvkk:false, kabul:false });
  const [activeModal, setActiveModal]   = useState<'konaklama'|'kvkk'|null>(null);

  const upd = (k: string, v: string | boolean) => setContactInfo(p => ({...p, [k]:v}));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreements.kabul) { alert('Lütfen sözleşmeleri onaylayınız.'); return; }
    localStorage.setItem('selge_pending_contact', JSON.stringify({ ...contactInfo, guests:{adults,children} }));
    const params = new URLSearchParams({
      roomId, roomName, totalPrice, checkIn, checkOut,
      adults: adults.toString(), children: children.toString()
    });
    router.push(`/booking/payment?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{
      backgroundImage:'url(/bg.jpg)',
      backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed',
    }}>
      <div className="absolute inset-0 bg-blue-900/20 pointer-events-none"/>

      {/* Modals */}
      {activeModal === 'konaklama' && (
        <Modal title="Konaklama Sözleşmesi" onClose={()=>setActiveModal(null)}>
          <p className="font-bold text-gray-900">Selge Beach Resort — Konaklama Ön Bilgi Formu ve Sözleşmesi</p>
          <p><strong>1. Taraflar</strong><br/>Bu sözleşme; Selge Beach Resort (bundan böyle &quot;Otel&quot; olarak anılacaktır) ile rezervasyon yaptıran misafir (bundan böyle &quot;Misafir&quot; olarak anılacaktır) arasında akdedilmiştir.</p>
          <p><strong>2. Rezervasyon ve Ödeme</strong><br/>Misafir, seçtiği oda tipi, giriş-çıkış tarihleri ve kişi sayısına göre belirlenen toplam bedeli kabul ederek rezervasyon işlemini tamamlar. Rezervasyon bedeli, ödeme aşamasında kredi/banka kartı ile tahsil edilir. Ödeme onaylanmadan rezervasyon kesinleşmez.</p>
          <p><strong>3. Giriş-Çıkış Saatleri</strong><br/>Otele giriş saati 14:00, otelden çıkış saati 12:00&apos;dir. Erken giriş ve geç çıkış taleplerine oda müsaitliğine göre ve ek ücret karşılığında cevap verilir.</p>
          <p><strong>4. İptal ve Değişiklik Koşulları</strong><br/>Rezervasyon tarihinden 7 gün öncesine kadar yapılan iptallerde ücret iadesi yapılır. 7 günden az sürede yapılan iptallerde ilk gece bedeli iade edilmez. No-show durumunda toplam rezervasyon bedelinin %50&apos;si tahsil edilir.</p>
          <p><strong>5. Otel Kuralları</strong><br/>Otel içinde gürültü saatleri 23:00–07:00 arasında uygulanır. Havuz ve plaj alanlarında güvenli davranış kurallarına uyulması zorunludur. Her türlü kişisel eşya güvenliği misafirin sorumluluğundadır. Evcil hayvanlar otele kabul edilmez.</p>
          <p><strong>6. Paket İçeriği</strong><br/>Seçilen pansiyon tipine göre (Her Şey Dahil, Yarım Pansiyon, Oda-Kahvaltı vb.) yiyecek-içecek hizmetleri sunulur. Her Şey Dahil konseptinde alkollü içecekler hariç tutulmaktadır.</p>
          <p><strong>7. Sorumluluk Sınırlaması</strong><br/>Otel, doğal afetler, grevler veya kamu otoritelerinin kararları nedeniyle hizmet verilememesi durumunda sorumluluk kabul etmez. Bu hallerde misafire alternatif tarih seçeneği sunulur.</p>
          <p><strong>8. Uygulanacak Hukuk</strong><br/>Bu sözleşmeden doğacak uyuşmazlıklarda Türk Hukuku uygulanacak olup Antalya Mahkemeleri ve İcra Daireleri yetkilidir.</p>
          <p className="text-gray-500 text-xs">Son güncelleme: Mart 2025</p>
        </Modal>
      )}

      {activeModal === 'kvkk' && (
        <Modal title="Kişisel Verilerin Korunması Politikası (KVKK)" onClose={()=>setActiveModal(null)}>
          <p className="font-bold text-gray-900">6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Aydınlatma Metni</p>
          <p><strong>Veri Sorumlusu:</strong><br/>Selge Beach Resort, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca veri sorumlusu sıfatıyla hareket etmektedir.</p>
          <p><strong>Toplanan Kişisel Veriler:</strong><br/>Ad-soyad, T.C. kimlik numarası, iletişim bilgileri (e-posta, telefon), adres bilgileri, ödeme bilgileri (kart numarası, son kullanma tarihi) ve konaklama tercihleri.</p>
          <p><strong>Kişisel Verilerin İşlenme Amaçları:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Rezervasyon işlemlerinin gerçekleştirilmesi ve yönetilmesi</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi (vergi, muhasebe gibi)</li>
            <li>Güvenlik ve doğrulama işlemleri</li>
            <li>Misafir memnuniyeti anketleri ve geri bildirim toplama</li>
            <li>Hizmet kalitesinin iyileştirilmesi</li>
          </ul>
          <p><strong>Kişisel Verilerin Aktarıldığı Taraflar:</strong><br/>Kişisel verileriniz; ödeme hizmeti sağlayıcılar (POS sistemleri), resmi makamlar (talep halinde), acente/servis sağlayıcılar (otel yazılımı, e-posta servisleri) ile yasal zorunluluklar çerçevesinde paylaşılabilir.</p>
          <p><strong>Hukuki Dayanak:</strong><br/>Kişisel verileriniz KVKK Madde 5/2(c) (sözleşmenin ifası) ve Madde 5/2(ç) (hukuki yükümlülük) kapsamında işlenmektedir.</p>
          <p><strong>Veri Sahibinin Hakları (KVKK Madde 11):</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını öğrenme ve bu amaca uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>KVKK Madde 7&apos;de öngörülen şartlar çerçevesinde silinmesini isteme</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
          </ul>
          <p><strong>İletişim:</strong><br/>Haklarınızı kullanmak için <a href="mailto:info@selgebeachhotel.com" className="text-blue-600 underline">info@selgebeachhotel.com</a> adresine e-posta gönderebilirsiniz.</p>
          <p><strong>Çerez Politikası:</strong><br/>Web sitemiz oturum çerezleri kullanmaktadır. Bu çerezler tarayıcınızı kapattığınızda silinir ve kişisel veri içermez.</p>
          <p className="text-gray-500 text-xs">Son güncelleme: Mart 2025 — Bu metin KVKK Madde 10 kapsamında aydınlatma yükümlülüğü çerçevesinde hazırlanmıştır.</p>
        </Modal>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 pt-[120px]">
        <div className="w-full max-w-5xl">

          {/* Tabs */}
          <div className="flex">
            <div className="bg-[#1a6eb5] text-white px-6 py-2.5 text-[13px] font-bold rounded-tl-lg rounded-tr-lg">
              {t('booking_new')}
            </div>
            <div className="bg-white/90 text-gray-500 px-6 py-2.5 text-[13px] font-bold rounded-tl-lg rounded-tr-lg border border-gray-200 border-b-0 ml-1">
              {t('booking_check')}
            </div>
          </div>

          {/* Panel */}
          <div className="bg-white rounded-b-xl rounded-tr-xl mb-8 shadow-2xl p-6">

            {/* Search Summary Bar - Açık yeşil/mavi tonlu */}
            <div className="bg-[#e8f5e9] border border-[#c8e6c9] px-5 py-3 mb-5 rounded-lg flex items-center justify-between gap-4 flex-wrap">
              <div className="flex gap-5 items-center flex-wrap">
                <div className="flex items-center gap-2 text-xs text-green-800 font-semibold">
                  <Calendar size={14} className="text-green-600"/>
                  <span>{checkIn || '—'}</span>
                  <span className="text-green-400">→</span>
                  <span>{checkOut || '—'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-green-800 font-semibold">
                  <Users size={13} className="text-green-600"/> {adults} {t('adult')}
                </div>
                {children > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-green-800 font-semibold">
                    <Baby size={13} className="text-green-600"/> {children} {t('child')}
                  </div>
                )}
              </div>
              <button className="bg-[#ff9800] hover:bg-[#f57c00] transition-colors text-white px-5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm">
                <Search size={13}/> {t('booking_search_btn')}
              </button>
            </div>

            {/* Info Banner - Açık mavi özet */}
            <div className="bg-[#e3f2fd] border border-[#bbdefb] px-4 py-2.5 mb-6 rounded-lg flex items-center gap-2">
              <CheckCircle size={14} className="text-blue-600"/>
              <span className="text-[12px] font-bold text-blue-800">
                {adults} {t('adult')}{children > 0 ? `, ${children} ${t('child')}` : ''} · 1 {t('booking_night')} · {checkIn} → {checkOut}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">

              {/* LEFT: Room Card */}
              <div className="w-full lg:w-[300px] shrink-0">
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
                  {/* Photo Carousel */}
                  <div className="relative w-full h-[210px] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photos[photoIdx]}
                      alt={roomName}
                      className="w-full h-full object-cover"
                    />
                    {photos.length > 1 && (
                      <>
                        <button type="button" onClick={()=>setPhotoIdx(i=>(i-1+photos.length)%photos.length)}
                          className="absolute top-1/2 left-2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center -translate-y-1/2 transition-colors">
                          ‹
                        </button>
                        <button type="button" onClick={()=>setPhotoIdx(i=>(i+1)%photos.length)}
                          className="absolute top-1/2 right-2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center -translate-y-1/2 transition-colors">
                          ›
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                      {photos.map((_,i)=>(
                        <button type="button" key={i} onClick={()=>setPhotoIdx(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${i===photoIdx?'bg-white':'bg-white/40'}`}/>
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-900 text-sm">Selge Beach Resort</p>
                    <p className="text-gray-600 text-xs mt-1">{roomName}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        ALKOLSÜZ ULTRA HER ŞEY DAHİL
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users size={11}/> {adults}</span>
                      {children>0 && <span className="flex items-center gap-1"><Baby size={11}/> {children}</span>}
                      <span className="flex items-center gap-1"><Calendar size={11}/> {checkIn} – {checkOut}</span>
                    </div>
                  </div>
                  <div className="bg-[#e8f5e9] p-4 border-t border-gray-100 text-center">
                    <div className="text-xl font-black text-green-700 tracking-tight">
                      {Number(totalPrice).toLocaleString('tr-TR')},00 TL
                    </div>
                    <div className="text-[10px] text-green-600 mt-0.5">KDV Dahil</div>
                  </div>
                </div>

                {/* Security badges - Soft stil */}
                <div className="mt-4 bg-gray-50 rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 text-[11px] text-gray-600 font-bold mb-2">
                    <Shield size={13} className="text-gray-500"/> {t('payment_secure')}
                  </div>
                  <CardBrandRow className="flex items-center gap-2" />
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
                    <Lock size={10}/> {t('co_ssl_secure')}
                  </div>
                </div>
              </div>

              {/* RIGHT: Forms */}
              <div className="flex-1 space-y-5">

                {/* 1. ODA GUESTS - Soft tema */}
                <fieldset className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <legend className="text-xs font-bold text-gray-700 px-3 ml-3 bg-white flex items-center gap-1.5">
                    <Users size={13} className="text-gray-500"/> {t('co_guest_info')}
                  </legend>
                  <div className="p-5 space-y-4">
                    {Array.from({length: adults}).map((_, i) => (
                      <div key={`adult-${i}`} className="flex flex-col sm:flex-row gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="sm:w-36">
                          <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_adult_gender').replace('{n}', String(i+1))}</label>
                          <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white">
                            <option value="Erkek">{t('co_gender_male')}</option>
                            <option value="Kadın">{t('co_gender_female')}</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_adult_name').replace('{n}', String(i+1))}</label>
                          <div className="relative">
                            <input type="text" required placeholder={t('co_name_placeholder')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 pl-8"/>
                            <User size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300"/>
                          </div>
                        </div>
                      </div>
                    ))}
                    {Array.from({length: children}).map((_, i) => (
                      <div key={`child-${i}`} className="flex flex-col sm:flex-row gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="sm:w-36">
                          <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_child_gender').replace('{n}', String(i+1))}</label>
                          <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 outline-none focus:border-blue-400 bg-white">
                            <option value="Erkek">{t('co_gender_male')}</option>
                            <option value="Kız">{t('co_gender_girl')}</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_child_name').replace('{n}', String(i+1))}</label>
                          <div className="relative">
                            <input type="text" required placeholder={t('co_name_placeholder')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 outline-none focus:border-blue-400 pl-8"/>
                            <Baby size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300"/>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>

                {/* 2. İRTİBAT - Soft tema */}
                <fieldset className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <legend className="text-xs font-bold text-gray-700 px-3 ml-3 bg-white flex items-center gap-1.5">
                    <User size={13} className="text-gray-500"/> {t('co_contact_info')}
                  </legend>
                  <div className="p-5 space-y-4">
                    <p className="text-[11px] text-gray-500">{t('co_contact_desc')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_fullname_req')}</label>
                        <div className="relative">
                          <input type="text" required placeholder={t('co_name_placeholder')} value={contactInfo.firstName} onChange={e=>upd('firstName',e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 pl-8"/>
                          <User size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300"/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_email_req')}</label>
                        <div className="relative">
                          <input type="email" required placeholder="ornek@mail.com" value={contactInfo.email} onChange={e=>upd('email',e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 pl-8"/>
                          <Mail size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300"/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_mobile_req')}</label>
                        <div className="relative">
                          <input type="tel" required placeholder="+90 5XX XXX XX XX" value={contactInfo.mobile} onChange={e=>upd('mobile',e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 pl-8"/>
                          <Phone size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300"/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_phone_opt')}</label>
                        <div className="relative">
                          <input type="tel" placeholder="+90 XXX XXX XX XX" value={contactInfo.phone} onChange={e=>upd('phone',e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 pl-8"/>
                          <Phone size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300"/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_country_req')}</label>
                        <select value={contactInfo.country} onChange={e=>upd('country',e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 bg-white">
                          <option>Türkiye</option><option>Almanya</option><option>İngiltere</option>
                          <option>Fransa</option><option>Hollanda</option><option>Rusya</option>
                          <option>Diğer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_city_req')}</label>
                        <select value={contactInfo.city} onChange={e=>upd('city',e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 bg-white">
                          <option>İstanbul</option><option>Ankara</option><option>İzmir</option>
                          <option>Antalya</option><option>Bursa</option><option>Konya</option>
                          <option>Diğer</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_address_req')}</label>
                      <div className="relative">
                        <textarea required placeholder={t('co_address_req')} rows={2} value={contactInfo.address} onChange={e=>upd('address',e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 resize-none pl-8"/>
                        <MapPin size={12} className="absolute left-2.5 top-2.5 text-gray-300"/>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">{t('co_tc_req')}</label>
                        <input type="text" required={!contactInfo.nonCitizen} disabled={contactInfo.nonCitizen}
                          placeholder={t('co_tc_req')} value={contactInfo.tcNo} onChange={e=>upd('tcNo',e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-300"/>
                      </div>
                      <div className="sm:pt-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input type="checkbox" checked={contactInfo.nonCitizen} onChange={e=>upd('nonCitizen',e.target.checked)} className="w-3.5 h-3.5 accent-sky-500"/>
                          <span className="text-xs text-gray-600">{t('co_not_tc')}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* 3. ÖZEL RİCALAR - Soft tema */}
                <fieldset className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <legend className="text-xs font-bold text-gray-700 px-3 ml-3 bg-white flex items-center gap-1.5">
                    <FileText size={13} className="text-gray-500"/> {t('co_special_req')}
                  </legend>
                  <div className="p-5">
                    <textarea placeholder={t('co_req_placeholder')} rows={3}
                      value={contactInfo.requests} onChange={e=>upd('requests',e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 resize-none"/>
                    <p className="text-[10px] text-gray-500 mt-1">{t('co_req_note')}</p>
                  </div>
                </fieldset>

                {/* 4. BANKA - Soft tema */}
                <fieldset className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <legend className="text-xs font-bold text-gray-700 px-3 ml-3 bg-white flex items-center gap-1.5">
                    <CreditCard size={13} className="text-gray-500"/> {t('co_bank_card')}
                  </legend>
                  <div className="p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div>
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('co_accepted_cards')}</div>
                            <div className="text-sm font-black text-gray-800 mt-1">{t('co_secure_payment')}</div>
                          </div>
                          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                            <Lock size={14} className="text-gray-600" />
                            <span className="text-[11px] font-black text-gray-700">{t('co_ssl_secure')}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 flex-wrap">
                          <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
                            <CardBrandRow className="flex items-center gap-3" />
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <TrustPill icon={<ShieldCheck size={14} />} text="3D Secure" />
                          <TrustPill icon={<Lock size={14} />} text="256-bit SSL" />
                          <TrustPill icon={<CheckCircle size={14} />} text={t('co_secure_trans')} />
                        </div>

                        <div className="mt-4 text-[11px] text-gray-500 leading-relaxed">
                          {t('co_card_note')}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('co_payment_summary')}</div>
                        <div className="mt-2 rounded-2xl border border-gray-300 bg-white p-4">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input type="radio" name="installment" defaultChecked className="mt-1 accent-blue-500" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-sm font-black text-gray-800">{t('co_single_pay')}</div>
                                <div className="text-sm font-black text-blue-600">{Number(totalPrice).toLocaleString('tr-TR')},00 TL</div>
                              </div>
                              <div className="text-[11px] text-gray-500 mt-1">
                                {t('co_single_pay_desc')}
                              </div>
                            </div>
                          </label>
                        </div>

                        <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-[11px] text-blue-800">
                          {t('co_3d_info')}
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* 5. ÖDEME & SÖZLEŞME - Soft tema */}
                <fieldset className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <legend className="text-xs font-bold text-gray-700 px-3 ml-3 bg-white flex items-center gap-1.5">
                    <Lock size={13} className="text-gray-500"/> {t('co_payment_agreement')}
                  </legend>
                  <div className="p-5 space-y-4">
                    {/* Total */}
                    <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-xl px-5 py-3">
                      <span className="text-sm font-bold text-gray-700">{t('co_pay_amount')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-gray-800">{Number(totalPrice).toLocaleString('tr-TR')},00</span>
                        <span className="text-[11px] bg-gray-700 text-white px-2 py-0.5 rounded-lg font-bold">TL</span>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-2">
                      <button type="button" onClick={()=>setActiveModal('konaklama')}
                        className="w-full flex items-center justify-between border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all rounded-xl px-4 py-3 bg-white group">
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-700">
                          <FileText size={14} className="text-gray-500"/>
                          {t('co_contract1')}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-blue-600 font-bold">{t('co_read')}</span>
                          <ChevronDown size={13} className="text-gray-400 group-hover:text-gray-600 transition-colors"/>
                        </div>
                      </button>
                      <button type="button" onClick={()=>setActiveModal('kvkk')}
                        className="w-full flex items-center justify-between border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all rounded-xl px-4 py-3 bg-white group">
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-700">
                          <Shield size={14} className="text-gray-500"/>
                          {t('co_contract2')}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-blue-600 font-bold">{t('co_read')}</span>
                          <ChevronDown size={13} className="text-gray-400 group-hover:text-gray-600 transition-colors"/>
                        </div>
                      </button>
                    </div>

                    {/* Acceptance */}
                    <label className="flex items-start gap-3 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors">
                      <input type="checkbox" checked={agreements.kabul} onChange={e=>setAgreements({...agreements, kabul:e.target.checked})}
                        className="w-4 h-4 mt-0.5 accent-gray-500 flex-shrink-0"/>
                      <span className="text-xs text-gray-700 leading-relaxed">
                        {t('co_accept_terms')}
                      </span>
                    </label>
                  </div>
                </fieldset>

                <div className="pt-4">
                  <button type="submit" disabled={!agreements.kabul} className="w-full bg-[#ff9800] hover:bg-[#f57c00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
                    {t('co_proceed_btn')} <Lock size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper with Suspense for useSearchParams
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div><p className="mt-4 text-gray-600">Yükleniyor...</p></div></div>}>
      <DetailedCheckout />
    </Suspense>
  );
}
