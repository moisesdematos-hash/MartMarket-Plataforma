// ==============================================================================
// MARTMARKET WEBHOOKS & EXTERNAL AUTOMATIONS GATEWAY
// Manage event subscriptions (Zapier, Make, custom HTTP servers), HMAC SHA-256
// signature secrets, and real-time payload delivery testing simulator.
// ==============================================================================

import React, { useState } from 'react';
import { Webhook, Plus, Play, CheckCircle2, Copy, RefreshCw, Key, Shield, Code, Send, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNotification } from '../../context/NotificationContext';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  status: 'ACTIVE' | 'PAUSED';
  lastDeliveryStatus: 200 | 400 | 500;
  totalDeliveries: number;
}

export const WebhookManager: React.FC = () => {
  const { showToast } = useNotification();

  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([
    {
      id: 'wh-1',
      name: 'Zapier - Notificação de Vendas WhatsApp',
      url: 'https://hooks.zapier.com/hooks/catch/198282/3847291',
      secret: 'whsec_8f9a2b7c4d1e0f3a6b5c8d7e4f1a2b3c',
      events: ['order.paid', 'cart.abandoned'],
      status: 'ACTIVE',
      lastDeliveryStatus: 200,
      totalDeliveries: 412
    },
    {
      id: 'wh-2',
      name: 'Make.com - Liberação de Área de Membros Externa',
      url: 'https://hook.eu1.make.com/a98x273b4c10z98m12k4',
      secret: 'whsec_3c2b1a4f7e8d5c6b3a0f1d4c7b2a9f8e',
      events: ['order.paid', 'subscription.renewed'],
      status: 'ACTIVE',
      lastDeliveryStatus: 200,
      totalDeliveries: 189
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['order.paid']);

  // Testing modal / drawer
  const [testingPayload, setTestingPayload] = useState<any | null>(null);
  const [isSimulatingSend, setIsSimulatingSend] = useState(false);

  const availableEvents = [
    { key: 'order.paid', label: 'Venda Aprovada (order.paid)' },
    { key: 'order.refunded', label: 'Reembolso Efetuado (order.refunded)' },
    { key: 'cart.abandoned', label: 'Carrinho Abandonado (cart.abandoned)' },
    { key: 'subscription.renewed', label: 'Assinatura Renovada (subscription.renewed)' },
    { key: 'subscription.canceled', label: 'Assinatura Cancelada (subscription.canceled)' },
    { key: 'quiz.passed', label: 'Aluno Aprovado no Quiz (quiz.passed)' }
  ];

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim() || selectedEvents.length === 0) {
      showToast('error', 'Preencha todos os campos e selecione ao menos 1 evento.');
      return;
    }

    const newEndpoint: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      name,
      url,
      secret: `whsec_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      events: selectedEvents,
      status: 'ACTIVE',
      lastDeliveryStatus: 200,
      totalDeliveries: 0
    };

    setEndpoints(prev => [...prev, newEndpoint]);
    setIsAdding(false);
    setName('');
    setUrl('');
    showToast('success', 'Webhook configurado e assinado via HMAC SHA-256!');
  };

  const handleTestEndpoint = (endpoint: WebhookEndpoint) => {
    setIsSimulatingSend(true);
    const mockPayload = {
      event: endpoint.events[0] || 'order.paid',
      timestamp: new Date().toISOString(),
      data: {
        orderId: `ord-test-${Math.floor(Math.random() * 90000 + 10000)}`,
        product: {
          id: 'prod-react-fullstack',
          title: 'Masterclass Fullstack: De Zero a SaaS Escalável'
        },
        buyer: {
          name: 'Kelson Manuel',
          email: 'kelson.dev@martmarket.com',
          phone: '+244923456789'
        },
        amountAOA: 75000,
        currency: 'AOA',
        paymentMethod: 'MULTICAIXA_EXPRESS',
        status: 'PAID'
      }
    };

    setTimeout(() => {
      setTestingPayload({
        endpoint,
        payload: mockPayload,
        signature: `t=${Math.floor(Date.now() / 1000)},v1=${endpoint.secret.slice(6, 22)}...`
      });
      setIsSimulatingSend(false);
      showToast('success', 'Evento de teste disparado com status HTTP 200 OK!');
    }, 600);
  };

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    showToast('success', 'Segredo HMAC copiado!');
  };

  const handleDelete = (id: string) => {
    setEndpoints(prev => prev.filter(e => e.id !== id));
    showToast('info', 'Endpoint de Webhook removido.');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<Webhook className="w-3.5 h-3.5" />}>
            Gateway de Automações & Webhooks
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Webhooks em Tempo Real
          </h2>
          <p className="text-xs text-slate-400">
            Conecte suas vendas e eventos a qualquer ferramenta externa (Zapier, Make, n8n, CRM, ERPs) com assinatura criptográfica HMAC.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Novo Webhook
        </Button>
      </div>

      {/* Add Webhook Form */}
      {isAdding && (
        <form onSubmit={handleCreateWebhook} className="p-6 rounded-2xl bg-slate-900 border border-blue-500/40 space-y-4 animate-fade-in shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-400" /> Adicionar Novo Endpoint de Destino
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nome de Identificação</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Disparo WhatsApp Zapier"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">URL de Destino (HTTPS Endpoint)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://sua-api.com/webhook"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">Eventos Assinados para Disparo:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableEvents.map(evt => {
                const isChecked = selectedEvents.includes(evt.key);
                return (
                  <label
                    key={evt.key}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEvents(prev => [...prev, evt.key]);
                        } else {
                          setSelectedEvents(prev => prev.filter(k => k !== evt.key));
                        }
                      }}
                      className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="font-mono text-[11px]">{evt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Criar Endpoint & Gerar Segredo
            </Button>
          </div>
        </form>
      )}

      {/* Webhook Endpoints List */}
      <div className="space-y-4">
        {endpoints.map((ep) => (
          <div key={ep.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{ep.name}</h4>
                  <Badge variant="success" size="sm">
                    HTTP {ep.lastDeliveryStatus} OK
                  </Badge>
                </div>
                <p className="text-xs font-mono text-slate-400 truncate max-w-lg mt-0.5">
                  {ep.url}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestEndpoint(ep)}
                  disabled={isSimulatingSend}
                  leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400" />}
                >
                  Testar Envio
                </Button>
                <button
                  onClick={() => handleDelete(ep.id)}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Excluir Webhook"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Secret & Events Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                  <Key className="w-3 h-3 text-amber-400" /> HMAC Secret:
                </span>
                <span className="font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                  {ep.secret.slice(0, 14)}•••••••••••••
                </span>
                <button
                  onClick={() => handleCopySecret(ep.secret)}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Copiar Chave Secreta"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {ep.events.map(ev => (
                  <span key={ev} className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 text-[10px] font-mono">
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Testing Payload Inspector Modal */}
      {testingPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white">
                  Payload JSON Enviado com Sucesso (HTTP 200 OK)
                </h3>
              </div>
              <button
                onClick={() => setTestingPayload(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1 font-mono text-xs">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-bold">X-MartMarket-Signature:</span> {testingPayload.signature}
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                {JSON.stringify(testingPayload.payload, null, 2)}
              </pre>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setTestingPayload(null)}
              >
                Fechar Inspecionador
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
