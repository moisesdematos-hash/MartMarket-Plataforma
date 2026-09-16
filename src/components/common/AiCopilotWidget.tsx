import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MinusCircle, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiCopilotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: 'Olá! Sou o **Marty**, a Inteligência Artificial do MartMarket. Conheço cada funcionalidade desta plataforma (Cursos, Afiliados, Pagamentos, Funis). Como posso ajudar o seu negócio hoje?',
      timestamp: new Date().toISOString(),
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    const handleOpenCopilot = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-ai-copilot', handleOpenCopilot);
    return () => window.removeEventListener('open-ai-copilot', handleOpenCopilot);
  }, []);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate AI typing and response
    setTimeout(() => {
      let aiResponse = "Desculpe, não compreendi. Poderia reformular?";
      const lowerInput = newMsg.content.toLowerCase();
      
      if (lowerInput.includes('criar') && lowerInput.includes('produto')) {
        aiResponse = "Para **criar um produto**, vá ao menu do topo e clique em **Criador**. Depois, clique no botão azul **+ Novo Produto**. Pode criar cursos, E-books, templates e muito mais!";
      } else if (lowerInput.includes('afiliad') || lowerInput.includes('vender produto dos outros')) {
        aiResponse = "Temos uma **Central de Afiliados**! Vá ao menu do topo e clique em **Afiliados**. Lá poderá encontrar produtos com comissões fantásticas e solicitar afiliação com 1 clique.";
      } else if (lowerInput.includes('suporte') || lowerInput.includes('chat')) {
        aiResponse = "O Chat de Suporte está disponível em dois lugares: na **Área de Membros** (aba Suporte) para os alunos enviarem mensagens, e no **Painel do Criador** (aba Chat de Suporte) para o produtor responder.";
      } else if (lowerInput.includes('dinheiro') || lowerInput.includes('levantamento') || lowerInput.includes('sacar')) {
        aiResponse = "Os seus ganhos vão diretos para o seu *Ledger*! Para levantar, vá à aba **Carteira** (Wallet) no menu superior, adicione o seu IBAN/Conta Bancária Angolana e clique em Levantar Kz.";
      } else if (lowerInput.includes('upsell') || lowerInput.includes('funil') || lowerInput.includes('bump')) {
        aiResponse = "O MartMarket tem ferramentas avançadas! Pode configurar **Order Bumps** ao criar o produto (Etapa 3), ou aceder ao construtor de **Upsell de 1-Clique** na aba 'Upsell de 1-Clique' dentro do Painel do Criador.";
      } else if (lowerInput.includes('comunidade') || lowerInput.includes('skool') || lowerInput.includes('kajabi')) {
        aiResponse = "Sim! Temos uma **Comunidade Standalone VIP** integrada (semelhante ao Skool/Kajabi). Pode vender o acesso através de Assinaturas Mensais, incluir Leaderboards e marcar Meetups. Está na Área de Membros.";
      } else if (lowerInput.includes('claro') || lowerInput.includes('white')) {
        aiResponse = "O MartMarket não possui modo claro. A plataforma foi desenhada nativamente num **Premium Dark Mode** para focar a conversão e transmitir uma estética luxuosa, semelhante às melhores plataformas do mundo (Vercel, Stripe).";
      } else {
        aiResponse = "Como IA de simulação do MartMarket, conheço perfeitamente a plataforma. Pode perguntar-me sobre **Criação de Produtos, Pagamentos, Afiliados, Comunidade, Suporte** ou **Funis de Vendas**.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        }
      ]);
    }, 800);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 z-[99999] p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-500/50 transition-all hover:scale-110 flex items-center justify-center group border-2 border-blue-400"
      >
        <Sparkles className="w-7 h-7 absolute animate-ping opacity-30 text-emerald-400" />
        <Bot className="w-7 h-7 relative z-10" />
      </button>
    );
  }

  return (
    <div className={`fixed right-6 z-[99999] flex flex-col transition-all duration-300 ${isMinimized ? 'bottom-6 w-72 h-14' : 'bottom-6 w-80 sm:w-96 h-[500px] max-h-[80vh]'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 rounded-t-2xl border border-slate-700 shadow-xl cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-800"></span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-white leading-tight">Marty AI</h4>
            <p className="text-[10px] text-blue-400">Assistente do MartMarket</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col bg-slate-900 border-x border-b border-slate-700 rounded-b-2xl shadow-2xl overflow-hidden">
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm'
                }`}>
                  {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className={msg.role === 'user' ? 'text-white' : 'text-blue-400'}>{part}</strong> : part)}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 mx-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pergunte-me algo..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
