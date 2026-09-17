// ==============================================================================
// MARTMARKET GLOBAL APPLICATION SHELL & ROUTER
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useI18n } from './context/I18nContext';
import { useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { LandingPage } from './components/landing/LandingPage';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { AiCopilotWidget } from './components/common/AiCopilotWidget';

// Lazy Loaded Views (Code Splitting)
const ProductDetailsPage = React.lazy(() => import('./components/marketplace/ProductDetailsPage').then(m => ({ default: m.ProductDetailsPage })));
const OnePageCheckout = React.lazy(() => import('./components/checkout/OnePageCheckout').then(m => ({ default: m.OnePageCheckout })));
const CheckoutSuccessPage = React.lazy(() => import('./components/checkout/CheckoutSuccessPage').then(m => ({ default: m.CheckoutSuccessPage })));
const CreatorDashboard = React.lazy(() => import('./components/creator/CreatorDashboard').then(m => ({ default: m.CreatorDashboard })));
const ProductCreationWizard = React.lazy(() => import('./components/creator/ProductCreationWizard').then(m => ({ default: m.ProductCreationWizard })));
const MembersLibrary = React.lazy(() => import('./components/members/MembersLibrary').then(m => ({ default: m.MembersLibrary })));
const CoursePlayer = React.lazy(() => import('./components/members/CoursePlayer').then(m => ({ default: m.CoursePlayer })));
const AffiliateHub = React.lazy(() => import('./components/affiliate/AffiliateHub').then(m => ({ default: m.AffiliateHub })));
const WalletDashboard = React.lazy(() => import('./components/wallet/WalletDashboard').then(m => ({ default: m.WalletDashboard })));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const DocsPage = React.lazy(() => import('./components/docs/DocsPage').then(m => ({ default: m.DocsPage })));
const CertificateVerificationPage = React.lazy(() => import('./components/members/CertificateVerificationPage').then(m => ({ default: m.CertificateVerificationPage })));

const FallbackLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

export function App() {
  const { user, isAuthenticated, isGuest } = useAuth();
  const { t } = useI18n();

  // Router State
  const [currentView, setCurrentView] = useState<string>('landing');
  const [routeParams, setRouteParams] = useState<Record<string, any>>({});
  
  // Modals & Palette
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Check URL query parameters for affiliate links & initial routing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    const prodId = urlParams.get('prod');
    const view = urlParams.get('view');

    if (view === 'checkout' && prodId) {
      setCurrentView('checkout');
      setRouteParams({ productId: prodId, affiliateId: refCode || undefined });
    } else if (refCode && prodId) {
      // Direct affiliate referral landing
      setCurrentView('checkout');
      setRouteParams({ productId: prodId, affiliateId: refCode });
    } else if (view) {
      setCurrentView(view);
    }
  }, []);

  const navigate = (view: string, params: Record<string, any> = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    setRouteParams(params);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    if (authMode === 'register') {
      setIsOnboardingOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigate}
        onOpenAuth={handleOpenAuth}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1">
        {isOnboardingOpen ? (
          <OnboardingWizard
            onComplete={(role) => {
              setIsOnboardingOpen(false);
              if (role === 'CREATOR' || role === 'CREATOR_AFFILIATE') {
                navigate('creator');
              } else if (role === 'AFFILIATE') {
                navigate('affiliates');
              } else {
                navigate('marketplace');
              }
            }}
          />
        ) : (
          <React.Suspense fallback={<FallbackLoader />}>
            {currentView === 'landing' && (
              <LandingPage
                onNavigate={navigate}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'marketplace' && (
              <MarketplaceView
                onNavigate={navigate}
              />
            )}

            {currentView === 'product-details' && (
              <ProductDetailsPage
                slug={routeParams.slug || 'masterclass-fullstack-saas'}
                onNavigate={navigate}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'checkout' && (
              <OnePageCheckout
                productId={routeParams.productId || 'prod-react-fullstack'}
                affiliateId={routeParams.affiliateId}
                onNavigate={navigate}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'checkout-success' && (
              <CheckoutSuccessPage
                order={routeParams.order}
                paymentResult={routeParams.paymentResult}
                onNavigate={navigate}
              />
            )}

            {['creator', 'creator-wizard', 'members', 'affiliates', 'wallet', 'admin'].includes(currentView) && (!isAuthenticated || isGuest) ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center px-4">
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
                  <p className="text-slate-400 max-w-sm">Tem de criar conta ou iniciar sessão para vender produtos e aceder ao painel.</p>
                </div>
                <button 
                  onClick={() => handleOpenAuth('register')}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  Fazer Cadastro Grátis
                </button>
              </div>
            ) : (
              <>
                {currentView === 'creator' && <CreatorDashboard onNavigate={navigate} />}
                {currentView === 'creator-wizard' && <ProductCreationWizard onNavigate={navigate} productId={routeParams.productId} />}
                {currentView === 'members' && <MembersLibrary onNavigate={navigate} />}
                {currentView === 'affiliates' && <AffiliateHub onNavigate={navigate} />}
                {currentView === 'wallet' && <WalletDashboard />}
                {currentView === 'admin' && <AdminDashboard />}
              </>
            )}

            {currentView === 'course-player' && (
              <CoursePlayer
                productId={routeParams.productId || 'prod-react-fullstack'}
                onNavigate={navigate}
              />
            )}



            {currentView === 'docs' && (
              <DocsPage />
            )}

            {currentView === 'verify-cert' && (
              <CertificateVerificationPage
                initialCode={routeParams.certId}
                onNavigate={navigate}
              />
            )}
          </React.Suspense>
        )}
      </main>

      {/* Footer (hidden inside course player for max view immersion) */}
      {currentView !== 'course-player' && !isOnboardingOpen && (
        <Footer onNavigate={navigate} />
      )}

      {/* Global Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigate}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Floating AI Copilot Widget */}
      <AiCopilotWidget />

      {/* Floating Toast Container */}
      <ToastContainer />
    </div>
  );
}
