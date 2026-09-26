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
import { supabase } from '../../lib/supabase';
import { useI18n } from '../../context/I18nContext';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
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
    updateProduct,
    platformSettings,
    updatePlatformSetting
  } = useMarketplace();
  const { t, formatMoney, currency } = useI18n();

  // Generate Chart Data
  const revenueData = React.useMemo(() => {
    const days: Record<string, { date: string, revenue: number, sales: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
      days[dateStr] = { date: dateStr, revenue: 0, sales: 0 };
    }

    orders.forEach(o => {
      const dateStr = new Date(o.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
      if (days[dateStr]) {
        days[dateStr].revenue += o.platformFee || 0;
        days[dateStr].sales += 1;
      }
    });
    return Object.values(days);
  }, [orders]);

  const topProductsData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => {
      counts[o.productTitle] = (counts[o.productTitle] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, sales]) => ({ name: name.substring(0, 20) + (name.length > 20 ? '...' : ''), sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [orders]);

  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'withdrawals' | 'refunds' | 'tickets' | 'audit' | 'settings'>('overview');
  
  
  const [users, setUsers] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setUsers(data);
      }
    };
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleUpdateUserKyc = async (userId: string, status: string) => {
    const { error } = await supabase.from('user_profiles').update({ kyc_status: status }).eq('id', userId);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, kyc_status: status } : u));
      showToast('success', 'Status KYC atualizado com sucesso.');
    } else {
      showToast('error', 'Erro ao atualizar KYC.');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase.from('user_profiles').update({ role: newRole }).eq('id', userId);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showToast('success', 'Nível de permissão atualizado.');
    } else {
      showToast('error', 'Erro ao atualizar permissão.');
    }
  };

  const [realWithdrawals, setRealWithdrawals] = React.useState<any[]>([]);

  
  const [tickets, setTickets] = React.useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = React.useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = React.useState<any[]>([]);
  const [replyText, setReplyText] = React.useState('');

  React.useEffect(() => {
    const fetchTickets = async () => {
      const { data } = await supabase
        .from('support_tickets')
        .select('*, user_profiles(full_name, email)')
        .order('created_at', { ascending: false });
      if (data) setTickets(data);
    };
    if (activeTab === 'tickets') fetchTickets();
  }, [activeTab]);

  const loadTicketMessages = async (ticket: any) => {
    setSelectedTicket(ticket);
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticket.id)
      .order('created_at', { ascending: true });
    if (data) setTicketMessages(data);
  };

  const handleReplyTicket = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    // Insert message
    const { error } = await supabase.from('support_messages').insert([{
      ticket_id: selectedTicket.id,
      sender_id: user?.id,
      message: replyText,
      is_admin_reply: true
    }]);

    if (!error) {
      // Update ticket status to IN_PROGRESS if it was OPEN
      if (selectedTicket.status === 'OPEN') {
        await supabase.from('support_tickets').update({ status: 'IN_PROGRESS' }).eq('id', selectedTicket.id);
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'IN_PROGRESS' } : t));
        setSelectedTicket({ ...selectedTicket, status: 'IN_PROGRESS' });
      }
      
      setTicketMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        ticket_id: selectedTicket.id,
        sender_id: user?.id,
        message: replyText,
        is_admin_reply: true,
        created_at: new Date().toISOString()
      }]);
      setReplyText('');
      showToast('success', 'Resposta enviada ao utilizador.');
    } else {
      showToast('error', 'Falha ao enviar resposta.');
    }
  };

  const handleCloseTicket = async (id: string) => {
    const { error } = await supabase.from('support_tickets').update({ status: 'RESOLVED' }).eq('id', id);
    if (!error) {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED' } : t));
      if (selectedTicket?.id === id) {
        setSelectedTicket({ ...selectedTicket, status: 'RESOLVED' });
      }
      showToast('success', 'Ticket marcado como Resolvido.');
    }
  };

  const [refunds, setRefunds] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchRefunds = async () => {
      // Assuming a join with orders and user_profiles, but for simplicity we fetch raw and map
      const { data, error } = await supabase.from('refund_requests').select('*, orders(product_id, buyer_id), user_profiles(full_name, email)');
      if (!error && data) {
        setRefunds(data);
      }
    };
    if (activeTab === 'refunds') {
      fetchRefunds();
    }
  }, [activeTab]);

  const handleProcessRefund = async (refundId: string, newStatus: string) => {
    const { error } = await supabase.from('refund_requests').update({ status: newStatus }).eq('id', refundId);
    if (!error) {
      setRefunds(prev => prev.map(r => r.id === refundId ? { ...r, status: newStatus } : r));
      showToast(newStatus === 'APPROVED' ? 'success' : 'warning', `Reembolso ${newStatus === 'APPROVED' ? 'aprovado' : 'rejeitado'}.`);
    } else {
      showToast('error', 'Erro ao processar disputa.');
    }
  };


  React.useEffect(() => {
    import('../../lib/supabase').then(({ supabase }) => {
      supabase.from('wallet_ledger').select('*, user_profiles(full_name)').eq('type', 'withdrawal').order('created_at', { ascending: false }).then(({ data }) => {
        if (data) setRealWithdrawals(data);
      });
    });
  }, []);

  // Platform Metrics
  const gmv = orders.reduce((sum, o) => sum + o.total, 0);
  const platformRevenue = orders.reduce((sum, o) => sum + o.platformFee, 0);
  const pendingWithdrawalsCount = realWithdrawals.filter((w) => w.status === 'pending').length;

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

      
      {/* TAB: USERS & KYC */}
      {activeTab === 'users' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Gestão de Identidades (KYC)
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-tl-xl">Utilizador</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">País/Moeda</th>
                  <th className="py-3 px-4">KYC Status</th>
                  <th className="py-3 px-4 rounded-tr-xl text-right">Ações KYC / Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{u.full_name}</div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <Badge variant={u.role === 'SUPER_ADMIN' ? 'success' : 'neutral'} size="sm">
                        {u.role || 'MEMBER'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {u.country || 'N/A'} / {u.currency || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.kyc_status === 'APPROVED' ? 'success' : u.kyc_status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                        {u.kyc_status || 'NONE'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 flex justify-end gap-2">
                      {/* KYC Actions */}
                      {u.kyc_status !== 'APPROVED' && (
                        <Button size="sm" variant="success" onClick={() => handleUpdateUserKyc(u.id, 'APPROVED')}>
                          Aprovar KYC
                        </Button>
                      )}
                      {u.kyc_status === 'PENDING' && (
                        <Button size="sm" variant="danger" onClick={() => handleUpdateUserKyc(u.id, 'REJECTED')}>
                          Rejeitar
                        </Button>
                      )}
                      {/* Role Actions */}
                      {u.role !== 'SUPER_ADMIN' && (
                        <Button size="sm" variant="secondary" onClick={() => handleUpdateUserRole(u.id, 'SUPER_ADMIN')}>
                          Tornar Admin
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

            {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Chart */}
            <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-xl">
              <h3 className="text-sm font-bold text-slate-100 mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Receita da Plataforma (Últimos 7 Dias)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products Chart */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-xl">
              <h3 className="text-sm font-bold text-slate-100 mb-6 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-400" />
                Top 5 Produtos (Vendas)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} hide />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={100} />
                    <RechartsTooltip 
                      cursor={{fill: '#1e293b'}}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

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
                          {(o.paymentMethod || "UNKNOWN").replace('_', ' ').toUpperCase()}
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
                      {(w.status || "UNKNOWN").toUpperCase()}
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


      
      
      {/* TAB: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-xl h-[600px] flex flex-col md:flex-row gap-6">
          
          {/* TICKETS LIST */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 border-r border-slate-800/60 pr-0 md:pr-6 h-full overflow-y-auto">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Tickets Abertos
            </h3>
            
            {tickets.length === 0 ? (
              <p className="text-xs text-slate-500">Sem tickets na base de dados.</p>
            ) : (
              <div className="space-y-2">
                {tickets.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => loadTicketMessages(t)}
                    className={`p-3 rounded-xl border cursor-pointer transition-colors ${selectedTicket?.id === t.id ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-950 border-slate-800 hover:bg-slate-800/50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-200 text-xs truncate max-w-[150px]">{t.subject}</span>
                      <Badge variant={t.status === 'RESOLVED' ? 'success' : t.status === 'IN_PROGRESS' ? 'warning' : 'danger'} size="sm">
                        {t.status}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      De: {t.user_profiles?.full_name || 'Utilizador'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {new Date(t.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TICKET CHAT WINDOW */}
          <div className="w-full md:w-2/3 flex flex-col h-full">
            {!selectedTicket ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                Selecione um ticket para ver as mensagens.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                  <div>
                    <h4 className="font-bold text-slate-100">{selectedTicket.subject}</h4>
                    <p className="text-xs text-slate-400">Cliente: {selectedTicket.user_profiles?.full_name} ({selectedTicket.user_profiles?.email})</p>
                  </div>
                  {selectedTicket.status !== 'RESOLVED' && (
                    <Button size="sm" variant="success" onClick={() => handleCloseTicket(selectedTicket.id)}>
                      Marcar Resolvido
                    </Button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {ticketMessages.map(msg => (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.is_admin_reply ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      <span className="text-[10px] text-slate-500 mb-1">{msg.is_admin_reply ? 'Suporte (Você)' : 'Cliente'}</span>
                      <div className={`p-3 rounded-2xl text-sm ${msg.is_admin_reply ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                        {msg.message}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {ticketMessages.length === 0 && (
                    <p className="text-center text-xs text-slate-500">Sem mensagens.</p>
                  )}
                </div>

                {selectedTicket.status !== 'RESOLVED' && (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleReplyTicket()}
                      placeholder="Escreva a resposta ao cliente..."
                      className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100"
                    />
                    <Button variant="primary" onClick={handleReplyTicket}>
                      Enviar
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      )}

      {/* TAB: REFUNDS */}
      {activeTab === 'refunds' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Centro de Resolução (Disputas e Reembolsos)
            </h3>
          </div>
          
          {refunds.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Não existem disputas pendentes no momento.
            </div>
          ) : (
            <div className="space-y-3">
              {refunds.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{r.user_profiles?.full_name || 'Cliente'}</span>
                      <span className="text-xs text-slate-500">({r.user_profiles?.email || 'N/A'})</span>
                    </div>
                    <div className="text-sm text-slate-300">
                      <strong>Motivo:</strong> {r.reason}
                    </div>
                    <div className="text-xs text-slate-500">
                      ID da Compra: {r.order_id} | Data do Pedido: {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                    <Badge variant={r.status === 'APPROVED' ? 'success' : r.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                      {r.status || 'PENDING'}
                    </Badge>
                    
                    {r.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="danger" onClick={() => handleProcessRefund(r.id, 'APPROVED')}>
                          Aprovar (Devolver)
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleProcessRefund(r.id, 'REJECTED')}>
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SYSTEM & CURRENCY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl text-xs text-slate-300">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            Configurações do Sistema (Live Database)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="font-bold text-slate-200 block">Comissão Padrão da Plataforma (%)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  step="0.1"
                  value={platformSettings.takeRate} 
                  onChange={(e) => updatePlatformSetting('takeRate', parseFloat(e.target.value))}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono w-full" 
                />
                <Button size="sm" variant="success" onClick={() => showToast('success', 'Taxa de Comissão guardada em tempo real na BD.')}>Guardar</Button>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="font-bold text-slate-200 block">Taxa de Câmbio de Referência (1 USD = AOA)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  step="0.1"
                  value={platformSettings.exchangeRateUsdAoa} 
                  onChange={(e) => updatePlatformSetting('exchangeRateUsdAoa', parseFloat(e.target.value))}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono w-full" 
                />
                <Button size="sm" variant="success" onClick={() => showToast('success', 'Taxa de Câmbio atualizada em tempo real na BD.')}>Guardar</Button>
              </div>
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 flex items-start gap-3 mt-4">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>
              Qualquer alteração efetuada nestes campos é imediatamente guardada na tabela <code>platform_settings</code> no Supabase. Todos os checkouts ativos vão recalcular os preços instantaneamente com base nestes novos valores.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
