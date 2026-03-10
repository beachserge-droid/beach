'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Users, Baby, Calendar, CheckCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ROOMS_TR, ROOMS_EN } from '@/data/rooms';

type Room = typeof ROOMS_TR[0] & { calculatedPrice?: number };

// ─── RoomCard ────────────────────────────────────────────────────────────────
function RoomCard({ room, nights, selected, onSelect, onProceed }: {
  room: Room; nights: number; selected: boolean;
  onSelect: () => void; onProceed: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className={`bg-white border flex flex-col sm:flex-row overflow-hidden transition-all mb-4 ${selected ? 'border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] relative z-10' : 'border-gray-200'}`}>
      
      {/* Left Image */}
      <div className="w-full sm:w-[280px] h-48 sm:h-auto shrink-0 relative booking-room-slider">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full"
        >
          {room.gallery?.map((imgStr, idx) => (
            <SwiperSlide key={idx} className="w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgStr} alt={`${room.title} - ${idx + 1}`} className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Middle Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">{room.title}</h3>
          <p className="text-[10px] text-gray-400 font-semibold mb-3">ALKOLSÜZ ULTRA HER ŞEY DAHİL</p>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            {t('booking_room_features')}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <Users size={12}/> <span>{t('capacity')}: {room.capacity} {t('person')}</span>
          </div>
        </div>
      </div>

      {/* Right Pricing Box (Green) */}
      <div className="w-full sm:w-[180px] shrink-0 bg-[#eef8ea] border-l border-gray-100 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-1">
          <div className="flex items-center justify-center gap-1 mb-1 text-green-700">
            <Users size={14}/>
          </div>
          <p className="text-[10px] text-green-700 font-medium">{nights} {t('booking_night')}</p>
          <p className="text-xl font-black text-red-600 tracking-tight mt-0.5">
            {(room.calculatedPrice ?? room.basePrice).toLocaleString('tr-TR')} TL
          </p>
        </div>
        <div className="text-[9px] text-center text-green-700 leading-tight mb-4 px-2">
          {t('booking_nationality_warn')}
        </div>
        
        <div className="flex flex-col gap-2 w-full">
          <button onClick={onSelect}
            className={`w-full py-1.5 rounded-sm text-xs font-bold transition-colors ${selected ? 'bg-green-700 text-white' : 'bg-[#5cb85c] hover:bg-green-600 text-white shadow-sm'}`}>
            {selected ? t('selected') : t('booking_buy_btn')}
          </button>
          {selected && (
            <button onClick={onProceed}
              className="w-full py-1.5 rounded-sm bg-orange-500 text-white text-xs font-bold shadow-sm hover:bg-orange-600 transition-colors animate-in slide-in-from-top-2">
              {t('booking_continue_btn')}
            </button>
          )}
          {!selected && (
            <button className="w-full py-1.5 rounded-sm border border-gray-300 bg-white text-gray-600 text-[11px] hover:bg-gray-50 transition-colors">
              {t('booking_inspect_btn')}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const ALL_ROOMS = language === 'tr' ? ROOMS_TR : ROOMS_EN;

  const paramCheckIn  = searchParams.get('checkIn')  ?? '';
  const paramCheckOut = searchParams.get('checkOut') ?? '';
  const paramAdults   = parseInt(searchParams.get('adults')   ?? '2');
  const paramChildren = parseInt(searchParams.get('children') ?? '0');

  const [tab, setTab]               = useState<'new'|'check'>('new');
  const [checkIn, setCheckIn]       = useState(paramCheckIn);
  const [checkOut, setCheckOut]     = useState(paramCheckOut);
  const [adults, setAdults]         = useState(paramAdults);
  const [children2, setChildren2]   = useState(paramChildren);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched]     = useState(false);
  const [results, setResults]       = useState<Room[]>([]);
  const [selected, setSelected]     = useState<Room|null>(null);

  const nights = (() => {
    if (!checkIn || !checkOut) return 1;
    const d = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
    return d > 0 ? d : 1;
  })();

  const calcPrice = useCallback((r: typeof ROOMS_TR[0]) => r.basePrice * nights, [nights]);

  const doSearch = useCallback(() => {
    setIsSearching(true);
    setSelected(null);
    setSearched(false);
    setTimeout(() => {
      const rooms = ALL_ROOMS
        .filter(r => r.capacity >= adults + children2)
        .map(r => ({ ...r, calculatedPrice: calcPrice(r) }));
      setResults(rooms);
      setIsSearching(false);
      setSearched(true);
    }, 900);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adults, children2, calcPrice, language]);

  // Auto-search if params came from homepage
  useEffect(() => {
    if (paramCheckIn && paramCheckOut) doSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) { alert(t('select_dates_alert')); return; }
    doSearch();
  };

  const handleProceed = (room: Room) => {
    const q = new URLSearchParams({
      roomId:     room.id.toString(),
      roomName:   room.title,
      totalPrice: (room.calculatedPrice ?? room.basePrice).toString(),
      checkIn, checkOut,
      adults:     adults.toString(),
      children:   children2.toString(),
    });
    router.push(`/booking/checkout?${q}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url(https://www.selgebeachhotel.com/webpfy.aspx?foto=selge-beach-hotel-otel-hakkinda-91.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/20 pointer-events-none"/>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 pt-[120px]">
        {/* Booking Panel */}
        <div className="w-full max-w-4xl">
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setTab('new')}
              className={`px-6 py-2 text-[13px] font-bold rounded-tl rounded-tr transition-colors border-b-0 ${tab==='new' ? 'bg-[#ff9800] text-white border border-[#ff9800]' : 'bg-white/90 text-gray-600 border border-gray-200 hover:bg-white'}`}>
              {t('booking_new')}
            </button>
            <button
              onClick={() => setTab('check')}
              className={`px-6 py-2 text-[13px] font-bold rounded-tl rounded-tr transition-colors border-b-0 ml-1 ${tab==='check' ? 'bg-[#ff9800] text-white border border-[#ff9800]' : 'bg-white/90 text-gray-600 border border-gray-200 hover:bg-white'}`}>
              {t('booking_check')}
            </button>
          </div>

          {/* Panel Body */}
          <div className="bg-white rounded-b mb-8 shadow-2xl">

            {/* ── NEW RESERVATION ── */}
            {tab === 'new' && (
              <>
                {/* Form section — light green tint like reference */}
                <div className="bg-[#e9f2df] border-b border-gray-200 px-6 py-5">
                  <h2 className="text-sm font-semibold text-gray-800 mb-3">{t('booking_title')}</h2>
                  <form onSubmit={handleSearch}>
                    <div className="flex flex-wrap items-end gap-3">
                      {/* Dates */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                          {t('booking_dates_label')}
                        </label>
                        <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden">
                          <input type="date" required value={checkIn}
                            onChange={e => {
                              const newCheckIn = e.target.value;
                              setCheckIn(newCheckIn);
                              if (newCheckIn) {
                                const nextDay = new Date(newCheckIn);
                                nextDay.setDate(nextDay.getDate() + 1);
                                setCheckOut(nextDay.toISOString().split('T')[0]);
                              }
                            }}
                            className="text-xs text-gray-700 outline-none w-full px-3 py-2 bg-transparent"/>
                          <div className="px-2 py-2 border-l border-r border-gray-200 bg-gray-50">
                            <Calendar size={12} className="text-gray-400"/>
                          </div>
                          <input type="date" required value={checkOut} min={checkIn}
                            onChange={e => setCheckOut(e.target.value)}
                            className="text-xs text-gray-700 outline-none w-full px-3 py-2 bg-transparent"/>
                        </div>
                      </div>

                      {/* Adults */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                          {t('booking_adult_label')}
                        </label>
                        <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden">
                          <select value={adults} onChange={e => setAdults(+e.target.value)}
                            className="text-xs text-gray-700 outline-none w-14 px-2 py-2 bg-transparent appearance-none text-center">
                            {[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}
                          </select>
                          <div className="px-2 py-2 border-l border-gray-200 bg-gray-50 flex items-center justify-center">
                            <Users size={12} className="text-gray-400"/>
                          </div>
                        </div>
                      </div>

                      {/* Children */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">
                          {t('booking_child_label')}
                        </label>
                        <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden">
                          <select value={children2} onChange={e => setChildren2(+e.target.value)}
                            className="text-xs text-gray-700 outline-none w-14 px-2 py-2 bg-transparent appearance-none text-center">
                            {[0,1,2,3,4].map(n=><option key={n}>{n}</option>)}
                          </select>
                          <div className="px-2 py-2 border-l border-gray-200 bg-gray-50 flex items-center justify-center">
                            <Baby size={12} className="text-gray-400"/>
                          </div>
                        </div>
                      </div>

                      {/* Search button */}
                      <button type="submit" disabled={isSearching}
                        className="bg-[#ff9800] hover:bg-orange-600 disabled:opacity-60 text-white px-5 py-2 rounded font-semibold text-sm flex items-center gap-1 transition-colors shadow-sm whitespace-nowrap">
                        {isSearching
                          ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                          : <><Search size={13}/> {t('booking_search_btn')}</>
                        }
                      </button>
                    </div>
                  </form>
                </div>

                {/* Results area */}
                <div className="p-4 bg-white min-h-[400px]">
                  {/* Loading */}
                  {isSearching && (
                    <div className="flex justify-center items-center py-12">
                      <div className="w-6 h-6 border-2 border-[#ff9800] border-t-transparent rounded-full animate-spin"/>
                    </div>
                  )}

                  {/* No results */}
                  {searched && !isSearching && results.length === 0 && (
                    <div className="bg-[#fadadd] text-[#a94442] px-4 py-3 text-sm rounded shadow-sm">
                      {t('booking_no_rooms')}
                    </div>
                  )}

                  {/* Results */}
                  {searched && !isSearching && results.length > 0 && (
                    <>
                      {/* Blue Summary Banner */}
                      <div className="bg-[#e4f0f6] border border-[#aed0ea] px-4 py-2 text-[11px] font-bold text-[#2779aa] mb-4 rounded flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"/>
                        {results.length} {t('booking_found_rooms_post')} | {adults} {t('adult')}{children2 > 0 ? `, ${children2} ${t('child')}` : ''} | {nights} {t('booking_night')} ({checkIn} - {checkOut})
                      </div>

                      {results.map(room => (
                        <RoomCard key={room.id} room={room} nights={nights}
                          selected={selected?.id === room.id}
                          onSelect={() => setSelected(selected?.id===room.id ? null : room)}
                          onProceed={() => handleProceed(room)}
                        />
                      ))}
                    </>
                  )}

                  {/* Empty initial state */}
                  {!searched && !isSearching && (
                    <div className="py-8 text-center text-gray-400 text-sm">
                      <Calendar size={32} className="mx-auto mb-2 opacity-30"/>
                      {t('booking_select_dates_desc')}
                    </div>
                  )}
                </div>
              </>
            )}
            {/* ── CHECK RESERVATION ── */}
            {tab === 'check' && (
              <div className="p-8 text-center text-gray-500 text-sm">
                <CheckCircle size={36} className="mx-auto mb-3 text-gray-300"/>
                <p className="font-semibold text-gray-700 mb-1">{t('booking_check')}</p>
                <p className="text-gray-400">{t('check_reservation_info')}</p>
                <div className="mt-5 max-w-xs mx-auto flex flex-col gap-3">
                  <input type="text" placeholder={t('booking_pnr_placeholder')} className="border border-gray-200 rounded px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"/>
                  <input type="email" placeholder={t('booking_email_placeholder')} className="border border-gray-200 rounded px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"/>
                  <button className="bg-orange-500 text-white py-2.5 rounded text-sm font-semibold hover:bg-orange-600 transition-colors">{t('booking_query_btn')}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div className="relative z-10 bg-white/90 backdrop-blur border-t border-gray-200 mt-auto">
        {/* Links */}
        <div className="flex justify-center gap-6 py-3 text-xs text-gray-500">
          {['Gizlilik ve Güvenlik','Çerez Politikası','KVKK Politikası'].map(l=>(
            <a key={l} href="#" className="hover:text-orange-500 transition-colors">{l}</a>
          ))}
        </div>

        {/* Hotel info */}
        <div className="text-center pb-3 text-xs text-gray-500">
          <p className="font-semibold text-gray-700 bg-transparent">Selge Beach Resort</p>
          <p>KURTAŞ KAPLERİ ER TURİZM İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ</p>
          <p>Kumluca Mahallesi Yeni Yerleşim Alanı Sokak No: 1/85201 · PK: 79 07600 Manavgat / Antalya</p>
          <p>+90 242 745 72 50 · info@selgebeachresort.com</p>
        </div>

        {/* Payment logos */}
        <div className="flex justify-center items-center gap-4 pb-5">
          {/* Maestro */}
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-red-500"/>
            <div className="w-7 h-7 rounded-full bg-blue-400 opacity-90"/>
          </div>
          {/* Mastercard */}
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-red-500"/>
            <div className="w-7 h-7 rounded-full bg-yellow-400 opacity-90"/>
          </div>
          {/* Troy */}
          <div className="h-7 px-3 bg-gray-800 rounded flex items-center justify-center">
            <span className="text-white text-xs font-black tracking-wider bg-transparent">troy</span>
          </div>
          {/* Visa */}
          <span className="text-2xl font-black italic text-blue-800 bg-transparent">VISA</span>
        </div>
      </div>
    </div>
  );
}

// Wrapper with Suspense for useSearchParams
export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div><p className="mt-4 text-gray-600">Yükleniyor...</p></div></div>}>
      <BookPageContent />
    </Suspense>
  );
}
