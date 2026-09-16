// ==============================================================================
// MARTMARKET ENTERPRISE FOOTER & LEGAL MODALS
// ==============================================================================

import React, { useState } from 'react';
import { Shield, Lock, Globe, FileText, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { Modal } from './Modal';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language, currency } = useI18n();
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: string; title: string }>({
    isOpen: false,
    type: '',
    title: ''
  });

  const openLegalModal = (type: string, title: string) => {
    setLegalModal({ isOpen: true, type, title });
  };

  const closeLegalModal = () => {
    setLegalModal({ isOpen: false, type: '', title: '' });
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 text-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-extrabold text-blue-400 text-base">
                  M
                </div>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                MART<span className="text-blue-500">MARKET</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Infraestrutura de ponta para criadores, autores, empresas e afiliados monetizarem o seu conhecimento no mercado global com checkout integrado e pagamentos sem fricção.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-400" />
                PCI-DSS & SSL 256-bit
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Angola AO06 & Global
              </span>
            </div>
          </div>

          {/* Col 1: Plataforma */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Plataforma
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  {t('marketplace')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('creator')} className="hover:text-white transition-colors cursor-pointer">
                  {t('forCreators')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('affiliates')} className="hover:text-white transition-colors cursor-pointer">
                  {t('forAffiliates')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('members')} className="hover:text-white transition-colors cursor-pointer">
                  {t('membersArea')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wallet')} className="hover:text-white transition-colors cursor-pointer">
                  {t('wallet')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Recursos & Docs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Recursos
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('docs')} className="hover:text-white transition-colors cursor-pointer">
                  Central de Documentação
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('docs')} className="hover:text-white transition-colors cursor-pointer">
                  API & Webhooks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('docs')} className="hover:text-white transition-colors cursor-pointer">
                  Guia do Criador em Angola
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('docs')} className="hover:text-white transition-colors cursor-pointer">
                  Guia de Afiliados
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('status', 'Status do Sistema')} className="hover:text-white transition-colors cursor-pointer">
                  Estado do Sistema (99.99%)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Políticas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Legal & Segurança
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => openLegalModal('terms', 'Termos de Utilização')} className="hover:text-white transition-colors cursor-pointer">
                  Termos de Serviço
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('privacy', 'Política de Privacidade')} className="hover:text-white transition-colors cursor-pointer">
                  Privacidade & Dados (LGPD/GDPR)
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('refund', 'Política de Reembolso')} className="hover:text-white transition-colors cursor-pointer">
                  Política de Reembolso (7 a 14 dias)
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('cookies', 'Política de Cookies')} className="hover:text-white transition-colors cursor-pointer">
                  Gestão de Cookies
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal('security', 'Segurança & Anti-Fraude')} className="hover:text-white transition-colors cursor-pointer">
                  Segurança & Conformidade
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} MartMarket Global Inc. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-mono uppercase">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              {language} / {currency}
            </span>
            <span>Versão 1.0.0-PROD (PWA Ready)</span>
          </div>
        </div>
      </div>

      {/* Legal Modal Dialog */}
      <Modal
        isOpen={legalModal.isOpen}
        onClose={closeLegalModal}
        title={legalModal.title}
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          {legalModal.type === 'terms' && (
            <>
              <p>
                Bem-vindo à MartMarket. Ao aceder e utilizar os nossos serviços, o utilizador concorda em cumprir integralmente os presentes Termos de Utilização.
              </p>
              <h5 className="font-semibold text-slate-100 text-sm">1. Natureza do Serviço</h5>
              <p>
                A MartMarket fornece uma infraestrutura tecnológica que permite a criadores publicar, comercializar e distribuir produtos digitais, e a compradores adquirir licenças de acesso. A MartMarket atua como intermediária tecnológica e processadora transacional.
              </p>
              <h5 className="font-semibold text-slate-100 text-sm">2. Comissões e Levantamentos</h5>
              <p>
                As taxas da plataforma são deduzidas automaticamente no momento de cada transação concluída. Os saldos ficam disponíveis para levantamento de acordo com o prazo de garantia do produto e podem ser transferidos para contas bancárias verificadas.
              </p>
            </>
          )}

          {legalModal.type === 'privacy' && (
            <>
              <p>
                A sua privacidade e a segurança dos seus dados são compromissos inegociáveis da MartMarket.
              </p>
              <h5 className="font-semibold text-slate-100 text-sm">1. Tratamento de Dados</h5>
              <p>
                Os dados fornecidos no ato de compra (nome, email e telemóvel) são estritamente utilizados para a emissão do comprovativo fiscal, entrega do acesso digital e prevenção contra fraudes.
              </p>
              <h5 className="font-semibold text-slate-100 text-sm">2. Dados Financeiros</h5>
              <p>
                Não armazenamos números completos de cartões de crédito nos nossos servidores. Todas as transações com cartão utilizam tokens seguros através de gateways certificados PCI-DSS.
              </p>
            </>
          )}

          {legalModal.type === 'refund' && (
            <>
              <p>
                A MartMarket garante total transparência e tranquilidade aos compradores.
              </p>
              <h5 className="font-semibold text-slate-100 text-sm">1. Período de Garantia Incondicional</h5>
              <p>
                Todos os produtos possuem garantia mínima obrigatória de 7 a 14 dias (conforme configurado pelo criador). Se o conteúdo não atender às suas expectativas, poderá solicitar o reembolso integral diretamente pelo painel de suporte.
              </p>
              <h5 className="font-semibold text-slate-100 text-sm">2. Processamento do Estorno</h5>
              <p>
                O valor é restituído através do mesmo meio de pagamento utilizado na compra ou creditado diretamente na conta bancária indicada.
              </p>
            </>
          )}

          {legalModal.type === 'status' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="font-semibold">Todos os Sistemas Operacionais</span>
                <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">99.99% Uptime</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Checkout Engine</span>
                  <span className="text-emerald-400 font-medium">Operacional (18ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Gateway Angola (Multicaixa Express / GPO)</span>
                  <span className="text-emerald-400 font-medium">Operacional</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>LMS & Video Streaming</span>
                  <span className="text-emerald-400 font-medium">Operacional</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Ledger Financeiro & Payouts</span>
                  <span className="text-emerald-400 font-medium">Operacional</span>
                </div>
              </div>
            </div>
          )}

          {legalModal.type === 'cookies' && (
            <>
              <p>
                Utilizamos cookies essenciais para manter a sua sessão autenticada, gravar a sua preferência de idioma/moeda e permitir o rastreamento seguro de afiliações sem recolher dados invasivos.
              </p>
            </>
          )}

          {legalModal.type === 'security' && (
            <>
              <p>
                A nossa infraestrutura implementa defesas em camadas com isolamento Row Level Security (RLS) no PostgreSQL, chaves de idempotência para evitar duplicações de cobrança e verificação de integridade transacional.
              </p>
            </>
          )}
        </div>
      </Modal>
    </footer>
  );
};
