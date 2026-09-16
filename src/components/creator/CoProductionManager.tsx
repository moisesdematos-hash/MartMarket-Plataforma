// ==============================================================================
// MARTMARKET CO-PRODUCTION & DUAL-LEDGER REVENUE SPLIT MANAGER
// Manage multi-party co-production agreements with automated real-time
// payout splits, contract duration, role assignments, and ledger allocation.
// ==============================================================================

import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, DollarSign, PieChart, Percent, Check, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../lib/currencies';

interface CoProducer {
  id: string;
  name: string;
  email: string;
  role: 'CO_PRODUCER' | 'TRAFFIC_MANAGER' | 'COPYWRITER' | 'STRATEGIST';
  splitPercentage: number;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  contractExpiresAt: string;
  totalEarnedAOA: number;
}

export const CoProductionManager: React.FC = () => {
  const { showToast } = useNotification();

  const [coProducers, setCoProducers] = useState<CoProducer[]>([
    {
      id: 'coprod-1',
      name: 'Manuel Viana (Estrategista de Tráfego)',
      email: 'manuel.viana@growthmedia.ao',
      role: 'TRAFFIC_MANAGER',
      splitPercentage: 30,
      status: 'ACTIVE',
      contractExpiresAt: '2027-12-31',
      totalEarnedAOA: 2450000
    },
    {
      id: 'coprod-2',
      name: 'Tânia Santos (Copywriter & VSL)',
      email: 'tania.copy@creativelab.ao',
      role: 'COPYWRITER',
      splitPercentage: 10,
      status: 'ACTIVE',
      contractExpiresAt: '2027-06-30',
      totalEarnedAOA: 816000
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'CO_PRODUCER' | 'TRAFFIC_MANAGER' | 'COPYWRITER' | 'STRATEGIST'>('CO_PRODUCER');
  const [newPercentage, setNewPercentage] = useState(15);
  const [newDurationMonths, setNewDurationMonths] = useState(12);

  // Simulation calculator
  const [simulationGrossAOA, setSimulationGrossAOA] = useState(50000);

  const mainCreatorPercentage = 100 - coProducers.reduce((acc, c) => acc + c.splitPercentage, 0);

  const handleAddCoProducer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast('error', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (newPercentage > mainCreatorPercentage) {
      showToast('error', `A porcentagem excede o limite disponível (${mainCreatorPercentage}%).`);
      return;
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + newDurationMonths);

    const newEntry: CoProducer = {
      id: `coprod-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      splitPercentage: newPercentage,
      status: 'ACTIVE',
      contractExpiresAt: expiryDate.toISOString().split('T')[0],
      totalEarnedAOA: 0
    };

    setCoProducers(prev => [...prev, newEntry]);
    setIsAdding(false);
    setNewName('');
    setNewEmail('');
    showToast('success', 'Contrato de co-produção criado e ativado no ledger!');
  };

  const handleRemove = (id: string) => {
    setCoProducers(prev => prev.filter(c => c.id !== id));
    showToast('info', 'Contrato de co-produção revogado.');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<Users className="w-3.5 h-3.5" />}>
            Divisão Automática de Receita (Split Ledger)
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Gestão de Co-Produção
          </h2>
          <p className="text-xs text-slate-400">
            Divida a receita líquida de cada venda automaticamente entre sócios, gestores de tráfego e especialistas direto nas suas carteiras.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Novo Coprodutor
        </Button>
      </div>

      {/* Split Allocation Overview Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-blue-400" /> Distribuição da Receita Líquida (100%)
          </span>
          <span className="text-blue-400 font-mono">
            Disponível para novos sócios: {mainCreatorPercentage}%
          </span>
        </div>

        {/* Progress Multi-Segment Bar */}
        <div className="w-full h-4 rounded-full bg-slate-950 border border-slate-800 flex overflow-hidden">
          <div
            style={{ width: `${mainCreatorPercentage}%` }}
            className="bg-blue-600 h-full flex items-center justify-center text-[9px] font-bold text-white transition-all"
            title={`Produtor Principal: ${mainCreatorPercentage}%`}
          >
            {mainCreatorPercentage > 15 ? `Você (${mainCreatorPercentage}%)` : ''}
          </div>
          {coProducers.map((c, idx) => (
            <div
              key={c.id}
              style={{ width: `${c.splitPercentage}%` }}
              className={`h-full flex items-center justify-center text-[9px] font-bold text-white transition-all ${
                idx === 0 ? 'bg-purple-600' : idx === 1 ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
              title={`${c.name}: ${c.splitPercentage}%`}
            >
              {c.splitPercentage > 10 ? `${c.splitPercentage}%` : ''}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 text-xs pt-2">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Você (Produtor Principal): <strong>{mainCreatorPercentage}%</strong></span>
          </div>
          {coProducers.map((c, idx) => (
            <div key={c.id} className="flex items-center gap-1.5 text-slate-300">
              <span className={`w-2.5 h-2.5 rounded-full ${
                idx === 0 ? 'bg-purple-600' : idx === 1 ? 'bg-emerald-600' : 'bg-amber-600'
              }`}></span>
              <span>{c.name}: <strong>{c.splitPercentage}%</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Co-Producer Form */}
      {isAdding && (
        <form onSubmit={handleAddCoProducer} className="p-6 rounded-2xl bg-slate-900/90 border border-blue-500/40 space-y-4 animate-fade-in shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> Cadastrar Novo Coprodutor / Parceiro
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nome Completo</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Carlos Mateus"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">E-mail MartMarket do Parceiro</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="parceiro@email.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Função / Papel</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="TRAFFIC_MANAGER">Gestor de Tráfego Pago</option>
                <option value="COPYWRITER">Copywriter / Roteirista VSL</option>
                <option value="STRATEGIST">Estrategista de Lançamento</option>
                <option value="CO_PRODUCER">Coprodutor Geral / Especialista</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Porcentagem Líquida (%)</label>
              <input
                type="number"
                min="1"
                max={mainCreatorPercentage}
                value={newPercentage}
                onChange={(e) => setNewPercentage(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Salvar Contrato de Split
            </Button>
          </div>
        </form>
      )}

      {/* Active Co-Producers Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200">
            Contratos de Co-Produção Ativos ({coProducers.length})
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Liquidação automática via Double-Entry Ledger
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Parceiro</th>
                <th className="p-3.5">Função</th>
                <th className="p-3.5">Split (%)</th>
                <th className="p-3.5">Total Repassado</th>
                <th className="p-3.5">Validade</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {coProducers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {c.role === 'TRAFFIC_MANAGER' ? 'Tráfego Pago' : c.role === 'COPYWRITER' ? 'Copywriter' : 'Coprodutor'}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-blue-400">
                    {c.splitPercentage}%
                  </td>
                  <td className="p-3.5 font-mono text-emerald-400 font-semibold">
                    {formatCurrency(c.totalEarnedAOA, 'AOA')}
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {c.contractExpiresAt}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleRemove(c.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                      title="Revogar contrato"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Split Simulator */}
      <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" /> Simulador de Venda & Divisão Automática
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-64">
            <label className="block text-[11px] text-slate-400 mb-1">Simular Valor da Venda (AOA)</label>
            <input
              type="number"
              step="5000"
              value={simulationGrossAOA}
              onChange={(e) => setSimulationGrossAOA(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Sua Carteira ({mainCreatorPercentage}%)</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {formatCurrency(simulationGrossAOA * 0.9 * (mainCreatorPercentage / 100), 'AOA')}
              </span>
            </div>

            {coProducers.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block truncate">{c.name} ({c.splitPercentage}%)</span>
                <span className="text-sm font-bold font-mono text-blue-400">
                  {formatCurrency(simulationGrossAOA * 0.9 * (c.splitPercentage / 100), 'AOA')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
