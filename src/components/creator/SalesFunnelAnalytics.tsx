// ==============================================================================
// MARTMARKET VISUAL SALES FUNNEL & SAAS CREATOR ANALYTICS
// Interactive funnel stages (Traffic -> Checkout -> Bump -> Sale -> Upsell),
// step-by-step conversion drop-offs, and critical creator economics (MRR, LTV, CAC).
// ==============================================================================

import React, { useState } from 'react';
import { TrendingUp, Users, ShoppingCart, CheckCircle2, ArrowDown, DollarSign, Percent, Zap, Eye, BarChart3 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../lib/currencies';

export const SalesFunnelAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const funnelData = [
    {
      stage: '1. Visitantes da Página de Vendas',
      count: 14850,
      percentageOfTotal: 100,
      dropOff: 0,
      icon: Eye,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      stage: '2. Checkouts Iniciados (InitiateCheckout)',
      count: 4210,
      percentageOfTotal: 28.3,
      dropOff: 71.7,
      icon: ShoppingCart,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      stage: '3. Order Bumps Adicionados',
      count: 1580,
      percentageOfTotal: 10.6,
      dropOff: 62.5,
      icon: Zap,
      color: 'from-purple-600 to-pink-600'
    },
    {
      stage: '4. Pagamentos Aprovados (Conversão Final)',
      count: 1120,
      percentageOfTotal: 7.5,
      dropOff: 29.1,
      icon: CheckCircle2,
      color: 'from-pink-600 to-emerald-600'
    },
    {
      stage: '5. Upsells 1-Click Aceitos',
      count: 340,
      percentageOfTotal: 2.3,
      dropOff: 69.6,
      icon: TrendingUp,
      color: 'from-emerald-600 to-teal-600'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<BarChart3 className="w-3.5 h-3.5" />}>
            Inteligência de Tráfego & Conversão
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Funil Visual de Vendas & Economia do Produtor
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhe a jornada completa do cliente desde o primeiro clique até o upsell pós-compra e maximize seu Ticket Médio.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range === '7d' ? 'Últimos 7 dias' : range === '30d' ? 'Últimos 30 dias' : 'Últimos 90 dias'}
            </button>
          ))}
        </div>
      </div>

      {/* Creator SaaS Unit Economics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Ticket Médio (AOV c/ Bumps)</span>
          <div className="text-xl font-black text-white font-mono">
            {formatCurrency(84500, 'AOA')}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% vs. produto sem bump
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Taxa de Conversão Global</span>
          <div className="text-xl font-black text-blue-400 font-mono">
            7.54%
          </div>
          <span className="text-[11px] text-slate-400">
            1.120 compras de 14.850 acessos
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">LTV Estimado (Lifetime Value)</span>
          <div className="text-xl font-black text-purple-400 font-mono">
            {formatCurrency(168000, 'AOA')}
          </div>
          <span className="text-[11px] text-purple-300">
            Média de 1.9 produtos por aluno
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Receita de Upsells 1-Click</span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {formatCurrency(12400000, 'AOA')}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">
            30.3% de aceitação pós-compra
          </span>
        </div>
      </div>

      {/* Visual Interactive Funnel */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Etapas do Funil de Aquisição
        </h3>

        <div className="space-y-4">
          {funnelData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{item.stage}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-white font-bold">{item.count.toLocaleString()}</span>
                    <span className="text-slate-400">({item.percentageOfTotal}%)</span>
                  </div>
                </div>

                {/* Funnel Bar with dynamic width */}
                <div className="w-full bg-slate-950 h-7 rounded-xl border border-slate-800 p-1 flex items-center">
                  <div
                    style={{ width: `${item.percentageOfTotal}%` }}
                    className={`h-full rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-end px-2 text-[10px] font-bold text-white shadow-sm transition-all duration-500`}
                  >
                    {item.percentageOfTotal > 8 ? `${item.percentageOfTotal}%` : ''}
                  </div>
                </div>

                {idx < funnelData.length - 1 && (
                  <div className="flex items-center gap-1.5 pl-6 text-[10px] text-slate-500 font-mono">
                    <ArrowDown className="w-3 h-3 text-slate-600" />
                    <span>Perda/Drop-off para próxima etapa: {funnelData[idx + 1].dropOff}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
