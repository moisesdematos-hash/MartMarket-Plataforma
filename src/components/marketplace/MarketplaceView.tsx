// ==============================================================================
// MARTMARKET MARKETPLACE EXPLORER & FACETED SEARCH
// ==============================================================================

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Code2, 
  Briefcase, 
  Palette, 
  Megaphone,
  Check
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MarketplaceRanking } from './MarketplaceRanking';

interface MarketplaceViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onNavigate }) => {
  const { products, categories } = useMarketplace();
  const { t, formatMoney, language, currency } = useI18n();

  const [viewMode, setViewMode] = useState<'catalog' | 'ranking'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');

  // Filter logic
  const filteredProducts = products.filter((p) => {
    if (p.status !== 'published' && !p.isPublished) return false;
    
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.creatorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesType = selectedType === 'all' || p.productType === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.defaultPrice - b.defaultPrice;
    if (sortBy === 'price-desc') return b.defaultPrice - a.defaultPrice;
    return b.totalSales - a.totalSales; // popular default
  });

  const sponsoredProducts = sortedProducts.filter(p => p.isSponsored);
  const organicProducts = sortedProducts.filter(p => !p.isSponsored);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'Code2': return <Code2 className="w-4 h-4" />;
      case 'Palette': return <Palette className="w-4 h-4" />;
      case 'Megaphone': return <Megaphone className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const renderProductCard = (product: any, isPatrocinado: boolean = false) => (
    <div
      key={product.id}
      onClick={() => onNavigate('product-details', { slug: product.slug })}
      className={`group rounded-2xl overflow-hidden transition-all cursor-pointer flex flex-col justify-between relative ${
        isPatrocinado 
          ? 'bg-amber-950/10 border-2 border-amber-500/30 hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-500/10'
          : 'bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5'
      }`}
    >
      {isPatrocinado && (
        <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 text-[10px] font-black uppercase px-2 py-1 rounded-bl-lg z-10 shadow-lg shadow-amber-500/20">
          Patrocinado
        </div>
      )}
      <div>
        {/* Cover Image */}
        <div className="relative h-44 overflow-hidden bg-slate-950">
          <img
            src={product.coverImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="primary" size="sm">
              {(product.productType || 'PRODUTO').toUpperCase()}
            </Badge>
          </div>
          {product.bumpEnabled && !isPatrocinado && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" size="sm">
                BUMP OFERTA
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <img
              src={product.creatorAvatar}
              alt={product.creatorName}
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="truncate">{product.creatorName}</span>
          </div>

          <h4 className={`font-bold text-sm line-clamp-2 transition-colors leading-snug ${isPatrocinado ? 'text-amber-100 group-hover:text-amber-400' : 'text-slate-100 group-hover:text-blue-400'}`}>
            {product.title}
          </h4>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>
      </div>

      {/* Footer Stats & Price */}
      <div className="p-4 pt-0">
        <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-slate-200">{product.rating}</span>
          <span className="text-slate-500">({product.reviewCount})</span>
        </div>

        <div className={`pt-3 border-t flex items-center justify-between ${isPatrocinado ? 'border-amber-500/20' : 'border-slate-800/80'}`}>
          <div>
            <span className="text-base font-extrabold text-white font-mono">
              {formatMoney(product.defaultPrice, product.currency)}
            </span>
          </div>
          <Button variant={isPatrocinado ? 'warning' : 'primary'} size="sm">
            Comprar &rarr;
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 border border-slate-800 shadow-2xl mb-10 overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <Badge variant="primary" size="sm">
            Catálogo Global
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Descubra os Melhores Produtos Digitais
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Cursos com videoaulas práticas, ebooks completos, templates profissionais e ferramentas desenvolvidas pelos melhores criadores.
          </p>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-1">
        <button
          onClick={() => setViewMode('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            viewMode === 'catalog'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          🛍️ Catálogo
        </button>
        <button
          onClick={() => setViewMode('ranking')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            viewMode === 'ranking'
              ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          🔥 Ranking & Temperatura
        </button>
      </div>

      {/* Ranking View */}
      {viewMode === 'ranking' && (
        <MarketplaceRanking onNavigate={onNavigate} />
      )}

      {/* Catalog View */}
      {viewMode === 'catalog' && (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" />
                {t('filter')}
              </span>
              {(selectedCategory !== 'all' || selectedType !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedType('all');
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Categorias
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600/20 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>Todas as Categorias</span>
                  {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600/20 text-blue-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getCategoryIcon(cat.icon)}
                      <span className="truncate">{cat.name[language] || cat.name.pt}</span>
                    </div>
                    {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Type */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tipo de Produto
              </h4>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'Todos os Formatos' },
                  { id: 'course', label: 'Cursos & Videoaulas' },
                  { id: 'ebook', label: 'Ebooks & Documentos' },
                  { id: 'template', label: 'Templates & Recursos' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                      selectedType === type.id
                        ? 'bg-blue-600/20 text-blue-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span>{type.label}</span>
                    {selectedType === type.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Search & Sort toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 whitespace-nowrap">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="popular">Mais Populares</option>
                <option value="rating">Melhor Avaliados</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-200 text-base">Nenhum produto encontrado</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Tente ajustar os filtros de categoria ou busque por outro termo.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Sponsored Section */}
              {sponsoredProducts.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                    <Sparkles className="w-5 h-5" />
                    <span>Destaques Patrocinados</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sponsoredProducts.map(p => renderProductCard(p, true))}
                  </div>
                </div>
              )}

              {/* Organic Section */}
              <div className="space-y-4">
                {sponsoredProducts.length > 0 && (
                  <h3 className="text-sm font-bold text-slate-300">Explorar Catálogo</h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {organicProducts.map(p => renderProductCard(p, false))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )} {/* end catalog view */}
    </div>
  );
};
