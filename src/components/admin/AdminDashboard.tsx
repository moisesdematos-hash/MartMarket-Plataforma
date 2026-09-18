// ==============================================================================
// MARTMARKET SUPER ADMIN CONTROL TOWER & MODERATION
// ==============================================================================

import React, { useState } from 'react';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Package, 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Settings, 
  AlertTriangle,
  Lock,
  Search
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto py-24 px-4 text-center">
        <div className="w-20 h-20 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
        <p className="text-slate-400">Esta área é restrita a administradores de topo.</p>
      </div>
    );
  }

  const { 
    products, 
    orders, 
    withdrawals, 
    approveWithdrawal, 
    updateProduct 
  } = useMarketplace();
  const { t, formatMoney, currency } = useI18n();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'withdrawals' | 'audit' | 'settings'>('overview');

  // Platform Metrics
  const gmv = orders.reduce((sum, o) => sum + o.total, 0);
  const platformRevenue = orders.reduce((sum, o) => sum + o.platformFee, 0);
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;

  const handleApproveProduct = (id: string) => {
    updateProduct(id, { status: 'published', isPublished: true });
    showToast('success', 'Produto aprovado e publicado com sucesso no marketplace.');
  };

  const handleSuspendProduct = (id: string) => {
    updateProduct(id, { status: 'suspended', isPublished: false });
    showToast('warning', 'Produto suspenso do marketplace.');
  };

  const handleApprovePayout = (id: string) => {
    approveWithdrawal(id, 'Aprovado e liquidado pelo operador financeiro.');
    showToast('success', 'Levantamento aprovado e liquidado.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="danger" size="sm" icon={<Shield className="w-3.5 h-3.5" />}>
            Super Admin Control Tower
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {t('adminTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Controlo total do ecossistema: volume bruto transacionado, moderação, liquidação e parâmetros fiscais.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('gmvLabel')}</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {formatMoney(gmv, currency)}
          </div>
          <span className="text-[11px] text-slate-400">Volume total transacionado</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('platformRevenue')}</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {formatMoney(platformRevenue, currency)}
          </div>
          <span className="text-[11px] text-slate-400">Take-rate 7.9% líquido</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('totalProducts')}</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {products.length}
          </div>
          <span className="text-[11px] text-slate-400">Ativos no ecossistema</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('pendingWithdrawals')}</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {pendingWithdrawalsCount}
          </div>
          <span className="text-[11px] text-slate-400">Aguardando liquidação bancária</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-800 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Visão Geral & Pedidos' },
          { id: 'products', label: 'Moderação de Conteúdos' },
          { id: 'withdrawals', label: 'Fila de Levantamentos' },
          { id: 'audit', label: 'Auditoria & Logs' },
          { id: 'settings', label: 'Configurações de Taxas & Moedas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Últimas Transações Globais
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 px-4 font-semibold">Data</th>
                  <th className="pb-3 px-4 font-semibold">Comprador</th>
                  <th className="pb-3 px-4 font-semibold">Produto</th>
                  <th className="pb-3 px-4 font-semibold">Método</th>
                  <th className="pb-3 px-4 font-semibold">Take-rate</th>
                  <th className="pb-3 px-4 font-semibold text-right">Total Liquidez</th>
                  <th className="pb-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 text-slate-300">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{o.buyerName}</div>
                      <div className="text-[10px] text-slate-500">{o.buyerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {o.productTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="neutral" size="sm">
                        {o.paymentMethod.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">
                      +{formatMoney(o.platformFee, o.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100">
                      {formatMoney(o.total, o.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" size="sm">PAGO</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MODERATION */}
      {activeTab === 'products' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100">{t('productModeration')}</h3>
          <div className="divide-y divide-slate-800/60">
            {products.map((p) => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.coverImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{p.title}</h4>
                    <span className="text-slate-400">Criador: {p.creatorName} • {formatMoney(p.defaultPrice, p.currency)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={p.isPublished ? 'success' : 'neutral'} size="sm">
                    {p.isPublished ? 'Publicado' : 'Suspenso'}
                  </Badge>

                  {p.isPublished ? (
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => handleSuspendProduct(p.id)}
                    >
                      Suspender
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => handleApproveProduct(p.id)}
                    >
                      Aprovar & Publicar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WITHDRAWALS QUEUE */}
      {activeTab === 'withdrawals' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100">Fila de Liquidação Bancária</h3>
          {withdrawals.length === 0 ? (
            <p className="text-xs text-slate-400">Sem pedidos de levantamento registados.</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{w.userName}</div>
                    <div className="text-slate-400 break-all">{w.payoutDetails}</div>
                    <div className="font-mono text-emerald-400 font-bold mt-1">
                      {formatMoney(w.amount, w.currency)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Badge variant={w.status === 'paid' ? 'success' : 'warning'} size="sm">
                      {w.status.toUpperCase()}
                    </Badge>
                    {w.status === 'pending' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleApprovePayout(w.id)}
                      >
                        {t('approveWithdrawal')}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 space-y-4 shadow-xl text-xs text-slate-300">
          <h3 className="text-base font-bold text-slate-100">{t('auditLogs')}</h3>
          <div className="space-y-2">
            {[
              { id: '1', action: 'ADMIN_APPROVED_WITHDRAWAL', actor: 'Super Admin', details: 'Levantamento #with-1 liquidado para BAI AO06', time: 'Há 2 horas' },
              { id: '2', action: 'ORDER_CONFIRMED_LEDGER', actor: 'System Worker', details: 'Ordem #MM-89214 creditada com sucesso no ledger', time: 'Há 5 horas' },
              { id: '3', action: 'PRODUCT_AUTO_INDEXED', actor: 'Indexer Engine', details: 'Produto "Masterclass Fullstack" atualizado no marketplace', time: 'Há 1 dia' }
            ].map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-blue-400 block">{log.action}</span>
                  <span className="text-slate-400">{log.details}</span>
                </div>
                <span className="text-slate-500 font-mono text-[11px]">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM & CURRENCY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl text-xs text-slate-300">
          <h3 className="text-base font-bold text-slate-100">{t('systemSettings')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="font-bold text-slate-200 block">Comissão Padrão da Plataforma (Take-Rate %)</label>
              <input type="text" defaultValue="7.9%" className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono w-full" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="font-bold text-slate-200 block">Taxa de Câmbio de Referência (1 USD = Kz)</label>
              <input type="text" defaultValue="915.50 AOA" className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
