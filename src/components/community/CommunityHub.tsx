// ==============================================================================
// MARTMARKET STANDALONE COMMUNITY HUB (Skool / Kajabi style)
// A dedicated social space with channels, leaderboards, and meetups.
// ==============================================================================

import React, { useState } from 'react';
import { 
  MessageSquare, Users, Trophy, Calendar, Hash, 
  Search, Heart, MessageCircle, MoreHorizontal, 
  Plus, Video, Image as ImageIcon, Flame, Medal
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

type TabView = 'feed' | 'leaderboard' | 'meetups';

interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  authorLevel: number;
  timeAgo: string;
  channel: string;
  content: string;
  likes: number;
  comments: number;
  isLikedByMe: boolean;
  image?: string;
}

export const CommunityHub: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<TabView>('feed');
  const [activeChannel, setActiveChannel] = useState('geral');
  const [newPostContent, setNewPostContent] = useState('');

  const channels = [
    { id: 'geral', name: 'Geral', icon: '💬', count: 124 },
    { id: 'vitorias', name: 'Vitórias & Ganhos', icon: '🏆', count: 42 },
    { id: 'duvidas', name: 'Dúvidas Técnicas', icon: '❓', count: 89 },
    { id: 'networking', name: 'Networking Angola', icon: '🤝', count: 56 },
  ];

  const posts: Post[] = [
    {
      id: 'p1', author: 'Edson Morais', authorAvatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&auto=format&fit=crop&q=80',
      authorLevel: 12, timeAgo: '2 horas atrás', channel: 'vitorias',
      content: 'Pessoal, acabei de fechar a minha primeira venda usando o PayPay Angola! Muito obrigado ao grupo pelo feedback na minha página de vendas. 🙏🔥',
      likes: 34, comments: 8, isLikedByMe: true
    },
    {
      id: 'p2', author: 'Ana Cardoso', authorAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf366?w=100&auto=format&fit=crop&q=80',
      authorLevel: 25, timeAgo: '5 horas atrás', channel: 'geral',
      content: 'Atenção comunidade! Na próxima semana teremos o meetup mensal de revisão de funis. Deixem os vossos links abaixo para análise ao vivo!',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop&q=80',
      likes: 89, comments: 45, isLikedByMe: false
    },
    {
      id: 'p3', author: 'Carlos Baptista', authorAvatar: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=100&auto=format&fit=crop&q=80',
      authorLevel: 4, timeAgo: 'Ontem', channel: 'duvidas',
      content: 'Alguém já teve problemas com a taxa de aprovação do Multicaixa Express nos fins de semana? Estou a notar uma ligeira quebra de conversão.',
      likes: 12, comments: 23, isLikedByMe: false
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Ana Cardoso', level: 25, points: 14500, avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf366?w=100&auto=format&fit=crop&q=80', change: 'up' },
    { rank: 2, name: 'João Miguel', level: 22, points: 12300, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', change: 'same' },
    { rank: 3, name: 'Edson Morais', level: 12, points: 8400, avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&auto=format&fit=crop&q=80', change: 'up' },
    { rank: 4, name: 'Maria Santos', level: 9, points: 5100, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', change: 'down' },
  ];

  const filteredPosts = activeChannel === 'geral' ? posts : posts.filter(p => p.channel === activeChannel);

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* Left Sidebar - Channels & Nav */}
      <div className="w-64 shrink-0 flex flex-col gap-6">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white leading-tight">Elite Digital</h2>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 34 online</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <button onClick={() => setView('feed')}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${view === 'feed' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <MessageSquare className="w-4 h-4" /> Feed da Comunidade
            </button>
            <button onClick={() => setView('leaderboard')}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${view === 'leaderboard' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Trophy className="w-4 h-4" /> Classificação (Níveis)
            </button>
            <button onClick={() => setView('meetups')}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${view === 'meetups' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Calendar className="w-4 h-4" /> Eventos & Meetups
            </button>
          </div>
        </div>

        {view === 'feed' && (
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">Canais</div>
            {channels.map(ch => (
              <button key={ch.id} onClick={() => setActiveChannel(ch.id)}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${activeChannel === ch.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span>{ch.icon}</span> {ch.name}
                </div>
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded-md font-mono">{ch.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {view === 'feed' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-10 space-y-6">
            
            {/* Create Post */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <textarea 
                  value={newPostContent} onChange={e => setNewPostContent(e.target.value)}
                  placeholder="Partilhe uma vitória, faça uma pergunta ou inicie um debate..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none h-20"
                />
              </div>
              <div className="flex items-center justify-between pl-13">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"><ImageIcon className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"><Video className="w-4 h-4" /></button>
                </div>
                <Button size="sm" onClick={() => setNewPostContent('')}>Publicar no #{channels.find(c=>c.id===activeChannel)?.name}</Button>
              </div>
            </div>

            {/* Feed Posts */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div key={post.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 transition-colors hover:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-white">
                          {post.authorLevel}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200 text-sm">{post.author}</span>
                          <Badge variant="neutral" size="sm">Admin</Badge>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span>{post.timeAgo}</span> • 
                          <span className="text-blue-400 font-medium">#{channels.find(c=>c.id===post.channel)?.name}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-white cursor-pointer"><MoreHorizontal className="w-5 h-5" /></button>
                  </div>
                  
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {post.image && (
                    <img src={post.image} alt="" className="w-full h-64 object-cover rounded-2xl mb-4 border border-slate-800" />
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-800/50">
                    <button className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${post.isLikedByMe ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'}`}>
                      <Heart className={`w-4 h-4 ${post.isLikedByMe ? 'fill-current' : ''}`} /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition-colors">
                      <MessageCircle className="w-4 h-4" /> {post.comments} comentários
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'leaderboard' && (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex-1 overflow-y-auto">
            <div className="text-center mb-10 space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mb-2">
                <Flame className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white">Classificação da Comunidade</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Ganhe pontos ao publicar conteúdo de valor, ajudar outros membros e receber "Likes". Os top 3 recebem mentoria gratuita mensal.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              {leaderboard.map((user, idx) => (
                <div key={user.name} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${idx === 0 ? 'bg-amber-500/10 border-amber-500/30' : idx === 1 ? 'bg-slate-300/5 border-slate-400/20' : idx === 2 ? 'bg-amber-700/10 border-amber-700/30' : 'bg-slate-950/50 border-slate-800'}`}>
                  <div className="w-8 text-center font-black font-mono text-xl text-slate-500">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${user.rank}`}
                  </div>
                  <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-slate-800" />
                  <div className="flex-1">
                    <div className="font-bold text-white text-base">{user.name}</div>
                    <div className="text-xs text-slate-400">Nível {user.level}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-blue-400 font-mono text-lg">{user.points.toLocaleString()} pts</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'meetups' && (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <Calendar className="w-16 h-16 text-emerald-400 mb-2 opacity-50" />
            <h2 className="text-2xl font-black text-white">Próximos Meetups</h2>
            <p className="text-sm text-slate-400 max-w-sm">
              As sessões de mentoria em grupo da comunidade aparecem aqui. Terá acesso aos links de Zoom na hora do evento.
            </p>
            <div className="mt-8 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-left max-w-md w-full">
              <Badge variant="success" size="sm" className="mb-2">Amanhã • 19:00 (Luanda)</Badge>
              <h3 className="font-bold text-white text-lg">Revisão de Funis & Páginas de Vendas</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">Traga a sua página de vendas e vamos otimizar a conversão em grupo com os especialistas.</p>
              <Button size="sm" variant="primary" className="w-full">Adicionar ao Calendário</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
