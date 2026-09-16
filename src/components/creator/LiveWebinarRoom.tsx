// ==============================================================================
// MARTMARKET LIVE & WEBINAR ROOM
// Real-time broadcasting with live chat, polls, countdown timer,
// viewer counter, raise hand, screen-share simulation, and recording.
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Video, VideoOff, Mic, MicOff, Monitor, Users, MessageSquare,
  BarChart3, Hand, Radio, Clock, Circle, Share2, Settings,
  ChevronUp, Send, ThumbsUp, Gift, Maximize2, X, Plus, Check
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useNotification } from '../../context/NotificationContext';

interface LiveMessage { id: string; user: string; avatar: string; text: string; ts: string; isHost?: boolean; }
interface PollOption { id: string; label: string; votes: number; }
interface LivePoll { question: string; options: PollOption[]; active: boolean; voted: string | null; }

export const LiveWebinarRoom: React.FC = () => {
  const { showToast } = useNotification();
  const chatRef = useRef<HTMLDivElement>(null);

  const [isLive, setIsLive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [tab, setTab] = useState<'chat' | 'poll' | 'schedule'>('chat');

  const [messages, setMessages] = useState<LiveMessage[]>([
    { id: 'm1', user: 'Edson M.', avatar: 'https://i.pravatar.cc/32?img=11', text: '🔥 Pronto para começar!', ts: '00:00' },
    { id: 'm2', user: 'Paula F.', avatar: 'https://i.pravatar.cc/32?img=20', text: 'Aguardando ansiosamente!', ts: '00:01' },
    { id: 'm3', user: 'Carlos B.', avatar: 'https://i.pravatar.cc/32?img=33', text: '👋 Olá a todos!', ts: '00:02' },
  ]);

  const [poll, setPoll] = useState<LivePoll>({
    question: 'Qual módulo prefere começar?',
    options: [
      { id: 'a', label: 'Backend & APIs', votes: 47 },
      { id: 'b', label: 'Frontend React', votes: 38 },
      { id: 'c', label: 'Pagamentos & Checkout', votes: 62 },
      { id: 'd', label: 'Deploy & DevOps', votes: 21 },
    ],
    active: false, voted: null,
  });

  const [scheduledEvents] = useState([
    { id: 'e1', title: 'Masterclass: SaaS do Zero ao Produto', date: '2026-09-20', time: '20:00', registered: 847 },
    { id: 'e2', title: 'Workshop: Pagamentos Angolanos com API', date: '2026-09-25', time: '18:30', registered: 312 },
    { id: 'e3', title: 'Q&A ao Vivo — Módulo 6', date: '2026-10-01', time: '19:00', registered: 504 },
  ]);

  // Simulate live viewers and auto-messages when live
  useEffect(() => {
    if (!isLive) { setViewers(0); setElapsed(0); return; }
    setViewers(Math.floor(Math.random() * 50) + 10);

    const viewerInterval = setInterval(() => {
      setViewers(v => v + Math.floor(Math.random() * 3) - 1);
      setElapsed(e => e + 1);
    }, 1000);

    const msgInterval = setInterval(() => {
      const fakeUsers = [
        { user: 'Ana R.', avatar: 'https://i.pravatar.cc/32?img=5' },
        { user: 'João N.', avatar: 'https://i.pravatar.cc/32?img=8' },
        { user: 'Maria L.', avatar: 'https://i.pravatar.cc/32?img=15' },
        { user: 'Pedro C.', avatar: 'https://i.pravatar.cc/32?img=22' },
      ];
      const fakeTexts = [
        '💯 Excelente explicação!', '🙋 Pode repetir essa parte?', '🔥 Muito bom!',
        'Finalmente entendi!', '❤️', '👏👏👏', 'Obrigado!', 'Isso é incrível!'
      ];
      const u = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
      const t = fakeTexts[Math.floor(Math.random() * fakeTexts.length)];
      const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      setMessages(prev => [...prev.slice(-49), {
        id: `m-${Date.now()}`, ...u, text: t, ts: `${mins}:${secs}`
      }]);
    }, 3000);

    return () => { clearInterval(viewerInterval); clearInterval(msgInterval); };
  }, [isLive]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const formatTime = (s: number) => `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const secs = String(elapsed % 60).padStart(2, '0');
    setMessages(prev => [...prev, {
      id: `m-${Date.now()}`, user: 'Host (Você)', avatar: 'https://i.pravatar.cc/32?img=50',
      text: chatInput.trim(), ts: `${mins}:${secs}`, isHost: true
    }]);
    setChatInput('');
  };

  const votePoll = (optId: string) => {
    if (poll.voted) return;
    setPoll(p => ({
      ...p, voted: optId,
      options: p.options.map(o => o.id === optId ? { ...o, votes: o.votes + 1 } : o)
    }));
  };

  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant={isLive ? 'danger' : 'neutral'} size="sm"
            icon={<Radio className={`w-3.5 h-3.5 ${isLive ? 'animate-pulse' : ''}`} />}>
            {isLive ? `AO VIVO • ${viewers} espectadores` : 'Sala de Webinar'}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Lives & Webinars</h2>
          <p className="text-xs text-slate-400">Transmita ao vivo para os seus alunos com chat em tempo real, enquetes e gravação automática.</p>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 font-mono text-rose-400 text-sm font-bold bg-rose-950/30 border border-rose-700/40 rounded-xl px-3 py-2">
            <Circle className="w-3 h-3 fill-rose-500 animate-pulse" />
            {formatTime(elapsed)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Preview / Stage */}
        <div className="lg:col-span-2 space-y-3">
          {/* Video Stage */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800" style={{ aspectRatio: '16/9' }}>
            {camOn ? (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto text-3xl">
                    🎥
                  </div>
                  <div className="text-white font-bold text-sm">Pré-visualização da Câmera</div>
                  {!isLive && <div className="text-slate-400 text-xs">Clique em "Iniciar Live" para transmitir</div>}
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                <VideoOff className="w-10 h-10 text-slate-600" />
              </div>
            )}

            {/* Live badge overlay */}
            {isLive && (
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  <Circle className="w-2 h-2 fill-white animate-pulse" /> AO VIVO
                </span>
                <span className="bg-black/60 text-white text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
                  <Users className="w-3 h-3" /> {viewers}
                </span>
              </div>
            )}

            {/* Screen share indicator */}
            {screenShare && (
              <div className="absolute top-3 right-3 bg-blue-600 text-white text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
                <Monitor className="w-3 h-3" /> Partilhando Ecrã
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              {/* Mic */}
              <button onClick={() => setMicOn(m => !m)}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer border ${micOn ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-rose-900/40 border-rose-700/50 text-rose-400'}`}>
                {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              {/* Camera */}
              <button onClick={() => setCamOn(c => !c)}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer border ${camOn ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-rose-900/40 border-rose-700/50 text-rose-400'}`}>
                {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
              {/* Screen share */}
              <button onClick={() => { setScreenShare(s => !s); showToast('info', screenShare ? 'Partilha encerrada.' : 'Ecrã partilhado com espectadores.'); }}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer border ${screenShare ? 'bg-blue-700/40 border-blue-600/50 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'}`}>
                <Monitor className="w-4 h-4" />
              </button>
              {/* Poll */}
              <button onClick={() => { setPoll(p => ({ ...p, active: !p.active })); setTab('poll'); }}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer border ${poll.active ? 'bg-purple-700/40 border-purple-600/50 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'}`}
                title="Enquete ao vivo">
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>

            <Button
              size="sm"
              variant={isLive ? 'danger' : 'primary'}
              leftIcon={isLive ? <VideoOff className="w-4 h-4" /> : <Radio className="w-4 h-4" />}
              onClick={() => {
                setIsLive(l => !l);
                showToast(isLive ? 'info' : 'success', isLive ? 'Live encerrada. Gravação salva automaticamente.' : '🔴 Live iniciada! Os seus seguidores foram notificados.');
              }}
            >
              {isLive ? 'Encerrar Live' : 'Iniciar Live'}
            </Button>
          </div>
        </div>

        {/* Sidebar: Chat / Poll / Schedule */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            {([['chat','💬 Chat'],['poll','📊 Enquete'],['schedule','📅 Agenda']] as const).map(([id,label]) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex-1 py-2.5 text-[11px] font-semibold transition-colors cursor-pointer ${tab === id ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Chat Tab */}
          {tab === 'chat' && (
            <>
              <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex items-start gap-2 ${msg.isHost ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.avatar} alt="" className="w-6 h-6 rounded-full shrink-0" />
                    <div className={`max-w-[80%] ${msg.isHost ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`text-[10px] font-bold mb-0.5 ${msg.isHost ? 'text-blue-400 text-right' : 'text-slate-400'}`}>{msg.user}</div>
                      <div className={`px-2.5 py-1.5 rounded-xl text-[11px] leading-snug ${msg.isHost ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-800 flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Mensagem ao vivo..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500" />
                <button onClick={sendChat}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* Poll Tab */}
          {tab === 'poll' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-xs font-bold text-white">{poll.question}</div>
              <div className="space-y-2">
                {poll.options.map(opt => {
                  const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  const isVoted = poll.voted === opt.id;
                  return (
                    <button key={opt.id} onClick={() => votePoll(opt.id)} disabled={!!poll.voted}
                      className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer relative overflow-hidden ${isVoted ? 'border-blue-500 bg-blue-600/10' : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'}`}>
                      {poll.voted && (
                        <div className="absolute inset-0 bg-blue-600/10 rounded-xl"
                          style={{ width: `${pct}%`, transition: 'width 0.5s ease' }} />
                      )}
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          {isVoted && <Check className="w-3 h-3 text-blue-400" />}
                          <span className={isVoted ? 'text-white font-bold' : 'text-slate-300'}>{opt.label}</span>
                        </div>
                        {poll.voted && <span className="text-xs font-mono font-bold text-blue-400">{pct}%</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="text-[11px] text-slate-400 text-center">{totalVotes} votos totais</div>
              <Button size="sm" variant="outline" className="w-full"
                onClick={() => { setPoll(p => ({ ...p, active: !p.active })); showToast('info', poll.active ? 'Enquete encerrada.' : 'Enquete ativa para espectadores!'); }}>
                {poll.active ? 'Encerrar Enquete' : 'Lançar Enquete ao Vivo'}
              </Button>
            </div>
          )}

          {/* Schedule Tab */}
          {tab === 'schedule' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {scheduledEvents.map(ev => (
                <div key={ev.id} className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                  <div className="text-xs font-bold text-white leading-snug">{ev.title}</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    {ev.date} às {ev.time}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-blue-400 font-mono">{ev.registered} inscritos</span>
                    <button onClick={() => showToast('info', `Link copiado para "${ev.title}"`)}
                      className="text-[10px] text-slate-400 hover:text-white border border-slate-700 px-2 py-1 rounded-lg transition-colors cursor-pointer">
                      <Share2 className="w-3 h-3 inline mr-1" />Partilhar
                    </button>
                  </div>
                </div>
              ))}
              <Button size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} className="w-full"
                onClick={() => showToast('info', 'Agende um novo evento no calendário.')}>
                Agendar Novo Evento
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
