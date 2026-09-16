// ==============================================================================
// MARTMARKET CREATOR REWARDS & GAMIFICATION
// Revenue milestone plaques (Black, Snipper, etc) tracking for creators.
// ==============================================================================

import React from 'react';
import { 
  Trophy, Star, Crown, Target, Zap, Rocket,
  CheckCircle2, Lock, Share2
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../lib/currencies';

interface Milestone {
  id: string;
  title: string;
  revenue: number;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
  color: string;
  plaqueDesc: string;
}

export const CreatorRewards: React.FC = () => {
  const { showToast } = useNotification();
  const currentRevenue = 12500000; // 12.5M Kz

  const milestones: Milestone[] = [
    { id: 'm1', title: 'Primeira Venda', revenue: 1, unlocked: true, unlockedAt: '2025-05-10', icon: '🎉', color: 'from-blue-400 to-indigo-500', plaqueDesc: 'Crachá Digital Inicial' },
    { id: 'm2', title: '10K Club', revenue: 10000, unlocked: true, unlockedAt: '2025-05-15', icon: '🥉', color: 'from-amber-600 to-amber-700', plaqueDesc: 'Crachá Bronze' },
    { id: 'm3', title: '1 Milhão Kz', revenue: 1000000, unlocked: true, unlockedAt: '2025-09-20', icon: '🥈', color: 'from-slate-300 to-slate-400', plaqueDesc: 'Placa Física de Prata 1M' },
    { id: 'm4', title: '10 Milhões Kz', revenue: 10000000, unlocked: true, unlockedAt: '2026-08-05', icon: '🥇', color: 'from-yellow-400 to-amber-500', plaqueDesc: 'Placa Física de Ouro 10M' },
    { id: 'm5', title: '50 Milhões Kz', revenue: 50000000, unlocked: false, icon: '💎', color: 'from-cyan-400 to-blue-500', plaqueDesc: 'Placa Diamante Negro 50M' },
    { id: 'm6', title: '100 Milhões Kz (Black)', revenue: 100000000, unlocked: false, icon: '🖤', color: 'from-slate-800 to-black', plaqueDesc: 'Placa "MartMarket Black" (Mármore)' },
  ];

  const nextMilestone = milestones.find(m => !m.unlocked);
  const progressPct = nextMilestone ? Math.min(100, (currentRevenue / nextMilestone.revenue) * 100) : 100;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<Trophy className="w-3.5 h-3.5" />}>
            MartMarket Rewards
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Conquistas & Premiações</h2>
          <p className="text-xs text-slate-400">Acompanhe a sua jornada. Atinga as metas de faturação e receba placas físicas em casa.</p>
        </div>
      </div>

      {/* Progress to next plaque */}
      {nextMilestone && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shrink-0 bg-gradient-to-br ${nextMilestone.color} shadow-2xl shadow-blue-500/20`}>
              {nextMilestone.icon}
            </div>
            
            <div className="flex-1 w-full space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Próxima Conquista</div>
                  <h3 className="text-xl font-black text-white">{nextMilestone.title}</h3>
                  <div className="text-xs text-slate-400">{nextMilestone.plaqueDesc}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-white">{formatCurrency(currentRevenue, 'AOA')}</div>
                  <div className="text-[10px] text-slate-500 font-mono">de {formatCurrency(nextMilestone.revenue, 'AOA')}</div>
                </div>
              </div>
              
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${nextMilestone.color} rounded-full relative`}
                  style={{ width: `${progressPct}%` }}>
                  <div className="absolute top-0 bottom-0 right-0 w-8 bg-white/20 blur-sm" />
                </div>
              </div>
              <div className="text-right text-[11px] font-bold text-blue-400">{progressPct.toFixed(1)}% concluído</div>
            </div>
          </div>
        </div>
      )}

      {/* Milestones Grid */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" /> Histórico de Conquistas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map(m => (
            <div key={m.id} className={`p-5 rounded-2xl border transition-all ${m.unlocked ? 'bg-slate-900 border-slate-700' : 'bg-slate-950/50 border-slate-800 opacity-60 grayscale'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${m.color} shadow-lg`}>
                  {m.icon}
                </div>
                {m.unlocked ? (
                  <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>Desbloqueado</Badge>
                ) : (
                  <Badge variant="neutral" size="sm" icon={<Lock className="w-3 h-3" />}>Bloqueado</Badge>
                )}
              </div>
              
              <h4 className="font-bold text-white text-base">{m.title}</h4>
              <div className="text-xs text-slate-400 mt-1 mb-3">{m.plaqueDesc}</div>
              
              <div className="font-mono text-sm font-bold text-slate-300 border-t border-slate-800 pt-3">
                {formatCurrency(m.revenue, 'AOA')}
              </div>
              
              {m.unlocked && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[10px] text-slate-500">
                    Atingido a {m.unlockedAt}
                  </div>
                  <button onClick={() => showToast('info', 'Link de partilha copiado! Mostre o seu sucesso no Instagram.')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer">
                    <Share2 className="w-3 h-3" /> Partilhar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
