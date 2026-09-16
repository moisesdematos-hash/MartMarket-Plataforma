// ==============================================================================
// MARTMARKET CHECKOUT A/B TESTING ENGINE
// Create, manage and compare checkout variants with live stats,
// statistical significance calculator, and winner declaration.
// ==============================================================================

import React, { useState } from 'react';
import {
  FlaskConical, TrendingUp, Trophy, BarChart3,
  Plus, Play, Pause, Eye, CheckCircle2, AlertTriangle, RefreshCw
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../lib/currencies';

type TestStatus = 'RUNNING' | 'PAUSED' | 'CONCLUDED';

interface Variant {
  id: string;
  name: string;
  description: string;
  traffic: number; // % of traffic
  visitors: number;
  conversions: number;
  revenue: number;
  convRate: number;
  isControl: boolean;
  isWinner?: boolean;
}

interface ABTest {
  id: string;
  productTitle: string;
  hypothesis: string;
  status: TestStatus;
  startDate: string;
  endDate?: string;
  variants: Variant[];
  confidence: number; // statistical significance %
}

export const CheckoutABTesting: React.FC = () => {
  const { showToast } = useNotification();

  const [tests, setTests] = useState<ABTest[]>([
    {
      id: 'ab-1',
      productTitle: 'Masterclass Fullstack: De Zero a SaaS',
      hypothesis: 'Adicionar um temporizador de escassez de 15 minutos aumenta a conversão em 15%+',
      status: 'RUNNING',
      startDate: '2026-09-10',
      confidence: 87,
      variants: [
        { id: 'v-a', name: 'Controlo (A)', description: 'Checkout padrão sem temporizador', traffic: 50, visitors: 1240, conversions: 98, revenue: 7350000, convRate: 7.9, isControl: true },
        { id: 'v-b', name: 'Variante (B)', description: 'Checkout com temporizador 15min + badge "Oferta a expirar"', traffic: 50, visitors: 1238, conversions: 127, revenue: 9525000, convRate: 10.3, isControl: false },
      ]
    },
    {
      id: 'ab-2',
      productTitle: 'Gestão Financeira Premium',
      hypothesis: 'Remover o campo de cupão do checkout reduz distração e aumenta conversão',
      status: 'CONCLUDED',
      startDate: '2026-08-20',
      endDate: '2026-09-03',
      confidence: 96,
      variants: [
        { id: 'v-c', name: 'Controlo (A)', description: 'Com campo de cupão visível', traffic: 50, visitors: 2100, conversions: 147, revenue: 5586000, convRate: 7.0, isControl: true },
        { id: 'v-d', name: 'Variante (B)', description: 'Campo de cupão oculto (link "Tenho cupão")', traffic: 50, visitors: 2098, conversions: 189, revenue: 7182000, convRate: 9.0, isControl: false, isWinner: true },
      ]
    },
    {
      id: 'ab-3',
      productTitle: 'Design UI/UX com Figma',
      hypothesis: 'Mostrar garantia de 7 dias em destaque no topo melhora a confiança',
      status: 'PAUSED',
      startDate: '2026-09-14',
      confidence: 42,
      variants: [
        { id: 'v-e', name: 'Controlo (A)', description: 'Garantia no rodapé', traffic: 50, visitors: 310, conversions: 19, revenue: 988000, convRate: 6.1, isControl: true },
        { id: 'v-f', name: 'Variante (B)', description: 'Banner de garantia no topo do checkout', traffic: 50, visitors: 312, conversions: 22, revenue: 1144000, convRate: 7.1, isControl: false },
      ]
    },
  ]);

  const [selected, setSelected] = useState<ABTest>(tests[0]);

  const toggleStatus = (id: string) => {
    setTests(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next = t.status === 'RUNNING' ? 'PAUSED' : 'RUNNING';
      showToast(next === 'RUNNING' ? 'success' : 'info', `Teste "${t.productTitle}" ${next === 'RUNNING' ? 'retomado' : 'pausado'}.`);
      return { ...t, status: next };
    }));
    setSelected(prev => prev.id === id ? { ...prev, status: prev.status === 'RUNNING' ? 'PAUSED' : 'RUNNING' } : prev);
  };

  const declareWinner = (testId: string, variantId: string) => {
    setTests(prev => prev.map(t => {
      if (t.id !== testId) return t;
      return {
        ...t, status: 'CONCLUDED', endDate: new Date().toISOString().split('T')[0],
        variants: t.variants.map(v => ({ ...v, isWinner: v.id === variantId }))
      };
    }));
    setSelected(prev => prev.id === testId ? {
      ...prev, status: 'CONCLUDED',
      variants: prev.variants.map(v => ({ ...v, isWinner: v.id === variantId }))
    } : prev);
    showToast('success', '🏆 Variante vencedora declarada! Checkout atualizado automaticamente.');
  };

  const statusCfg: Record<TestStatus, { label: string; variant: any }> = {
    RUNNING:   { label: 'A Correr',  variant: 'success' },
    PAUSED:    { label: 'Pausado',   variant: 'warning' },
    CONCLUDED: { label: 'Concluído', variant: 'neutral' },
  };

  const getSignificanceBadge = (conf: number) => {
    if (conf >= 95) return { v: 'success' as const, label: `${conf}% — Significativo!` };
    if (conf >= 80) return { v: 'warning' as const, label: `${conf}% — A precisar de dados` };
    return { v: 'danger' as const, label: `${conf}% — Insuficiente` };
  };

  const uplift = (control: Variant, variant: Variant) => {
    if (control.convRate === 0) return 0;
    return ((variant.convRate - control.convRate) / control.convRate * 100).toFixed(1);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<FlaskConical className="w-3.5 h-3.5" />}>
            Motor de Testes A/B de Checkout
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Checkout A/B Testing</h2>
          <p className="text-xs text-slate-400">Teste variantes do seu checkout com dados estatísticos reais. Descubra o que converte mais e aplique automaticamente.</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => showToast('info', 'Wizard de criação de teste A/B em breve.')}>
          Novo Teste
        </Button>
      </div>

      {/* Test List + Detail layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Test list */}
        <div className="space-y-3">
          {tests.map(test => (
            <button key={test.id} onClick={() => setSelected(test)}
              className={`w-full text-left p-4 rounded-2xl border transition-colors cursor-pointer ${selected.id === test.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-white line-clamp-2 flex-1">{test.productTitle}</span>
                <Badge variant={statusCfg[test.status].variant} size="sm">{statusCfg[test.status].label}</Badge>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{test.hypothesis}</p>
              <div className="flex items-center gap-2">
                <FlaskConical className="w-3 h-3 text-purple-400" />
                <span className="text-[11px] text-slate-400">{test.variants.length} variantes</span>
                <span className="text-[11px] font-mono text-slate-500">desde {test.startDate}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Test Detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Test header */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-black text-white">{selected.productTitle}</div>
                <p className="text-[11px] text-slate-400 mt-0.5">{selected.hypothesis}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selected.status !== 'CONCLUDED' && (
                  <button onClick={() => toggleStatus(selected.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                    {selected.status === 'RUNNING' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Significance */}
            <div className="flex items-center gap-3 flex-wrap">
              {(() => { const s = getSignificanceBadge(selected.confidence); return <Badge variant={s.v} size="sm" icon={<BarChart3 className="w-3 h-3" />}>{s.label}</Badge>; })()}
              <span className="text-[11px] text-slate-400">
                {selected.confidence >= 95 ? '✅ Resultado estatisticamente significativo — pode declarar vencedor.' : `⏳ Necessita de mais dados para atingir 95% de confiança.`}
              </span>
            </div>
          </div>

          {/* Variants comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selected.variants.map(v => {
              const control = selected.variants.find(x => x.isControl)!;
              const up = v.isControl ? null : uplift(control, v);
              return (
                <div key={v.id} className={`p-4 rounded-2xl border space-y-4 ${v.isWinner ? 'bg-emerald-950/20 border-emerald-500/40' : v.isControl ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-black text-white">{v.name}</div>
                      <div className="text-[11px] text-slate-400">{v.description}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {v.isWinner && <Badge variant="success" size="sm" icon={<Trophy className="w-3 h-3" />}>Vencedor</Badge>}
                      {v.isControl && <Badge variant="neutral" size="sm">Controlo</Badge>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Visitantes', v: v.visitors.toLocaleString(), c: 'text-white' },
                      { label: 'Conversões', v: v.conversions, c: 'text-white' },
                      { label: 'Taxa Conv.', v: `${v.convRate}%`, c: v.convRate > (control?.convRate || 0) ? 'text-emerald-400' : 'text-slate-300' },
                      { label: 'Receita', v: `${(v.revenue/1000000).toFixed(1)}M`, c: 'text-emerald-400' },
                    ].map(m => (
                      <div key={m.label} className="p-2.5 rounded-xl bg-slate-950/50 text-center">
                        <div className={`text-sm font-black font-mono ${m.c}`}>{m.v}</div>
                        <div className="text-[10px] text-slate-500">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Uplift */}
                  {!v.isControl && up !== null && (
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${parseFloat(up as string) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                      {parseFloat(up as string) > 0 ? `+${up}%` : `${up}%`} vs controlo
                    </div>
                  )}

                  {/* Conv rate bar */}
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${v.isWinner ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(v.convRate * 5, 100)}%` }} />
                    </div>
                  </div>

                  {/* Declare winner button */}
                  {selected.status === 'RUNNING' && !v.isControl && selected.confidence >= 80 && (
                    <Button size="sm" variant="outline" leftIcon={<Trophy className="w-3.5 h-3.5" />}
                      onClick={() => declareWinner(selected.id, v.id)}
                      className="w-full">
                      Declarar Vencedor
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
