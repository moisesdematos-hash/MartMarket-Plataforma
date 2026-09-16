// ==============================================================================
// MARTMARKET ENTERPRISE DOCUMENTATION & DEVELOPER API
// ==============================================================================

import React, { useState } from 'react';
import { 
  FileText, 
  Code2, 
  Sparkles, 
  Users, 
  Wallet, 
  CreditCard, 
  Terminal, 
  Check, 
  Copy,
  BookOpen
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'getting-started' | 'creators' | 'affiliates' | 'payments' | 'api'>('getting-started');
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('https://api.martmarket.com/v1/webhooks');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <Badge variant="primary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
          Central de Documentação & Guias
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Documentação MartMarket
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Tudo o que você precisa saber para criar produtos, vender com checkout rápido, afiliar-se e integrar webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
            {[
              { id: 'getting-started', label: 'Primeiros Passos', icon: Sparkles },
              { id: 'creators', label: 'Guia do Criador', icon: FileText },
              { id: 'affiliates', label: 'Guia de Afiliados', icon: Users },
              { id: 'payments', label: 'Pagamentos & Angola AOA', icon: CreditCard },
              { id: 'api', label: 'API & Webhooks', icon: Code2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                    activeSection === tab.id
                      ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-xl">
          
          {activeSection === 'getting-started' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Bem-vindo à MartMarket</h2>
              <p>
                A MartMarket é a primeira plataforma verdadeiramente internacional com infraestrutura de ponta e suporte nativo ao mercado angolano (Kwanza AOA, Multicaixa Express, Referências GPO, Unitel Money) e mercados globais.
              </p>
              <h3 className="text-base font-bold text-slate-100 pt-2">Ciclo de Vendas em 4 Etapas</h3>
              <ol className="list-decimal pl-5 space-y-2 text-slate-400 text-xs">
                <li><strong className="text-slate-200">Cadastro da Conta:</strong> Crie a sua conta gratuita em menos de 2 minutos.</li>
                <li><strong className="text-slate-200">Publicação do Produto:</strong> Utilize o assistente de 9 passos para cadastrar o seu curso ou ebook.</li>
                <li><strong className="text-slate-200">Venda no Checkout:</strong> Compartilhe o seu link com pagamentos locais e internacionais.</li>
                <li><strong className="text-slate-200">Levantamento Bancário:</strong> Transfira para qualquer IBAN bancário em Angola ou no exterior.</li>
              </ol>
            </div>
          )}

          {activeSection === 'creators' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Guia do Criador de Conteúdo</h2>
              <p>
                A plataforma disponibiliza uma área de membros de alto nível para cursos com streaming de vídeo, módulo por módulo, anexos e emissão automática de certificados.
              </p>
              <h3 className="text-base font-bold text-slate-100">Recursos de Conversão</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-400 text-xs">
                <li><strong className="text-slate-200">Order Bumps:</strong> Adicione materiais complementares na página de pagamento com 1 clique.</li>
                <li><strong className="text-slate-200">Cupões de Desconto:</strong> Crie códigos promocionais com limite de usos e validade.</li>
                <li><strong className="text-slate-200">Proteção de Arquivos:</strong> Ebooks e downloads são servidos com URLs criptografadas.</li>
              </ul>
            </div>
          )}

          {activeSection === 'affiliates' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Guia de Afiliados & Promotores</h2>
              <p>
                O nosso motor de afiliação garante rastreamento de cliques com cookies protegidos contra perda de atribuição.
              </p>
              <p>
                Sempre que um comprador realiza uma compra através do seu link exclusivo, a sua comissão é calculada instantaneamente e registrada no seu livro contábil imutável.
              </p>
            </div>
          )}

          {activeSection === 'payments' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Infraestrutura de Pagamentos & Angola</h2>
              <p>
                A MartMarket não depende do Stripe. Criamos uma camada de abstração com múltiplos adaptadores regionais:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-slate-100">Multicaixa Express</div>
                  <div className="text-slate-400 mt-0.5">Notificação push no telemóvel do comprador.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-slate-100">Referência Bancária (GPO)</div>
                  <div className="text-slate-400 mt-0.5">Entidade e referência para pagamento no ATM/Internet Banking.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-slate-100">Unitel Money</div>
                  <div className="text-slate-400 mt-0.5">Carteira móvel via USSD e aplicativo.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-slate-100">Cartões Globais</div>
                  <div className="text-slate-400 mt-0.5">Processamento internacional multimoeda.</div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Webhooks & API REST</h2>
              <p>
                Receba notificações em tempo real no seu servidor para cada evento de venda, reembolso ou liquidação.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
                  <span>Exemplo de Payload Webhook (order.completed)</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 cursor-pointer text-[11px]"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar URL</span>
                  </button>
                </div>
                <pre className="text-emerald-400 overflow-x-auto p-2">
{`{
  "event": "payment.completed",
  "order_id": "ord_89214",
  "order_number": "MM-89214",
  "product_id": "prod-react-fullstack",
  "buyer": {
    "name": "António Silva",
    "email": "antonio.silva@gmail.com",
    "phone": "+244923111222"
  },
  "financials": {
    "amount": 35000.00,
    "currency": "AOA",
    "platform_fee": 2765.00,
    "creator_net": 32235.00
  },
  "payment_method": "multicaixa_express",
  "timestamp": "2026-09-16T15:30:00Z"
}`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
