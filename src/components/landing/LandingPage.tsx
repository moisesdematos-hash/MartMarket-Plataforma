// ==============================================================================
// MARTMARKET PREMIUM CINEMATIC LANDING PAGE
// ==============================================================================

import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Coins, 
  Layers, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  ChevronDown, 
  ShoppingBag,
  CreditCard,
  Building2,
  Lock,
  Smartphone
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface LandingPageProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenAuth
}) => {
  const { t, formatMoney, currency } = useI18n();
  const { products } = useMarketplace();

  // Calculator state
  const [calcPrice, setCalcPrice] = useState<number>(25000);
  const [calcSales, setCalcSales] = useState<number>(30);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Calculations for earnings preview
  const grossMonthly = calcPrice * calcSales;
  const platformFee = grossMonthly * 0.079;
  const creatorNetEarnings = grossMonthly - platformFee;

  return (
    <div className="w-full min-h-screen text-slate-100 overflow-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          
          {/* Live Platform Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-xs font-semibold text-blue-400 shadow-xl shadow-blue-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Infraestrutura Global para Criadores Digitais</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Suporte Kwanza (AOA) & Global</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Transforme Conhecimento em um{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              Império Digital
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenAuth('register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto text-base px-8 py-3.5"
            >
              {t('startFree')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('marketplace')}
              leftIcon={<ShoppingBag className="w-4 h-4 text-blue-400" />}
              className="w-full sm:w-auto text-base px-8 py-3.5"
            >
              {t('exploreProducts')}
            </Button>
          </div>

          {/* Key Metrics strip */}
          <div className="grid grid-cols-3 gap-4 pt-12 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">
                {t('heroStat1')}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">
                {t('heroStat1Label')}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {t('heroStat2')}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">
                {t('heroStat2Label')}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                {t('heroStat3')}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">
                {t('heroStat3Label')}
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Platform Mockup Card */}
        <div className="mt-16 max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-slate-800/60 to-slate-950 p-2 sm:p-4 border border-slate-800 shadow-2xl shadow-blue-500/10 relative z-10">
          <div className="rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
            {/* Window header */}
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 ml-2 font-mono">martmarket.app/dashboard</span>
              </div>
              <Badge variant="success" size="sm" icon={<Zap className="w-3 h-3" />}>
                Tempo Real
              </Badge>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">{t('revenue')}</div>
                <div className="text-2xl font-bold text-white mt-1 font-mono">
                  {formatMoney(1485000, currency)}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +28.4% este mês
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">{t('salesCount')}</div>
                <div className="text-2xl font-bold text-white mt-1 font-mono">
                  142 Pedidos
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Multicaixa Express & Cartão
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">{t('availableBalance')}</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                  {formatMoney(485000, currency)}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Pronto para IBAN AO06
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="py-20 bg-slate-950/60 border-y border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
              {t('howItWorks')}
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('howItWorksDesc')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-2">{t('step1Title')}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t('step1Desc')}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/15 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-2">{t('step2Title')}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t('step2Desc')}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-2">{t('step3Title')}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t('step3Desc')}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h4 className="text-base font-bold text-slate-100 mb-2">{t('step4Title')}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{t('step4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUE FOR CREATORS, AFFILIATES & BUYERS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        
        {/* Creators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="primary" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
              Criadores & Especialistas
            </Badge>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tudo o que você precisa para criar, vender e hospedar o seu conteúdo.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('forCreatorsDesc')}
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Assistente de criação em 9 passos simples para qualquer formato digital.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Order Bumps de 1 clique para aumentar o seu Ticket Médio.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Cupões dinâmicos com limite de uso e datas de validade.
              </li>
            </ul>
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('creator-wizard')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Criar Primeiro Produto Agora
            </Button>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">Tipos de Produtos Suportados</span>
                <span className="text-[10px] text-blue-400 font-mono">9 Categorias</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="font-semibold text-slate-200">Cursos & Videoaulas</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Streaming HD + Módulos</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="font-semibold text-slate-200">Ebooks & PDFs</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Download protegido</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="font-semibold text-slate-200">Templates & UI Kits</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Figma, Code, Design</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="font-semibold text-slate-200">Software & Licenças</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Gerador de chaves</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-200 text-sm mb-2">Motor de Atribuição Inteligente</div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Link de Divulgação Único</div>
                  <div className="text-[11px] text-slate-500 font-mono">martmarket.app/p/saas?ref=AFF-99</div>
                </div>
                <Badge variant="info" size="sm">Cookie Seguro</Badge>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Divisão Automática</div>
                  <div className="text-[11px] text-slate-500">Sem atrasos no repasse de comissões</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold">Até 80%</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <Badge variant="success" size="md" icon={<Users className="w-3.5 h-3.5" />}>
              Rede de Afiliados
            </Badge>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Promova os melhores produtos e ganhe comissões automáticas.
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('forAffiliatesDesc')}
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigate('affiliates')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explorar Mercado de Afiliação
            </Button>
          </div>
        </div>
      </section>

      {/* 4. MARKETPLACE PREVIEW */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                {t('marketplace')}
              </h2>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                Produtos em Destaque
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('marketplace')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {t('viewAll')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => {
              const isPatrocinado = product.isSponsored;
              return (
                <div
                  key={product.id}
                  onClick={() => onNavigate('product-details', { slug: product.slug })}
                  className={`group rounded-2xl overflow-hidden transition-all cursor-pointer flex flex-col justify-between shadow-lg relative ${
                    isPatrocinado
                      ? 'bg-amber-950/10 border-2 border-amber-500/30 hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-500/10'
                      : 'bg-slate-900 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isPatrocinado && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 text-[10px] font-black uppercase px-2 py-1 rounded-bl-lg z-10 shadow-lg shadow-amber-500/20">
                      Patrocinado
                    </div>
                  )}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary" size="sm">
                        {product.productType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className={`font-bold text-base line-clamp-2 transition-colors ${
                        isPatrocinado ? 'text-amber-100 group-hover:text-amber-400' : 'text-slate-100 group-hover:text-blue-400'
                      }`}>
                        {product.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    </div>

                    <div className={`mt-4 pt-4 border-t flex items-center justify-between ${
                      isPatrocinado ? 'border-amber-500/20' : 'border-slate-800/50'
                    }`}>
                      <span className="text-lg font-extrabold text-white font-mono">
                        {formatMoney(product.defaultPrice, product.currency)}
                      </span>
                      <Button variant={isPatrocinado ? 'warning' : 'primary'} size="sm">
                        Comprar &rarr;
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4.5. ENTERPRISE GROWTH FEATURES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <Badge variant="warning" size="md" icon={<Zap className="w-3.5 h-3.5" />}>
            O "Endgame" das Plataformas
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-6">
            Aumente o Lucro sem Gastar em Anúncios.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            A diferença entre uma plataforma normal e o MartMarket: Nós temos as ferramentas agressivas de conversão e retenção utilizadas pelos maiores *players* do mercado internacional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          
          {/* Card 1: 1-Click Upsell */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-emerald-500/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Upsell de 1-Clique</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              O cliente acabou de comprar o Curso Principal. Antes do recibo, oferte a sua Mentoria. Ele compra com 1 clique, sem revalidar o Multicaixa. <span className="text-emerald-400 font-bold">Aumente as vendas em +30%.</span>
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/> Order Bumps na página de compra</div>
              <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/> Downsells Automáticos</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/> Funil Visual Drag-and-Drop</div>
            </div>
          </div>

          {/* Card 2: Community Hub */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-blue-500/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Comunidade Standalone VIP</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Pare de usar o WhatsApp. Tenha a sua própria rede social gamificada, integrada aos cursos, com Feed, Leaderboards, Meetups e venda o acesso como assinatura (Estilo Kajabi/Skool).
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400"/> Feed de Posts & Imagens</div>
              <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400"/> Pontos e Rankings de Membros</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400"/> Assinaturas Recorrentes (MRR)</div>
            </div>
          </div>

          {/* Card 3: Gamification Rewards */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-amber-500/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Programa de Placas & Prémios</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Seja recompensado por ficar rico. Atingiu o seu primeiro Milhão de Kwanzas (ou Dólares)? Nós enviamos a Placa Física de Prata, Ouro e Black para sua casa (Estilo Kiwify/Hotmart).
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 mb-2 text-slate-400">🥈 Placa Prata (1M)</div>
              <div className="flex items-center gap-2 mb-2 text-yellow-500">🥇 Placa Ouro (10M)</div>
              <div className="flex items-center gap-2 text-white font-bold">⚫ Placa Black (100M)</div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE EARNINGS & FEE CALCULATOR */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
            Simulador de Ganhos
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('pricingTitle')}
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            {t('pricingSubtitle')}
          </p>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                  <span>Preço do seu Produto</span>
                  <span className="text-blue-400 font-mono text-sm">{formatMoney(calcPrice, currency)}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                  <span>Vendas Estimadas por Mês</span>
                  <span className="text-blue-400 font-mono text-sm">{calcSales} vendas</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={calcSales}
                  onChange={(e) => setCalcSales(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Taxa da Plataforma (7.9%):</span>
                  <span className="font-mono text-slate-300">-{formatMoney(platformFee, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mensalidade Fixa:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{formatMoney(0, currency)}</span>
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-600/20 via-slate-900 to-indigo-950 border border-blue-500/30 text-center">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Você Receberá Mensalmente
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-mono text-emerald-400">
                {formatMoney(creatorNetEarnings, currency)}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Depositado diretamente no seu IBAN cadastrado.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenAuth('register')}
                className="mt-6 w-full"
              >
                Criar Minha Conta Gratuita
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-900 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
            Tire as suas Dúvidas
          </h2>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            {t('faqTitle')}
          </h3>
        </div>

        <div className="space-y-3">
          {[
            { q: t('faqQ1'), a: t('faqA1') },
            { q: t('faqQ2'), a: t('faqA2') },
            { q: t('faqQ3'), a: t('faqA3') },
            { q: t('faqQ4'), a: t('faqA4') }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-cyan-600 p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Pronto para Começar a Vender Globalmente?
            </h3>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Crie a sua conta em menos de 2 minutos. Sem cartões exigidos e sem mensalidades.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onOpenAuth('register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-white text-slate-950 hover:bg-slate-100 shadow-xl font-bold"
            >
              {t('startFree')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
