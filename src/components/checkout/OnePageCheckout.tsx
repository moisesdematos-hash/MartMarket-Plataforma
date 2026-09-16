// ==============================================================================
// MARTMARKET HIGH-CONVERTING ONE-PAGE CHECKOUT ENGINE
// Conversion-optimized checkout with Scarcity Timer, Social Proof Testimonials,
// Multi-Order Bumps, Local & Global Payment Adapters, and Instant Coupon System.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Tag, 
  Check, 
  Smartphone, 
  CreditCard, 
  Building2, 
  ArrowLeft, 
  Sparkles,
  AlertCircle,
  Clock,
  Star,
  Users,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { PaymentEngine } from '../../services/payment/PaymentEngine';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PaymentSandboxSimulator } from './PaymentSandboxSimulator';

interface OnePageCheckoutProps {
  productId: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
  affiliateId?: string;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const OnePageCheckout: React.FC<OnePageCheckoutProps> = ({
  productId,
  onNavigate,
  affiliateId,
  onOpenAuth
}) => {
  const { getProductById, coupons, createAndProcessOrder } = useMarketplace();
  const { t, formatMoney, currency } = useI18n();
  const { user, isAuthenticated, isGuest } = useAuth();
  const { showToast } = useNotification();

  const product = getProductById(productId);

  // Buyer Form state
  const [buyerName, setBuyerName] = useState(user?.fullName || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [buyerCountry, setBuyerCountry] = useState(user?.country || 'AO');

  // Checkout Options
  const [includeBump, setIncludeBump] = useState(false);
  const [includeSecondBump, setIncludeSecondBump] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('multicaixa_express');
  const [isProcessing, setIsProcessing] = useState(false);

  // Urgency Countdown Timer (14:59 ticking down)
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-100">Produto não encontrado para checkout.</h2>
        <Button variant="outline" size="sm" onClick={() => onNavigate('marketplace')} className="mt-4">
          Voltar ao Marketplace
        </Button>
      </div>
    );
  }

  // Active coupon
  const activeCoupon = appliedCouponCode
    ? coupons.find((c) => c.code.toUpperCase() === appliedCouponCode.toUpperCase())
    : null;

  // Price calculation
  const priceBreakdown = PaymentEngine.calculateOrderPrice(
    product,
    includeBump,
    activeCoupon,
    !!affiliateId
  );

  // Secondary bump calculation
  const secondBumpPrice = 12500;
  const totalWithAllBumps = priceBreakdown.total + (includeSecondBump ? secondBumpPrice : 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const clean = couponInput.trim().toUpperCase();

    // Default built-in coupons
    if (clean === 'LANCAMENTO20' || clean === 'BLACKFRIDAY50' || clean === 'MARTVIP20') {
      setAppliedCouponCode(clean);
      showToast('success', `Cupom ${clean} aplicado com sucesso!`);
      return;
    }

    const found = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);
    if (found) {
      setAppliedCouponCode(found.code);
      showToast('success', t('couponApplied'));
    } else {
      showToast('error', t('invalidCoupon'));
    }
  };

  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || isGuest) {
      showToast('info', 'Para comprar, precisa criar a sua conta (ou fazer login) primeiro.');
      onOpenAuth?.('register');
      return;
    }

    if (!buyerName || !buyerEmail) {
      showToast('error', 'Por favor preencha o seu nome e email para a entrega.');
      return;
    }

    if (selectedPaymentMethod === 'multicaixa_express' && !buyerPhone) {
      showToast('error', 'Por favor informe o seu número de telefone Multicaixa Express.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createAndProcessOrder(
        product,
        {
          name: buyerName,
          email: buyerEmail,
          phone: buyerPhone,
          country: buyerCountry
        },
        selectedPaymentMethod,
        includeBump,
        appliedCouponCode,
        affiliateId
      );

      showToast('success', 'Pedido gerado com sucesso!');
      onNavigate('checkout-success', {
        order: result.order,
        paymentResult: result.paymentResult
      });
    } catch (err) {
      showToast('error', 'Ocorreu um erro ao processar o seu pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 py-6 px-4 sm:px-6 lg:px-8">
      
      {/* Scarcity Countdown Banner */}
      <div className="max-w-5xl mx-auto mb-6 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-between text-xs animate-fade-in shadow-lg">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <Clock className="w-4 h-4 animate-spin [animation-duration:8s]" />
          <span>⚡ OFERTA PROMOCIONAL LIMITADA: As condições especiais encerram em:</span>
        </div>
        <div className="px-3 py-1 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-400 font-mono font-black text-sm tracking-widest shadow-inner">
          {formatTimer(timeLeft)}
        </div>
      </div>

      {/* Top Header Bar */}
      <div className="max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-slate-900 mb-8">
        <button
          onClick={() => onNavigate('product-details', { slug: product.slug })}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Produto</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <Lock className="w-3.5 h-3.5" /> SSL 256-bit Seguro
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:flex items-center gap-1 text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Entrega Imediata
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Buyer Form & Payment Providers */}
        <div className="lg:col-span-7 space-y-6">
          
          <form onSubmit={handleProcessOrder} className="space-y-6">
            
            {/* 1. Buyer Information */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-sm text-slate-100">{t('buyerInfo')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('fullNameLabel')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('emailLabel')} (para receber o acesso) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('phoneLabel')} (Multicaixa Express / WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    placeholder="+244 923 000 000"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-sm text-slate-100">{t('paymentMethod')}</h3>
              </div>

              <div className="space-y-2.5">
                
                {/* Multicaixa Express */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPaymentMethod === 'multicaixa_express'
                      ? 'bg-blue-600/15 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="multicaixa_express"
                    checked={selectedPaymentMethod === 'multicaixa_express'}
                    onChange={() => setSelectedPaymentMethod('multicaixa_express')}
                    className="mt-1 accent-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-100 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-blue-400" />
                        {t('angolaMCX')}
                      </span>
                      <Badge variant="primary" size="sm">Mais Rápido</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Receba o pedido de aprovação instantâneo na App Multicaixa Express no seu telemóvel.
                    </p>
                  </div>
                </label>

                {/* Multicaixa Referência Bancária */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPaymentMethod === 'bank_reference'
                      ? 'bg-blue-600/15 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="bank_reference"
                    checked={selectedPaymentMethod === 'bank_reference'}
                    onChange={() => setSelectedPaymentMethod('bank_reference')}
                    className="mt-1 accent-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-100 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        {t('angolaRef')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Entidade: 00192</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Pague no ATM ou Internet Banking de qualquer banco em Angola.
                    </p>
                  </div>
                </label>

                {/* Unitel Money */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPaymentMethod === 'unitel_money'
                      ? 'bg-blue-600/15 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="unitel_money"
                    checked={selectedPaymentMethod === 'unitel_money'}
                    onChange={() => setSelectedPaymentMethod('unitel_money')}
                    className="mt-1 accent-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-xs text-slate-100 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      Unitel Money (*449#)
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Pague diretamente da sua carteira móvel Unitel Money.
                    </p>
                  </div>
                </label>

                {/* PayPay Angola */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPaymentMethod === 'paypay_angola'
                      ? 'bg-blue-600/15 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="paypay_angola"
                    checked={selectedPaymentMethod === 'paypay_angola'}
                    onChange={() => setSelectedPaymentMethod('paypay_angola')}
                    className="mt-1 accent-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-100 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-purple-400" />
                        PayPay Angola (Carteira Digital BNA)
                      </span>
                      <Badge variant="primary" size="sm">App PayPay</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Autorize o pagamento direto na App PayPay Angola ou via leitura de QR Code.
                    </p>
                  </div>
                </label>

                {/* International Card */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPaymentMethod === 'global_card'
                      ? 'bg-blue-600/15 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="global_card"
                    checked={selectedPaymentMethod === 'global_card'}
                    onChange={() => setSelectedPaymentMethod('global_card')}
                    className="mt-1 accent-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-xs text-slate-100 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-400" />
                      {t('globalCard')}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Visa, Mastercard ou cartões internacionais autorizados.
                    </p>
                  </div>
                </label>

                {/* Sandbox Simulator */}
                <PaymentSandboxSimulator
                  currentMethod={selectedPaymentMethod}
                  onSimulateApproved={(method) => {
                    handleProcessOrder({ preventDefault: () => {} } as any);
                  }}
                  onSimulateDeclined={() => {
                    showToast('error', 'Simulação: Pagamento recusado pelo emissor bancário.');
                  }}
                />
              </div>
            </div>

            {/* 3. Multi-Order Bump 1 (Primary) */}
            {product.bumpEnabled && product.bumpTitle && (
              <div
                onClick={() => setIncludeBump(!includeBump)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  includeBump
                    ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-slate-900 border-dashed border-amber-500/40 hover:border-amber-500'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="checkbox"
                    checked={includeBump}
                    onChange={(e) => setIncludeBump(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" size="sm">OFERTA ESPECIAL 1</Badge>
                      <h4 className="font-bold text-xs text-slate-100">{product.bumpTitle}</h4>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {product.bumpDescription}
                    </p>
                    <div className="text-xs font-bold text-amber-400 mt-2 font-mono">
                      + {formatMoney(product.bumpPrice || 0, product.currency)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Multi-Order Bump 2 (Secondary Workbook Pack) */}
            <div
              onClick={() => setIncludeSecondBump(!includeSecondBump)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                includeSecondBump
                  ? 'bg-purple-500/15 border-purple-500 ring-2 ring-purple-500/20'
                  : 'bg-slate-900 border-dashed border-purple-500/40 hover:border-purple-500'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  checked={includeSecondBump}
                  onChange={(e) => setIncludeSecondBump(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-purple-500 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm" icon={<Zap className="w-3 h-3 text-purple-400" />}>
                      OFERTA EXCLUSIVA 2
                    </Badge>
                    <h4 className="font-bold text-xs text-slate-100">
                      Pack de Modelos Prontos & Checklist de Auditoria SaaS
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Mais de 25 templates de código, fluxos de automação e planilhas de precificação prontas para acelerar seu resultado em 3x.
                  </p>
                  <div className="text-xs font-bold text-purple-400 mt-2 font-mono">
                    + {formatMoney(secondBumpPrice, product.currency)}
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              className="w-full py-4 text-base font-bold shadow-xl shadow-blue-500/25 cursor-pointer"
            >
              {t('payNow')} ({formatMoney(totalWithAllBumps, priceBreakdown.currency)})
            </Button>
          </form>

          {/* Social Proof & Verified Testimonials */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" /> O que dizem os alunos formados:
              </h4>
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-white font-bold ml-1">4.9/5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Edson Morais (Luanda)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  "O checkout via Multicaixa Express aprovou no mesmo segundo no meu telefone. O acesso às aulas foi imediato!"
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Paula Ferreira (Benguela)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  "Excelente suporte e materiais de alto nível. O player com tutor de IA economizou horas de estudo."
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Order Summary, Product Mini-Card & Coupon */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-20 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <h3 className="font-bold text-sm text-slate-100 pb-3 border-b border-slate-800">
              {t('orderSummary')}
            </h3>

            {/* Product Card */}
            <div className="flex items-start gap-4">
              <img
                src={product.coverImage}
                alt={product.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-100 line-clamp-2">{product.title}</h4>
                <div className="text-[11px] text-slate-400 mt-0.5">{product.creatorName}</div>
                <div className="font-bold text-xs text-blue-400 mt-1 font-mono">
                  {formatMoney(product.defaultPrice, product.currency)}
                </div>
              </div>
            </div>

            {/* Coupon Entry */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Cupom (ex: LANCAMENTO20)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 uppercase font-mono focus:outline-none focus:border-blue-500"
              />
              <Button type="submit" variant="secondary" size="sm">
                {t('applyCoupon')}
              </Button>
            </form>

            {appliedCouponCode && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 animate-fade-in">
                <span className="font-mono font-semibold">Cupão Ativo: {appliedCouponCode}</span>
                <button
                  type="button"
                  onClick={() => setAppliedCouponCode(undefined)}
                  className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                >
                  Remover
                </button>
              </div>
            )}

            {/* Price Calculations breakdown */}
            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>{t('subtotal')}:</span>
                <span className="font-mono font-medium">{formatMoney(priceBreakdown.subtotal, priceBreakdown.currency)}</span>
              </div>

              {includeBump && (
                <div className="flex justify-between text-amber-400">
                  <span>Oferta Especial 1:</span>
                  <span className="font-mono">+{formatMoney(priceBreakdown.bumpPrice, priceBreakdown.currency)}</span>
                </div>
              )}

              {includeSecondBump && (
                <div className="flex justify-between text-purple-400">
                  <span>Pack de Modelos & Checklist:</span>
                  <span className="font-mono">+{formatMoney(secondBumpPrice, priceBreakdown.currency)}</span>
                </div>
              )}

              {priceBreakdown.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>{t('discount')}:</span>
                  <span className="font-mono">-{formatMoney(priceBreakdown.discount, priceBreakdown.currency)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="font-bold text-sm text-slate-100">{t('total')}:</span>
                <span className="font-extrabold text-xl text-emerald-400 font-mono">
                  {formatMoney(totalWithAllBumps, priceBreakdown.currency)}
                </span>
              </div>
            </div>

            {/* Guarantee note */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Garantia incondicional de {product.refundDays} dias de satisfação ou reembolso total.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
