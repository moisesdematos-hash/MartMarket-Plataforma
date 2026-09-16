// ==============================================================================
// MARTMARKET ONE-CLICK POST-PURCHASE UPSELL & DOWNSELL ENGINE
// ==============================================================================

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order, SupportedCurrency } from '../../types';
import { useI18n } from '../../context/I18nContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface OneClickUpsellModalProps {
  isOpen: boolean;
  order: Order;
  onAccept: (upsellTitle: string, upsellPrice: number) => void;
  onDecline: () => void;
}

export const OneClickUpsellModal: React.FC<OneClickUpsellModalProps> = ({
  isOpen,
  order,
  onAccept,
  onDecline
}) => {
  const { formatMoney } = useI18n();
  const [isDownsell, setIsDownsell] = useState(false);

  const upsellOffer = {
    title: 'Mentoria Exclusiva de Aceleração VIP (1-on-1)',
    price: 15000,
    originalPrice: 45000,
    description: 'Sessão individual ao vivo para auditar o seu negócio, estruturar o seu funil de vendas e acelerar os seus resultados em menos de 14 dias.',
    benefits: [
      'Análise personalizada do seu projeto em Luanda ou exterior',
      'Gravação completa da sessão em vídeo para rever quando quiser',
      'Acesso direto ao WhatsApp do mentor durante 30 dias'
    ]
  };

  const downsellOffer = {
    title: 'Kit de Gravações & Templates VIP Starter',
    price: 6000,
    originalPrice: 18000,
    description: 'Acesse as gravações de 5 mentorias de alto nível e receba todos os modelos de funil de vendas prontos.',
    benefits: [
      '5 Masterclasses gravadas em alta definição',
      'Pacote com 15 modelos de funil e criativos validados'
    ]
  };

  const activeOffer = isDownsell ? downsellOffer : upsellOffer;

  const handleDeclineFirst = () => {
    if (!isDownsell) {
      setIsDownsell(true);
    } else {
      onDecline();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onDecline}
      title={isDownsell ? 'Espere! Oferta Especial de Downsell' : 'Oferta Especial Única (One-Click Upsell)'}
      maxWidth="xl"
    >
      <div className="space-y-6 text-xs text-slate-300">
        
        {/* Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-900/30 border border-amber-500/30 text-center space-y-1">
          <Badge variant="warning" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
            OFERTA EXCLUSIVA PÓS-COMPRA (NÃO VOLTARÁ A APARECER)
          </Badge>
          <h3 className="text-base sm:text-lg font-extrabold text-white mt-2">
            {activeOffer.title}
          </h3>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          {activeOffer.description}
        </p>

        {/* Benefits list */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="font-bold text-slate-200 block">O que está incluído:</span>
          {activeOffer.benefits.map((b, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* Price callout */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 line-through block">
              De {formatMoney(activeOffer.originalPrice, order.currency)}
            </span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono">
              Por apenas {formatMoney(activeOffer.price, order.currency)}
            </span>
          </div>
          <Badge variant="success" size="sm">67% OFF</Badge>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2.5 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onAccept(activeOffer.title, activeOffer.price)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full py-3.5 text-sm font-bold shadow-xl shadow-blue-500/25"
          >
            SIM! Adicionar ao meu Acesso com 1 Clique
          </Button>

          <button
            type="button"
            onClick={handleDeclineFirst}
            className="w-full py-2 text-center text-slate-500 hover:text-slate-300 text-xs cursor-pointer transition-colors"
          >
            {isDownsell
              ? 'Não, obrigado. Quero apenas o produto que já comprei.'
              : 'Não tenho interesse nesta oferta de aceleração.'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
