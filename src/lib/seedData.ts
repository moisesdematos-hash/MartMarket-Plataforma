// ==============================================================================
// MARTMARKET INITIAL HIGH-FIDELITY SEED DATA
// ==============================================================================

import { ProductCategory, Product, UserProfile, Coupon, PayoutMethod } from '../types';

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat-business',
    slug: 'business',
    name: {
      pt: 'Negócios & Empreendedorismo',
      en: 'Business & Entrepreneurship',
      fr: 'Affaires & Entrepreneuriat',
      es: 'Negocios & Emprendimiento'
    },
    icon: 'Briefcase',
    sortOrder: 1
  },
  {
    id: 'cat-tech',
    slug: 'tech-dev',
    name: {
      pt: 'Tecnologia & Programação',
      en: 'Tech & Software Development',
      fr: 'Technologie & Développement',
      es: 'Tecnología & Programación'
    },
    icon: 'Code2',
    sortOrder: 2
  },
  {
    id: 'cat-finance',
    slug: 'finance',
    name: {
      pt: 'Finanças & Investimentos',
      en: 'Finance & Investments',
      fr: 'Finance & Investissements',
      es: 'Finanzas & Inversiones'
    },
    icon: 'TrendingUp',
    sortOrder: 3
  },
  {
    id: 'cat-design',
    slug: 'design-creative',
    name: {
      pt: 'Design & Criatividade',
      en: 'Design & Creative Arts',
      fr: 'Design & Création',
      es: 'Diseño & Creatividad'
    },
    icon: 'Palette',
    sortOrder: 4
  },
  {
    id: 'cat-marketing',
    slug: 'marketing',
    name: {
      pt: 'Marketing & Tráfego Pago',
      en: 'Marketing & Paid Traffic',
      fr: 'Marketing & Publicité',
      es: 'Marketing & Tráfico Digital'
    },
    icon: 'Megaphone',
    sortOrder: 5
  },
  {
    id: 'cat-personal-dev',
    slug: 'personal-dev',
    name: {
      pt: 'Desenvolvimento Pessoal & Idiomas',
      en: 'Personal Growth & Languages',
      fr: 'Développement Personnel & Langues',
      es: 'Desarrollo Personal & Idiomas'
    },
    icon: 'Sparkles',
    sortOrder: 6
  }
];

export const INITIAL_CREATORS: UserProfile[] = [
  {
    id: 'usr-creator-1',
    email: 'kelson.manuel@martmarket.com',
    fullName: 'Kelson Manuel',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    phone: '+244 923 881 294',
    country: 'AO',
    language: 'pt',
    currency: 'AOA',
    role: 'CREATOR',
    bio: 'Engenheiro de Software e Empreendedor Digital em Luanda. Fundador de 3 startups de tecnologia.',
    isVerified: true,
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'usr-creator-2',
    email: 'claudia.santos@martmarket.com',
    fullName: 'Cláudia dos Santos',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    phone: '+244 912 455 109',
    country: 'AO',
    language: 'pt',
    currency: 'AOA',
    role: 'CREATOR',
    bio: 'Especialista em Gestão Financeira, Investimentos no Mercado de Capitais (BODIVA) e Planeamento Tributário.',
    isVerified: true,
    createdAt: '2026-02-01T14:30:00Z'
  },
  {
    id: 'usr-creator-3',
    email: 'alex.vance@martmarket.com',
    fullName: 'Alexandre Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    phone: '+351 919 443 200',
    country: 'PT',
    language: 'pt',
    currency: 'EUR',
    role: 'CREATOR',
    bio: 'Senior Product Designer & Design System Architect.',
    isVerified: true,
    createdAt: '2026-02-15T09:00:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-react-fullstack',
    creatorId: 'usr-creator-1',
    creatorName: 'Kelson Manuel',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    title: 'Masterclass Fullstack: De Zero a SaaS Escalável',
    slug: 'masterclass-fullstack-saas',
    shortDescription: 'Aprenda a construir e monetizar aplicações modernas com React, Node, PostgreSQL e pagamentos em Angola e no mundo.',
    description: 'Um programa prático completo para desenvolvedores e fundadores técnicos que desejam construir produtos de software robustos e monetizáveis. Abrange arquitetura limpa, autenticação, pagamentos locais e globais, e deploy automatizado.',
    categoryId: 'cat-tech',
    categorySlug: 'tech-dev',
    productType: 'course',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    isPublished: true,
    defaultPrice: 35000,
    currency: 'AOA',
    refundDays: 7,
    affiliateEnabled: true,
    affiliateCommissionRate: 40,
    affiliateApprovalType: 'instant',
    isSponsored: true,
    bumpEnabled: true,
    bumpTitle: 'Kit Completo de Boilerplates & Arquitetura Starter',
    bumpDescription: 'Receba templates prontos com autenticação, PostgreSQL e banco configurados para economizar 100 horas.',
    bumpPrice: 10000,
    totalSales: 142,
    rating: 4.9,
    reviewCount: 38,
    createdAt: '2026-02-10T12:00:00Z',
    course: {
      id: 'crs-fullstack',
      productId: 'prod-react-fullstack',
      creatorId: 'usr-creator-1',
      title: 'Masterclass Fullstack: De Zero a SaaS Escalável',
      description: 'Formação prática com videoaulas HD, repositórios de código e suporte para dúvidas.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      certificateEnabled: true,
      modules: [
        {
          id: 'mod-1',
          courseId: 'crs-fullstack',
          title: 'Módulo 1: Fundamentos de Arquitetura & Stack Moderna',
          description: 'Visão holística, design de banco de dados e estruturação modular.',
          sortOrder: 1,
          lessons: [
            {
              id: 'les-1-1',
              moduleId: 'mod-1',
              title: '1.1 Boas-vindas e Visão Geral da Arquitetura',
              description: 'Entenda os princípios de engenharia para criar sistemas de alta disponibilidade.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              durationSeconds: 780,
              attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              attachmentName: 'Guia_Arquitetura_SaaS.pdf',
              isFreePreview: true,
              sortOrder: 1
            },
            {
              id: 'les-1-2',
              moduleId: 'mod-1',
              title: '1.2 Modelagem de Dados Relacionais & PostgreSQL',
              description: 'Construindo schemas escaláveis, integridade referencial e RLS.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              durationSeconds: 1140,
              attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              attachmentName: 'Schema_Database_Reference.sql',
              isFreePreview: false,
              sortOrder: 2
            }
          ]
        },
        {
          id: 'mod-2',
          courseId: 'crs-fullstack',
          title: 'Módulo 2: Pagamentos, Webhooks & Ledger Financeiro',
          description: 'Implementando transações atômicas, conciliação e proteção contra duplicidade.',
          sortOrder: 2,
          lessons: [
            {
              id: 'les-2-1',
              moduleId: 'mod-2',
              title: '2.1 Engenharia de Checkout & Idempotência',
              description: 'Garantindo consistência contábil de pagamentos com ledger duplo.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              durationSeconds: 960,
              isFreePreview: false,
              sortOrder: 1
            },
            {
              id: 'les-2-2',
              moduleId: 'mod-2',
              title: '2.2 Webhooks Seguros & Entrega de Acesso',
              description: 'Processamento de eventos assíncronos e liberação imediata ao aluno.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              durationSeconds: 1320,
              isFreePreview: false,
              sortOrder: 2
            }
          ]
        }
      ]
    }
  },
  {
    id: 'prod-guia-financeiro',
    creatorId: 'usr-creator-2',
    creatorName: 'Cláudia dos Santos',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    title: 'Guia Prático de Finanças & Investimentos em Angola (BODIVA & Imobiliário)',
    slug: 'guia-financas-investimentos-angola',
    shortDescription: 'O manual definitivo para proteger seu património, investir com rentabilidade e planejar o seu futuro financeiro.',
    description: 'Um ebook com mais de 240 páginas ricamente ilustradas, acompanhado de planilhas financeiras automatizadas para gestão de orçamento familiar, títulos do tesouro (OT/BT) e investimentos imobiliários.',
    categoryId: 'cat-finance',
    categorySlug: 'finance',
    productType: 'ebook',
    coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    isPublished: true,
    defaultPrice: 18000,
    currency: 'AOA',
    refundDays: 14,
    affiliateEnabled: true,
    affiliateCommissionRate: 50,
    affiliateApprovalType: 'instant',
    bumpEnabled: true,
    bumpTitle: 'Planilha Avançada de Orçamento & Projeção Financeira',
    bumpDescription: 'Modelo automático em Excel e Google Sheets para simular rendimentos de juros compostos.',
    bumpPrice: 4500,
    files: [
      {
        id: 'file-ebook-pdf',
        productId: 'prod-guia-financeiro',
        fileName: 'Guia_Financas_Angola_2026_Completo.pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: 18450000,
        mimeType: 'application/pdf',
        version: '2.4',
        downloadCount: 310,
        createdAt: '2026-02-01T10:00:00Z'
      }
    ],
    totalSales: 285,
    rating: 5.0,
    reviewCount: 74,
    createdAt: '2026-02-01T15:00:00Z'
  },
  {
    id: 'prod-ui-design-system',
    creatorId: 'usr-creator-3',
    creatorName: 'Alexandre Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    title: 'Aurora UI: Design System Profissional para Figma & Tailwind',
    slug: 'aurora-ui-design-system',
    shortDescription: 'Mais de 1.200 componentes acessíveis, tokens semânticos e templates completos para aplicações web modernas.',
    description: 'Kit de UI e Design System com suporte a Figma Auto-layout 5.0, variáveis de temas (Dark/Light), e biblioteca complementar codificada em React e Tailwind CSS pronta para uso em produção.',
    categoryId: 'cat-design',
    categorySlug: 'design-creative',
    productType: 'template',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    isPublished: true,
    defaultPrice: 28000,
    currency: 'AOA',
    refundDays: 7,
    affiliateEnabled: true,
    affiliateCommissionRate: 35,
    affiliateApprovalType: 'instant',
    bumpEnabled: false,
    files: [
      {
        id: 'file-figma-pack',
        productId: 'prod-ui-design-system',
        fileName: 'Aurora_UI_Design_System_v2.fig',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: 45000000,
        mimeType: 'application/octet-stream',
        version: '2.1',
        downloadCount: 89,
        createdAt: '2026-02-18T10:00:00Z'
      }
    ],
    totalSales: 94,
    rating: 4.8,
    reviewCount: 22,
    createdAt: '2026-02-18T14:00:00Z'
  },
  {
    id: 'prod-traffic-marketing',
    creatorId: 'usr-creator-1',
    creatorName: 'Kelson Manuel',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    title: 'Tráfego Pago de Alta Conversão para o Mercado Africano e Lusófono',
    slug: 'trafego-pago-alta-conversao',
    shortDescription: 'Domine Meta Ads, Google Ads e TikTok Ads com estratégias testadas para mercados emergentes.',
    description: 'Aprenda a criar campanhas de alto retorno sobre investimento publicitário (ROAS), esteiras de conversão no WhatsApp e funis de checkout com pagamentos locais.',
    categoryId: 'cat-marketing',
    categorySlug: 'marketing',
    productType: 'course',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    isPublished: true,
    defaultPrice: 25000,
    currency: 'AOA',
    refundDays: 7,
    affiliateEnabled: true,
    affiliateCommissionRate: 50,
    affiliateApprovalType: 'instant',
    bumpEnabled: true,
    bumpTitle: 'Pack de 50 Criativos & Copys Validadas',
    bumpDescription: 'Modelos de anúncios prontos para copiar e colar nas suas campanhas.',
    bumpPrice: 5000,
    totalSales: 168,
    rating: 4.9,
    reviewCount: 45,
    createdAt: '2026-02-25T11:00:00Z',
    course: {
      id: 'crs-traffic',
      productId: 'prod-traffic-marketing',
      creatorId: 'usr-creator-1',
      title: 'Tráfego Pago de Alta Conversão',
      description: 'Estratégias avançadas de compra de mídia e otimização de conversão.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      certificateEnabled: true,
      modules: [
        {
          id: 'mod-tr-1',
          courseId: 'crs-traffic',
          title: 'Módulo 1: Estruturação de Conta & Pixel de Conversão',
          description: 'Configurações técnicas essenciais e rastreamento de eventos.',
          sortOrder: 1,
          lessons: [
            {
              id: 'les-tr-1',
              moduleId: 'mod-tr-1',
              title: '1.1 Configuração de Domínio e API de Conversões',
              description: 'Como evitar perdas de tracking com o novo protocolo de checkout.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
              durationSeconds: 840,
              isFreePreview: true,
              sortOrder: 1
            }
          ]
        }
      ]
    }
  },
  {
    id: 'prod-english-fluency',
    creatorId: 'usr-creator-4',
    creatorName: 'Sarah Jenkins',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
    title: 'Fluência em Inglês (Foco em Entrevistas Internacionais)',
    slug: 'ingles-para-entrevistas',
    shortDescription: 'Método acelerado para passar em entrevistas de tecnologia em inglês.',
    description: 'Um curso focado em pronúncia, vocabulário técnico e simulações de entrevistas para desenvolvedores e designers que querem trabalhar no exterior.',
    categoryId: 'cat-business',
    categorySlug: 'business',
    productType: 'course',
    coverImage: 'https://images.unsplash.com/photo-1546410531-dd4cb39b7d27?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    isPublished: true,
    defaultPrice: 15000,
    currency: 'AOA',
    refundDays: 7,
    affiliateEnabled: true,
    affiliateCommissionRate: 40,
    affiliateApprovalType: 'instant',
    bumpEnabled: false,
    totalSales: 450,
    rating: 4.8,
    reviewCount: 112,
    createdAt: '2026-03-01T10:00:00Z',
    course: {
      id: 'crs-english',
      productId: 'prod-english-fluency',
      creatorId: 'usr-creator-4',
      title: 'Fluência em Inglês',
      description: 'Vídeos práticos e mock interviews.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1546410531-dd4cb39b7d27?auto=format&fit=crop&q=80&w=800',
      certificateEnabled: true,
      modules: []
    }
  },
  {
    id: 'prod-fitness-30days',
    creatorId: 'usr-creator-5',
    creatorName: 'Marco Fit',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    title: 'Desafio 30 Dias: Definição Muscular em Casa',
    slug: 'desafio-30-dias-fitness',
    shortDescription: 'Treinos em casa sem equipamento para queimar gordura.',
    description: 'Vídeos diários de 20 minutos de treino HIIT, combinados com um plano alimentar em PDF focado em ingredientes locais acessíveis em Angola e Brasil.',
    categoryId: 'cat-health',
    categorySlug: 'health',
    productType: 'course',
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    isPublished: true,
    defaultPrice: 12000,
    currency: 'AOA',
    refundDays: 7,
    affiliateEnabled: true,
    affiliateCommissionRate: 60,
    affiliateApprovalType: 'instant',
    bumpEnabled: true,
    bumpTitle: 'E-book Receitas Low Carb Locais',
    bumpDescription: 'Receitas saborosas para potenciar o seu treino.',
    bumpPrice: 3500,
    totalSales: 890,
    rating: 4.7,
    reviewCount: 304,
    createdAt: '2026-03-05T08:00:00Z',
    course: {
      id: 'crs-fitness',
      productId: 'prod-fitness-30days',
      creatorId: 'usr-creator-5',
      title: 'Desafio 30 Dias',
      description: 'Cronograma completo de exercícios.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
      certificateEnabled: false,
      modules: []
    }
  },
  {
    id: 'prod-notion-life',
    creatorId: 'usr-creator-6',
    creatorName: 'Sofia Marques',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    title: 'Notion Life OS: O Seu Segundo Cérebro',
    slug: 'notion-life-os-template',
    shortDescription: 'O template de Notion mais completo para organizar a sua vida, finanças e projetos.',
    description: 'Transforme o Notion num sistema interligado onde os seus hábitos, tarefas diárias, contabilidade e projetos profissionais comunicam entre si. Inclui tutorial em vídeo.',
    categoryId: 'cat-design',
    categorySlug: 'design-creative',
    productType: 'template',
    coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    isPublished: true,
    defaultPrice: 8500,
    currency: 'AOA',
    refundDays: 14,
    affiliateEnabled: true,
    affiliateCommissionRate: 50,
    affiliateApprovalType: 'instant',
    bumpEnabled: false,
    files: [
      {
        id: 'file-notion',
        productId: 'prod-notion-life',
        fileName: 'Link_Notion_Template.txt',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: 1500,
        mimeType: 'text/plain',
        version: '1.0',
        downloadCount: 1500,
        createdAt: '2026-03-10T12:00:00Z'
      }
    ],
    totalSales: 1540,
    rating: 4.9,
    reviewCount: 420,
    createdAt: '2026-03-10T11:00:00Z'
  },
  {
    id: 'prod-crypto-basics',
    creatorId: 'usr-creator-2',
    creatorName: 'Cláudia dos Santos',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    title: 'Criptomoedas do Zero à Primeira Compra',
    slug: 'criptomoedas-do-zero',
    shortDescription: 'Como investir em Bitcoin de forma segura e criar uma carteira descentralizada.',
    description: 'Aprenda os fundamentos da blockchain, como usar exchanges globais (Binance) e como transferir kwanzas para comprar os seus primeiros satoshis. Sem jargões técnicos!',
    categoryId: 'cat-finance',
    categorySlug: 'finance',
    productType: 'course',
    coverImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    isPublished: true,
    defaultPrice: 19500,
    currency: 'AOA',
    refundDays: 7,
    affiliateEnabled: true,
    affiliateCommissionRate: 30,
    affiliateApprovalType: 'instant',
    bumpEnabled: true,
    bumpTitle: 'Masterclass: Análise Gráfica (1h)',
    bumpDescription: 'Aprenda os padrões clássicos de candlestick.',
    bumpPrice: 5000,
    totalSales: 320,
    rating: 4.6,
    reviewCount: 88,
    createdAt: '2026-03-15T09:00:00Z',
    course: {
      id: 'crs-crypto',
      productId: 'prod-crypto-basics',
      creatorId: 'usr-creator-2',
      title: 'Criptomoedas do Zero',
      description: 'Vídeos práticos passo a passo.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800',
      certificateEnabled: true,
      modules: []
    }
  },
  {
    id: 'prod-culinaria-angolana',
    creatorId: 'usr-creator-7',
    creatorName: 'Chef Manuel',
    creatorAvatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400',
    title: 'Sabores de Angola: Receitas Tradicionais Modernizadas',
    slug: 'sabores-de-angola-receitas',
    shortDescription: 'E-book com 50 receitas clássicas angolanas reinventadas com técnicas modernas.',
    description: 'Do Mufete ao Calulu, aprenda a cozinhar como um chef. Fotografias profissionais, tempos de preparo e lista de compras incluída.',
    categoryId: 'cat-health',
    categorySlug: 'health',
    productType: 'ebook',
    coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    isPublished: true,
    defaultPrice: 4500,
    currency: 'AOA',
    refundDays: 7,
    affiliateEnabled: false,
    affiliateCommissionRate: 0,
    affiliateApprovalType: 'instant',
    bumpEnabled: false,
    files: [
      {
        id: 'file-ebook-receitas',
        productId: 'prod-culinaria-angolana',
        fileName: 'Receitas_ChefManuel.pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: 32000000,
        mimeType: 'application/pdf',
        version: '1.0',
        downloadCount: 215,
        createdAt: '2026-03-20T10:00:00Z'
      }
    ],
    totalSales: 215,
    rating: 5.0,
    reviewCount: 95,
    createdAt: '2026-03-20T09:00:00Z'
  },
  {
    id: 'prod-mentoria-carreira',
    creatorId: 'usr-creator-1',
    creatorName: 'Kelson Manuel',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    title: 'Mentoria Elite: Aceleração de Carreira Tech',
    slug: 'mentoria-elite-carreira',
    shortDescription: 'Programa exclusivo de 6 semanas ao vivo para desenvolvedores.',
    description: 'Nesta mentoria, vamos construir um portfólio de alto nível, reescrever o seu CV para os padrões internacionais e criar estratégias para ser contratado remotamente (Ganhar em Dólares).',
    categoryId: 'cat-business',
    categorySlug: 'business',
    productType: 'community',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    bannerImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    isPublished: true,
    defaultPrice: 55000,
    currency: 'AOA',
    refundDays: 0,
    affiliateEnabled: false,
    affiliateCommissionRate: 0,
    affiliateApprovalType: 'instant',
    bumpEnabled: false,
    totalSales: 42,
    rating: 5.0,
    reviewCount: 12,
    createdAt: '2026-03-25T14:00:00Z'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-martvip',
    creatorId: 'usr-creator-1',
    code: 'MARTVIP20',
    discountType: 'percentage',
    discountValue: 20,
    maxUses: 500,
    currentUses: 34,
    minOrderAmount: 10000,
    isActive: true
  },
  {
    id: 'coup-angola10',
    creatorId: 'usr-creator-2',
    code: 'ANGOLA10',
    discountType: 'percentage',
    discountValue: 10,
    maxUses: 1000,
    currentUses: 112,
    minOrderAmount: 5000,
    isActive: true
  }
];

export const INITIAL_PAYOUT_METHODS: PayoutMethod[] = [
  {
    id: 'paym-1',
    userId: 'usr-creator-1',
    methodType: 'angola_iban',
    bankName: 'Banco Angolano de Investimentos (BAI)',
    accountHolder: 'Kelson Manuel',
    ibanOrAccount: 'AO06 0040 0000 1234 5678 9012 3',
    swiftBic: 'BAIAAO22',
    isDefault: true,
    isVerified: true,
    createdAt: '2026-01-15T12:00:00Z'
  }
];
