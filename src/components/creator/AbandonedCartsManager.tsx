// ==============================================================================
// MARTMARKET ABANDONED CART RECOVERY & WHATSAPP DIRECT
// ==============================================================================

import React, { useState } from 'react';
import { ShoppingCart, MessageCircle, Phone, Mail, Clock, Send, Check, ExternalLink } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface AbandonedCart {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productTitle: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  abandonedAt: string;
  status: 'pending' | 'recovered' | 'contacted';
}

export const AbandonedCartsManager: React.FC = () => {
  const { formatMoney } = useI18n();
  const { showToast } = useNotification();

  const [carts, setCarts] = useState<AbandonedCart[]>([
    {
      id: 'ab-1',
      customerName: 'Manuel Fernandes',
      customerEmail: 'manuel.fernandes@gmail.com',
      customerPhone: '+244924118990',
      productTitle: 'Masterclass Fullstack: De Zero a SaaS Escalável',
      amount: 35000,
      currency: 'AOA',
      paymentMethod: 'Multicaixa Express',
      abandonedAt: 'Há 45 minutos',
      status: 'pending'
    },
    {
      id: 'ab-2',
      customerName: 'Teresa Baptista',
      customerEmail: 'teresa.baptista@hotmail.com',
      customerPhone: '+244919554321',
      productTitle: 'Guia Prático de Finanças & Investimentos em Angola',
      amount: 18000,
      currency: 'AOA',
      paymentMethod: 'Referência Bancária (GPO)',
      abandonedAt: 'Há 2 horas',
      status: 'pending'
    }
  ]);

  const handleSendWhatsApp = (cart: AbandonedCart) => {
    const cleanPhone = cart.customerPhone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${cart.customerName}! Notámos que iniciou o pedido do "${cart.productTitle}" na MartMarket via ${cart.paymentMethod}.\n\nPara facilitar o seu acesso imediato ou tirar qualquer dúvida, estamos à disposição por aqui! Link do checkout: https://martmarket.app/c/${cart.id}`
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

    window.open(whatsappUrl, '_blank');

    setCarts((prev) =>
      prev.map((c) => (c.id === cart.id ? { ...c, status: 'contacted' } : c))
    );

    showToast('success', `Conversa do WhatsApp aberta para ${cart.customerName}!`);
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl text-xs text-slate-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm" icon={<ShoppingCart className="w-3.5 h-3.5" />}>
              Recuperador Automático
            </Badge>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            Carrinhos e Checkouts Abandonados ({carts.length})
          </h3>
          <p className="text-slate-400 text-xs">
            Recupere até 35% das vendas perdidas contactando os compradores diretamente via WhatsApp.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {carts.map((cart) => (
          <div
            key={cart.id}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm">{cart.customerName}</span>
                <Badge
                  variant={cart.status === 'contacted' ? 'info' : 'warning'}
                  size="sm"
                >
                  {cart.status === 'contacted' ? 'Contactado' : 'Aguardando Recuperação'}
                </Badge>
              </div>

              <div className="text-slate-400">
                Produto: <strong className="text-slate-200">{cart.productTitle}</strong> ({formatMoney(cart.amount, cart.currency as any)})
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  {cart.customerPhone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-blue-400" />
                  {cart.customerEmail}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {cart.abandonedAt}
                </span>
              </div>
            </div>

            <Button
              variant="success"
              size="sm"
              onClick={() => handleSendWhatsApp(cart)}
              leftIcon={<MessageCircle className="w-4 h-4 fill-current" />}
              className="shrink-0 font-bold"
            >
              Recuperar no WhatsApp &rarr;
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
