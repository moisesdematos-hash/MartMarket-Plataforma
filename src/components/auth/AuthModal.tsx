// ==============================================================================
// MARTMARKET AUTHENTICATION MODAL COMPONENT
// ==============================================================================

import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const { login, register, loginWithGoogle, continueAsGuest, isLoading } = useAuth();
  const { t } = useI18n();
  const { showToast } = useNotification();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CREATOR_AFFILIATE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('error', 'Por favor preencha o seu endereço de email.');
      return;
    }

    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) {
        showToast('success', `Bem-vindo de volta! Sessão iniciada.`);
        onClose();
        if (onSuccess) onSuccess();
      }
    } else {
      if (!fullName) {
        showToast('error', 'Por favor informe o seu nome completo.');
        return;
      }
      const ok = await register(fullName, email, password, selectedRole);
      if (ok) {
        showToast('success', 'Conta criada com sucesso! Bem-vindo à MartMarket.');
        onClose();
        if (onSuccess) onSuccess();
      }
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    showToast('success', 'Autenticado com sucesso via Google!');
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleGuest = () => {
    continueAsGuest();
    showToast('info', 'Explorando a plataforma como visitante convidado.');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? t('loginTitle') : t('registerTitle')}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-100 font-medium text-xs sm:text-sm transition-all shadow-md cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t('loginWithGoogle')}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-widest font-mono">
            ou com email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('fullNameLabel')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                {t('passwordLabel')}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => showToast('info', 'Link de recuperação enviado para o email se cadastrado.')}
                  className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                >
                  {t('forgotPassword')}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo de Perfil Inicial
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('CREATOR_AFFILIATE')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedRole === 'CREATOR_AFFILIATE'
                      ? 'bg-blue-600/20 border-blue-500 text-slate-100'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-200">Criador & Afiliado</div>
                  <div className="text-[10px] text-slate-400">Vender produtos e promover</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('BUYER')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedRole === 'BUYER'
                      ? 'bg-blue-600/20 border-blue-500 text-slate-100'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-200">Aluno / Comprador</div>
                  <div className="text-[10px] text-slate-400">Apenas aceder a conteúdos</div>
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            {mode === 'login' ? t('login') : t('register')}
          </Button>
        </form>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            {mode === 'login' ? (
              <span>{t('noAccount')} <strong className="text-blue-400">{t('register')}</strong></span>
            ) : (
              <span>{t('haveAccount')} <strong className="text-blue-400">{t('login')}</strong></span>
            )}
          </button>

          <button
            type="button"
            onClick={handleGuest}
            className="text-slate-400 hover:text-slate-200 font-medium cursor-pointer"
          >
            {t('guestMode')} &rarr;
          </button>
        </div>
      </div>
    </Modal>
  );
};
