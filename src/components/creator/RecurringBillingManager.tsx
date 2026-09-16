// ==============================================================================
// MARTMARKET RECURRING BILLING & SUBSCRIPTION MANAGEMENT ENGINE
// Full lifecycle management: plans, billing cycles, failed payment retry,
// dunning logic, access pause/resume, and churn prevention automations.
// ==============================================================================

import React, { useState } from 'react';
import {
  RefreshCw, CreditCard, AlertTriangle, CheckCircle2,
  PauseCircle, PlayCircle, XCircle, Plus, Calendar,
  TrendingDown, Bell, Clock, Zap, Settings
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../lib/currencies';

type BillingStatus = 'ACTIVE' | 'PAUSED' | 'OVERDUE' | 'CANCELLED' | 'TRIALING';

interface SubscriptionPlan {
  id: string;
  productTitle: string;
  subscriber: string;
  subscriberEmail: string;
  plan: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  priceAOA: number;
  status: BillingStatus;
  nextBillingDate: string;
  failedAttempts: number;
  lastAttemptDate?: string;
  retryScheduled?: string;
  startedAt: string;
  totalCollected: number;
}

export const RecurringBillingManager: React.FC = () => {
  const { showToast } = useNotification();

  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([
    {
      id: 'sub-1',
      productTitle: 'Masterclass Fullstack: De Zero a SaaS',
      subscriber: 'Edson Morais',
      subscriberEmail: 'edson.morais@email.ao',
      plan: 'MONTHLY',
      priceAOA: 15000,
      status: 'ACTIVE',
      nextBillingDate: '2026-10-16',
      failedAttempts: 0,
      startedAt: '2026-01-16',
      totalCollected: 135000
    },
    {
      id: 'sub-2',
      productTitle: 'Clube de Gestão Financeira Premium',
      subscriber: 'Paula Ferreira',
      subscriberEmail: 'paula.ferreira@gmail.com',
      plan: 'MONTHLY',
      priceAOA: 8500,
      status: 'OVERDUE',
      nextBillingDate: '2026-09-10',
      failedAttempts: 2,
      lastAttemptDate: '2026-09-13',
      retryScheduled: '2026-09-17',
      startedAt: '2025-12-10',
      totalCollected: 85000
    },
    {
      id: 'sub-3',
      productTitle: 'Masterclass Fullstack: De Zero a SaaS',
      subscriber: 'Carlos Baptista',
      subscriberEmail: 'c.baptista@techluanda.ao',
      plan: 'ANNUAL',
      priceAOA: 150000,
      status: 'ACTIVE',
      nextBillingDate: '2027-09-16',
      failedAttempts: 0,
      startedAt: '2026-09-16',
      totalCollected: 150000
    },
    {
      id: 'sub-4',
      productTitle: 'Clube de Gestão Financeira Premium',
      subscriber: 'Maria Lourenço',
      subscriberEmail: 'maria.l@angola.com',
      plan: 'MONTHLY',
      priceAOA: 8500,
      status: 'PAUSED',
      nextBillingDate: '—',
      failedAttempts: 0,
      startedAt: '2026-05-01',
      totalCollected: 42500
    }
  ]);

  const handleAction = (id: string, action: 'PAUSE' | 'RESUME' | 'CANCEL' | 'RETRY') => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id !== id) return s;
      if (action === 'PAUSE') {
        showToast('info', `Assinatura de ${s.subscriber} pausada. Acesso suspenso até reativação.`);
        return { ...s, status: 'PAUSED', nextBillingDate: '—' };
      }
      if (action === 'RESUME') {
        const next = new Date(); next.setMonth(next.getMonth() + 1);
        showToast('success', `Assinatura de ${s.subscriber} reativada! Próxima cobrança em 30 dias.`);
        return { ...s, status: 'ACTIVE', nextBillingDate: next.toISOString().split('T')[0] };
      }
      if (action === 'CANCEL') {
        showToast('info', `Assinatura de ${s.subscriber} cancelada definitivamente.`);
        return { ...s, status: 'CANCELLED' };
      }
      if (action === 'RETRY') {
        showToast('success', `Tentativa de cobrança forçada para ${s.subscriber} via Multicaixa Express.`);
        return { ...s, failedAttempts: s.failedAttempts + 1, lastAttemptDate: new Date().toISOString().split('T')[0] };
      }
      return s;
    }));
  };

  const activeCount = subscriptions.filter(s => s.status === 'ACTIVE').length;
  const overdueCount = subscriptions.filter(s => s.status === 'OVERDUE').length;
  const mrrTotal = subscriptions
    .filter(s => s.status === 'ACTIVE')
    .reduce((sum, s) => {
      const monthly = s.plan === 'ANNUAL' ? s.priceAOA / 12 : s.plan === 'QUARTERLY' ? s.priceAOA / 3 : s.priceAOA;
      return sum + monthly;
    }, 0);

  const statusConfig: Record<BillingStatus, { label: string; variant: any; icon: React.ReactNode }> = {
    ACTIVE: { label: 'Ativo', variant: 'success', icon: <CheckCircle2 className="w-3 h-3" /> },
    PAUSED: { label: 'Pausado', variant: 'warning', icon: <PauseCircle className="w-3 h-3" /> },
    OVERDUE: { label: 'Em Atraso', variant: 'danger', icon: <AlertTriangle className="w-3 h-3" /> },
    CANCELLED: { label: 'Cancelado', variant: 'neutral', icon: <XCircle className="w-3 h-3" /> },
    TRIALING: { label: 'Trial', variant: 'primary', icon: <Clock className="w-3 h-3" /> }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="primary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Motor de Recorrência & Dunning Automático
        </Badge>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
          Assinaturas & Cobranças Recorrentes
        </h2>
        <p className="text-xs text-slate-400">
          Gerencie planos ativos, cobranças falhadas, tentativas automáticas e suspensão de acesso por inadimplência.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Assinantes Ativos</span>
          <div className="text-xl font-black text-white font-mono">{activeCount}</div>
          <span className="text-[10px] text-emerald-400">cobrança automática</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">MRR Estimado</span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {formatCurrency(Math.round(mrrTotal), 'AOA')}
          </div>
          <span className="text-[10px] text-slate-400">receita mensal recorrente</span>
        </div>
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 space-y-1">
          <span className="text-[11px] text-slate-400">Em Atraso / Dunning</span>
          <div className="text-xl font-black text-rose-400 font-mono">{overdueCount}</div>
          <span className="text-[10px] text-rose-400">tentativa automática agendada</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Churn Rate</span>
          <div className="text-xl font-black text-blue-400 font-mono">3.2%</div>
          <span className="text-[10px] text-slate-400">últimos 30 dias</span>
        </div>
      </div>

      {/* Dunning Alert */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-300 block">Atenção: {overdueCount} assinatura(s) em regime de Dunning</span>
            <span className="text-slate-400">
              O sistema enviará automaticamente notificações via WhatsApp e e-mail ao assinante e tentará a cobrança de novo em 3 dias. Após 3 tentativas falhadas, o acesso é suspenso automaticamente.
            </span>
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-200">Todos os Assinantes ({subscriptions.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Assinante</th>
                <th className="p-3.5">Produto & Plano</th>
                <th className="p-3.5">Valor</th>
                <th className="p-3.5">Próxima Cobrança</th>
                <th className="p-3.5">Total Arrecadado</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {subscriptions.map((s) => {
                const cfg = statusConfig[s.status];
                return (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{s.subscriber}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.subscriberEmail}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-200 max-w-[180px] truncate">{s.productTitle}</div>
                      <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                        {s.plan === 'MONTHLY' ? 'Mensal' : s.plan === 'QUARTERLY' ? 'Trimestral' : 'Anual'}
                      </span>
                      {s.failedAttempts > 0 && (
                        <span className="ml-1 text-[10px] font-mono bg-rose-900/50 border border-rose-700/40 px-1.5 py-0.5 rounded text-rose-400">
                          {s.failedAttempts} falha(s)
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-100">
                      {formatCurrency(s.priceAOA, 'AOA')}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      {s.nextBillingDate}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400 font-semibold">
                      {formatCurrency(s.totalCollected, 'AOA')}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={cfg.variant} size="sm" icon={cfg.icon}>
                        {cfg.label}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {s.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleAction(s.id, 'PAUSE')}
                            title="Pausar acesso"
                            className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(s.status === 'PAUSED' || s.status === 'OVERDUE') && (
                          <button
                            onClick={() => handleAction(s.id, 'RESUME')}
                            title="Reativar"
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}
                        {s.status === 'OVERDUE' && (
                          <button
                            onClick={() => handleAction(s.id, 'RETRY')}
                            title="Tentar cobrança agora"
                            className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        {s.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleAction(s.id, 'CANCEL')}
                            title="Cancelar assinatura"
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
