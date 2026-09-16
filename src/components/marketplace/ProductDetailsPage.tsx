// ==============================================================================
// MARTMARKET PRODUCT SALES PAGE COMPONENT
// ==============================================================================

import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  PlayCircle, 
  FileText, 
  ArrowLeft, 
  ShoppingBag, 
  Share2, 
  Download, 
  User, 
  Clock,
  Sparkles,
  Lock,
  Users
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ProductDetailsPageProps {
  slug: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  slug,
  onNavigate,
  onOpenAuth
}) => {
  const { getProductBySlug, reviews, addReview } = useMarketplace();
  const { t, formatMoney, currency } = useI18n();
  const { user, isAuthenticated, isGuest } = useAuth();
  const { showToast } = useNotification();

  const product = getProductBySlug(slug);

  // Review form state
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-100">Produto não encontrado.</h2>
        <Button variant="outline" size="sm" onClick={() => onNavigate('marketplace')} className="mt-4">
          Voltar ao Marketplace
        </Button>
      </div>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle || !reviewComment) {
      showToast('error', 'Por favor preencha o título e o comentário da sua avaliação.');
      return;
    }

    addReview({
      productId: product.id,
      userId: user ? user.id : `usr_${Date.now()}`,
      userName: user ? user.fullName : 'Aluno Verificado',
      userAvatar: user?.avatarUrl,
      rating: ratingInput,
      title: reviewTitle,
      comment: reviewComment
    });

    showToast('success', 'A sua avaliação foi registada com sucesso!');
    setReviewTitle('');
    setReviewComment('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('info', 'Link do produto copiado para a área de transferência!');
  };

  return (
    <div className="w-full min-h-screen pb-20">
      
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => onNavigate('marketplace')}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Marketplace</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Cols: Details, Modules, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="md">
                {product.productType.toUpperCase()}
              </Badge>
              <Badge variant="neutral" size="md">
                {product.categorySlug.toUpperCase()}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Creator & Rating Info */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400 border-y border-slate-800/80 py-3">
              <div className="flex items-center gap-2">
                <img
                  src={product.creatorAvatar}
                  alt={product.creatorName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                />
                <span className="font-medium text-slate-200">{product.creatorName}</span>
              </div>

              <div className="flex items-center gap-1.5 text-amber-400">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-200">{product.rating}</span>
                <span className="text-slate-500">({product.reviewCount} avaliações)</span>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Acesso Imediato</span>
              </div>
            </div>
          </div>

          {/* Cover & Video Banner */}
          <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl relative">
            <img
              src={product.bannerImage || product.coverImage}
              alt={product.title}
              className="w-full h-72 sm:h-96 object-cover"
            />
          </div>

          {/* Full Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Sobre este Produto
            </h3>
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Course Curriculum (if Course) */}
          {product.course && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Conteúdo do Curso ({product.course.modules.length} Módulos)
                </h3>
              </div>

              <div className="space-y-3">
                {product.course.modules.map((module, mIdx) => (
                  <div
                    key={module.id}
                    className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden"
                  >
                    <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-200">
                        {module.title}
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {module.lessons.length} aulas
                      </span>
                    </div>

                    <div className="divide-y divide-slate-800/40">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-3.5 px-4 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-blue-400 shrink-0" />
                            <span className="font-medium text-slate-200">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.isFreePreview && (
                              <Badge variant="success" size="sm">
                                Prévia Grátis
                              </Badge>
                            )}
                            <span className="text-slate-500 font-mono text-[11px]">
                              {Math.floor(lesson.durationSeconds / 60)} min
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files List (if Ebook / Template) */}
          {product.files && product.files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Ficheiros Incluídos
              </h3>
              <div className="space-y-2">
                {product.files.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-bold text-slate-200">{file.fileName}</div>
                        <div className="text-slate-500 text-[11px]">Versão {file.version}</div>
                      </div>
                    </div>
                    <Badge variant="neutral" size="sm">
                      Protegido pós-compra
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews & Star Rating Section */}
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Avaliações de Compradores ({productReviews.length})
            </h3>

            {/* Existing reviews */}
            <div className="space-y-4">
              {productReviews.length === 0 ? (
                <p className="text-xs text-slate-400">Seja o primeiro a avaliar este produto!</p>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                          alt={rev.userName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-semibold text-xs text-slate-200">{rev.userName}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <h5 className="font-bold text-xs text-slate-100">{rev.title}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Leave a review box */}
            <form onSubmit={handleAddReview} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h4 className="font-bold text-sm text-slate-200">Deixar a sua Avaliação</h4>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nota (1 a 5 estrelas)</label>
                <div className="flex gap-1 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingInput(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= ratingInput ? 'fill-amber-400' : 'text-slate-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Título da sua avaliação"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  placeholder="O que achou deste material?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <Button type="submit" variant="secondary" size="sm">
                Enviar Avaliação
              </Button>
            </form>
          </div>
        </div>

        {/* Right Sticky Purchase Card */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6">
            
            {/* Price section */}
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">
                Valor do Investimento
              </span>
              <div className="text-3xl font-extrabold text-white mt-1 font-mono text-emerald-400">
                {formatMoney(product.defaultPrice, product.currency)}
              </div>
            </div>

            {/* Direct Checkout CTA */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (!isAuthenticated || isGuest) {
                  onOpenAuth?.('register');
                  return;
                }
                onNavigate('checkout', { productId: product.id });
              }}
              className="w-full text-base py-3.5 shadow-xl shadow-blue-500/25"
            >
              Comprar Agora &rarr;
            </Button>

            {/* Share link button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Partilhar Produto
            </Button>

            {/* Guarantees & Features */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Garantia de Reembolso de {product.refundDays} dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Acesso vitalício aos conteúdos e atualizações</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Certificado de conclusão automático</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Pagamento 100% Seguro (Multicaixa / Cartão)</span>
              </div>
            </div>

            {/* Request Affiliation CTA */}
            {product.affiliateEnabled && (
              <div className="pt-4 border-t border-slate-800">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-dashed border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => {
                     if (!isAuthenticated || isGuest) {
                        showToast('info', 'Para ser afiliado, precisa de se cadastrar na plataforma.');
                        onOpenAuth?.('register');
                     } else {
                        onNavigate('affiliates'); 
                     }
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Promover e ganhar {product.affiliateCommissionRate}% de Comissão
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
