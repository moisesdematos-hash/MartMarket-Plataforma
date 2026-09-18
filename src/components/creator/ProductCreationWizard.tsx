// ==============================================================================
// MARTMARKET 9-STEP PRODUCT CREATION WIZARD
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Code2, 
  Layers, 
  Video, 
  Music, 
  DollarSign, 
  Users, 
  Eye,
  Plus,
  Trash2,
  Webhook
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ProductType, SupportedCurrency } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AICopilotModal } from './AICopilotModal';
import { AICopyResult, AICurriculumModule } from '../../services/ai/aiCopilot';

interface ProductCreationWizardProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  productId?: string;
}

export const ProductCreationWizard: React.FC<ProductCreationWizardProps> = ({ onNavigate, productId }) => {
  const { addProduct, updateProduct, getProductById, categories } = useMarketplace();
  const { t, formatMoney } = useI18n();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [currentStep, setCurrentStep] = useState(1);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-tech');
  const [productType, setProductType] = useState<ProductType>('course');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800');
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200');
  
  // Pricing
  const [defaultPrice, setDefaultPrice] = useState<number>(25000);
  const [currency, setCurrency] = useState<SupportedCurrency>('AOA');
  const [refundDays, setRefundDays] = useState<number>(7);

  // Bump Offer
  const [bumpEnabled, setBumpEnabled] = useState(false);
  const [bumpTitle, setBumpTitle] = useState('');
  const [bumpDescription, setBumpDescription] = useState('');
  const [bumpPrice, setBumpPrice] = useState<number>(5000);

  // Affiliate
  const [affiliateEnabled, setAffiliateEnabled] = useState(true);
  const [affiliateCommissionRate, setAffiliateCommissionRate] = useState<number>(40);

  useEffect(() => {
    if (productId) {
      const p = getProductById(productId);
      if (p) {
        setTitle(p.title);
        setSlug(p.slug);
        setShortDescription(p.shortDescription || '');
        setDescription(p.description || '');
        setCategoryId(p.categoryId || categories[0]?.id);
        setProductType(p.productType);
        setCoverImage(p.coverImage || '');
        setBannerImage(p.bannerImage || '');
        setDefaultPrice(p.defaultPrice);
        setCurrency(p.currency);
        setRefundDays(p.refundDays || 7);
        setBumpEnabled(p.bumpEnabled || false);
        setBumpTitle(p.bumpTitle || '');
        setBumpDescription(p.bumpDescription || '');
        setBumpPrice(p.bumpPrice || 0);
        setAffiliateEnabled(p.affiliateEnabled || false);
        setAffiliateCommissionRate(p.affiliateCommissionRate || 40);
        setWebhookUrl(p.webhookUrl || '');
        setDownloadUrl(p.downloadUrl || '');
      }
    }
  }, [productId, getProductById, categories]);

  // Course modules (if course)
  const [modules, setModules] = useState([
    {
      id: 'mod-new-1',
      title: 'Módulo 1: Introdução & Fundamentos',
      lessons: [
        {
          id: 'les-new-1',
          title: 'Aula 1: Apresentação e Primeiros Passos',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          durationSeconds: 600,
          isFreePreview: true
        }
      ]
    }
  ]);

  // Handle title change and slug auto-generation
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setSlug(
        val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const steps = [
    { num: 1, name: t('wizardStep1') },
    { num: 2, name: t('wizardStep2') },
    { num: 3, name: t('wizardStep3') },
    { num: 4, name: t('wizardStep4') },
    { num: 5, name: t('wizardStep5') },
    { num: 6, name: t('wizardStep6') },
    { num: 7, name: t('wizardStep7') },
    { num: 8, name: t('wizardStep8') },
    { num: 9, name: t('wizardStep9') },
  ];

  const handleNext = () => {
    if (currentStep === 1 && (!title || !slug)) {
      showToast('error', 'Por favor preencha o título e o identificador do produto.');
      return;
    }
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePublish = () => {
    // SECURITY & INTEGRITY VALIDATIONS (P1 Fix)
    if (!title || !slug) {
      showToast('error', 'O Título e a URL (Slug) são obrigatórios.');
      setCurrentStep(1);
      return;
    }
    
    if (productType === 'software' && !webhookUrl) {
      showToast('error', 'Para um SaaS, deve fornecer a URL do Webhook no Passo 3.');
      setCurrentStep(3);
      return;
    }
    
    if (['ebook', 'template'].includes(productType) && !downloadUrl) {
      showToast('error', 'Para E-books/Templates, deve fornecer o Link de Download no Passo 3.');
      setCurrentStep(3);
      return;
    }
    
    if (defaultPrice < 100) {
      showToast('error', 'O preço do produto não pode ser inferior a 100 ' + currency);
      setCurrentStep(4);
      return;
    }
    
    if (bumpEnabled && (!bumpTitle || !bumpPrice || bumpPrice <= 0)) {
      showToast('error', 'A Oferta Extra (Bump) está ativa mas faltam dados obrigatórios no Passo 5.');
      setCurrentStep(5);
      return;
    }

    const selectedCategoryObj = categories.find((c) => c.id === categoryId);

    const productPayload = {
      creatorId: user ? user.id : 'usr-creator-1',
      creatorName: user ? user.fullName : 'Kelson Manuel',
      creatorAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      title,
      slug: slug || `prod-${Date.now()}`,
      shortDescription: shortDescription || title,
      description: description || shortDescription || title,
      categoryId,
      categorySlug: selectedCategoryObj?.slug || 'tech-dev',
      productType,
      coverImage,
      bannerImage,
      status: 'published' as const,
      isPublished: true,
      defaultPrice,
      currency,
      refundDays,
      affiliateEnabled,
      affiliateCommissionRate,
      affiliateApprovalType: 'instant' as const,
      bumpEnabled,
      bumpTitle: bumpEnabled ? bumpTitle : undefined,
      bumpDescription: bumpEnabled ? bumpDescription : undefined,
      bumpPrice: bumpEnabled ? bumpPrice : undefined,
      isSponsored: false,
      webhookUrl: productType === 'software' ? webhookUrl : undefined,
      downloadUrl: ['ebook', 'template'].includes(productType) ? downloadUrl : undefined,
      features: ['Acesso vitalício', 'Certificado de Conclusão'],
      course: productType === 'course' ? {
        id: `crs_${Date.now()}`,
        productId: '',
        creatorId: user ? user.id : 'usr-creator-1',
        title,
        description: shortDescription,
        thumbnailUrl: coverImage,
        certificateEnabled: true,
        modules: modules.map((m, idx) => ({
          id: m.id,
          courseId: '',
          title: m.title,
          sortOrder: idx + 1,
          lessons: m.lessons.map((l, lIdx) => ({
            id: l.id,
            moduleId: m.id,
            title: l.title,
            videoUrl: l.videoUrl,
            durationSeconds: l.durationSeconds,
            isFreePreview: lIdx === 0,
            sortOrder: lIdx + 1
          }))
        }))
      } : undefined
    };

    if (productId) {
      updateProduct(productId, productPayload);
      showToast('success', 'Produto atualizado com sucesso!');
      onNavigate('product-details', { slug: productPayload.slug });
    } else {
      const newProd = addProduct(productPayload as any);
      showToast('success', 'Produto criado e publicado com sucesso!');
      onNavigate('product-details', { slug: newProd.slug });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('creator')}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancelar e Voltar ao Painel</span>
        </button>

        <span className="text-xs font-mono text-blue-400">
          Passo {currentStep} de 9
        </span>
      </div>

      {/* Steps Indicator Bar */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
        {steps.map((s) => (
          <div
            key={s.num}
            onClick={() => {
              if (productId || s.num <= currentStep) {
                setCurrentStep(s.num);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              currentStep === s.num
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : (productId || s.num < currentStep)
                ? 'bg-slate-900 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-900/50 text-slate-500 border border-slate-800/50'
            }`}
          >
            {s.num < currentStep ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <span>{s.num}.</span>
            )}
            <span className="hidden md:inline">{s.name}</span>
          </div>
        ))}
      </div>

      {/* Main Wizard Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-6">
        
        {/* STEP 1: INFORMAÇÕES BÁSICAS */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-100">{t('wizardStep1')}</h2>
                <p className="text-xs text-slate-400">Defina o nome, categoria e o link do seu produto digital.</p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsAiModalOpen(true)}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Gerar com IA Copilot
              </Button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('productTitleLabel')} *
              </label>
              <input
                type="text"
                placeholder="Ex: Formação Completa em Inteligência Artificial para Negócios"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Identificador URL (Slug) *
              </label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden px-3.5">
                <span className="text-xs text-slate-500 font-mono">martmarket.app/p/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full py-2.5 bg-transparent text-xs text-slate-100 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('productCategoryLabel')}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.pt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descrição Curta (Resumo de Alto Impacto)
              </label>
              <textarea
                rows={2}
                placeholder="Explique em 2 frases qual o resultado transformador que o seu aluno ou cliente terá."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* STEP 2: TIPO DE PRODUTO */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{t('wizardStep2')}</h2>
              <p className="text-xs text-slate-400">Selecione o formato de entrega do seu produto.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { type: 'course' as ProductType, label: t('productTypeCourse'), desc: 'Aulas em vídeo, módulos estruturados e certificados', icon: Video },
                { type: 'ebook' as ProductType, label: t('productTypeEbook'), desc: 'Livros digitais em formato PDF ou EPUB para download', icon: BookOpen },
                { type: 'software' as ProductType, label: t('productTypeSoftware'), desc: 'Scripts, licenças e chaves de software', icon: Code2 },
                { type: 'template' as ProductType, label: t('productTypeTemplate'), desc: 'Figma, Notion, modelos gráficos e planilhas', icon: Layers },
                { type: 'community' as ProductType, label: t('productTypeCommunity'), desc: 'Acesso a comunidade privada e networking', icon: Users },
                { type: 'audio' as ProductType, label: 'Áudios & Podcasts', desc: 'Séries de áudio e meditações guiadas', icon: Music },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = productType === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => setProductType(item.type)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-100">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: FICHEIROS & AULAS */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{t('wizardStep3')}</h2>
              <p className="text-xs text-slate-400">Configure os conteúdos, links de vídeo e materiais didáticos.</p>
            </div>

            {productType === 'course' ? (
              <div className="space-y-4">
                {modules.map((mod, mIdx) => (
                  <div key={mod.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => {
                          const updated = [...modules];
                          updated[mIdx].title = e.target.value;
                          setModules(updated);
                        }}
                        className="bg-transparent font-bold text-sm text-slate-100 focus:outline-none w-full"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      {mod.lessons.map((les, lIdx) => (
                        <div key={les.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <input
                            type="text"
                            value={les.title}
                            onChange={(e) => {
                              const updated = [...modules];
                              updated[mIdx].lessons[lIdx].title = e.target.value;
                              setModules(updated);
                            }}
                            className="bg-transparent text-slate-200 focus:outline-none flex-1 font-medium"
                          />
                          <input
                            type="text"
                            placeholder="URL do Vídeo (MP4/HLS)"
                            value={les.videoUrl}
                            onChange={(e) => {
                              const updated = [...modules];
                              updated[mIdx].lessons[lIdx].videoUrl = e.target.value;
                              setModules(updated);
                            }}
                            className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono w-full sm:w-64"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : productType === 'software' ? (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <Webhook className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Integração SaaS (Webhook)</h3>
                    <p className="text-[11px] text-slate-400">Enviaremos um sinal POST para esta URL quando houver um pagamento aprovado.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL do Webhook (Endpoint da sua API)
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.seusaas.com/webhooks/martmarket"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Entrega de Ficheiro</h3>
                    <p className="text-[11px] text-slate-400">Para o MVP, cole o link direto do Google Drive ou Dropbox para os clientes baixarem.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Link Secreto de Download
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: PREÇO & MOEDA */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{t('wizardStep4')}</h2>
              <p className="text-xs text-slate-400">Defina o valor padrão de venda e a garantia.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('productPriceLabel')} *
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={defaultPrice}
                  onChange={(e) => setDefaultPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Moeda Principal
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="AOA">Kwanza Angolano (AOA)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="BRL">Real Brasileiro (BRL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Período de Garantia Incondicional
                </label>
                <select
                  value={refundDays}
                  onChange={(e) => setRefundDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value={7}>7 Dias (Padrão)</option>
                  <option value={14}>14 Dias</option>
                  <option value={30}>30 Dias</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CHECKOUT & ORDER BUMP */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{t('wizardStep5')}</h2>
              <p className="text-xs text-slate-400">Ative ofertas complementares para aumentar o seu faturamento.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bumpEnabled}
                  onChange={(e) => setBumpEnabled(e.target.checked)}
                  className="accent-blue-500 w-4 h-4"
                />
                <span>{t('enableBumpOffer')}</span>
              </label>

              {bumpEnabled && (
                <div className="space-y-3 pt-3 border-t border-slate-800 animate-fade-in">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('bumpTitleLabel')}</label>
                    <input
                      type="text"
                      placeholder="Ex: Planilha Financeira Automatizada"
                      value={bumpTitle}
                      onChange={(e) => setBumpTitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('bumpPriceLabel')}</label>
                    <input
                      type="number"
                      value={bumpPrice}
                      onChange={(e) => setBumpPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: PROGRAMA DE AFILIADOS */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{t('wizardStep6')}</h2>
              <p className="text-xs text-slate-400">Permita que promotores alavanquem as suas vendas.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={affiliateEnabled}
                  onChange={(e) => setAffiliateEnabled(e.target.checked)}
                  className="accent-blue-500 w-4 h-4"
                />
                <span>Ativar Programa de Afiliados no Marketplace</span>
              </label>

              {affiliateEnabled && (
                <div className="space-y-3 pt-3 border-t border-slate-800 animate-fade-in">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      {t('affiliateCommissionLabel')}: <strong className="text-blue-400">{affiliateCommissionRate}%</strong>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      step="5"
                      value={affiliateCommissionRate}
                      onChange={(e) => setAffiliateCommissionRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-900 rounded-lg accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 7: PÁGINA DE VENDAS */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{t('wizardStep7')}</h2>
              <p className="text-xs text-slate-400">Adicione a descrição longa e imagens de capa.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('productDescLabel')}
              </label>
              <textarea
                rows={5}
                placeholder="Descreva detalhadamente o que o aluno irá aprender, benefícios, para quem é indicado e metodologia."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL da Imagem de Capa
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 8: REVISÃO */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{t('wizardStep8')}</h2>
              <p className="text-xs text-slate-400">Verifique os dados antes da publicação oficial.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Título:</span>
                <span className="font-bold text-slate-100">{title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Tipo:</span>
                <span className="font-mono uppercase text-blue-400">{productType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Preço:</span>
                <span className="font-mono font-bold text-emerald-400">{formatMoney(defaultPrice, currency)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Comissão de Afiliados:</span>
                <span className="font-mono">{affiliateEnabled ? `${affiliateCommissionRate}%` : 'Desativado'}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: PUBLICAÇÃO */}
        {currentStep === 9 && (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Tudo Pronto para Publicar!</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              O seu produto ficará imediatamente visível no marketplace e o checkout próprio estará pronto para processar pagamentos.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handlePublish}
              className="mt-4 px-8 py-3.5 shadow-xl shadow-blue-500/25"
            >
              {t('publishProductNow')} &rarr;
            </Button>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 9 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              {t('back')}
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t('continue')}
            </Button>
          </div>
        )}
      </div>

      {/* AI Creator Copilot Modal */}
      <AICopilotModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyCopy={(copyResult) => {
          setTitle(copyResult.headline);
          setShortDescription(copyResult.subheadline);
          setDescription(`${copyResult.subheadline}\n\nO que você vai aprender:\n${copyResult.bulletPoints.map(b => `• ${b}`).join('\n')}\n\nPúblico-alvo:\n${copyResult.targetAudience}`);
          showToast('success', 'Conteúdo da IA aplicado aos campos do produto!');
        }}
        onApplyCurriculum={(currModules) => {
          setModules(currModules.map((m, i) => ({
            id: `mod-ai-${i}`,
            title: m.title,
            lessons: m.lessons.map((l, lIdx) => ({
              id: `les-ai-${i}-${lIdx}`,
              title: l,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              durationSeconds: 720,
              isFreePreview: lIdx === 0
            }))
          })));
          showToast('success', 'Ementa de aulas gerada pela IA aplicada com sucesso!');
        }}
      />
    </div>
  );
};
