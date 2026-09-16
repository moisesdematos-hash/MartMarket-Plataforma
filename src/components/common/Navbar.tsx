// ==============================================================================
// MARTMARKET ENTERPRISE NAVBAR COMPONENT
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  BookOpen, 
  Users, 
  Wallet, 
  Shield, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Globe, 
  Coins, 
  Menu, 
  X, 
  User, 
  LogOut, 
  FileText,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { SupportedLanguage, SupportedCurrency, UserRole } from '../../types';
import { Button } from './Button';
import { PushNotificationManager } from '../notifications/PushNotificationManager';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenCommandPalette
}) => {
  const { user, isAuthenticated, isGuest, logout, switchRole } = useAuth();
  const { language, setLanguage, currency, setCurrency, t } = useI18n();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useNotification();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setIsLangDropdownOpen(false);
      if (currRef.current && !currRef.current.contains(e.target as Node)) setIsCurrencyDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifDropdownOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português (AO/PT/BR)', flag: '🇦🇴' },
    { code: 'en', label: 'English (US/UK)', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  const currencies: { code: SupportedCurrency; symbol: string; label: string }[] = [
    { code: 'AOA', symbol: 'Kz', label: 'Kwanza (Angola)' },
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'BRL', symbol: 'R$', label: 'Real Brasileiro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
  ];

  const navLinks = [
    { id: 'marketplace', label: t('marketplace'), icon: ShoppingBag },
    { id: 'creator', label: t('creatorTitle'), icon: Sparkles },
    { id: 'members', label: t('membersArea'), icon: BookOpen },
    { id: 'affiliates', label: t('affiliates'), icon: Users },
    { id: 'wallet', label: t('wallet'), icon: Wallet },
    { id: 'admin', label: t('admin'), icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-lg tracking-wider">
                  M
                </span>
              </div>
            </div>
            <div className="text-left">
              <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1">
                MART<span className="text-blue-500">MARKET</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                GLOBAL CREATOR
              </span>
            </div>
          </button>

          {/* Search / Command trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('searchPlaceholder').slice(0, 32)}...</span>
            <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            const isProtected = ['creator', 'members', 'affiliates', 'wallet', 'admin'].includes(link.id);
            return (
              <button
                key={link.id}
                onClick={() => {
                  if (isProtected && (!isAuthenticated || isGuest)) {
                    onOpenAuth('register');
                  } else {
                    onNavigate(link.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-copilot'))}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>IA Copilot</span>
          </button>

          {/* Currency Dropdown */}
          <div className="relative" ref={currRef}>
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
              title={t('currency')}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-fade-in">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t('currency')}
                </div>
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors cursor-pointer text-left ${
                      currency === c.code ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="text-slate-400 font-mono">{c.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
              title={t('language')}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-fade-in">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t('language')}
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors cursor-pointer text-left ${
                      language === l.code ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </div>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              title={t('notificationsTitle')}
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-slate-100 text-sm">{t('notificationsTitle')}</span>
                  {unreadNotifsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                    >
                      {t('markAllAsRead')}
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-slate-400">{t('noNotifications')}</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                          n.isRead ? 'bg-slate-950/40 border-slate-800/60 text-slate-400' : 'bg-blue-600/10 border-blue-500/30 text-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-slate-100 mb-0.5">{n.title}</div>
                        <p className="text-[11px] leading-relaxed mb-1">{n.message}</p>
                        <span className="text-[9px] text-slate-500">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-slate-800 mt-2 pt-2">
                  <button
                    onClick={() => { setIsNotifDropdownOpen(false); setIsPushModalOpen(true); }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <Bell className="w-3.5 h-3.5 text-blue-400" />
                    Configurar Notificações Push & PWA
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Auth or Profile Menu */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-lg object-cover border border-blue-500/30"
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                  {user.fullName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-fade-in">
                  <div className="p-2 border-b border-slate-800 mb-1">
                    <div className="font-bold text-slate-100 text-sm truncate">{user.fullName}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {user.role}
                    </span>
                  </div>

                  {/* Role Switcher */}
                  <div className="px-2 py-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Alternar Perfil
                    </span>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {(['CREATOR', 'AFFILIATE', 'BUYER', 'SUPER_ADMIN'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setIsUserMenuOpen(false);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer text-left ${
                            user.role === r ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {r.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => {
                      onNavigate('creator');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t('creatorTitle')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('members');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t('membersArea')}</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('wallet');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('wallet')}</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenAuth('login')}
              >
                {t('login')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAuth('register')}
              >
                {t('register')}
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-slide-down">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isProtected = ['creator', 'members', 'affiliates', 'wallet', 'admin'].includes(link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (isProtected && (!isAuthenticated || isGuest)) {
                      onOpenAuth('register');
                    } else {
                      onNavigate(link.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentView === link.id ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenCommandPalette();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 text-sm text-slate-300 cursor-pointer"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Pesquisa Global (Ctrl K)</span>
            </button>
          </div>
        </div>
      )}

      {/* Push Notifications Manager Modal */}
      <PushNotificationManager
        isOpen={isPushModalOpen}
        onClose={() => setIsPushModalOpen(false)}
      />
    </header>
  );
};
