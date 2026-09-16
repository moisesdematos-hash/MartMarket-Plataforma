// ==============================================================================
// MARTMARKET LESSON DISCUSSION FORUM & STUDENT Q&A
// ==============================================================================

import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar?: string;
  isInstructor: boolean;
  content: string;
  createdAt: string;
  upvotes: number;
}

interface LessonDiscussionProps {
  lessonId: string;
  lessonTitle: string;
}

export const LessonDiscussion: React.FC<LessonDiscussionProps> = ({
  lessonId,
  lessonTitle
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'comm-1',
      authorName: 'António Silva',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      isInstructor: false,
      content: 'Excelente explicação sobre os webhooks e conciliação bancária! No caso do Multicaixa Express, o tempo de timeout padrão de 15 minutos é suficiente para a maioria dos casos?',
      createdAt: 'Há 1 dia',
      upvotes: 4
    },
    {
      id: 'comm-2',
      authorName: 'Kelson Manuel',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
      isInstructor: true,
      content: 'Sim, António! 15 minutos é o tempo ideal recomendado pela EMIS. Se o utilizador não confirmar o PIN no telemóvel dentro deste prazo, a transação expira de forma segura sem risco de duplicidade.',
      createdAt: 'Há 18 horas',
      upvotes: 7
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const item: CommentItem = {
      id: `comm_${Date.now()}`,
      authorName: user ? user.fullName : 'Aluno MartMarket',
      authorAvatar: user?.avatarUrl,
      isInstructor: user?.role === 'CREATOR' || user?.role === 'SUPER_ADMIN',
      content: newComment,
      createdAt: 'Agora mesmo',
      upvotes: 0
    };

    setComments((prev) => [item, ...prev]);
    setNewComment('');
    showToast('success', 'A sua pergunta ou comentário foi publicado!');
  };

  const handleUpvote = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c))
    );
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-xs text-slate-300">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-sm text-slate-100">Dúvidas & Discussão da Aula ({comments.length})</h3>
        </div>
        <span className="text-[11px] text-slate-500">Respostas diretas do instrutor</span>
      </div>

      {/* New comment input */}
      <form onSubmit={handlePostComment} className="space-y-3">
        <textarea
          rows={2}
          placeholder="Ficou com alguma dúvida nesta aula? Escreva aqui..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Publicar Dúvida
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`p-4 rounded-2xl border space-y-2 ${
              comment.isInstructor
                ? 'bg-blue-950/20 border-blue-500/30'
                : 'bg-slate-950 border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={comment.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover border border-slate-700"
                />
                <span className="font-bold text-xs text-slate-200">{comment.authorName}</span>
                {comment.isInstructor && (
                  <Badge variant="primary" size="sm">
                    Instrutor
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{comment.createdAt}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pl-8">
              {comment.content}
            </p>

            <div className="pl-8 pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleUpvote(comment.id)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{comment.upvotes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
