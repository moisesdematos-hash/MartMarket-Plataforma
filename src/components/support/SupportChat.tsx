import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, CheckCheck, Headphones, AlertCircle, Clock, CheckCircle2, Smile, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { supabase } from '../../lib/supabase';
import { AICopilotService } from '../../services/ai/aiCopilot';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

interface SupportTicket {
  id: string;
  product_id: string;
  buyer_id: string;
  creator_id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  
  buyer_profile?: { full_name: string; avatar_url: string };
  creator_profile?: { full_name: string; avatar_url: string };
  product?: { title: string };
  
  messages?: ChatMessage[];
  unread?: number;
}

interface ChatMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  text: string;
  is_read: boolean;
  created_at: string;
  sender_profile?: { full_name: string; avatar_url: string };
}

interface SupportChatProps {
  mode?: 'student' | 'support';
}

const STATUS_CFG: Record<TicketStatus, { label: string; variant: any; icon: React.ReactNode }> = {
  OPEN:        { label: 'Aberto',       variant: 'primary', icon: <AlertCircle className="w-3 h-3" /> },
  IN_PROGRESS: { label: 'Em Progresso', variant: 'warning', icon: <Clock className="w-3 h-3" /> },
  RESOLVED:    { label: 'Resolvido',    variant: 'success', icon: <CheckCircle2 className="w-3 h-3" /> },
};

const PRIORITY_CFG: Record<TicketPriority, { label: string; color: string }> = {
  LOW:    { label: 'Baixa',  color: 'text-slate-400' },
  NORMAL: { label: 'Normal', color: 'text-blue-400' },
  HIGH:   { label: 'Alta',   color: 'text-amber-400' },
  URGENT: { label: 'Urgente',color: 'text-rose-400' },
};

const CANNED = [
  "Olá! Muito obrigado pelo contacto. Como posso ajudar com este módulo?",
  "O reembolso foi processado com sucesso. O valor deverá ficar disponível em 3-5 dias úteis.",
  "Estou a verificar o seu problema com o acesso. Volto já com novidades.",
  "Ainda precisa de ajuda com este tópico ou posso marcar o ticket como resolvido?"
];

export const SupportChat: React.FC<SupportChatProps> = ({ mode = 'support' }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { showToast } = useNotification();
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [inputText, setInputText] = useState('');
  const [showCanned, setShowCanned] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchTickets = async () => {
      setLoading(true);
      const query = supabase.from('support_tickets').select(`*, buyer_profile:user_profiles!buyer_id(full_name, avatar_url), creator_profile:user_profiles!creator_id(full_name, avatar_url), product:products!product_id(title)`).order('created_at', { ascending: false });

      if (mode === 'support') {
        query.eq('creator_id', user.id);
      } else {
        query.eq('buyer_id', user.id);
      }

      const { data, error } = await query;
      if (!error && data) {
        setTickets(data as any);
        if (data.length > 0) setSelectedTicket(data[0] as any);
      }
      setLoading(false);
    };

    fetchTickets();
  }, [user, mode]);

  useEffect(() => {
    if (!selectedTicket || !user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase.from('support_messages')
        .select('*, sender_profile:user_profiles!sender_id(full_name, avatar_url)')
        .eq('ticket_id', selectedTicket.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setSelectedTicket(prev => prev ? { ...prev, messages: data as any } : null);
      }
    };

    fetchMessages();

    const channel = supabase.channel(`ticket-${selectedTicket.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'support_messages',
        filter: `ticket_id=eq.${selectedTicket.id}`
      }, payload => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTicket?.id, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || !selectedTicket || !user) return;

    setInputText('');
    
    const { error } = await supabase.from('support_messages').insert({
      ticket_id: selectedTicket.id,
      sender_id: user.id,
      text: text
    });

    if (error) {
      showToast('error', 'Falha ao enviar mensagem.');
    }
  };

  const resolveTicket = async () => {
    if (!selectedTicket) return;
    
    const { error } = await supabase.from('support_tickets')
      .update({ status: 'RESOLVED' })
      .eq('id', selectedTicket.id);

    if (!error) {
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'RESOLVED' } : t));
      setSelectedTicket(prev => prev ? { ...prev, status: 'RESOLVED' } : null);
      showToast('success', 'Ticket resolvido com sucesso!');
    }
  };

  const handleAiSuggest = async () => {
    if (!selectedTicket || !selectedTicket.messages || selectedTicket.messages.length === 0) {
      showToast('error', 'Sem histórico de mensagens para a IA analisar.');
      return;
    }

    // A última mensagem deve ser do aluno
    const lastMsg = selectedTicket.messages[selectedTicket.messages.length - 1];
    if (lastMsg.sender_id === user?.id) {
      showToast('info', 'A última mensagem já é sua.');
      return;
    }

    setIsAiLoading(true);
    setShowCanned(false);
    try {
      const creatorName = user?.fullName || 'Equipa de Suporte';
      const productTitle = selectedTicket.product?.title || 'Produto Digital';
      const reply = await AICopilotService.generateSupportReply(selectedTicket.subject, productTitle, lastMsg.text, creatorName);
      setInputText(reply);
      showToast('success', 'Resposta sugerida pela IA (Llama 3)!');
    } catch (err) {
      showToast('error', 'Falha ao gerar resposta com IA.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const pName = mode === 'support' ? t.buyer_profile?.full_name : t.creator_profile?.full_name;
    return t.subject.toLowerCase().includes(search.toLowerCase()) || 
           (pName || '').toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-800 rounded w-3/4"></div></div></div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <Badge variant="primary" size="sm" icon={<Headphones className="w-3.5 h-3.5" />}>
          Central de Suporte Integrada
        </Badge>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Chat & Tickets de Suporte</h2>
        <p className="text-xs text-slate-400">Responda às dúvidas dos alunos diretamente na plataforma, com histórico completo.</p>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center p-10 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">Não existem tickets de suporte no momento.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[540px]">
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
            {filteredTickets.map(ticket => {
              const partnerName = mode === 'support' ? ticket.buyer_profile?.full_name : ticket.creator_profile?.full_name;
              const partnerAvatar = mode === 'support' ? ticket.buyer_profile?.avatar_url : ticket.creator_profile?.avatar_url;
              return (
              <button key={ticket.id}
                onClick={()=>setSelectedTicket(ticket)}
                className={`w-full p-3 text-left transition-colors hover:bg-slate-800/60 cursor-pointer ${selectedTicket?.id===ticket.id?'bg-blue-600/10 border-l-2 border-blue-500':''}`}>
                <div className="flex items-start gap-2">
                  <img src={partnerAvatar || 'https://i.pravatar.cc/40?img=50'} alt="" className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">{partnerName || 'Anónimo'}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">{ticket.subject}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant={STATUS_CFG[ticket.status].variant} size="sm">{STATUS_CFG[ticket.status].label}</Badge>
                    </div>
                  </div>
                </div>
              </button>
            )})}
          </div>
        </div>

        {selectedTicket ? (
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={(mode === 'support' ? selectedTicket.buyer_profile?.avatar_url : selectedTicket.creator_profile?.avatar_url) || 'https://i.pravatar.cc/40?img=50'} alt="" className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-xs font-bold text-white">{(mode === 'support' ? selectedTicket.buyer_profile?.full_name : selectedTicket.creator_profile?.full_name) || 'Anónimo'}</div>
                <div className="text-[10px] text-slate-400">{selectedTicket.product?.title} • {selectedTicket.subject}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={STATUS_CFG[selectedTicket.status].variant} size="sm">
                {STATUS_CFG[selectedTicket.status].label}
              </Badge>
              {selectedTicket.status !== 'RESOLVED' && mode === 'support' && (
                <button onClick={resolveTicket}
                  className="text-[11px] text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors cursor-pointer">
                  Resolver
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(selectedTicket.messages || []).map(msg => {
              const isMe = msg.sender_id === user?.id;
              return (
              <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <img src={msg.sender_profile?.avatar_url || 'https://i.pravatar.cc/40'} alt="" className="w-7 h-7 rounded-full shrink-0 mt-0.5" />
                <div className={`max-w-[75%] space-y-1 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  <div className="text-[10px] text-slate-500 px-1 flex items-center gap-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                    {isMe && <CheckCheck className="w-3 h-3 text-blue-400" />}
                  </div>
                </div>
              </div>
            )})}
            <div ref={bottomRef} />
          </div>

          {showCanned && mode === 'support' && (
            <div className="mx-3 mb-2 p-2 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
              <div className="flex items-center justify-between px-1 mb-2">
                <div className="text-[10px] text-slate-400 font-bold">Respostas Rápidas</div>
                <button onClick={handleAiSuggest} disabled={isAiLoading}
                  className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-600/10 hover:bg-blue-600/20 px-2 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50">
                  {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Gerar com IA
                </button>
              </div>
              {CANNED.map((c, i) => (
                <button key={i} onClick={()=>{setInputText(c);setShowCanned(false);}}
                  className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-1.5 rounded-lg transition-colors cursor-pointer truncate">
                  {c}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-slate-800 flex items-center gap-2">
            {mode === 'support' && (
              <button onClick={()=>setShowCanned(!showCanned)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="Respostas rápidas">
                <Smile className="w-4 h-4" />
              </button>
            )}
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
        ) : (
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <p className="text-slate-500">Selecione um ticket para ver as mensagens.</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
};
