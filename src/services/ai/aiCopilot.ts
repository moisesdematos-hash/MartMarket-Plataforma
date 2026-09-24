import { supabase } from '../../lib/supabase';

// ==============================================================================
// MARTMARKET AI CREATOR COPILOT (POWERED BY GROQ & LLAMA 3)
// ==============================================================================

export interface AICopyResult {
  headline: string;
  subheadline: string;
  bulletPoints: string[];
  targetAudience: string;
  seoDescription: string;
}

export interface AICurriculumModule {
  title: string;
  lessons: string[];
}

export interface AIFAQItem {
  question: string;
  answer: string;
}

const callGroqAPI = async (systemPrompt: string, userPrompt: string) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API Key (VITE_GROQ_API_KEY) não está definida.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Groq API Error:', errorData);
    throw new Error(errorData.error?.message || 'Falha na comunicação com a API de IA');
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

export class AICopilotService {
  /**
   * Generates high-converting sales copy based on product topic and target market
   */
  static async generateSalesCopy(topic: string, format: string, targetMarket: string = 'Angola & Global'): Promise<AICopyResult> {
    const systemPrompt = `És um especialista em Copywriting de classe mundial para a plataforma MartMarket (tipo Hotmart). O teu objetivo é vender info-produtos. Retorna OBRIGATORIAMENTE um objeto JSON estrito com esta exata estrutura:
{
  "headline": "Título ultra persuasivo de alto impacto",
  "subheadline": "Subtítulo explicando o benefício principal (1-2 frases)",
  "bulletPoints": ["Benefício forte 1", "Benefício forte 2", "Benefício forte 3", "Benefício forte 4"],
  "targetAudience": "Público alvo e a sua principal dor resolvida (1 frase)",
  "seoDescription": "Descrição rica em palavras-chave para SEO (max 160 caracteres)"
}
A língua DEVE ser Português (PT-PT).`;

    const userPrompt = `Cria uma copy focada em vendas agressivas mas autênticas para um produto digital.\nTema: "${topic}"\nFormato: "${format}"\nMercado: "${targetMarket}".`;

    return await callGroqAPI(systemPrompt, userPrompt);
  }

  /**
   * Generates structured curriculum modules and lesson titles
   */
  static async generateCourseCurriculum(topic: string, level: string = 'Do Básico ao Avançado'): Promise<AICurriculumModule[]> {
    const systemPrompt = `És um designer instrucional e criador de cursos profissionais. Retorna OBRIGATORIAMENTE um objeto JSON estrito com a estrutura:
{
  "modules": [
    {
      "title": "Nome do Módulo 1 (ex: Módulo 1: Fundamentos)",
      "lessons": ["Nome da Lição 1.1", "Nome da Lição 1.2"]
    }
  ]
}
Gera 3 a 4 módulos, cada um com 3 a 5 lições focadas na prática. Língua: Português (PT-PT).`;

    const userPrompt = `Cria um currículo de aulas detalhado e sequencial para um curso cujo tema é "${topic}". O nível de ensino é "${level}".`;

    const result = await callGroqAPI(systemPrompt, userPrompt);
    return result.modules;
  }

  /**
   * Generates dynamic FAQs tailored to the product
   */
  static async generateFAQs(topic: string, refundDays: number = 7): Promise<AIFAQItem[]> {
    const systemPrompt = `És um assistente de suporte ao cliente especializado em reduzir hesitações de compra. Retorna OBRIGATORIAMENTE um objeto JSON com:
{
  "faqs": [
    { "question": "Pergunta comum do cliente?", "answer": "Resposta reconfortante" }
  ]
}
Gera 3 a 5 FAQs comuns. Língua: Português (PT-PT).`;

    const userPrompt = `Gera as Perguntas Frequentes (FAQ) de pré-compra para um produto sobre "${topic}". Lembra-te que a plataforma (MartMarket) tem garantia de reembolso incondicional de ${refundDays} dias, pagamento instantâneo por Multicaixa ou Cartão, e acesso imediato.`;

    const result = await callGroqAPI(systemPrompt, userPrompt);
    return result.faqs;
  }

  /**
   * Generates an automatic response to a student support ticket
   */
  static async generateSupportReply(ticketSubject: string, productTitle: string, lastStudentMessage: string, creatorName: string): Promise<string> {
    const systemPrompt = `És o criador "${creatorName}" do produto "${productTitle}". Estás a responder de forma gentil e muito prestativa ao ticket de suporte com o assunto "${ticketSubject}". Retorna OBRIGATORIAMENTE um JSON com:
{
  "reply": "O texto da tua resposta natural e humanizada (max 3 frases)."
}
A língua é Português (PT-PT).`;

    const userPrompt = `A última mensagem do aluno foi: "${lastStudentMessage}". Gera uma resposta de ajuda.`;

    const result = await callGroqAPI(systemPrompt, userPrompt);
    return result.reply;
  }

  /**
   * Generates a conversational reply for the Marty AI floating widget
   */
  static async chatWithMarty(userMessage: string, chatHistory: {role: string, content: string}[]): Promise<string> {
    const systemPrompt = `És o 'Marty AI', o assistente virtual oficial e super inteligente do MartMarket.
O MartMarket é uma plataforma angolana de venda de produtos digitais (cursos, ebooks, templates), com Checkout próprio, Multicaixa Express, Cartão Visa/Mastercard, Order Bumps, Upsells de 1-clique, Sistema de Afiliados, e Comunidades VIP.
Deves ajudar os utilizadores que estão a navegar no site (potenciais criadores ou alunos) com as suas dúvidas.
Sê conciso, simpático e usa formatação markdown (como **negrito**).
Responde sempre em Português (PT-PT).
Retorna OBRIGATORIAMENTE um JSON com esta exata estrutura:
{
  "reply": "O teu texto formatado em markdown"
}`;

    const recentHistory = chatHistory.slice(-5).map(m => `${m.role === 'user' ? 'Utilizador' : 'Marty'}: ${m.content}`).join('\n');
    
    const userPrompt = `Histórico da conversa:\n${recentHistory}\n\nMensagem atual do utilizador:\n${userMessage}\n\nGera a tua resposta em JSON.`;

    const result = await callGroqAPI(systemPrompt, userPrompt);
    return result.reply;
  }
}
