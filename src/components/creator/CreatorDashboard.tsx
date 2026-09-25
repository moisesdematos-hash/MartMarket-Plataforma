// ==============================================================================
// MARTMARKET CREATOR STUDIO & ANALYTICS DASHBOARD
// Enterprise Creator suite: Product Catalog, WhatsApp Cart Recovery, Pixels,
// Co-Production & Split, Webhooks, Sales Funnel Analytics, and Coupon Campaigns.
// ==============================================================================

import React, { useState } from 'react';
import { 
  Sparkles, 
  PlusCircle, 
  TrendingUp, 
  ShoppingBag, 
  Wallet, 
  Users, 
  Star, 
  Eye, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ArrowUpRight,
  Filter,
  Webhook,
  Tag,
  BarChart3
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AbandonedCartsManager } from './AbandonedCartsManager';
import { PixelManager } from './PixelManager';
import { CoProductionManager } from './CoProductionManager';
import { WebhookManager } from './WebhookManager';
import { SalesFunnelAnalytics } from './SalesFunnelAnalytics';
import { CouponManager } from './CouponManager';
import { RecurringBillingManager } from './RecurringBillingManager';
import { VideoHeatmapAnalytics } from './VideoHeatmapAnalytics';
import { EmailMarketingManager } from './EmailMarketingManager';
import { UTMAttributionDashboard } from './UTMAttributionDashboard';
import { LiveWebinarRoom } from './LiveWebinarRoom';
import { CheckoutABTesting } from './CheckoutABTesting';
import { EventTicketManager } from './EventTicketManager';
import { CertificateEditor } from './CertificateEditor';
import { SupportChat } from '../support/SupportChat';
import { FunnelFlowBuilder } from './FunnelFlowBuilder';
import { CreatorRewards } from './CreatorRewards';

interface CreatorDashboardProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ onNavigate }) => {
  const { products, orders, wallet, deleteProduct, updateProduct } = useMarketplace();
  const { t, formatMoney, currency } = useI18n();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'products' | 'abandoned' | 'pixels' | 'coproduction' | 'webhooks' | 'funnel' | 'coupons' | 'billing' | 'heatmap' | 'email' | 'utm' | 'live' | 'abtesting' | 'events' | 'certificate' | 'support' | 'funnel_builder' | 'rewards'>('products');

  // Filter products by creator (or show all creator products for demo)
  const myProducts = products.filter((p) => !user || p.creatorId === user.id || p.creatorId === 'usr-creator-1');

  // Metrics
  const totalSalesCount = myProducts.reduce((sum, p) => sum + p.totalSales, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.creatorNet, 0);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem a certeza que deseja eliminar este produto?')) {
      deleteProduct(id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    updateProduct(id, { isPublished: !currentStatus });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
              Creator Studio
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Painel de Gestão do Criador
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Acompanhe as suas vendas, receitas, coprodutores, funis de conversão, automações e cupons.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate('creator-wizard')}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="shadow-lg shadow-blue-500/20"
        >
          {t('createProduct')}
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Net Revenue */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('revenue')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {formatMoney(totalRevenue, currency)}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            +31.2% em relação ao mês anterior
          </div>
        </div>

        {/* Total Sales Count */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('salesCount')}</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalSalesCount}
          </div>
          <div className="text-[11px] text-slate-400">
            Em todos os produtos publicados
          </div>
        </div>

        {/* Available Balance */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('availableBalance')}</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {formatMoney(wallet.availableBalance, currency)}
          </div>
          <button
            onClick={() => onNavigate('wallet')}
            className="text-[11px] text-blue-400 hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            Pedir Levantamento &rarr;
          </button>
        </div>

        {/* Active Products */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Produtos Cadastrados</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {myProducts.length}
          </div>
          <div className="text-[11px] text-slate-400">
            {myProducts.filter((p) => p.isPublished).length} Ativos no Marketplace
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}

            <div className="flex gap-2 border-b border-slate-800 pb-1 text-xs font-semibold overflow-x-auto no-scrollbar">
        {[
          { id: 'products',       label: 'Catálogo de Produtos', isFake: false },
          { id: 'support',        label: '💬 Chat de Suporte', isFake: false },
          { id: 'rewards',        label: '🏆 Minhas Conquistas', isFake: true },
          { id: 'funnel_builder', label: '💸 Upsell de 1-Clique', isFake: true },
          { id: 'email',          label: '📧 Email Marketing', isFake: true },
          { id: 'live',           label: '📺 Lives & Webinars', isFake: true },
          { id: 'events',         label: '🎫 Eventos & Ingressos', isFake: true },
          { id: 'abtesting',      label: '🧪 A/B Testing', isFake: true },
          { id: 'utm',            label: '📊 UTM Attribution', isFake: true },
          { id: 'funnel',         label: 'Funil de Vendas & LTV', isFake: true },
          { id: 'heatmap',        label: '🔥 Heatmap de Vídeo', isFake: true },
          { id: 'billing',        label: '🔄 Assinaturas', isFake: true },
          { id: 'certificate',    label: '🎓 Editor de Certificado', isFake: true },
          { id: 'coproduction',   label: 'Co-Produção & Splits', isFake: true },
          { id: 'coupons',        label: 'Cupons & Promoções', isFake: true },
          { id: 'abandoned',      label: 'Recuperador WhatsApp', isFake: true },
          { id: 'pixels',         label: 'Pixels de Rastreamento', isFake: true },
          { id: 'webhooks',       label: 'Webhooks & APIs', isFake: true },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.isFake) {
                alert('🚀 Funcionalidade em Breve! O MVP oficial foca-se na estabilidade do Checkout, Pagamentos e Área de Membros.');
                return;
              }
              setActiveTab(tab.id as any);
            }}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                : tab.isFake
                ? 'text-slate-600 hover:text-slate-500 bg-slate-950/50 line-through opacity-70'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title={tab.isFake ? "Em Breve" : ""}
          >
            {tab.label} {tab.isFake && ' 🔒'}
          </button>
        ))}
      </div>

      {/* Render Active Subtab Content */}
      {activeTab === 'abandoned'   && <AbandonedCartsManager />}
      {activeTab === 'pixels'      && <PixelManager />}
      {activeTab === 'coproduction'&& <CoProductionManager />}
      {activeTab === 'webhooks'    && <WebhookManager />}
      {activeTab === 'funnel'      && <SalesFunnelAnalytics />}
      {activeTab === 'coupons'     && <CouponManager />}
      {activeTab === 'billing'     && <RecurringBillingManager />}
      {activeTab === 'heatmap'     && <VideoHeatmapAnalytics />}
      {activeTab === 'email'       && <EmailMarketingManager />}
      {activeTab === 'utm'         && <UTMAttributionDashboard />}
      {activeTab === 'live'        && <LiveWebinarRoom />}
      {activeTab === 'abtesting'   && <CheckoutABTesting />}
      {activeTab === 'events'      && <EventTicketManager />}
      {activeTab === 'certificate' && <CertificateEditor />}
      {activeTab === 'support'     && <SupportChat mode="support" />}
      {activeTab === 'funnel_builder' && <FunnelFlowBuilder />}
      {activeTab === 'rewards'     && <CreatorRewards />}

      {/* Products Table & Management */}
      {activeTab === 'products' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-100">{t('myProducts')}</h3>
              <p className="text-xs text-slate-400">Gerencie preços, materiais, aulas e status de publicação.</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('creator-wizard')}
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              Novo Produto
            </Button>
          </div>

        {myProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="font-bold text-slate-200 text-sm">Ainda não cadastrou nenhum produto.</div>
            <Button variant="primary" size="sm" onClick={() => onNavigate('creator-wizard')}>
              Criar o meu primeiro produto agora
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Produto</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Preço</th>
                  <th className="py-3 px-4">Vendas</th>
                  <th className="py-3 px-4">Avaliação</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {myProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.coverImage}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-800"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-100 truncate max-w-xs">{prod.title}</div>
                          <div className="text-[11px] text-slate-500 font-mono">/{prod.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="neutral" size="sm">
                        {(prod.productType || "PRODUTO").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                      {formatMoney(prod.defaultPrice, prod.currency)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      {prod.totalSales}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-slate-200">{prod.rating}</span>
                        <span className="text-slate-500">({prod.reviewCount})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={(e) => handleToggleStatus(prod.id, prod.isPublished, e)}
                        className="cursor-pointer"
                      >
                        <Badge variant={prod.isPublished ? 'success' : 'neutral'} size="sm">
                          {prod.isPublished ? 'Publicado' : 'Rascunho'}
                        </Badge>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigate('creator-wizard', { productId: prod.id })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Editar Produto"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onNavigate('product-details', { slug: prod.slug })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Visualizar Página Pública"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const checkoutUrl = `${window.location.origin}/?view=checkout&prod=${prod.id}`;
                            navigator.clipboard.writeText(checkoutUrl);
                            alert('Link de Checkout copiado com sucesso!\n' + checkoutUrl);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Copiar Link de Checkout Direto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </button>
                        <button
                          onClick={() => onNavigate('checkout', { productId: prod.id })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Testar Checkout"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(prod.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Eliminar Produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Recent Orders Section */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-slate-100">{t('recentOrders')}</h3>
        <div className="space-y-2">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-blue-400">#{order.orderNumber}</span>
                <span className="font-medium text-slate-200">{order.productTitle}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400">{order.buyerName}</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatMoney(order.total, order.currency)}
                </span>
                <Badge variant="success" size="sm">
                  {order.paymentMethod.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
