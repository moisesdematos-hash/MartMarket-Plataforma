// ==============================================================================
// MARTMARKET EVENT TICKETING SYSTEM
// Sell tickets for live, online or hybrid events with QR Code generation,
// attendee list, check-in, capacity management and Multicaixa/PayPay payment.
// ==============================================================================

import React, { useState } from 'react';
import {
  Calendar, Ticket, Users, MapPin, Clock, QrCode,
  Plus, CheckCircle2, XCircle, Search, Download,
  TrendingUp, DollarSign, Share2, Settings
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../lib/currencies';

type EventStatus = 'UPCOMING' | 'LIVE' | 'ENDED' | 'DRAFT';
type AttendeeStatus = 'CONFIRMED' | 'PENDING' | 'CHECKED_IN' | 'CANCELLED';

interface EventTicket {
  id: string;
  name: string;
  price: number;
  sold: number;
  capacity: number;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  status: AttendeeStatus;
  qrCode: string;
  purchasedAt: string;
}

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  status: EventStatus;
  type: 'ONLINE' | 'PRESENCIAL' | 'HÍBRIDO';
  date: string;
  time: string;
  location: string;
  coverImage: string;
  tickets: EventTicket[];
  attendees: Attendee[];
  totalRevenue: number;
}

const STATUS_CFG: Record<EventStatus, { label: string; variant: any }> = {
  UPCOMING: { label: 'Próximo',   variant: 'primary' },
  LIVE:     { label: 'A Decorrer',variant: 'danger'  },
  ENDED:    { label: 'Encerrado', variant: 'neutral' },
  DRAFT:    { label: 'Rascunho',  variant: 'warning' },
};

const ATTENDEE_CFG: Record<AttendeeStatus, { label: string; variant: any }> = {
  CONFIRMED:  { label: 'Confirmado',  variant: 'success' },
  PENDING:    { label: 'Pendente',    variant: 'warning' },
  CHECKED_IN: { label: 'Check-in ✓', variant: 'primary' },
  CANCELLED:  { label: 'Cancelado',  variant: 'neutral' },
};

export const EventTicketManager: React.FC = () => {
  const { showToast } = useNotification();
  const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [view, setView] = useState<'events' | 'attendees' | 'checkin'>('events');

  const [events] = useState<LiveEvent[]>([
    {
      id: 'evt-1',
      title: 'MartConf 2026 — Conferência de Empreendedorismo Digital',
      description: 'O maior evento de empreendedorismo digital de Angola. 2 dias de palestras, workshops e networking.',
      status: 'UPCOMING', type: 'PRESENCIAL',
      date: '2026-10-15', time: '09:00', location: 'Centro de Convenções de Luanda, Angola',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80',
      totalRevenue: 42500000,
      tickets: [
        { id: 'tk-1', name: 'Entrada Geral', price: 25000, sold: 480, capacity: 600 },
        { id: 'tk-2', name: 'VIP (Mesa + Almoço)', price: 75000, sold: 85, capacity: 100 },
        { id: 'tk-3', name: 'Grupo (5 pessoas)', price: 100000, sold: 23, capacity: 50 },
      ],
      attendees: [
        { id: 'a1', name: 'Edson Morais', email: 'edson@email.ao', ticketType: 'VIP', status: 'CONFIRMED', qrCode: 'QR-EVT1-A1-2026', purchasedAt: '2026-09-10' },
        { id: 'a2', name: 'Paula Ferreira', email: 'paula@gmail.com', ticketType: 'Entrada Geral', status: 'CONFIRMED', qrCode: 'QR-EVT1-A2-2026', purchasedAt: '2026-09-12' },
        { id: 'a3', name: 'Carlos Baptista', email: 'carlos@tech.ao', ticketType: 'VIP', status: 'PENDING', qrCode: 'QR-EVT1-A3-2026', purchasedAt: '2026-09-14' },
        { id: 'a4', name: 'Maria Lourenço', email: 'maria@angola.com', ticketType: 'Entrada Geral', status: 'CHECKED_IN', qrCode: 'QR-EVT1-A4-2026', purchasedAt: '2026-09-08' },
      ]
    },
    {
      id: 'evt-2',
      title: 'Workshop Online: Monetize o Seu Conhecimento com Infoprodutos',
      description: 'Workshop de 3 horas ao vivo via streaming. Aprenda a criar e vender o seu primeiro infoproduto.',
      status: 'UPCOMING', type: 'ONLINE',
      date: '2026-09-28', time: '19:00', location: 'Online — Link enviado por email',
      coverImage: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&auto=format&fit=crop&q=80',
      totalRevenue: 5250000,
      tickets: [
        { id: 'tk-4', name: 'Acesso ao Vivo', price: 15000, sold: 245, capacity: 500 },
        { id: 'tk-5', name: 'Gravação + Material', price: 25000, sold: 120, capacity: 300 },
      ],
      attendees: []
    },
  ]);

  const checkIn = (eventId: string, attendeeId: string) => {
    showToast('success', '✅ Check-in realizado com sucesso! Acesso autorizado.');
  };

  const shareEvent = (ev: LiveEvent) => {
    showToast('info', `Link copiado: martmarket.app/evento/${ev.id}`);
  };

  if (selectedEvent && (view === 'attendees' || view === 'checkin')) {
    const filtered = selectedEvent.attendees.filter(a =>
      a.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(attendeeSearch.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => { setSelectedEvent(null); setView('events'); }}
              className="text-xs text-blue-400 hover:underline cursor-pointer mb-1 block">← Voltar a Eventos</button>
            <h2 className="text-lg font-black text-white">{selectedEvent.title}</h2>
            <p className="text-xs text-slate-400">{selectedEvent.date} • {selectedEvent.time} • {selectedEvent.location}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('attendees')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${view==='attendees'?'bg-blue-600/20 text-blue-400 border border-blue-500/30':'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'}`}>
              👥 Participantes
            </button>
            <button onClick={() => setView('checkin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${view==='checkin'?'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30':'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'}`}>
              📷 Check-in
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input value={attendeeSearch} onChange={e => setAttendeeSearch(e.target.value)}
            placeholder="Pesquisar participante por nome ou email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-300 placeholder:text-slate-500" />
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <table className="w-full text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5 text-left">Participante</th>
                <th className="p-3.5 text-left">Ingresso</th>
                <th className="p-3.5 text-left">Estado</th>
                <th className="p-3.5 text-left">QR Code</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{a.name}</div>
                    <div className="text-[11px] text-slate-400">{a.email}</div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px]">{a.ticketType}</td>
                  <td className="p-3.5">
                    <Badge variant={ATTENDEE_CFG[a.status].variant} size="sm">{ATTENDEE_CFG[a.status].label}</Badge>
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-slate-400">{a.qrCode}</td>
                  <td className="p-3.5 text-right">
                    {a.status !== 'CHECKED_IN' && a.status !== 'CANCELLED' && (
                      <button onClick={() => checkIn(selectedEvent.id, a.id)}
                        className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto">
                        <QrCode className="w-3 h-3" /> Check-in
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<Ticket className="w-3.5 h-3.5" />}>
            Sistema de Eventos & Ingressos
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Eventos & Venda de Ingressos</h2>
          <p className="text-xs text-slate-400">Crie e venda ingressos para eventos presenciais, online ou híbridos. QR Code para check-in digital.</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => showToast('info', 'Wizard de criação de evento em breve.')}>
          Criar Evento
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Eventos Ativos', v: events.filter(e=>e.status!=='ENDED').length, c: 'text-blue-400' },
          { label: 'Total de Ingressos', v: events.reduce((s,e)=>s+e.tickets.reduce((ts,t)=>ts+t.sold,0),0), c: 'text-white' },
          { label: 'Receita Total', v: `${(events.reduce((s,e)=>s+e.totalRevenue,0)/1000000).toFixed(1)}M Kz`, c: 'text-emerald-400' },
          { label: 'Participantes', v: events.reduce((s,e)=>s+e.attendees.length,0), c: 'text-purple-400' },
        ].map(k => (
          <div key={k.label} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className={`text-2xl font-black font-mono ${k.c}`}>{k.v}</div>
            <div className="text-[11px] text-slate-400">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(ev => {
          const totalSold = ev.tickets.reduce((s, t) => s + t.sold, 0);
          const totalCapacity = ev.tickets.reduce((s, t) => s + t.capacity, 0);
          const pct = Math.round((totalSold / totalCapacity) * 100);

          return (
            <div key={ev.id} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="relative h-36 overflow-hidden">
                <img src={ev.coverImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <Badge variant={STATUS_CFG[ev.status].variant} size="sm">{STATUS_CFG[ev.status].label}</Badge>
                    <span className="ml-2 text-[11px] font-bold text-white bg-slate-900/60 px-2 py-0.5 rounded-full">
                      {ev.type}
                    </span>
                  </div>
                  <button onClick={() => shareEvent(ev)}
                    className="p-1.5 rounded-lg bg-slate-900/60 text-slate-300 hover:text-white transition-colors cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white leading-tight">{ev.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{ev.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                {/* Ticket types */}
                <div className="space-y-1.5">
                  {ev.tickets.map(t => (
                    <div key={t.id} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">{t.name}</span>
                      <span className="font-mono text-slate-400">{t.sold}/{t.capacity} • <span className="text-emerald-400">{formatCurrency(t.price,'AOA')}</span></span>
                    </div>
                  ))}
                </div>

                {/* Capacity bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Capacidade</span>
                    <span className={`font-mono font-bold ${pct>=90?'text-rose-400':pct>=70?'text-amber-400':'text-emerald-400'}`}>{pct}% vendido</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct>=90?'bg-rose-500':pct>=70?'bg-amber-500':'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs">
                    <span className="text-slate-400">Receita: </span>
                    <span className="font-bold text-emerald-400 font-mono">{formatCurrency(ev.totalRevenue,'AOA')}</span>
                  </div>
                  <Button size="sm" variant="outline"
                    leftIcon={<Users className="w-3.5 h-3.5" />}
                    onClick={() => { setSelectedEvent(ev); setView('attendees'); }}>
                    Participantes ({ev.attendees.length})
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
