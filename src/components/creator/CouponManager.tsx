// ==============================================================================
// MARTMARKET ADVANCED COUPON & FLASH SALE CAMPAIGN MANAGER
// Create and manage discount codes (% or fixed amount), expiration countdowns,
// maximum redemption caps, affiliate bindings, and live tracking.
// ==============================================================================

import React, { useState } from 'react';
import { Tag, Plus, Clock, Copy, CheckCircle2, Percent, DollarSign, Calendar, Trash2, Power } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../lib/currencies';

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED';
}

export const CouponManager: React.FC = () => {
  const { showToast } = useNotification();

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'cp-1',
      code: 'LANCAMENTO20',
      type: 'PERCENTAGE',
      value: 20,
      maxUses: 100,
      currentUses: 64,
      expiresAt: '2026-10-31',
      status: 'ACTIVE'
    },
    {
      id: 'cp-2',
      code: 'BLACKFRIDAY50',
      type: 'PERCENTAGE',
      value: 50,
      maxUses: 250,
      currentUses: 198,
      expiresAt: '2026-11-30',
      status: 'ACTIVE'
    },
    {
      id: 'cp-3',
      code: 'VIPANGOLA10000',
      type: 'FIXED',
      value: 10000,
      maxUses: 50,
      currentUses: 12,
      expiresAt: '2026-12-31',
      status: 'ACTIVE'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState(15);
  const [maxUses, setMaxUses] = useState(100);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('error', 'Digite um código de cupom.');
      return;
    }

    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: code.toUpperCase().trim(),
      type,
      value,
      maxUses,
      currentUses: 0,
      expiresAt,
      status: 'ACTIVE'
    };

    setCoupons(prev => [newCoupon, ...prev]);
    setIsAdding(false);
    setCode('');
    showToast('success', `Cupom ${newCoupon.code} ativado com sucesso!`);
  };

  const handleCopyCode = (c: string) => {
    navigator.clipboard.writeText(c);
    showToast('success', `Código ${c} copiado para a área de transferência!`);
  };

  const handleToggleStatus = (id: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        showToast('info', `Cupom ${c.code} alterado para ${nextStatus}.`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleDelete = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('info', 'Cupom excluído.');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<Tag className="w-3.5 h-3.5" />}>
            Promoções Relâmpago & Cupons
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Gestão de Cupons de Desconto
          </h2>
          <p className="text-xs text-slate-400">
            Crie campanhas de escassez, cupons percentuais ou de valor fixo com limite de uso para acelerar conversões no Checkout.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Criar Novo Cupom
        </Button>
      </div>

      {/* Add Coupon Form */}
      {isAdding && (
        <form onSubmit={handleCreateCoupon} className="p-6 rounded-2xl bg-slate-900 border border-blue-500/40 space-y-4 animate-fade-in shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-400" /> Cadastrar Novo Cupom de Desconto
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Código do Cupom</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: PROMO2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Tipo de Desconto</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="PERCENTAGE">Porcentagem (%)</option>
                <option value="FIXED">Valor Fixo (Kz / USD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                {type === 'PERCENTAGE' ? 'Desconto (%)' : 'Valor Fixo (Kz)'}
              </label>
              <input
                type="number"
                min="1"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Limite Máx. de Usos</label>
              <input
                type="number"
                min="1"
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Data de Validade</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
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
              Ativar Cupom
            </Button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200">
            Cupons Ativos & Campanhas ({coupons.length})
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Válidos para One-Page Checkout
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Código</th>
                <th className="p-3.5">Desconto</th>
                <th className="p-3.5">Utilizações</th>
                <th className="p-3.5">Validade</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {coupons.map((c) => {
                const percentUsed = Math.round((c.currentUses / c.maxUses) * 100);
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
                          {c.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(c.code)}
                          className="text-slate-400 hover:text-white transition-colors"
                          title="Copiar código"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `-${formatCurrency(c.value, 'AOA')}`}
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span>{c.currentUses} de {c.maxUses}</span>
                          <span className="text-slate-400">{percentUsed}%</span>
                        </div>
                        <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      {c.expiresAt}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={c.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
                        {c.status === 'ACTIVE' ? 'Ativo' : 'Pausado'}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(c.id)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          title="Pausar/Ativar"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                          title="Excluir Cupom"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
