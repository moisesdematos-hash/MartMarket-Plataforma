// ==============================================================================
// MARTMARKET AI STUDENT TUTOR & LMS LEARNING COPILOT
// Interactive in-player AI assistant that explains lesson concepts, answers questions,
// and creates practice exercises based on the current lecture.
// ==============================================================================

import React, { useState } from 'react';
import { Bot, Sparkles, Send, BookOpen, Lightbulb, CheckCircle2, User, RefreshCw, Zap } from 'lucide-react';
import { Button } from '../common/Button';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AIStudentTutorProps {
  lessonTitle: string;
  moduleTitle: string;
}

export const AIStudentTutor: React.FC<AIStudentTutorProps> = ({
  lessonTitle,
  moduleTitle
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Olá! Sou o seu **Tutor de IA da MartMarket** para a aula **"${lessonTitle}"** do módulo *${moduleTitle}*.\n\nComo posso ajudar você a dominar o conteúdo de hoje? Você pode tirar dúvidas conceituais, pedir exemplos práticos ou solicitar um resumo rápido dos pontos-chave!`,
      timestamp: 'Agora'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    '📌 Resumir pontos-chave desta aula',
    '💡 Explicar arquitetura na prática',
    '⚡ Como aplicar em produção?',
    '🎯 Criar um mini-desafio de código'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // AI Simulation with tailored responses based on lecture context
    setTimeout(() => {
      let responseText = '';
      const lower = query.toLowerCase();

      if (lower.includes('resumir') || lower.includes('pontos-chave') || lower.includes('resumo')) {
        responseText = `### 📋 Resumo Executivo da Aula: "${lessonTitle}"\n\n1. **Conceito Central**: Implementação robusta de microsserviços e isolamento de dependências.\n2. **Boas Práticas**: Validação estrita de contratos de API via schemas tipados (TypeScript + Zod).\n3. **Padrão de Resiliência**: Implementação de *Circuit Breaker* e *Exponential Backoff* para garantir alta disponibilidade mesmo em cenários de instabilidade na rede.\n4. **Próximo Passo**: Testar as rotas utilizando o sandbox de integração disponibilizado na aba de anexos.`;
      } else if (lower.includes('arquitetura') || lower.includes('prática')) {
        responseText = `### 🏛️ Aplicação Prática na Arquitetura\n\nAo estruturar sua aplicação para escalar para milhares de requisições simultâneas:\n- Separe as camadas de **Domínio**, **Aplicação** e **Infraestrutura** (Clean Architecture).\n- Mantenha o estado global desacoplado da renderização através de Context Providers modulares ou Zustand.\n- Garanta que operações financeiras utilizem **Double-Entry Ledger** (como no MartMarket) para que nenhum saldo fique inconsistente.`;
      } else if (lower.includes('desafio') || lower.includes('código')) {
        responseText = `### 🎯 Mini-Desafio Prático de Fixação\n\n**Desafio**: Crie um middleware de validação que intercepte requisições de pagamento e valide se o montante (\`amount\`) é maior que 0 e se a moeda (\`currency\`) é suportada (\`AOA\`, \`USD\`, \`EUR\`, \`BRL\`).\n\n**Dica**: Use enums TypeScript para tipar estritamente as moedas e retorne um erro HTTP 422 com payload JSON estruturado caso a validação falhe.`;
      } else {
        responseText = `Excelente pergunta sobre **"${lessonTitle}"**!\n\nNo contexto desta lição, o ponto crítico a observar é que a separação clara de responsabilidades reduz em mais de 70% o acoplamento de código. Quando você integra serviços externos (como gateways de pagamento locais como Multicaixa Express e GPO), deve sempre encapsular a chamada dentro de um **Adapter Pattern**, garantindo que seu core de negócio permaneça imutável mesmo se o provedor mudar.\n\nDeseja que eu aprofunde algum exemplo em código?`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="flex flex-col h-[520px] bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Header */}
      <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              Tutor de IA do Aluno
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                LMS Copilot
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
              Contexto: {lessonTitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'msg-reset',
                sender: 'ai',
                text: `Sessão reiniciada! Como posso ajudar você a aprofundar seu aprendizado nesta aula?`,
                timestamp: 'Agora'
              }
            ]);
          }}
          title="Limpar conversa"
          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded bg-purple-600/30 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700/60'
              }`}
            >
              <div className="whitespace-pre-line prose-invert font-sans">
                {msg.text}
              </div>
              <div
                className={`text-[9px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-purple-400 pl-8">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span className="text-[11px] text-slate-400">Tutor de IA analisando conteúdo da aula...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-900/40 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 border border-slate-700/50 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pergunte qualquer dúvida sobre a aula..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputText.trim() || isTyping}
          className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-500 hover:!to-blue-500"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
};
