// ==============================================================================
// MARTMARKET INTEGRATED SUPPORT CHAT & TICKET SYSTEM
// Real-time student-to-creator/support messaging, ticket queue, canned replies,
// SLA tracking and resolution status — embedded inside members area.
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Send, X, ChevronDown, CheckCheck,
  Clock, AlertCircle, CheckCircle2, User, Headphones,
  Search, Filter, MoreVertical, Paperclip, Smile
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  isSupport: boolean;
  text: string;
  timestamp: string;
  read: boolean;
}

interface SupportTicket {
  id: string;
  subject: string;
  studentName: string;
  studentAvatar: string;
  productTitle: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  lastMessage: string;
  unread: number;
  messages: ChatMessage[];
}

interface SupportChatProps {
  mode?: 'student' | 'support';
}

const STATUS_CFG: Record<TicketStatus, { label: string; variant: any; icon: React.ReactNode }> = {
  OPEN:        { label: 'Aberto',       variant: 'primary', icon: <AlertCircle className="w-3 h-3" /> },
  IN_PROGRESS: { label: 'Em Progresso', variant: 'warning', icon: <Clock className="w-3 h-3" />       },
  RESOLVED:    { label: 'Resolvido',    variant: 'success', icon: <CheckCircle2 className="w-3 h-3" />},
  CLOSED:      { label: 'Fechado',      variant: 'neutral', icon: <X className="w-3 h-3" />           },
};

const PRIORITY_CFG: Record<TicketPriority, { color: string }> = {
  LOW:    { color: 'text-slate-400'  },
  MEDIUM: { color: 'text-blue-400'   },
  HIGH:   { color: 'text-amber-400'  },
  URGENT: { color: 'text-rose-400'   },
};

const CANNED = [
  'Olá! Obrigado por entrar em contacto. Como posso ajudá-lo(a)?',
  'Já verificámos o seu caso e estamos a trabalhar numa solução.',
  'O seu certificado será emitido em até 24 horas após a conclusão.',
  'Para aceder ao material, vá a Área de Membros → Meus Cursos.',
  'O pagamento foi confirmado. O acesso já está liberado na sua conta.',
];

export const SupportChat: React.FC<SupportChatProps> = ({ mode = 'student' }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'tkt-1', subject: 'Não consigo aceder ao Módulo 4',
      studentName: 'Edson Morais', studentAvatar: 'https://i.pravatar.cc/40?img=11',
      productTitle: 'Masterclass Fullstack', status: 'IN_PROGRESS', priority: 'HIGH',
      createdAt: '2026-09-16T10:30:00Z', lastMessage: 'Já tentei várias vezes e o erro persiste.',
      unread: 2,
      messages: [
        { id: 'm1', senderId: 'usr-student', senderName: 'Edson Morais', senderAvatar: 'https://i.pravatar.cc/40?img=11', isSupport: false, text: 'Olá! Não consigo aceder ao Módulo 4. Aparece um erro 403.', timestamp: '2026-09-16T10:30:00Z', read: true },
        { id: 'm2', senderId: 'usr-support', senderName: 'Suporte MartMarket', senderAvatar: 'https://i.pravatar.cc/40?img=50', isSupport: true, text: 'Olá Edson! Obrigado por nos contactar. Pode indicar o navegador que está a usar?', timestamp: '2026-09-16T10:35:00Z', read: true },
        { id: 'm3', senderId: 'usr-student', senderName: 'Edson Morais', senderAvatar: 'https://i.pravatar.cc/40?img=11', isSupport: false, text: 'Estou a usar o Chrome 126. Já tentei várias vezes e o erro persiste.', timestamp: '2026-09-16T10:42:00Z', read: false },
      ]
    },
    {
      id: 'tkt-2', subject: 'Quando recebo o meu certificado?',
      studentName: 'Paula Ferreira', studentAvatar: 'https://i.pravatar.cc/40?img=20',
      productTitle: 'Gestão Financeira Premium', status: 'OPEN', priority: 'MEDIUM',
      createdAt: '2026-09-16T14:00:00Z', lastMessage: 'Completei o curso há 2 dias.',
      unread: 1,
      messages: [
        { id: 'm4', senderId: 'usr-student-2', senderName: 'Paula Ferreira', senderAvatar: 'https://i.pravatar.cc/40?img=20', isSupport: false, text: 'Completei o curso há 2 dias e ainda não recebi o certificado. Quando será emitido?', timestamp: '2026-09-16T14:00:00Z', read: false },
      ]
    },
    {
      id: 'tkt-3', subject: 'Reembolso do produto',
      studentName: 'Carlos Baptista', studentAvatar: 'https://i.pravatar.cc/40?img=33',
      productTitle: 'Masterclass Fullstack', status: 'RESOLVED', priority: 'URGENT',
      createdAt: '2026-09-15T09:00:00Z', lastMessage: 'Obrigado pela resolução rápida!',
      unread: 0,
      messages: [
        { id: 'm5', senderId: 'usr-student-3', senderName: 'Carlos Baptista', senderAvatar: 'https://i.pravatar.cc/40?img=33', isSupport: false, text: 'Preciso de solicitar reembolso. O conteúdo não corresponde ao descrito.', timestamp: '2026-09-15T09:00:00Z', read: true },
        { id: 'm6', senderId: 'usr-support', senderName: 'Suporte MartMarket', senderAvatar: 'https://i.pravatar.cc/40?img=50', isSupport: true, text: 'Processámos o reembolso de 75.000 Kz. Será creditado em 3-5 dias úteis.', timestamp: '2026-09-15T11:00:00Z', read: true },
        { id: 'm7', senderId: 'usr-student-3', senderName: 'Carlos Baptista', senderAvatar: 'https://i.pravatar.cc/40?img=33', isSupport: false, text: 'Obrigado pela resolução rápida!', timestamp: '2026-09-15T11:30:00Z', read: true },
      ]
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket>(tickets[0]);
  const [inputText, setInputText] = useState('');
  const [showCanned, setShowCanned] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket.messages]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: user?.id || 'usr-support',
      senderName: mode === 'support' ? 'Suporte MartMarket' : (user?.fullName || 'Aluno'),
      senderAvatar: user?.avatarUrl || 'https://i.pravatar.cc/40?img=50',
      isSupport: mode === 'support',
      text, timestamp: new Date().toISOString(), read: false
    };

    setTickets(prev => prev.map(t => t.id === selectedTicket.id
      ? { ...t, messages: [...t.messages, newMsg], lastMessage: text, status: t.status === 'OPEN' ? 'IN_PROGRESS' : t.status }
      : t
    ));
    setSelectedTicket(prev => ({
      ...prev, messages: [...prev.messages, newMsg],
      lastMessage: text, status: prev.status === 'OPEN' ? 'IN_PROGRESS' : prev.status
    }));
    setInputText('');
  };

  const resolveTicket = () => {
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'RESOLVED' } : t));
    setSelectedTicket(prev => ({ ...prev, status: 'RESOLVED' }));
    showToast('success', 'Ticket marcado como resolvido.');
  };

  const filteredTickets = tickets.filter(t =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.studentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <Badge variant="primary" size="sm" icon={<Headphones className="w-3.5 h-3.5" />}>
          Central de Suporte Integrada
        </Badge>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Chat & Tickets de Suporte</h2>
        <p className="text-xs text-slate-400">Responda às dúvidas dos alunos diretamente na plataforma, com histórico completo e SLA de atendimento.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Tickets Abertos',     v: tickets.filter(t=>t.status==='OPEN').length,        c: 'text-blue-400'   },
          { label: 'Em Progresso',        v: tickets.filter(t=>t.status==='IN_PROGRESS').length,  c: 'text-amber-400'  },
          { label: 'Resolvidos Hoje',     v: tickets.filter(t=>t.status==='RESOLVED').length,     c: 'text-emerald-400'},
          { label: 'Mensagens Não Lidas', v: tickets.reduce((s,t)=>s+t.unread,0),                 c: 'text-rose-400'   },
        ].map(k => (
          <div key={k.label} className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className={`text-2xl font-black font-mono ${k.c}`}>{k.v}</div>
            <div className="text-[11px] text-slate-400">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Main layout: ticket list + chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[540px]">

        {/* Ticket List */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Pesquisar tickets..."
                className="w-full bg-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-300 placeholder:text-slate-500 border border-slate-700" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
            {filteredTickets.map(ticket => (
              <button key={ticket.id}
                onClick={()=>setSelectedTicket(ticket)}
                className={`w-full p-3 text-left transition-colors hover:bg-slate-800/60 cursor-pointer ${selectedTicket.id===ticket.id?'bg-blue-600/10 border-l-2 border-blue-500':''}`}>
                <div className="flex items-start gap-2">
                  <img src={ticket.studentAvatar} alt="" className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">{ticket.studentName}</span>
                      {ticket.unread > 0 && (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">{ticket.unread}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">{ticket.subject}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{ticket.lastMessage}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant={STATUS_CFG[ticket.status].variant} size="sm">{STATUS_CFG[ticket.status].label}</Badge>
                      <span className={`text-[10px] font-bold ${PRIORITY_CFG[ticket.priority].color}`}>{ticket.priority}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={selectedTicket.studentAvatar} alt="" className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-xs font-bold text-white">{selectedTicket.studentName}</div>
                <div className="text-[10px] text-slate-400">{selectedTicket.productTitle} • {selectedTicket.subject}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={STATUS_CFG[selectedTicket.status].variant} size="sm">
                {STATUS_CFG[selectedTicket.status].label}
              </Badge>
              {selectedTicket.status !== 'RESOLVED' && (
                <button onClick={resolveTicket}
                  className="text-[11px] text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors cursor-pointer">
                  Resolver
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedTicket.messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.isSupport ? 'flex-row-reverse' : 'flex-row'}`}>
                <img src={msg.senderAvatar} alt="" className="w-7 h-7 rounded-full shrink-0 mt-0.5" />
                <div className={`max-w-[75%] space-y-1 ${msg.isSupport ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.isSupport
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  <div className="text-[10px] text-slate-500 px-1 flex items-center gap-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                    {msg.isSupport && <CheckCheck className="w-3 h-3 text-blue-400" />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Canned Replies */}
          {showCanned && (
            <div className="mx-3 mb-2 p-2 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold px-1">Respostas Rápidas</div>
              {CANNED.map((c, i) => (
                <button key={i} onClick={()=>{setInputText(c);setShowCanned(false);}}
                  className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-1.5 rounded-lg transition-colors cursor-pointer truncate">
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-800 flex items-center gap-2">
            <button onClick={()=>setShowCanned(!showCanned)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Respostas rápidas">
              <Smile className="w-4 h-4" />
            </button>
            <input value={inputText} onChange={e=>setInputText(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),sendMessage())}
              placeholder="Escreva a sua resposta..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500" />
            <button onClick={sendMessage} disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
