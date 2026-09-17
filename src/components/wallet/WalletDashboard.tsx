// ==============================================================================
// MARTMARKET AUDITABLE FINANCIAL LEDGER & WALLET
// ==============================================================================

import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText,
  DollarSign
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const WalletDashboard: React.FC = () => {
  const { 
    wallet, 
    ledger, 
    payoutMethods, 
    withdrawals, 
    requestWithdrawal, 
    addPayoutMethod 
  } = useMarketplace();
  const { t, formatMoney, currency } = useI18n();
  const { user } = useAuth();
  const { showToast } = useNotification();

  // Modals
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // Withdrawal form
  const [withdrawAmount, setWithdrawAmount] = useState<number>(wallet.availableBalance);
  const [selectedPayoutMethodId, setSelectedPayoutMethodId] = useState<string>(payoutMethods[0]?.id || '');

  // Add Account form
  const [bankName, setBankName] = useState('Banco Angolano de Investimentos (BAI)');
  const [accountHolder, setAccountHolder] = useState(user?.fullName || 'Kelson Manuel');
  const [ibanInput, setIbanInput] = useState('AO06 ');

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayoutMethodId) {
      showToast('error', 'Por favor selecione ou cadastre uma conta bancária.');
      return;
    }

    const result = requestWithdrawal(
      user?.id || 'usr-creator-1',
      user?.fullName || 'Kelson Manuel',
      selectedPayoutMethodId,
      withdrawAmount
    );

    if (result.success) {
      showToast('success', 'Pedido de levantamento registado com sucesso! O valor será processado para a sua conta.');
      setIsWithdrawModalOpen(false);
    } else {
      showToast('error', result.error || 'Erro ao processar o levantamento.');
    }
  };

  const handleAddPayoutMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountHolder || !ibanInput) {
      showToast('error', 'Por favor preencha todos os dados bancários.');
      return;
    }

    addPayoutMethod({
      userId: user?.id || 'usr-creator-1',
      methodType: 'angola_iban',
      bankName,
      accountHolder,
      ibanOrAccount: ibanInput,
      isDefault: payoutMethods.length === 0,
      isVerified: true
    });

    showToast('success', 'Conta bancária cadastrada com sucesso!');
    setIsAddAccountModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="success" size="sm" icon={<Wallet className="w-3.5 h-3.5" />}>
            Sistema Financeiro & Carteira
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {t('walletTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Contabilidade de dupla entrada com registo imutável de vendas, comissões, taxas e levantamentos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddAccountModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {t('addPayoutMethod')}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setWithdrawAmount(wallet.availableBalance);
              setIsWithdrawModalOpen(true);
            }}
            disabled={wallet.availableBalance <= 0}
            leftIcon={<ArrowUpRight className="w-4 h-4" />}
            className="shadow-lg shadow-blue-500/20"
          >
            {t('requestWithdrawal')}
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        
        {/* Available Balance */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/30 via-slate-900 to-slate-900 border border-blue-500/30 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">
            {t('availableBalance')}
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-mono truncate">
            {formatMoney(wallet.availableBalance, currency)}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Disponível imediatamente para transferência
          </span>
        </div>

        {/* Pending Balance */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">
            {t('pendingBalance')}
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-amber-400 font-mono truncate">
            {formatMoney(wallet.pendingBalance, currency)}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Garantia (7 a 14 dias)
          </span>
        </div>

        {/* Total Withdrawn */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">
            {t('totalWithdrawn')}
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono truncate">
            {formatMoney(wallet.totalWithdrawn, currency)}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Liquidado com sucesso
          </span>
        </div>

        {/* AGT Tax Estimator */}
        <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/20 space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-6 text-[10px] bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 px-2" onClick={() => showToast('info', 'O Relatório Anual do Imposto Industrial estará disponível aqui no final do exercício económico.')}>
              Baixar Relatório
            </Button>
          </div>
          <span className="text-xs font-semibold text-rose-400/80 block">
            Imposto Estimado (AGT)
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-rose-400 font-mono truncate">
            {formatMoney((wallet.availableBalance + wallet.pendingBalance + wallet.totalWithdrawn) * 0.065, currency)}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            6.5% - Regime Simplificado do Imposto Industrial
          </span>
        </div>
      </div>

      {/* Registered Payout Methods */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-sm text-slate-100">{t('payoutMethods')}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddAccountModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Adicionar Outra Conta
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {payoutMethods.map((pm) => (
            <div
              key={pm.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">{pm.bankName}</div>
                  <div className="text-slate-400">{pm.accountHolder}</div>
                  <div className="font-mono text-cyan-400 font-semibold mt-1">{pm.ibanOrAccount}</div>
                </div>
              </div>
              <Badge variant="success" size="sm">Verificada</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Auditable Ledger History */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">{t('ledgerHistory')}</h3>
            <p className="text-xs text-slate-400">Registo contábil imutável de todas as movimentações financeiras.</p>
          </div>
          <Badge variant="neutral" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            Double-Entry Ledger
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-right">Saldo Resultante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ledger.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={item.amount > 0 ? 'success' : 'danger'}
                      size="sm"
                    >
                      {item.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    {item.referenceId || '-'}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                    item.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {item.amount > 0 ? `+${formatMoney(item.amount, item.currency)}` : formatMoney(item.amount, item.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100">
                    {formatMoney(item.balanceAfter, item.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Request Withdrawal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Solicitar Levantamento Bancário"
        maxWidth="md"
      >
        <form onSubmit={handleRequestWithdrawal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Conta de Destino *
            </label>
            <select
              value={selectedPayoutMethodId}
              onChange={(e) => setSelectedPayoutMethodId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none cursor-pointer"
            >
              {payoutMethods.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.bankName} - {pm.ibanOrAccount}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Valor a Levantar ({currency}) *
            </label>
            <input
              type="number"
              min="1000"
              max={wallet.availableBalance}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Saldo disponível: {formatMoney(wallet.availableBalance, currency)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Taxa de Transferência:</span>
              <span className="text-emerald-400 font-semibold">{formatMoney(0, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Prazo de Processamento:</span>
              <span className="text-slate-200">2 a 24 horas úteis</span>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
            Confirmar Levantamento &rarr;
          </Button>
        </form>
      </Modal>

      {/* Modal: Add Payout Method */}
      <Modal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        title="Cadastrar Nova Conta Bancária"
        maxWidth="md"
      >
        <form onSubmit={handleAddPayoutMethod} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Instituição Bancária *
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="Banco Angolano de Investimentos (BAI)">Banco Angolano de Investimentos (BAI)</option>
              <option value="Banco de Fomento Angola (BFA)">Banco de Fomento Angola (BFA)</option>
              <option value="Banco BIC Angola">Banco BIC Angola</option>
              <option value="Banco Millennium Atlântico (BMA)">Banco Millennium Atlântico (BMA)</option>
              <option value="Banco SOL">Banco SOL</option>
              <option value="Banco Standard Bank Angola">Standard Bank Angola</option>
              <option value="Conta Internacional / SEPA">Conta Internacional / SEPA</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nome do Titular da Conta *
            </label>
            <input
              type="text"
              required
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t('ibanLabel')} *
            </label>
            <input
              type="text"
              required
              placeholder="AO06 0000 0000 0000 0000 0000 0"
              value={ibanInput}
              onChange={(e) => setIbanInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
            Guardar Conta Bancária
          </Button>
        </form>
      </Modal>
    </div>
  );
};
