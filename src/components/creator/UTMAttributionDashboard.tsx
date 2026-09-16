// ==============================================================================
// MARTMARKET UTM ATTRIBUTION DASHBOARD
// Multi-touch attribution: first-click, last-click, linear models.
// Source/medium/campaign breakdown, ROAS, CAC, LTV per channel.
// ==============================================================================

import React, { useState } from 'react';
import {
  Target, TrendingUp, DollarSign, MousePointer2,
  Globe, BarChart3, ArrowUpRight, Zap, Filter
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../lib/currencies';

type AttributionModel = 'last-click' | 'first-click' | 'linear';

interface ChannelData {
  channel: string;
  source: string;
  medium: string;
  sessions: number;
  conversions: number;
  revenue: number;
  spend: number;
  roas: number;
  cac: number;
}

const CHANNELS: ChannelData[] = [
  { channel: 'Facebook Ads',    source: 'facebook',  medium: 'cpc',     sessions: 14200, conversions: 312, revenue: 23400000, spend: 4200000, roas: 5.57, cac: 13462 },
  { channel: 'Google Ads',      source: 'google',    medium: 'cpc',     sessions: 8400,  conversions: 198, revenue: 14850000, spend: 3100000, roas: 4.79, cac: 15657 },
  { channel: 'TikTok Ads',      source: 'tiktok',    medium: 'cpc',     sessions: 6200,  conversions: 87,  revenue: 6525000,  spend: 1800000, roas: 3.63, cac: 20690 },
  { channel: 'Email Marketing', source: 'email',     medium: 'email',   sessions: 3800,  conversions: 142, revenue: 10650000, spend: 0,       roas: 0,    cac: 0     },
  { channel: 'Orgânico / SEO',  source: 'google',    medium: 'organic', sessions: 5100,  conversions: 98,  revenue: 7350000,  spend: 0,       roas: 0,    cac: 0     },
  { channel: 'Afiliados',       source: 'affiliate', medium: 'referral',sessions: 4300,  conversions: 176, revenue: 13200000, spend: 3960000, roas: 3.33, cac: 22500 },
  { channel: 'WhatsApp Direto', source: 'whatsapp',  medium: 'social',  sessions: 2100,  conversions: 63,  revenue: 4725000,  spend: 0,       roas: 0,    cac: 0     },
  { channel: 'Instagram',       source: 'instagram', medium: 'social',  sessions: 3200,  conversions: 45,  revenue: 3375000,  spend: 850000,  roas: 3.97, cac: 18889 },
];

const ATTRIBUTION_DESC: Record<AttributionModel, string> = {
  'last-click':  'Todo o crédito vai ao último canal que o cliente tocou antes de comprar.',
  'first-click': 'Todo o crédito vai ao primeiro canal que trouxe o cliente.',
  'linear':      'O crédito é distribuído igualmente por todos os canais na jornada.',
};

export const UTMAttributionDashboard: React.FC = () => {
  const [model, setModel] = useState<AttributionModel>('last-click');
  const [sortBy, setSortBy] = useState<'revenue' | 'conversions' | 'roas'>('revenue');

  const sorted = [...CHANNELS].sort((a, b) => b[sortBy] - a[sortBy]);

  const totalRevenue  = CHANNELS.reduce((s,c)=>s+c.revenue, 0);
  const totalSpend    = CHANNELS.reduce((s,c)=>s+c.spend, 0);
  const totalConv     = CHANNELS.reduce((s,c)=>s+c.conversions, 0);
  const totalSessions = CHANNELS.reduce((s,c)=>s+c.sessions, 0);
  const overallROAS   = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const getChannelIcon = (source: string) => {
    const icons: Record<string, string> = {
      facebook: '📘', google: '🔍', tiktok: '🎵', email: '📧',
      affiliate: '🤝', whatsapp: '💬', instagram: '📸'
    };
    return icons[source] || '🌐';
  };

  const getRoasBadge = (roas: number) => {
    if (roas === 0) return { variant: 'neutral' as const, label: 'Orgânico' };
    if (roas >= 4)  return { variant: 'success' as const, label: `${roas.toFixed(2)}x` };
    if (roas >= 2)  return { variant: 'warning' as const, label: `${roas.toFixed(2)}x` };
    return { variant: 'danger' as const, label: `${roas.toFixed(2)}x` };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="primary" size="sm" icon={<Target className="w-3.5 h-3.5" />}>
          Atribuição Multi-Touch de Vendas
        </Badge>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">UTM Attribution & ROAS por Canal</h2>
        <p className="text-xs text-slate-400">Identifique quais canais e campanhas geram mais vendas e otimize o seu investimento em marketing.</p>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita Total',      v: `${(totalRevenue/1000000).toFixed(1)}M Kz`, icon: <DollarSign className="w-4 h-4 text-emerald-400" />, c: 'text-emerald-400' },
          { label: 'Conversões Totais',  v: totalConv,                                   icon: <MousePointer2 className="w-4 h-4 text-blue-400" />,    c: 'text-blue-400'    },
          { label: 'ROAS Geral',         v: `${overallROAS.toFixed(2)}×`,                icon: <TrendingUp className="w-4 h-4 text-purple-400" />,      c: 'text-purple-400'  },
          { label: 'Sessões Totais',     v: totalSessions.toLocaleString(),              icon: <Globe className="w-4 h-4 text-slate-400" />,            c: 'text-white'       },
        ].map(k => (
          <div key={k.label} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">{k.icon}<span className="text-[11px] text-slate-400">{k.label}</span></div>
            <div className={`text-2xl font-black font-mono ${k.c}`}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Attribution Model Selector */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-bold text-slate-200">Modelo de Atribuição:</span>
          <div className="flex gap-2">
            {(['last-click','first-click','linear'] as AttributionModel[]).map(m => (
              <button key={m} onClick={()=>setModel(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer capitalize ${model===m?'bg-blue-600 text-white':'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {m === 'last-click' ? 'Último Clique' : m === 'first-click' ? 'Primeiro Clique' : 'Linear'}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-slate-400">{ATTRIBUTION_DESC[model]}</p>
      </div>

      {/* Revenue by Channel — Visual Bars */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200">Receita por Canal de Marketing</h3>
          <div className="flex gap-1">
            {(['revenue','conversions','roas'] as const).map(s => (
              <button key={s} onClick={()=>setSortBy(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer capitalize ${sortBy===s?'bg-slate-700 text-white':'text-slate-400 hover:text-white'}`}>
                {s === 'revenue' ? 'Receita' : s === 'conversions' ? 'Conversões' : 'ROAS'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {sorted.map(ch => {
            const pct = Math.round((ch.revenue / totalRevenue) * 100);
            const roasBadge = getRoasBadge(ch.roas);
            return (
              <div key={ch.channel} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{getChannelIcon(ch.source)}</span>
                    <span className="font-semibold text-slate-200">{ch.channel}</span>
                    <Badge variant={roasBadge.variant} size="sm">{roasBadge.label}</Badge>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span className="hidden sm:inline text-slate-400">{ch.conversions} conv.</span>
                    <span className="text-white font-bold">{(ch.revenue/1000000).toFixed(1)}M Kz</span>
                    <span className="text-slate-400 w-8 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      ch.spend === 0 ? 'bg-emerald-500' : ch.roas >= 4 ? 'bg-blue-500' : ch.roas >= 2 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Channel Detail Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <h3 className="text-xs font-bold text-slate-200">Tabela Detalhada por Canal</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Canal</th>
                <th className="p-3.5">Sessões</th>
                <th className="p-3.5">Conversões</th>
                <th className="p-3.5">Taxa Conv.</th>
                <th className="p-3.5">Receita</th>
                <th className="p-3.5">Investimento</th>
                <th className="p-3.5">ROAS</th>
                <th className="p-3.5">CAC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sorted.map(ch => (
                <tr key={ch.channel} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getChannelIcon(ch.source)}</span>
                      <div>
                        <div className="font-bold text-white">{ch.channel}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{ch.source}/{ch.medium}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono">{ch.sessions.toLocaleString()}</td>
                  <td className="p-3.5 font-mono font-bold text-white">{ch.conversions}</td>
                  <td className="p-3.5 font-mono">
                    <span className={`font-bold ${ch.conversions/ch.sessions*100 >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {(ch.conversions/ch.sessions*100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">{formatCurrency(ch.revenue,'AOA')}</td>
                  <td className="p-3.5 font-mono">{ch.spend > 0 ? formatCurrency(ch.spend,'AOA') : <span className="text-emerald-400">Grátis</span>}</td>
                  <td className="p-3.5">
                    {ch.roas > 0
                      ? <span className={`font-mono font-bold ${ch.roas>=4?'text-emerald-400':ch.roas>=2?'text-amber-400':'text-rose-400'}`}>{ch.roas.toFixed(2)}×</span>
                      : <span className="text-slate-400 font-mono">—</span>
                    }
                  </td>
                  <td className="p-3.5 font-mono text-[11px]">
                    {ch.cac > 0 ? formatCurrency(ch.cac,'AOA') : <span className="text-emerald-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
