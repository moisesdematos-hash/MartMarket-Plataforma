// ==============================================================================
// MARTMARKET VISUAL FUNNEL BUILDER (1-CLICK UPSELL/DOWNSELL)
// Node-based UI for creating post-purchase offer flows.
// ==============================================================================

import React, { useState } from 'react';
import { 
  GitMerge, Plus, ArrowRight, ArrowDownRight, ArrowUpRight, 
  Settings, Copy, Trash2, Check, DollarSign, Play, StopCircle, ShoppingCart 
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../lib/currencies';

type NodeType = 'TRIGGER' | 'UPSELL' | 'DOWNSELL' | 'THANK_YOU';

interface FunnelNode {
  id: string;
  type: NodeType;
  title: string;
  price?: number;
  conversionRate?: number;
  revenue?: number;
  nextAccept?: string;
  nextDecline?: string;
}

export const FunnelFlowBuilder: React.FC = () => {
  const { showToast } = useNotification();
  const [funnelActive, setFunnelActive] = useState(true);

  // Simulated node structure (like a flowchart)
  const [nodes, setNodes] = useState<FunnelNode[]>([
    { 
      id: 'n-trigger', type: 'TRIGGER', title: 'Produto Principal: Masterclass Fullstack', 
      price: 75000, conversionRate: 100, revenue: 12500000,
      nextAccept: 'n-upsell-1'
    },
    { 
      id: 'n-upsell-1', type: 'UPSELL', title: 'Mentoria Individual VIP (1h)', 
      price: 25000, conversionRate: 14.2, revenue: 1775000,
      nextAccept: 'n-thanks', nextDecline: 'n-downsell-1'
    },
    { 
      id: 'n-downsell-1', type: 'DOWNSELL', title: 'Gravação Mentoria em Grupo (Desconto)', 
      price: 10000, conversionRate: 21.5, revenue: 1075000,
      nextAccept: 'n-thanks', nextDecline: 'n-thanks'
    },
    { 
      id: 'n-thanks', type: 'THANK_YOU', title: 'Página de Obrigado (Fim do Funil)' 
    },
  ]);

  const totalFunnelRevenue = nodes.filter(n => n.type !== 'TRIGGER').reduce((s, n) => s + (n.revenue || 0), 0);
  const bumpPercentage = ((totalFunnelRevenue / (nodes[0].revenue || 1)) * 100).toFixed(1);

  const getNodeIcon = (type: NodeType) => {
    switch(type) {
      case 'TRIGGER': return <ShoppingCart className="w-5 h-5 text-blue-400" />;
      case 'UPSELL': return <ArrowUpRight className="w-5 h-5 text-emerald-400" />;
      case 'DOWNSELL': return <ArrowDownRight className="w-5 h-5 text-amber-400" />;
      case 'THANK_YOU': return <Check className="w-5 h-5 text-slate-400" />;
    }
  };

  const getNodeStyle = (type: NodeType) => {
    switch(type) {
      case 'TRIGGER': return 'border-blue-500/50 bg-blue-600/10';
      case 'UPSELL': return 'border-emerald-500/50 bg-emerald-600/10';
      case 'DOWNSELL': return 'border-amber-500/50 bg-amber-600/10';
      case 'THANK_YOU': return 'border-slate-700 bg-slate-800/50';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<GitMerge className="w-3.5 h-3.5" />}>
            Construtor Visual de Funil (1-Click)
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Order Bumps & Upsells</h2>
          <p className="text-xs text-slate-400">Desenhe a jornada de compra e ofereça produtos complementares sem o cliente inserir o cartão de novo.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={funnelActive ? 'danger' : 'primary'}
            leftIcon={funnelActive ? <StopCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            onClick={() => { setFunnelActive(!funnelActive); showToast(funnelActive ? 'warning' : 'success', funnelActive ? 'Funil pausado.' : 'Funil ativado e pronto a vender!'); }}>
            {funnelActive ? 'Pausar Funil' : 'Ativar Funil'}
          </Button>
          <Button size="sm" leftIcon={<Settings className="w-4 h-4" />} variant="outline"
            onClick={() => showToast('info', 'Definições do funil abertas.')}>
            Definições
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* KPI Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Receita Adicional Gerada</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">+{formatCurrency(totalFunnelRevenue, 'AOA')}</div>
            <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-2">
              <Badge variant="success" size="sm">+{bumpPercentage}%</Badge> aumento no AOV
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200">Adicionar Passo</h3>
            <div className="grid grid-cols-1 gap-2">
              <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 transition-colors cursor-pointer text-left"
                onClick={() => showToast('info', 'Arraste um produto para adicionar como Upsell.')}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Upsell (Aceitar)</div>
                  <div className="text-[10px] text-slate-400">Oferta se comprar</div>
                </div>
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 transition-colors cursor-pointer text-left"
                onClick={() => showToast('info', 'Arraste um produto para adicionar como Downsell.')}>
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <ArrowDownRight className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Downsell (Recusar)</div>
                  <div className="text-[10px] text-slate-400">Oferta de resgate</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas (Flowchart mapping) */}
        <div className="lg:col-span-3 min-h-[500px] rounded-3xl bg-[#0f172a] border border-slate-800 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/30 via-slate-900/10 to-transparent">
          {/* Grid background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="absolute inset-0 p-8 flex flex-col items-center gap-8 overflow-y-auto">
            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div className={`w-[340px] rounded-2xl border-2 bg-slate-900/90 backdrop-blur-sm p-4 relative z-10 shadow-2xl ${getNodeStyle(node.type)}`}>
                  
                  {/* Action buttons on hover */}
                  <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"><Settings className="w-3 h-3"/></button>
                     {node.type !== 'TRIGGER' && node.type !== 'THANK_YOU' && <button className="w-6 h-6 rounded-full bg-rose-900/50 border border-rose-700/50 flex items-center justify-center text-rose-400 hover:text-white cursor-pointer"><Trash2 className="w-3 h-3"/></button>}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getNodeIcon(node.type)}</div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {node.type === 'TRIGGER' ? 'Produto Gatilho' : node.type === 'THANK_YOU' ? 'Conclusão' : node.type}
                      </div>
                      <div className="text-sm font-bold text-white leading-tight">{node.title}</div>
                      
                      {node.price !== undefined && (
                        <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-700/50 pt-2">
                          <div>
                            <div className="text-slate-400 text-[10px]">Preço</div>
                            <div className="font-mono text-white">{formatCurrency(node.price, 'AOA')}</div>
                          </div>
                          {node.type !== 'TRIGGER' && (
                            <div className="text-right">
                              <div className="text-slate-400 text-[10px]">Conversão</div>
                              <div className="font-mono text-emerald-400 font-bold">{node.conversionRate}%</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connectors (Simulated visually) */}
                {node.nextAccept && (
                  <div className="w-1 h-8 bg-emerald-500/50 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-emerald-500/50 px-2 py-0.5 rounded text-[9px] text-emerald-400 font-bold tracking-widest z-10">
                      ACEITA
                    </div>
                  </div>
                )}
                {node.nextDecline && (
                  <div className="w-1 h-8 bg-amber-500/50 relative -mt-16 ml-[340px] rotate-45 transform origin-top-left">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-amber-500/50 px-2 py-0.5 rounded text-[9px] text-amber-400 font-bold tracking-widest z-10 -rotate-45">
                      RECUSA
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
