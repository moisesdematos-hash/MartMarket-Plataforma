// ==============================================================================
// MARTMARKET VIDEO ANALYTICS HEATMAP ENGINE
// Per-lesson retention curves, view-drop heatmap, replay segments,
// and average watch-time analytics for Creator Studio intelligence.
// ==============================================================================

import React, { useState } from 'react';
import {
  Flame, TrendingUp, TrendingDown, Eye, RotateCcw,
  BarChart3, Clock, Play, ChevronDown, Award
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../lib/currencies';

interface LessonStats {
  id: string;
  title: string;
  module: string;
  durationMin: number;
  totalViews: number;
  avgRetention: number; // %
  completionRate: number; // %
  replays: number;
  heatmap: number[]; // 0-100 intensity per 5% segment (20 points)
  dropOffAt: number; // % timestamp where most people leave
}

export const VideoHeatmapAnalytics: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<LessonStats | null>(null);

  const lessons: LessonStats[] = [
    {
      id: 'l1',
      title: 'Introdução à Arquitetura SaaS Escalável',
      module: 'Módulo 1 — Fundamentos',
      durationMin: 18,
      totalViews: 1240,
      avgRetention: 74,
      completionRate: 62,
      replays: 218,
      dropOffAt: 78,
      heatmap: [95, 93, 90, 88, 85, 82, 80, 78, 74, 70, 68, 65, 63, 60, 55, 50, 48, 44, 40, 35]
    },
    {
      id: 'l2',
      title: 'Configuração do Ambiente de Desenvolvimento',
      module: 'Módulo 1 — Fundamentos',
      durationMin: 24,
      totalViews: 1155,
      avgRetention: 68,
      completionRate: 55,
      replays: 342,
      dropOffAt: 55,
      heatmap: [92, 88, 85, 80, 76, 72, 65, 58, 52, 55, 60, 58, 54, 50, 44, 38, 32, 28, 24, 20]
    },
    {
      id: 'l3',
      title: 'Implementação do Motor de Pagamentos Angolano',
      module: 'Módulo 4 — Pagamentos Locais',
      durationMin: 41,
      totalViews: 980,
      avgRetention: 82,
      completionRate: 71,
      replays: 530,
      dropOffAt: 88,
      heatmap: [98, 97, 96, 95, 94, 92, 90, 89, 88, 87, 86, 84, 82, 80, 78, 75, 72, 70, 68, 65]
    },
    {
      id: 'l4',
      title: 'Deploy e CI/CD na Nuvem',
      module: 'Módulo 6 — Produção',
      durationMin: 35,
      totalViews: 840,
      avgRetention: 59,
      completionRate: 41,
      replays: 195,
      dropOffAt: 42,
      heatmap: [90, 85, 78, 70, 60, 45, 40, 38, 42, 44, 40, 35, 30, 28, 25, 22, 20, 18, 15, 12]
    }
  ];

  const getHeatColor = (value: number) => {
    if (value >= 80) return 'bg-emerald-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-rose-600';
  };

  const getRetentionBadge = (pct: number) => {
    if (pct >= 75) return { variant: 'success' as const, label: 'Excelente' };
    if (pct >= 55) return { variant: 'warning' as const, label: 'Regular' };
    return { variant: 'danger' as const, label: 'Crítico' };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="primary" size="sm" icon={<Flame className="w-3.5 h-3.5" />}>
          Inteligência de Conteúdo por Vídeo
        </Badge>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
          Heatmap de Retenção de Vídeo
        </h2>
        <p className="text-xs text-slate-400">
          Identifique exatamente onde os alunos abandonam, repetem ou perdem interesse em cada aula para otimizar seu conteúdo.
        </p>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Retenção Média Global</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">71%</span>
          <span className="text-[10px] text-slate-500 block">de visualizações acima de 50%</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Aula com Mais Replays</span>
          <span className="text-sm font-bold text-white block truncate">Módulo 4 — Pagamentos</span>
          <span className="text-[10px] text-blue-400">530 repetições</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Drop-off Crítico Detectado</span>
          <span className="text-sm font-bold text-rose-400 truncate block">Deploy & CI/CD (42%)</span>
          <span className="text-[10px] text-slate-500">abandono precoce — revisar ritmo</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Total de Visualizações</span>
          <span className="text-2xl font-black text-blue-400 font-mono">4,215</span>
          <span className="text-[10px] text-slate-500">em todas as aulas monitoradas</span>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const badge = getRetentionBadge(lesson.avgRetention);
          const isSelected = selectedLesson?.id === lesson.id;

          return (
            <div key={lesson.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              {/* Lesson Row */}
              <button
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
                onClick={() => setSelectedLesson(isSelected ? null : lesson)}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white truncate">{lesson.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{lesson.module} • {lesson.durationMin}min</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <div className="hidden sm:flex flex-col items-end text-xs">
                    <span className="text-slate-400 text-[11px]">Retenção Avg.</span>
                    <span className="font-mono font-bold text-white">{lesson.avgRetention}%</span>
                  </div>
                  <div className="hidden lg:flex flex-col items-end text-xs">
                    <span className="text-slate-400 text-[11px]">Conclusão</span>
                    <span className="font-mono font-bold text-white">{lesson.completionRate}%</span>
                  </div>
                  <div className="hidden md:flex flex-col items-end text-xs">
                    <span className="text-slate-400 text-[11px]">Replays</span>
                    <span className="font-mono font-bold text-blue-400">{lesson.replays}×</span>
                  </div>
                  <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Expanded Heatmap */}
              {isSelected && (
                <div className="px-4 pb-4 space-y-4 border-t border-slate-800 animate-fade-in pt-4">
                  {/* Heatmap Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>00:00 (Início)</span>
                      <span className="font-bold text-white">Mapa de Calor de Retenção — Segmentos de 5%</span>
                      <span>{lesson.durationMin}:00 (Fim)</span>
                    </div>

                    {/* Heatmap Bars */}
                    <div className="flex gap-0.5 h-12 rounded-xl overflow-hidden border border-slate-800">
                      {lesson.heatmap.map((val, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 ${getHeatColor(val)} transition-all relative group`}
                          style={{ opacity: 0.3 + (val / 100) * 0.7 }}
                          title={`${idx * 5}%–${(idx + 1) * 5}% do vídeo: ${val}% dos alunos ainda assistindo`}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 border border-slate-700 rounded text-[10px] text-white px-1.5 py-0.5 whitespace-nowrap font-mono z-10 shadow-xl">
                            {val}% @ {idx * 5}%
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-emerald-500 inline-block"></span>Alta Retenção (80%+)</div>
                      <div className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-yellow-500 inline-block"></span>Média (60-79%)</div>
                      <div className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-orange-500 inline-block"></span>Baixa (40-59%)</div>
                      <div className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-rose-600 inline-block"></span>Crítica (&lt;40%)</div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-1">
                      <div className="flex items-center gap-1 text-rose-400 font-bold">
                        <TrendingDown className="w-3.5 h-3.5" /> Ponto de Abandono Principal
                      </div>
                      <p className="text-slate-300">
                        {lesson.dropOffAt}% do vídeo — maior queda de audiência. Revise o ritmo ou adicione uma transição mais dinâmica neste ponto.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-1">
                      <div className="flex items-center gap-1 text-blue-400 font-bold">
                        <RotateCcw className="w-3.5 h-3.5" /> Segmento Mais Repetido
                      </div>
                      <p className="text-slate-300">
                        Os alunos revisitam o segmento dos 25%–40% em média {Math.ceil(lesson.replays / lesson.totalViews * 10) / 10}× — conteúdo denso, considere desacelerar.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Award className="w-3.5 h-3.5" /> Taxa de Conclusão
                      </div>
                      <p className="text-slate-300">
                        {lesson.completionRate}% dos alunos chegam ao fim — {lesson.completionRate >= 60 ? 'acima da média da plataforma (58%).' : 'abaixo da média. Adicione um gancho nos primeiros 30% da aula.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
