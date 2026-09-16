import React, { useState } from 'react';
import { BookOpen, Play, Download, CheckCircle2, Star, Sparkles, Repeat, Shield, FileText, Headphones } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { SubscriptionManager } from './SubscriptionManager';
import { SecurePDFViewer } from './SecurePDFViewer';
import { PodcastPlayer } from './PodcastPlayer';
import { SupportChat } from '../support/SupportChat';
import { CommunityHub } from '../community/CommunityHub';

interface MembersLibraryProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const MembersLibrary: React.FC<MembersLibraryProps> = ({ onNavigate }) => {
  const { products, getCourseProgressPercent } = useMarketplace();
  const { t } = useI18n();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'subscriptions' | 'podcast' | 'support' | 'community'>('products');
  const [pdfViewer, setPdfViewer] = useState<{ url: string; title: string } | null>(null);

  // For demonstration and real users, show purchased products or default enrolled courses
  const enrolledProducts = products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
            Área do Aluno & Comprador
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {t('myLibrary')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Aceda aos seus cursos, videoaulas, materiais didáticos e certificados de conclusão.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('marketplace')}
        >
          {t('exploreProducts')} &rarr;
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Meus Cursos & Ebooks
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'subscriptions'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Assinaturas & Recorrência
        </button>
        <button
          onClick={() => setActiveTab('podcast')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'podcast'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          🎙️ Podcasts
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'support'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          💬 Suporte
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'community'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          🌟 Comunidade VIP
        </button>
      </div>

      {activeTab === 'subscriptions' && <SubscriptionManager />}
      {activeTab === 'podcast' && <PodcastPlayer />}
      {activeTab === 'support' && <SupportChat mode="student" />}
      {activeTab === 'community' && <CommunityHub />}

      {/* Library Grid */}
      {activeTab === 'products' && (
        enrolledProducts.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-200">{t('noCoursesYet')}</h3>
          <Button variant="primary" size="md" onClick={() => onNavigate('marketplace')}>
            {t('browseMarketplace')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledProducts.map((product) => {
            const progress = product.course
              ? getCourseProgressPercent(user?.id || 'usr-creator-1', product.course.id)
              : 100;

            return (
              <div
                key={product.id}
                className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-950">
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

                  <div className="p-5 space-y-3">
                    <div className="text-xs text-slate-400 font-medium">
                      Por {product.creatorName}
                    </div>

                    <h4 className="font-bold text-sm text-slate-100 line-clamp-2 leading-snug">
                      {product.title}
                    </h4>

                    {product.productType === 'course' && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                          <span>{t('courseProgress')}</span>
                          <span className="font-bold text-blue-400">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {product.productType === 'course' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate('course-player', { productId: product.id })}
                      leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                      className="w-full"
                    >
                      {progress > 0 ? 'Continuar Assistindo' : 'Começar Curso'}
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        setPdfViewer({
                          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                          title: product.title
                        });
                      }}
                      leftIcon={<Shield className="w-3.5 h-3.5" />}
                      className="w-full"
                    >
                      Ler E-book Protegido
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )
      )}

      {/* Secure PDF Viewer */}
      {pdfViewer && (
        <SecurePDFViewer
          pdfUrl={pdfViewer.url}
          pdfTitle={pdfViewer.title}
          studentName={user?.fullName || 'Leitor MartMarket'}
          studentEmail={user?.email || 'leitor@martmarket.app'}
          onClose={() => setPdfViewer(null)}
        />
      )}
    </div>
  );
};
