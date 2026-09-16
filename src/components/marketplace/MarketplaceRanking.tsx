// ==============================================================================
// MARTMARKET MARKETPLACE TEMPERATURE RANKING ENGINE
// Product temperature system (Hot/Rising/Cold), affiliate approval ratings,
// bestseller badges, category trending, and social proof counters.
// ==============================================================================

import React, { useState } from 'react';
import {
  Flame, TrendingUp, Star, Users, ShoppingBag,
  Award, BarChart3, ArrowUpRight, Filter, RefreshCw
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../lib/currencies';

type ProductTemperature = 'HOT' | 'RISING' | 'WARM' | 'COLD';

interface RankedProduct {
  id: string;
  rank: number;
  title: string;
  creator: string;
  coverImage: string;
  category: string;
  priceAOA: number;
  totalSales: number;
  conversionRate: number;
  refundRate: number;
  affiliateCommission: number;
  rating: number;
  reviewCount: number;
  temperature: ProductTemperature;
  weeklyGrowth: number; // % change in sales vs last week
  isBestseller: boolean;
  isNewRelease: boolean;
}

interface MarketplaceRankingProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

const temperatureConfig: Record<ProductTemperature, { label: string; icon: React.ReactNode; colorClass: string; badgeVariant: any }> = {
  HOT: {
    label: 'Em Chamas',
    icon: <Flame className="w-3.5 h-3.5" />,
    colorClass: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    badgeVariant: 'warning'
  },
  RISING: {
    label: 'Em Alta',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    badgeVariant: 'success'
  },
  WARM: {
    label: 'Aquecido',
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    badgeVariant: 'primary'
  },
  COLD: {
    label: 'Frio',
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    colorClass: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    badgeVariant: 'neutral'
  }
};

const RANKED_PRODUCTS: RankedProduct[] = [
  {
    id: 'prod-1', rank: 1,
    title: 'Masterclass Fullstack: De Zero a SaaS Escalável',
    creator: 'Kelson Manuel',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=80&auto=format&fit=crop&q=80',
    category: 'Tecnologia',
    priceAOA: 75000,
    totalSales: 2847,
    conversionRate: 9.2,
    refundRate: 1.1,
    affiliateCommission: 40,
    rating: 4.9,
    reviewCount: 1284,
    temperature: 'HOT',
    weeklyGrowth: 34,
    isBestseller: true,
    isNewRelease: false
  },
  {
    id: 'prod-2', rank: 2,
    title: 'Marketing Digital para PMEs Angolanas',
    creator: 'Ana Cardoso',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&auto=format&fit=crop&q=80',
    category: 'Marketing',
    priceAOA: 45000,
    totalSales: 1923,
    conversionRate: 7.8,
    refundRate: 2.3,
    affiliateCommission: 50,
    rating: 4.7,
    reviewCount: 874,
    temperature: 'HOT',
    weeklyGrowth: 18,
    isBestseller: true,
    isNewRelease: false
  },
  {
    id: 'prod-3', rank: 3,
    title: 'Gestão Financeira e Investimentos em Angola',
    creator: 'Dr. João Neto',
    coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=80&auto=format&fit=crop&q=80',
    category: 'Finanças',
    priceAOA: 38000,
    totalSales: 1540,
    conversionRate: 8.1,
    refundRate: 0.8,
    affiliateCommission: 35,
    rating: 4.8,
    reviewCount: 672,
    temperature: 'RISING',
    weeklyGrowth: 52,
    isBestseller: false,
    isNewRelease: false
  },
  {
    id: 'prod-4', rank: 4,
    title: 'Design UI/UX Profissional com Figma',
    creator: 'Maria Silva',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=80&auto=format&fit=crop&q=80',
    category: 'Design',
    priceAOA: 52000,
    totalSales: 1102,
    conversionRate: 6.4,
    refundRate: 1.9,
    affiliateCommission: 45,
    rating: 4.6,
    reviewCount: 428,
    temperature: 'RISING',
    weeklyGrowth: 27,
    isBestseller: false,
    isNewRelease: true
  },
  {
    id: 'prod-5', rank: 5,
    title: 'Inglês para Negócios — Nível C1',
    creator: 'Prof. Pedro Costa',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=80&auto=format&fit=crop&q=80',
    category: 'Idiomas',
    priceAOA: 28000,
    totalSales: 788,
    conversionRate: 5.2,
    refundRate: 3.1,
    affiliateCommission: 30,
    rating: 4.4,
    reviewCount: 312,
    temperature: 'WARM',
    weeklyGrowth: 6,
    isBestseller: false,
    isNewRelease: false
  }
];

export const MarketplaceRanking: React.FC<MarketplaceRankingProps> = ({ onNavigate }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'growth' | 'conversion'>('rank');

  const categories = ['all', 'Tecnologia', 'Marketing', 'Finanças', 'Design', 'Idiomas'];

  const filtered = RANKED_PRODUCTS
    .filter(p => filterCategory === 'all' || p.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'growth') return b.weeklyGrowth - a.weeklyGrowth;
      if (sortBy === 'conversion') return b.conversionRate - a.conversionRate;
      return a.rank - b.rank;
    });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Badge variant="warning" size="sm" icon={<Flame className="w-3.5 h-3.5" />}>
          Rankings & Temperatura de Mercado
        </Badge>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
          Produtos Mais Vendidos do Marketplace
        </h2>
        <p className="text-xs text-slate-400">
          Ranking atualizado em tempo real com temperatura de vendas, taxa de conversão e aprovação de afiliados.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 ml-auto">
          <span className="text-[11px] text-slate-500 px-2">Ordenar por:</span>
          {([
            { key: 'rank', label: 'Ranking Geral' },
            { key: 'growth', label: 'Crescimento' },
            { key: 'conversion', label: 'Conversão' }
          ] as const).map(opt => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                sortBy === opt.key
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5">Produto</th>
                <th className="p-3.5">Temperatura</th>
                <th className="p-3.5">Vendas</th>
                <th className="p-3.5">Conversão</th>
                <th className="p-3.5">Reembolsos</th>
                <th className="p-3.5">Comissão Afiliado</th>
                <th className="p-3.5">Avaliação</th>
                <th className="p-3.5">Crescimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((product) => {
                const temp = temperatureConfig[product.temperature];
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => onNavigate?.('product-details', { slug: product.id })}
                  >
                    <td className="p-3.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-sm ${
                        product.rank <= 3 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {product.rank <= 3 ? '🏆'.slice(0, 1) : product.rank}
                        {product.rank === 1 && <span className="text-[10px]">🥇</span>}
                        {product.rank === 2 && <span className="text-[10px]">🥈</span>}
                        {product.rank === 3 && <span className="text-[10px]">🥉</span>}
                        {product.rank > 3 && product.rank}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.coverImage}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                        />
                        <div>
                          <div className="font-bold text-white max-w-[220px] truncate">{product.title}</div>
                          <div className="text-[11px] text-slate-400">{product.creator}</div>
                          <div className="flex gap-1 mt-0.5">
                            {product.isBestseller && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                                BESTSELLER
                              </span>
                            )}
                            {product.isNewRelease && (
                              <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-bold">
                                LANÇAMENTO
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full border ${temp.colorClass}`}>
                        {temp.icon} {temp.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">
                      {product.totalSales.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className={`font-mono font-bold ${product.conversionRate >= 7 ? 'text-emerald-400' : product.conversionRate >= 5 ? 'text-yellow-400' : 'text-rose-400'}`}>
                        {product.conversionRate}%
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`font-mono ${product.refundRate <= 2 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {product.refundRate}%
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-purple-400">{product.affiliateCommission}%</span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-bold text-white">{product.rating}</span>
                        <span className="text-slate-500">({product.reviewCount})</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`font-mono font-bold flex items-center gap-1 ${product.weeklyGrowth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <TrendingUp className="w-3 h-3" />
                        +{product.weeklyGrowth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
