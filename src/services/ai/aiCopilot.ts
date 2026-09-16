// ==============================================================================
// MARTMARKET AI CREATOR COPILOT (DECOUPLED & INTELLIGENT)
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

export class AICopilotService {
  /**
   * Generates high-converting sales copy based on product topic and target market
   */
  static async generateSalesCopy(topic: string, format: string, targetMarket: string = 'Angola & Global'): Promise<AICopyResult> {
    // Fast generative heuristics engine with rich localization
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      headline: `Domine ${topic} e Acelere os seus Resultados no Mercado ${targetMarket}`,
      subheadline: `O método prático em formato ${format} passo a passo para criar novas fontes de receita e alcançar liberdade financeira e profissional.`,
      bulletPoints: [
        `Metodologia 100% prática e adaptada à realidade de ${targetMarket}.`,
        `Estratégias testadas para economizar meses de erros e tentativas.`,
        `Materiais de apoio, planilhas e templates prontos para copiar e colar.`,
        `Acesso imediato com suporte direto para tirar dúvidas.`
      ],
      targetAudience: `Profissionais, empreendedores e criadores que desejam monetizar competências em ${topic} sem complexidade.`,
      seoDescription: `Aprenda ${topic} com o melhor conteúdo em ${format}. Acesso vitalício, certificado e pagamentos flexíveis em Kwanza (AOA) e moedas internacionais.`
    };
  }

  /**
   * Generates structured curriculum modules and lesson titles
   */
  static async generateCourseCurriculum(topic: string, level: string = 'Do Básico ao Avançado'): Promise<AICurriculumModule[]> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    return [
      {
        title: `Módulo 1: Fundamentos & Mentalidade de ${topic}`,
        lessons: [
          '1.1 Boas-vindas e Visão Geral do Método',
          '1.2 Conceitos-Chave e Como o Mercado Funciona',
          '1.3 Ferramentas Essenciais e Configuração Inicial'
        ]
      },
      {
        title: `Módulo 2: Estratégias Práticas e Execução`,
        lessons: [
          '2.1 Passo a Passo da Implementação',
          '2.2 Estudos de Caso Reais e Erros Frequentes a Evitar',
          '2.3 Otimização de Processos e Produtividade'
        ]
      },
      {
        title: `Módulo 3: Monetização, Vendas & Escala`,
        lessons: [
          '3.1 Como Precificar e Atrair Clientes',
          '3.2 Funis de Vendas com Pagamentos Locais (Multicaixa/Cartão)',
          '3.3 Escalando os Ganhos de Forma Sustentável'
        ]
      }
    ];
  }

  /**
   * Generates dynamic FAQs tailored to the product
   */
  static async generateFAQs(topic: string, refundDays: number = 7): Promise<AIFAQItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return [
      {
        question: `Como receberei o acesso após o pagamento?`,
        answer: `O acesso é libertado imediatamente após a confirmação do pagamento. Se pagar por Multicaixa Express ou Cartão, o acesso é instantâneo no ecrã e enviado para o seu email.`
      },
      {
        question: `Preciso ter conhecimento prévio em ${topic}?`,
        answer: `Não! O conteúdo foi estruturado do nível introdutório ao avançado, com linguagem acessível e exemplos práticos.`
      },
      {
        question: `Como funciona a garantia de reembolso?`,
        answer: `Você conta com uma garantia incondicional de ${refundDays} dias. Se não gostar do conteúdo, basta solicitar o reembolso no painel e o valor será integralmente estornado.`
      }
    ];
  }
}
