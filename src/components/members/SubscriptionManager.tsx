// ==============================================================================
// MARTMARKET SUBSCRIPTIONS & RECURRING BILLING MANAGER
// ==============================================================================

import React, { useState } from 'react';
import { Repeat, Calendar, CheckCircle2, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface SubscriptionItem {
  id: string;
  planName: string;
  creatorName: string;
  amount: number;
  currency: string;
  interval: 'mensal' | 'trimestral' | 'anual';
  nextBillingDate: string;
  status: 'active' | 'past_due' | 'cancelled';
}

export const SubscriptionManager: React.FC = () => {
  const { formatMoney } = useI18n();
  const { showToast } = useNotification();

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([
    {
      id: 'sub-1',
      planName: 'Comunidade Alpha Creators VIP',
      creatorName: 'Kelson Manuel',
      amount: 12500,
      currency: 'AOA',
      interval: 'mensal',
      nextBillingDate: '16 de Outubro de 2026',
      status: 'active'
    },
    {
      id: 'sub-2',
      planName: 'Clube de Investimentos BODIVA Pro',
      creatorName: 'Cláudia dos Santos',
      amount: 45000,
      currency: 'AOA',
      interval: 'trimestral',
      nextBillingDate: '01 de Dezembro de 2026',
      status: 'active'
    }
  ]);

  const handleCancelSub = (id: string) => {
    if (confirm('Deseja realmente cancelar esta subscrição? O seu acesso continuará ativo até ao final do período pago.')) {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s))
      );
      showToast('info', 'Subscrição cancelada com sucesso.');
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl text-xs text-slate-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm" icon={<Repeat className="w-3.5 h-3.5" />}>
              Assinaturas & Recorrência
            </Badge>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            Minhas Assinaturas Ativas ({subscriptions.filter((s) => s.status === 'active').length})
          </h3>
          <p className="text-slate-400 text-xs">
            Gerencie as suas mensalidades, datas de renovação e métodos de pagamento.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm">{sub.planName}</span>
                <Badge
                  variant={sub.status === 'active' ? 'success' : 'neutral'}
                  size="sm"
                >
                  {sub.status === 'active' ? 'Ativa' : 'Cancelada'}
                </Badge>
              </div>

              <div className="text-slate-400">
                Criador: <strong className="text-slate-200">{sub.creatorName}</strong>
              </div>

              <div className="flex items-center gap-3 text-slate-500 text-[11px] font-mono">
                <span>Valor: <strong className="text-emerald-400 font-bold">{formatMoney(sub.amount, sub.currency as any)}</strong> / {sub.interval}</span>
                <span>• Próxima cobrança: {sub.nextBillingDate}</span>
              </div>
            </div>

            {sub.status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelSub(sub.id)}
                className="shrink-0 text-red-400 hover:text-red-300 hover:border-red-500/30"
              >
                Cancelar Renovação
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
