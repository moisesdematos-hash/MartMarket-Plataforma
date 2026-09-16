// ==============================================================================
// MARTMARKET COURSE COMMUNITY SOCIAL FEED (COMMUNITY 2.0)
// High-engagement community feed where students and instructors interact,
// share progress milestones, post questions, and celebrate wins.
// ==============================================================================

import React, { useState } from 'react';
import { MessageSquare, Heart, Sparkles, Send, Pin, ThumbsUp, CheckCircle, Tag, Share2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface Post {
  id: string;
  authorName: string;
  authorRole: 'INSTRUCTOR' | 'STUDENT' | 'TOP_STUDENT';
  avatar: string;
  content: string;
  tag: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
  isPinned?: boolean;
}

interface CourseCommunityFeedProps {
  courseTitle: string;
}

export const CourseCommunityFeed: React.FC<CourseCommunityFeedProps> = ({
  courseTitle
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post-1',
      authorName: 'Kelson Manuel (Instrutor)',
      authorRole: 'INSTRUCTOR',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: '🚀 Sejam todos bem-vindos à turma 2026 da Masterclass! O Módulo 4 de Integração de Pagamentos com Multicaixa Express e PayPay acaba de ser atualizado com novas rotas de webhook!',
      tag: '#AvisosOficiais',
      likes: 48,
      commentsCount: 14,
      createdAt: 'Hoje às 10:30',
      isPinned: true
    },
    {
      id: 'post-2',
      authorName: 'Edivaldo Simões',
      authorRole: 'TOP_STUDENT',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      content: 'Acabei de colocar em produção o meu primeiro microsserviço em Go + React usando a arquitetura ensinada no Módulo 2! Obrigado a todos da comunidade pelo suporte nos testes.',
      tag: '#Vitórias',
      likes: 29,
      commentsCount: 6,
      createdAt: 'Há 3 horas'
    }
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('#Dúvidas');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const availableTags = ['#Dúvidas', '#Vitórias', '#Projetos', '#Networking', '#Sugestões'];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: user ? user.fullName : 'Aluno MartMarket',
      authorRole: 'STUDENT',
      avatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      content: newPostContent,
      tag: selectedTag,
      likes: 0,
      commentsCount: 0,
      createdAt: 'Agora'
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    showToast('success', 'Publicação compartilhada com a comunidade!');
  };

  const handleToggleLike = (postId: string) => {
    const isLiked = !!likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Create Post Card */}
      <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="font-bold">Compartilhar com a Turma</span>
        </div>

        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Compartilhe uma dúvida, insight ou conquista com os colegas..."
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!newPostContent.trim()}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Publicar
          </Button>
        </div>
      </form>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              post.isPinned
                ? 'bg-gradient-to-tr from-slate-900 via-slate-900 to-blue-950/40 border-blue-500/40 shadow-xl'
                : 'bg-slate-900 border-slate-800 shadow-md'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{post.authorName}</span>
                    {post.authorRole === 'INSTRUCTOR' && (
                      <Badge variant="primary" size="sm">Instrutor</Badge>
                    )}
                    {post.authorRole === 'TOP_STUDENT' && (
                      <Badge variant="warning" size="sm">Top Aluno</Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{post.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {post.isPinned && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                    <Pin className="w-3 h-3" /> Fixado
                  </span>
                )}
                <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  {post.tag}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Actions Bar */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-800/80 text-xs">
              <button
                onClick={() => handleToggleLike(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  likedPosts[post.id]
                    ? 'text-rose-400 bg-rose-500/10 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${likedPosts[post.id] ? 'fill-rose-400' : ''}`} />
                <span>{post.likes}</span>
              </button>

              <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.commentsCount} respostas</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
