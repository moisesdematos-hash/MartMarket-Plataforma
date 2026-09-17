// ==============================================================================
// MARTMARKET AFFILIATE NETWORK & TRACKING HUB
// ==============================================================================

import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Copy, 
  Check, 
  MousePointer, 
  DollarSign, 
  ShoppingBag, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const chartData = [
  { name: 'Seg', clicks: 120, conversions: 12 },
  { name: 'Ter', clicks: 180, conversions: 19 },
  { name: 'Qua', clicks: 150, conversions: 15 },
  { name: 'Qui', clicks: 220, conversions: 25 },
  { name: 'Sex', clicks: 310, conversions: 35 },
  { name: 'Sáb', clicks: 450, conversions: 50 },
  { name: 'Dom', clicks: 390, conversions: 42 },
];

interface AffiliateHubProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AffiliateHub: React.FC<AffiliateHubProps> = ({ onNavigate }) => {
  const { products, affiliateLinks, getOrCreateAffiliateLink, trackAffiliateClick } = useMarketplace();
  const { t, formatMoney, currency } = useI18n();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const currentAffiliateId = user?.id || 'usr-creator-1';

  // Metrics
  const totalClicks = affiliateLinks.reduce((sum, l) => sum + l.clicksCount, 0);
  const totalConversions = affiliateLinks.reduce((sum, l) => sum + l.conversionsCount, 0);
  const totalCommissions = affiliateLinks.reduce((sum, l) => sum + l.totalCommission, 0);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyLink = (code: string, productId: string) => {
    const affiliateUrl = `${window.location.origin}/?ref=${code}&prod=${productId}`;
    navigator.clipboard.writeText(affiliateUrl);
    setCopiedCode(code);
    showToast('success', t('linkCopied'));
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleJoinAffiliation = (productId: string) => {
    const link = getOrCreateAffiliateLink(currentAffiliateId, productId);
    showToast('success', t('affiliatedSuccess'));
  };

  const handleSimulateClick = (code: string, productSlug: string) => {
    trackAffiliateClick(code);
    showToast('info', 'Simulando clique de afiliado com cookie de atribuição...');
    onNavigate('product-details', { slug: productSlug });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="success" size="sm" icon={<Users className="w-3.5 h-3.5" />}>
            Rede de Afiliados
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {t('affiliateHub')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Promova produtos digitais validados, rastreie cliques e receba comissões automáticas.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('affiliateCommissionEarned')}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {formatMoney(totalCommissions, currency)}
          </div>
          <div className="text-[11px] text-slate-400">
            Creditado automaticamente no seu ledger
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('affiliateConversions')}</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalConversions}
          </div>
          <div className="text-[11px] text-slate-400">
            Vendas confirmadas com sucesso
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('affiliateClicks')}</span>
            <MousePointer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalClicks}
          </div>
          <div className="text-[11px] text-slate-400">
            Rastreados via cookies de longa duração
          </div>
        </div>
      </div>

      {/* Advanced Tracking Chart */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          Gráfico de Rastreio (Conversões vs Cliques)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="clicks" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
              <Area type="monotone" dataKey="conversions" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorConversions)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Referral Links */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-100">{t('myAffiliateLinks')}</h3>

        {affiliateLinks.length === 0 ? (
          <p className="text-xs text-slate-400">Ainda não gerou links de divulgação. Escolha um produto abaixo.</p>
        ) : (
          <div className="space-y-3">
            {affiliateLinks.map((link) => {
              const product = products.find((p) => p.id === link.productId);
              if (!product) return null;

              return (
                <div
                  key={link.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.coverImage}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{product.title}</h4>
                      <span className="text-[11px] text-blue-400 font-semibold font-mono">
                        Comissão: {product.affiliateCommissionRate}% por venda ({formatMoney((product.defaultPrice * product.affiliateCommissionRate) / 100, product.currency)})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span>Cliques: <strong>{link.clicksCount}</strong></span>
                      <span>Vendas: <strong className="text-emerald-400">{link.conversionsCount}</strong></span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCopyLink(link.code, product.id)}
                      leftIcon={copiedCode === link.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {copiedCode === link.code ? 'Copiado!' : t('copyLink')}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimulateClick(link.code, product.slug)}
                    >
                      Testar Link
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Products to Affiliate */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-100">{t('findProducts')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter((p) => p.affiliateEnabled).map((prod) => (
            <div
              key={prod.id}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <img
                  src={prod.coverImage}
                  alt={prod.title}
                  className="w-full h-36 rounded-xl object-cover"
                />
                <h4 className="font-bold text-xs text-slate-100 line-clamp-2">{prod.title}</h4>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Preço:</span>
                  <span className="font-bold text-slate-200">{formatMoney(prod.defaultPrice, prod.currency)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Sua Comissão:</span>
                  <span className="font-bold text-emerald-400">
                    {prod.affiliateCommissionRate}% ({formatMoney((prod.defaultPrice * prod.affiliateCommissionRate) / 100, prod.currency)})
                  </span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleJoinAffiliation(prod.id)}
                className="w-full"
              >
                {t('requestAffiliation')}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
