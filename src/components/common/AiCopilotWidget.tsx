import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MinusCircle, Maximize2, Loader2 } from 'lucide-react';
import { AICopilotService } from '../../services/ai/aiCopilot';

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
  const [isTyping, setIsTyping] = useState(false);
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
  }, [messages, isOpen, isMinimized, isTyping]);

  useEffect(() => {
    const handleOpenCopilot = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-ai-copilot', handleOpenCopilot);
    return () => window.removeEventListener('open-ai-copilot', handleOpenCopilot);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, newMsg];
    setMessages(newHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const historyPayload = newHistory.map(m => ({ role: m.role, content: m.content }));
      const aiReply = await AICopilotService.chatWithMarty(userText, historyPayload);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: aiReply,
          timestamp: new Date().toISOString(),
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Oops! Houve uma falha de comunicação com os meus servidores da Groq. Tente novamente.",
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
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
            
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="max-w-[85%] px-4 py-3 bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl rounded-bl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-xs text-slate-400">A processar...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
              placeholder="Pergunte-me algo..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
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
