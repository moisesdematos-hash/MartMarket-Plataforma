// ==============================================================================
// MARTMARKET AI CREATOR COPILOT MODAL
// ==============================================================================

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Wand2, BookOpen, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import { AICopilotService, AICopyResult, AICurriculumModule, AIFAQItem } from '../../services/ai/aiCopilot';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNotification } from '../../context/NotificationContext';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCopy?: (copy: AICopyResult) => void;
  onApplyCurriculum?: (modules: AICurriculumModule[]) => void;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({
  isOpen,
  onClose,
  onApplyCopy,
  onApplyCurriculum
}) => {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState<'copy' | 'curriculum' | 'faq'>('copy');
  
  // Generator form inputs
  const [topic, setTopic] = useState('Tráfego Pago & Vendas no WhatsApp');
  const [format, setFormat] = useState('Curso em Videoaulas');
  const [market, setMarket] = useState('Angola & Internacional');
  const [isLoading, setIsLoading] = useState(false);

  // Generated results
  const [copyResult, setCopyResult] = useState<AICopyResult | null>(null);
  const [curriculumResult, setCurriculumResult] = useState<AICurriculumModule[] | null>(null);
  const [faqResult, setFaqResult] = useState<AIFAQItem[] | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('info', 'Texto copiado para a área de transferência!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = async () => {
    if (!topic) {
      showToast('error', 'Por favor indique o tema do produto.');
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === 'copy') {
        const res = await AICopilotService.generateSalesCopy(topic, format, market);
        setCopyResult(res);
      } else if (activeTab === 'curriculum') {
        const res = await AICopilotService.generateCourseCurriculum(topic);
        setCurriculumResult(res);
      } else {
        const res = await AICopilotService.generateFAQs(topic);
        setFaqResult(res);
      }
      showToast('success', 'Conteúdo gerado com sucesso pela IA!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="MartMarket AI Creator Copilot"
      maxWidth="3xl"
    >
      <div className="space-y-6 text-xs text-slate-300">
        
        {/* Top Feature Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-950 to-purple-900/30 border border-blue-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100">Assistente Inteligente de Conteúdo</div>
              <div className="text-[11px] text-slate-400">Gere headlines, argumentos de venda e ementas completas em segundos.</div>
            </div>
          </div>
          <Badge variant="primary" size="sm">IA Integrada</Badge>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'copy', label: 'Copy & Pitch de Vendas', icon: FileText },
            { id: 'curriculum', label: 'Ementa de Curso & Aulas', icon: BookOpen },
            { id: 'faq', label: 'Perguntas Frequentes (FAQ)', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Generator Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="sm:col-span-1">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tema / Nicho *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Finanças Pessoais"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Formato</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="Curso em Videoaulas">Curso em Videoaulas</option>
              <option value="Ebook Digital (PDF)">Ebook Digital (PDF)</option>
              <option value="Template / Ferramenta">Template / Ferramenta</option>
              <option value="Mentoria & Acompanhamento">Mentoria & Acompanhamento</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerate}
              isLoading={isLoading}
              leftIcon={<Wand2 className="w-4 h-4" />}
              className="w-full"
            >
              Gerar com IA
            </Button>
          </div>
        </div>

        {/* Results Viewer */}
        {activeTab === 'copy' && copyResult && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-100">Resultado da Copy de Vendas</span>
              {onApplyCopy && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    onApplyCopy(copyResult);
                    onClose();
                  }}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Inserir no Produto
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Headline de Alto Impacto</div>
                <div className="text-sm font-bold text-white mt-0.5">{copyResult.headline}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Subheadline / Promessa</div>
                <p className="text-slate-300 mt-0.5">{copyResult.subheadline}</p>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Pontos Fortes (Bullets)</div>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-300">
                  {copyResult.bulletPoints.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Descrição SEO</div>
                <p className="text-slate-400 mt-0.5">{copyResult.seoDescription}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && curriculumResult && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-100">Grade Curricular Sugerida</span>
              {onApplyCurriculum && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    onApplyCurriculum(curriculumResult);
                    onClose();
                  }}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Aplicar ao Curso
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {curriculumResult.map((mod, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-xs text-blue-400 mb-1">{mod.title}</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-300">
                    {mod.lessons.map((l, lIdx) => (
                      <li key={lIdx}>{l}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && faqResult && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-fade-in">
            <div className="font-bold text-slate-100 pb-2 border-b border-slate-800">Perguntas Frequentes Geradas</div>
            {faqResult.map((faq, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-slate-200">{faq.question}</div>
                <p className="text-slate-400 text-[11px]">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
