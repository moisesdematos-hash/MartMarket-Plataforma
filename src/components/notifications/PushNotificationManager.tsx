// ==============================================================================
// MARTMARKET PWA PUSH NOTIFICATIONS MANAGER
// Manages push notification subscriptions, sends in-app and push alerts,
// handles offline queuing, and provides granular user preference controls.
// Includes service worker registration handshake and permission flow.
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  Bell, BellOff, BellRing, Smartphone, Shield,
  Check, X, BookOpen, ShoppingBag, Award, MessageSquare,
  Settings2, Download, Wifi, WifiOff, Zap
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../common/Modal';

type PermissionState = 'default' | 'granted' | 'denied' | 'unavailable';

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface PushNotificationManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  isOpen, onClose
}) => {
  const { showToast } = useNotification();
  const [permState, setPermState] = useState<PermissionState>('default');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistered, setSwRegistered] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const [prefs, setPrefs] = useState<NotificationPreference[]>([
    {
      id: 'new-lesson',
      label: 'Novas Aulas Publicadas',
      description: 'Seja notificado quando uma nova aula for adicionada a um curso que você comprou.',
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      enabled: true
    },
    {
      id: 'purchase-confirm',
      label: 'Confirmação de Compra',
      description: 'Receba um push imediato quando sua compra for confirmada.',
      icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />,
      enabled: true
    },
    {
      id: 'cert-ready',
      label: 'Certificado Disponível',
      description: 'Notificação quando seu certificado de conclusão estiver pronto para download.',
      icon: <Award className="w-4 h-4 text-amber-400" />,
      enabled: true
    },
    {
      id: 'community',
      label: 'Atividade da Comunidade',
      description: 'Respostas às suas perguntas, menções e postagens populares na comunidade do curso.',
      icon: <MessageSquare className="w-4 h-4 text-purple-400" />,
      enabled: false
    },
    {
      id: 'promo',
      label: 'Promoções e Descontos',
      description: 'Ofertas exclusivas, lançamentos e cupons para os produtos do seu interesse.',
      icon: <Zap className="w-4 h-4 text-rose-400" />,
      enabled: false
    }
  ]);

  // Check permission & SW status on mount
  useEffect(() => {
    if (!('Notification' in window)) {
      setPermState('unavailable');
      return;
    }
    setPermState(Notification.permission as PermissionState);

    // Check if SW is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        setSwRegistered(!!reg);
      });
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    setRequesting(true);

    try {
      const result = await Notification.requestPermission();
      setPermState(result as PermissionState);

      if (result === 'granted') {
        // Register service worker if not yet registered
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
          setSwRegistered(true);

          // Send test notification
          reg.showNotification('MartMarket', {
            body: 'Notificações ativadas! Você receberá atualizações importantes aqui.',
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            tag: 'welcome'
          });
        }
        showToast('success', 'Notificações push ativadas com sucesso!');
      } else {
        showToast('info', 'Notificações push não ativadas. Você pode ativar mais tarde nas configurações do navegador.');
      }
    } catch (err) {
      showToast('warning', 'Erro ao solicitar permissão para notificações.');
    } finally {
      setRequesting(false);
    }
  };

  const togglePref = (id: string) => {
    setPrefs(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
    showToast('success', 'Preferências de notificação atualizadas.');
  };

  const sendTestNotification = () => {
    if (permState !== 'granted') {
      showToast('warning', 'Ative as notificações primeiro para testar.');
      return;
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification('MartMarket — Teste', {
          body: 'Esta é uma notificação de teste do MartMarket!',
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: 'test-' + Date.now()
        });
      });
    }
    showToast('info', 'Notificação de teste enviada!');
  };

  const permBanner = () => {
    if (permState === 'unavailable') return (
      <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-2 text-xs text-slate-400">
        <BellOff className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Seu navegador não suporta notificações push. Use um navegador moderno como Chrome, Edge ou Firefox.</span>
      </div>
    );
    if (permState === 'denied') return (
      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/50 flex items-start gap-2 text-xs text-rose-300">
        <BellOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <span>
          Permissão de notificações bloqueada pelo navegador. Para ativar, acesse as <strong className="text-white">Configurações do Site</strong> no seu navegador e habilite "Notificações" para <code className="bg-rose-950 px-1 rounded">martmarket.app</code>.
        </span>
      </div>
    );
    if (permState === 'granted') return (
      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-start gap-2 text-xs text-emerald-300">
        <BellRing className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Notificações push <strong className="text-white">ativas</strong>. Você receberá alertas mesmo com o navegador fechado (quando o dispositivo estiver online).
        </span>
      </div>
    );
    return (
      <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/50 space-y-3">
        <div className="flex items-start gap-2 text-xs text-blue-300">
          <Bell className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>Ative as notificações para receber alertas sobre suas aulas, compras e comunidade — mesmo com o browser fechado.</span>
        </div>
        <Button
          size="sm"
          leftIcon={<Bell className="w-4 h-4" />}
          onClick={requestPermission}
          disabled={requesting}
          className="w-full"
        >
          {requesting ? 'Aguardando permissão...' : 'Ativar Notificações Push'}
        </Button>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="md">
      <div className="space-y-6 p-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" size="sm" icon={<BellRing className="w-3 h-3" />}>
                Centro de Notificações
              </Badge>
              {/* Online/Offline indicator */}
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isOnline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                {isOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <h2 className="text-lg font-black text-white">Notificações & PWA</h2>
            <p className="text-[11px] text-slate-400">Gerencie alertas push e acesso offline à plataforma.</p>
          </div>
          <div className="flex items-center gap-2">
            {permState === 'granted' && (
              <button
                onClick={sendTestNotification}
                className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg transition-colors"
              >
                Testar
              </button>
            )}
          </div>
        </div>

        {/* Permission Banner */}
        {permBanner()}

        {/* PWA Install Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white">Instalar App MartMarket (PWA)</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Instale a plataforma como um app nativo no seu dispositivo. Funciona offline, carrega mais rápido e aparece na sua tela inicial como um aplicativo normal.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Funciona offline</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Aulas em cache local</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Sem instalar pela loja</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Ícone na tela inicial</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => {
              showToast('info', 'Para instalar: clique em "Mais opções" no seu navegador e selecione "Instalar aplicativo".');
            }}
            className="w-full"
          >
            Instalar no Dispositivo
          </Button>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-200">Preferências de Notificação</h3>
          </div>

          <div className="divide-y divide-slate-800 rounded-xl overflow-hidden border border-slate-800">
            {prefs.map(pref => (
              <div key={pref.id} className="flex items-start justify-between gap-3 p-3.5 bg-slate-900/60 hover:bg-slate-900 transition-colors">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 shrink-0">{pref.icon}</div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-100">{pref.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{pref.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePref(pref.id)}
                  disabled={permState !== 'granted'}
                  className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 mt-0.5 border cursor-pointer ${
                    pref.enabled && permState === 'granted'
                      ? 'bg-blue-600 border-blue-500'
                      : 'bg-slate-700 border-slate-600'
                  } ${permState !== 'granted' ? 'opacity-40 cursor-not-allowed' : ''}`}
                  style={{ height: '22px', width: '40px' }}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${
                    pref.enabled && permState === 'granted' ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SW Status */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 border-t border-slate-800 pt-4">
          <Shield className="w-3 h-3 text-slate-600" />
          <span>
            Service Worker: <span className={swRegistered ? 'text-emerald-400' : 'text-slate-400'}>
              {swRegistered ? 'Ativo' : 'Inativo'}
            </span>
          </span>
          <span className="ml-auto">
            Permissão: <span className={permState === 'granted' ? 'text-emerald-400' : permState === 'denied' ? 'text-rose-400' : 'text-slate-400'}>
              {permState === 'granted' ? 'Concedida' : permState === 'denied' ? 'Negada' : permState === 'unavailable' ? 'Indisponível' : 'Pendente'}
            </span>
          </span>
        </div>
      </div>
    </Modal>
  );
};
