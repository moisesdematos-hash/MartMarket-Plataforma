// ==============================================================================
// MARTMARKET COMMAND PALETTE (CTRL/CMD + K)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, PlusCircle, BookOpen, Users, Wallet, Shield, FileText, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { products } = useMarketplace();
  const { t, formatMoney } = useI18n();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.creatorName.toLowerCase().includes(query.toLowerCase())
  );

  const quickActions = [
    { id: 'act-new-prod', title: t('createProduct'), icon: PlusCircle, view: 'creator-wizard' },
    { id: 'act-marketplace', title: t('marketplace'), icon: ShoppingBag, view: 'marketplace' },
    { id: 'act-library', title: t('membersArea'), icon: BookOpen, view: 'members' },
    { id: 'act-affiliates', title: t('affiliates'), icon: Users, view: 'affiliates' },
    { id: 'act-wallet', title: t('wallet'), icon: Wallet, view: 'wallet' },
    { id: 'act-admin', title: t('admin'), icon: Shield, view: 'admin' },
    { id: 'act-docs', title: t('docs'), icon: FileText, view: 'docs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-slate-100">
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder={t('commandPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/50">
          {/* Quick Actions */}
          <div className="py-2">
            <h4 className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('quickActions')}
            </h4>
            <div className="space-y-1 mt-1">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      onNavigate(action.view);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                      <span>{action.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Products */}
          {filteredProducts.length > 0 && (
            <div className="py-2">
              <h4 className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('myProducts')} ({filteredProducts.length})
              </h4>
              <div className="space-y-1 mt-1">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onNavigate('product-details', { slug: product.slug });
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.coverImage}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-medium text-slate-200 truncate">{product.title}</div>
                        <div className="text-xs text-slate-400">{product.creatorName}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-400 shrink-0 ml-3">
                      {formatMoney(product.defaultPrice, product.currency)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
