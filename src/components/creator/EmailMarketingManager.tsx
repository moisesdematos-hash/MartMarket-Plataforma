// ==============================================================================
// MARTMARKET NATIVE EMAIL MARKETING ENGINE
// Visual sequence builder, automated flows, broadcast campaigns,
// open/click analytics, welcome series, abandon recovery, re-engagement.
// ==============================================================================

import React, { useState } from 'react';
import {
  Mail, Plus, Play, Pause, BarChart3, Clock,
  Users, TrendingUp, Zap, Edit3, Trash2, Eye,
  CheckCircle2, AlertCircle, RefreshCw, Send
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNotification } from '../../context/NotificationContext';

type FlowStatus = 'ACTIVE' | 'PAUSED' | 'DRAFT';
type FlowType = 'WELCOME' | 'ABANDON' | 'UPSELL' | 'REENGAGEMENT' | 'BROADCAST';

interface EmailStep {
  id: string;
  delayDays: number;
  subject: string;
  openRate: number;
  clickRate: number;
}

interface EmailFlow {
  id: string;
  name: string;
  type: FlowType;
  status: FlowStatus;
  subscribers: number;
  steps: EmailStep[];
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  revenue: number;
  createdAt: string;
}

const FLOW_TYPE_CONFIG: Record<FlowType, { label: string; icon: string; color: string }> = {
  WELCOME:      { label: 'Boas-Vindas',     icon: '👋', color: 'text-emerald-400' },
  ABANDON:      { label: 'Abandono',        icon: '🛒', color: 'text-rose-400'    },
  UPSELL:       { label: 'Upsell',          icon: '🚀', color: 'text-blue-400'    },
  REENGAGEMENT: { label: 'Reengajamento',   icon: '🔄', color: 'text-amber-400'   },
  BROADCAST:    { label: 'Campanha',        icon: '📣', color: 'text-purple-400'  },
};

const STATUS_CONFIG: Record<FlowStatus, { label: string; variant: any }> = {
  ACTIVE: { label: 'Ativo',   variant: 'success' },
  PAUSED: { label: 'Pausado', variant: 'warning'  },
  DRAFT:  { label: 'Rascunho',variant: 'neutral'  },
};

export const EmailMarketingManager: React.FC = () => {
  const { showToast } = useNotification();

  const [flows, setFlows] = useState<EmailFlow[]>([
    {
      id: 'flow-1', name: 'Boas-Vindas — Masterclass Fullstack',
      type: 'WELCOME', status: 'ACTIVE',
      subscribers: 1240, totalSent: 3720,
      avgOpenRate: 64.2, avgClickRate: 18.7, revenue: 892500,
      createdAt: '2026-08-01',
      steps: [
        { id: 's1', delayDays: 0,  subject: '🎉 Bem-vindo(a)! O seu acesso está pronto', openRate: 78, clickRate: 34 },
        { id: 's2', delayDays: 3,  subject: 'Por onde começar? O guia rápido para o seu sucesso', openRate: 62, clickRate: 21 },
        { id: 's3', delayDays: 7,  subject: '🔑 3 erros que a maioria comete na semana 1', openRate: 58, clickRate: 15 },
      ]
    },
    {
      id: 'flow-2', name: 'Recuperação de Carrinho Abandonado',
      type: 'ABANDON', status: 'ACTIVE',
      subscribers: 487, totalSent: 1461,
      avgOpenRate: 51.3, avgClickRate: 22.4, revenue: 1245000,
      createdAt: '2026-08-15',
      steps: [
        { id: 's4', delayDays: 0,  subject: 'Esqueceu algo? O seu carrinho ainda está guardado 🛒', openRate: 68, clickRate: 31 },
        { id: 's5', delayDays: 1,  subject: 'Última oportunidade: preço especial para si (-10%)', openRate: 45, clickRate: 19 },
        { id: 's6', delayDays: 3,  subject: 'O João acabou de comprar o que estava no seu carrinho...', openRate: 41, clickRate: 17 },
      ]
    },
    {
      id: 'flow-3', name: 'Reengajamento — Alunos Inativos',
      type: 'REENGAGEMENT', status: 'PAUSED',
      subscribers: 312, totalSent: 624,
      avgOpenRate: 28.1, avgClickRate: 6.3, revenue: 187000,
      createdAt: '2026-09-01',
      steps: [
        { id: 's7', delayDays: 0,  subject: 'Sentimos a sua falta 😔 — O que aconteceu?', openRate: 35, clickRate: 8 },
        { id: 's8', delayDays: 7,  subject: '🎁 Um presente exclusivo para recomeçar hoje', openRate: 21, clickRate: 5 },
      ]
    },
    {
      id: 'flow-4', name: 'Campanha: Lançamento Módulo 5',
      type: 'BROADCAST', status: 'DRAFT',
      subscribers: 2100, totalSent: 0,
      avgOpenRate: 0, avgClickRate: 0, revenue: 0,
      createdAt: '2026-09-16',
      steps: [
        { id: 's9', delayDays: 0,  subject: '🔥 NOVO: Módulo 5 — Deploy em produção com Docker', openRate: 0, clickRate: 0 },
      ]
    },
  ]);

  const [expandedFlow, setExpandedFlow] = useState<string | null>('flow-1');
  const [activeTab, setActiveTab] = useState<'flows' | 'stats' | 'compose'>('flows');

  const [draft, setDraft] = useState({ subject: '', body: '', sendTo: 'all' });

  const toggleFlowStatus = (id: string) => {
    setFlows(prev => prev.map(f => {
      if (f.id !== id) return f;
      const next = f.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      showToast(next === 'ACTIVE' ? 'success' : 'info',
        `Fluxo "${f.name}" ${next === 'ACTIVE' ? 'ativado' : 'pausado'}.`);
      return { ...f, status: next };
    }));
  };

  const deleteFlow = (id: string) => {
    setFlows(prev => prev.filter(f => f.id !== id));
    showToast('info', 'Fluxo eliminado com sucesso.');
  };

  const sendBroadcast = () => {
    if (!draft.subject.trim()) { showToast('warning', 'Escreva o assunto do email.'); return; }
    showToast('success', `Email enviado para ${draft.sendTo === 'all' ? '2.100' : '487'} contactos! Taxa de entrega estimada: 97.3%.`);
    setDraft({ subject: '', body: '', sendTo: 'all' });
    setActiveTab('flows');
  };

  const totalRevenue = flows.reduce((s, f) => s + f.revenue, 0);
  const totalSent = flows.reduce((s, f) => s + f.totalSent, 0);
  const avgOpen = flows.filter(f=>f.avgOpenRate>0).reduce((s,f,_,a)=>s+f.avgOpenRate/a.length,0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<Mail className="w-3.5 h-3.5" />}>
            Motor de Email Marketing Nativo
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Email Marketing & Automações</h2>
          <p className="text-xs text-slate-400">Crie fluxos automáticos de email, campanhas e sequências de nutrição sem sair da plataforma.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" leftIcon={<Send className="w-4 h-4" />}
            onClick={() => setActiveTab('compose')}>
            Enviar Campanha
          </Button>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => showToast('info', 'Editor de fluxo em breve — por agora use os fluxos pré-construídos.')}>
            Novo Fluxo
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Emails Enviados', value: totalSent.toLocaleString(), color: 'text-blue-400', icon: <Mail className="w-4 h-4 text-blue-400" /> },
          { label: 'Taxa Média de Abertura', value: `${avgOpen.toFixed(1)}%`, color: 'text-emerald-400', icon: <Eye className="w-4 h-4 text-emerald-400" /> },
          { label: 'Fluxos Ativos', value: flows.filter(f=>f.status==='ACTIVE').length.toString(), color: 'text-purple-400', icon: <Zap className="w-4 h-4 text-purple-400" /> },
          { label: 'Receita Atribuída', value: `${(totalRevenue/1000).toFixed(0)}K Kz`, color: 'text-amber-400', icon: <TrendingUp className="w-4 h-4 text-amber-400" /> },
        ].map(k => (
          <div key={k.label} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">{k.icon}<span className="text-[11px] text-slate-400">{k.label}</span></div>
            <div className={`text-2xl font-black font-mono ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-1">
        {([['flows','📋 Fluxos'],['stats','📊 Estatísticas'],['compose','✉️ Compor']] as const).map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeTab===id?'bg-blue-600/20 text-blue-400 border border-blue-500/30':'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <div className="space-y-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-sm font-bold text-white">✉️ Nova Campanha de Email</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Enviar para</label>
              <select value={draft.sendTo} onChange={e=>setDraft(d=>({...d,sendTo:e.target.value}))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 px-3 py-2">
                <option value="all">Todos os contactos (2.100)</option>
                <option value="buyers">Compradores (487)</option>
                <option value="abandoned">Carrinhos abandonados (312)</option>
                <option value="inactive">Alunos inativos (+30 dias)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Assunto do Email</label>
              <input value={draft.subject} onChange={e=>setDraft(d=>({...d,subject:e.target.value}))}
                placeholder="Ex: 🔥 Promoção exclusiva para si..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 px-3 py-2 placeholder:text-slate-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Corpo do Email</label>
            <textarea value={draft.body} onChange={e=>setDraft(d=>({...d,body:e.target.value}))}
              rows={8} placeholder="Escreva o conteúdo do seu email aqui. Suporta HTML básico."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 px-3 py-2 placeholder:text-slate-500 resize-none font-mono" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" leftIcon={<Send className="w-4 h-4" />} onClick={sendBroadcast}>Enviar Agora</Button>
            <Button size="sm" variant="outline" onClick={()=>showToast('info','Agendamento: escolha data e hora.')}>Agendar Envio</Button>
          </div>
        </div>
      )}

      {/* Flows Tab */}
      {activeTab === 'flows' && (
        <div className="space-y-4">
          {flows.map(flow => {
            const tc = FLOW_TYPE_CONFIG[flow.type];
            const sc = STATUS_CONFIG[flow.status];
            const isExpanded = expandedFlow === flow.id;
            return (
              <div key={flow.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <button className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={()=>setExpandedFlow(isExpanded?null:flow.id)}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tc.icon}</span>
                    <div>
                      <div className="font-bold text-white text-xs">{flow.name}</div>
                      <div className={`text-[11px] font-medium ${tc.color}`}>{tc.label}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="hidden sm:block text-center">
                      <div className="text-[11px] text-slate-400">Abertura</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">{flow.avgOpenRate}%</div>
                    </div>
                    <div className="hidden md:block text-center">
                      <div className="text-[11px] text-slate-400">Cliques</div>
                      <div className="text-xs font-bold text-blue-400 font-mono">{flow.avgClickRate}%</div>
                    </div>
                    <div className="hidden lg:block text-center">
                      <div className="text-[11px] text-slate-400">Subscritores</div>
                      <div className="text-xs font-bold text-white font-mono">{flow.subscribers}</div>
                    </div>
                    <Badge variant={sc.variant} size="sm">{sc.label}</Badge>
                    <button onClick={e=>{e.stopPropagation();toggleFlowStatus(flow.id);}}
                      className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white">
                      {flow.status==='ACTIVE'?<Pause className="w-3.5 h-3.5"/>:<Play className="w-3.5 h-3.5"/>}
                    </button>
                    <button onClick={e=>{e.stopPropagation();deleteFlow(flow.id);}}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors text-slate-400 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-800 pt-4 space-y-2">
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-3">Sequência de Emails</div>
                    {flow.steps.map((step, idx) => (
                      <div key={step.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-black text-blue-400 shrink-0">
                          {idx+1}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
                          <Clock className="w-3 h-3" />
                          {step.delayDays === 0 ? 'Imediato' : `+${step.delayDays}d`}
                        </div>
                        <div className="flex-1 text-xs text-slate-200 font-medium truncate">{step.subject}</div>
                        {step.openRate > 0 && (
                          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono shrink-0">
                            <span className="text-emerald-400">👁 {step.openRate}%</span>
                            <span className="text-blue-400">🖱 {step.clickRate}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {flows.filter(f=>f.totalSent>0).map(flow => (
            <div key={flow.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white">{FLOW_TYPE_CONFIG[flow.type].icon} {flow.name}</div>
                <Badge variant={STATUS_CONFIG[flow.status].variant} size="sm">{STATUS_CONFIG[flow.status].label}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {label:'Enviados',v:flow.totalSent.toLocaleString(),c:'text-slate-300'},
                  {label:'Taxa Abertura',v:`${flow.avgOpenRate}%`,c:'text-emerald-400'},
                  {label:'Taxa Clique',v:`${flow.avgClickRate}%`,c:'text-blue-400'},
                ].map(m=>(
                  <div key={m.label} className="text-center p-2 rounded-xl bg-slate-950/50">
                    <div className={`text-sm font-black font-mono ${m.c}`}>{m.v}</div>
                    <div className="text-[10px] text-slate-500">{m.label}</div>
                  </div>
                ))}
              </div>
              {/* Mini bar: open rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Taxa de Abertura</span><span className="text-emerald-400 font-mono">{flow.avgOpenRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width:`${flow.avgOpenRate}%`}} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Taxa de Clique</span><span className="text-blue-400 font-mono">{flow.avgClickRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{width:`${flow.avgClickRate}%`}} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
