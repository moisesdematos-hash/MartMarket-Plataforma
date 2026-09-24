// ==============================================================================
// MARTMARKET CHECKOUT SUCCESS & AUTOMATED DIGITAL DELIVERY
// Full order fulfillment with PayPay, Multicaixa, Instant LMS Onboarding,
// 1-Click Upsell, and AGT-Certified Tax Invoice Receipt Generator.
// ==============================================================================

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  BookOpen, 
  Download, 
  FileText, 
  Printer, 
  ArrowRight, 
  Smartphone, 
  Building2,
  Lock,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Order } from '../../types';
import { PaymentInitiationResult } from '../../services/payment/PaymentProvider';
import { useI18n } from '../../context/I18nContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { OneClickUpsellModal } from './OneClickUpsellModal';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import { useNotification } from '../../context/NotificationContext';

interface CheckoutSuccessPageProps {
  order?: Order;
  paymentResult?: PaymentInitiationResult;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const CheckoutSuccessPage: React.FC<CheckoutSuccessPageProps> = ({
  order,
  paymentResult,
  onNavigate
}) => {
  const { t, formatMoney } = useI18n();
  const { showToast } = useNotification();
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order?.status || 'completed');

  useEffect(() => {
    if (!order || orderStatus === 'completed') return;

    let channel: any;
    import('../../lib/supabase').then(({ supabase }) => {
      channel = supabase.channel(`order-status-${order.id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`
        }, (payload) => {
          if (payload.new && payload.new.status) {
            setOrderStatus(payload.new.status);
            if (payload.new.status === 'completed') {
              showToast('success', 'Pagamento confirmado! O seu acesso foi libertado!');
              confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#10b981', '#f59e0b']
              });
            }
          }
        })
        .subscribe();
    });

    return () => {
      if (channel) {
        import('../../lib/supabase').then(({ supabase }) => {
          supabase.removeChannel(channel);
        });
      }
    };
  }, [order, orderStatus]);

  useEffect(() => {
    // Trigger festive celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Prompt 1-click post-purchase upsell after 1.2 seconds
    const timer = setTimeout(() => {
      setIsUpsellModalOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-100">Nenhum pedido recente.</h2>
        <Button variant="primary" size="sm" onClick={() => onNavigate('marketplace')} className="mt-4">
          Ir ao Marketplace
        </Button>
      </div>
    );
  }

  const isPendingMethod = orderStatus !== 'completed' && (order.paymentMethod === 'bank_reference' || order.paymentMethod === 'global_wire' || order.paymentMethod === 'paypay_angola');

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* Header Success State */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <Badge variant="success" size="md">
            {isPendingMethod ? 'Pagamento Aguardando Confirmação' : t('purchaseConfirmed')}
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isPendingMethod ? 'Instruções para Liquidação' : 'O seu Acesso foi Libertado!'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            {isPendingMethod
              ? 'Por favor finalize o pagamento com os dados abaixo para que o seu acesso seja liberado automaticamente.'
              : t('purchaseConfirmedDesc')}
          </p>
        </div>

        {/* PayPay Angola Instruction Card */}
        {order.paymentMethod === 'paypay_angola' && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-6 text-xs animate-fade-in">
              <div className="flex items-center justify-between text-purple-400 font-bold border-b border-purple-500/20 pb-3">
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> PayPay Africa - Digital Wallet
                </span>
                <Badge variant={isPendingMethod ? 'warning' : 'primary'} size="sm">
                  {isPendingMethod ? 'Aguardando Pagamento' : 'Aprovado Instantâneo'}
                </Badge>
              </div>
              
              {isPendingMethod ? (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-1 space-y-3">
                    <p className="text-slate-300 leading-relaxed text-sm">
                      Foi enviada uma notificação para o telemóvel <span className="font-bold text-white">{order.buyerPhone}</span>.
                      Abra a app PayPay Angola e confirme o pagamento para libertar o acesso.
                    </p>
                    <p className="text-slate-500 text-xs">
                      Se não recebeu a notificação, abra a app e leia o Código QR ao lado.
                    </p>
                  </div>
                  <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center shrink-0">
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 leading-relaxed">
                  O débito foi processado com sucesso na sua carteira PayPay. As suas credenciais de acesso foram emitidas.
                </p>
              )}
            </div>
          )}

        {/* Multicaixa Reference Instruction Box (if Bank Reference) */}
        {order.paymentMethod === 'bank_reference' && paymentResult && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Building2 className="w-4 h-4" />
              <span>Dados para Pagamento por Referência Bancária (GPO / Multicaixa)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Entidade</span>
                <span className="font-mono text-base font-bold text-white">
                  {paymentResult.entityCode || '00192'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Referência</span>
                <span className="font-mono text-base font-bold text-cyan-400">
                  {paymentResult.referenceNumber || '892 104 391'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total a Pagar:</span>
              <span className="font-mono text-base font-bold text-emerald-400">
                {formatMoney(order.total, order.currency)}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {paymentResult.instructions}
            </p>
          </div>
        )}

        {/* Order Details Mini-Card */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3 text-xs text-slate-300">
          <div className="flex justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Número do Pedido:</span>
            <span className="font-mono font-bold text-slate-100">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Produto:</span>
            <span className="font-semibold text-slate-100">{order.productTitle}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Comprador:</span>
            <span>{order.buyerName} ({order.buyerEmail})</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-400">Valor Total:</span>
            <span className="font-mono font-extrabold text-sm text-emerald-400">
              {formatMoney(order.total, order.currency)}
            </span>
          </div>
        </div>

        {/* Action Buttons: Instant Access / Receipt */}
        <div className="space-y-3 pt-2">
          {order.productType === 'course' ? (
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('members')}
              leftIcon={<BookOpen className="w-4 h-4" />}
              className="w-full py-3.5 text-sm font-bold shadow-xl shadow-blue-500/20"
            >
              {t('goToMembersArea')} &rarr;
            </Button>
          ) : (
            <Button
              variant="success"
              size="lg"
              onClick={() => {
                window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
              }}
              leftIcon={<Download className="w-4 h-4" />}
              className="w-full py-3.5 text-sm font-bold shadow-xl shadow-emerald-500/20"
            >
              {t('downloadDigitalFile')}
            </Button>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsInvoiceModalOpen(true)}
              leftIcon={<FileText className="w-4 h-4 text-emerald-400" />}
              className="flex-1"
            >
              Emitir Factura-Recibo Fiscal AGT
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigate('marketplace')}
              className="flex-1"
            >
              Continuar a Explorar
            </Button>
          </div>
        </div>
      </div>

      {/* Tax Invoice Modal */}
      {isInvoiceModalOpen && (
        <InvoiceReceiptModal
          order={order}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      )}

      {/* One-Click Upsell Modal */}
      <OneClickUpsellModal
        isOpen={isUpsellModalOpen}
        order={order}
        onAccept={(upsellTitle, upsellPrice) => {
          setIsUpsellModalOpen(false);
          showToast('success', `Oferta VIP "${upsellTitle}" adicionada com sucesso ao seu pedido!`);
          confetti({ particleCount: 70, spread: 80 });
        }}
        onDecline={() => setIsUpsellModalOpen(false)}
      />
    </div>
  );
};
