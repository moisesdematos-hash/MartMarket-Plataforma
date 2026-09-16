// ==============================================================================
// MARTMARKET ONBOARDING WIZARD
// ==============================================================================

import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Users, Layers, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { Button } from '../common/Button';
import { UserRole } from '../../types';

interface OnboardingWizardProps {
  onComplete: (role: UserRole) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { user, switchRole } = useAuth();
  const { t } = useI18n();
  const [selectedGoal, setSelectedGoal] = useState<UserRole>('CREATOR');

  const options = [
    {
      role: 'CREATOR' as UserRole,
      title: t('onboardingOption1'),
      desc: 'Hospede cursos, venda ebooks e crie a sua área de membros com pagamentos integrados.',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      role: 'AFFILIATE' as UserRole,
      title: t('onboardingOption2'),
      desc: 'Explore produtos no marketplace, gere links com cookies de atribuição e receba comissões automáticas.',
      icon: Users,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      role: 'BUYER' as UserRole,
      title: t('onboardingOption3'),
      desc: 'Assista a videoaulas, descarregue materiais didáticos e aceda aos seus certificados.',
      icon: ShoppingBag,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      role: 'CREATOR_AFFILIATE' as UserRole,
      title: t('onboardingOption4'),
      desc: 'Tenha o poder total: Venda os seus próprios produtos e promova produtos de outros criadores.',
      icon: Layers,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const handleFinish = () => {
    switchRole(selectedGoal);
    onComplete(selectedGoal);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('onboardingTitle')}
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          {t('onboardingSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 mb-8">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedGoal === opt.role;
          return (
            <div
              key={opt.role}
              onClick={() => setSelectedGoal(opt.role)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/20 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div
                className={`p-3 rounded-xl bg-gradient-to-tr ${opt.color} text-white shrink-0 shadow-lg`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-100">{opt.title}</h4>
                  {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={handleFinish}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          {t('completeOnboarding')}
        </Button>
      </div>
    </div>
  );
};
