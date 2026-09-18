// ==============================================================================
// MARTMARKET MARKETPLACE & CORE DATA CONTEXT
// ==============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  ProductCategory, 
  Order, 
  Coupon, 
  UserWallet, 
  LedgerEntry, 
  PayoutMethod, 
  WithdrawalRequest, 
  AffiliateLink,
  ProductReview,
  LessonProgress,
  SupportedCurrency
} from '../types';
import { supabase } from '../lib/supabase';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_COUPONS, 
  INITIAL_PAYOUT_METHODS 
} from '../lib/seedData';
import { PaymentEngine } from '../services/payment/PaymentEngine';
import { PaymentInitiationResult } from '../services/payment/PaymentProvider';

interface MarketplaceContextType {
  products: Product[];
  categories: ProductCategory[];
  orders: Order[];
  coupons: Coupon[];
  wallet: UserWallet;
  ledger: LedgerEntry[];
  payoutMethods: PayoutMethod[];
  withdrawals: WithdrawalRequest[];
  affiliateLinks: AffiliateLink[];
  reviews: ProductReview[];
  lessonProgress: Record<string, LessonProgress>;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'totalSales' | 'rating' | 'reviewCount' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  
  // Checkout & Orders
  createAndProcessOrder: (
    product: Product,
    buyer: { name: string; email: string; phone?: string; country: string },
    paymentMethod: string,
    includeBump: boolean,
    couponCode?: string,
    affiliateId?: string
  ) => Promise<{ order: Order; paymentResult: PaymentInitiationResult }>;
  
  // LMS Progress
  toggleLessonCompleted: (userId: string, lessonId: string) => void;
  isLessonCompleted: (userId: string, lessonId: string) => boolean;
  getCourseProgressPercent: (userId: string, courseId: string) => number;
  
  // Affiliate actions
  getOrCreateAffiliateLink: (affiliateId: string, productId: string) => AffiliateLink;
  trackAffiliateClick: (code: string) => void;
  
  // Wallet & Withdrawals
  requestWithdrawal: (userId: string, userName: string, payoutMethodId: string, amount: number) => { success: boolean; error?: string };
  addPayoutMethod: (method: Omit<PayoutMethod, 'id' | 'createdAt'>) => PayoutMethod;
  approveWithdrawal: (withdrawalId: string, adminNote?: string) => void;
  
  // Reviews
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('martmarket_products');
    let loaded = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    loaded = loaded.map((p: Product) => 
      p.id === 'prod-react-fullstack' ? { ...p, isSponsored: true } : p
    );
    return loaded;
  });

  useEffect(() => {
    // Initial sync of mock products (force sponsored flag)
    setProducts(prev => {
      const needsUpdate = prev.some(p => p.id === 'prod-react-fullstack' && !p.isSponsored);
      if (needsUpdate) {
        return prev.map(p => p.id === 'prod-react-fullstack' ? { ...p, isSponsored: true } : p);
      }
      return prev;
    });

    // Fetch real products from Supabase
    const fetchRealProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          // Map snake_case from DB to camelCase for UI
          const mappedProducts = data.map(dbProd => ({
            id: dbProd.id,
            slug: dbProd.slug,
            title: dbProd.title,
            shortDescription: dbProd.short_description,
            description: dbProd.short_description, // mock
            coverImage: dbProd.cover_image,
            productType: dbProd.product_type,
            creatorId: dbProd.creator_id,
            creatorName: 'Real Creator', // would need join
            creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator',
            defaultPrice: dbProd.default_price,
            currency: dbProd.currency,
            rating: 5.0,
            reviewCount: 0,
            totalSales: 0,
            isPublished: dbProd.is_published,
            isSponsored: dbProd.is_sponsored,
            status: dbProd.status,
            categoryId: 'cat-1',
            categorySlug: 'desenvolvimento',
            refundDays: 7,
            affiliateApprovalType: 'instant',
            bumpEnabled: false,
            affiliateEnabled: dbProd.affiliate_commission_rate > 0,
            affiliateCommissionRate: dbProd.affiliate_commission_rate,
            features: [],
            createdAt: dbProd.created_at,
          })) as unknown as Product[];
          
          setProducts(prev => {
            // merge supabase data with local mock data (for UI completeness)
            const supabaseIds = new Set(mappedProducts.map(p => p.id));
            const filteredLocal = prev.filter(p => !supabaseIds.has(p.id));
            return [...mappedProducts, ...filteredLocal];
          });
        }
      } catch (err) {
        console.error('Error fetching from supabase:', err);
      }
    };
    
    fetchRealProducts();
  }, []);

  const [categories] = useState<ProductCategory[]>(INITIAL_CATEGORIES);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('martmarket_orders');
    if (saved) return JSON.parse(saved);
    // Seed initial orders
    return [
      {
        id: 'ord-1',
        orderNumber: 'MM-89214',
        buyerId: 'usr-buyer-1',
        buyerName: 'António Silva',
        buyerEmail: 'antonio.silva@gmail.com',
        buyerPhone: '+244 923 111 222',
        buyerCountry: 'AO',
        creatorId: 'usr-creator-1',
        productId: 'prod-react-fullstack',
        productTitle: 'Masterclass Fullstack: De Zero a SaaS Escalável',
        productCoverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        productType: 'course',
        subtotal: 35000,
        discount: 0,
        platformFee: 2765,
        affiliateFee: 0,
        creatorNet: 32235,
        total: 35000,
        currency: 'AOA',
        bumpAdded: false,
        paymentMethod: 'multicaixa_express',
        paymentStatus: 'completed',
        orderStatus: 'completed',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      }
    ];
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('martmarket_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // Wallet
  const [wallet, setWallet] = useState<UserWallet>(() => {
    const saved = localStorage.getItem('martmarket_wallet');
    return saved ? JSON.parse(saved) : {
      userId: 'usr-creator-1',
      availableBalance: 485000,
      pendingBalance: 75000,
      currency: 'AOA',
      totalWithdrawn: 120000,
      updatedAt: new Date().toISOString()
    };
  });

  // Ledger History
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('martmarket_ledger');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ledg-1',
        userId: 'usr-creator-1',
        orderId: 'ord-1',
        type: 'creator_revenue',
        amount: 32235,
        currency: 'AOA',
        balanceAfter: 485000,
        description: 'Venda de Masterclass Fullstack (Ordem #MM-89214)',
        referenceId: 'REF-89214',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      },
      {
        id: 'ledg-2',
        userId: 'usr-creator-1',
        type: 'withdrawal',
        amount: -120000,
        currency: 'AOA',
        balanceAfter: 452765,
        description: 'Levantamento Bancário para BAI AO06 (Concluído)',
        referenceId: 'WITH-1029',
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
      }
    ];
  });

  // Payout Methods
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>(() => {
    const saved = localStorage.getItem('martmarket_payout_methods');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUT_METHODS;
  });

  // Withdrawals
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('martmarket_withdrawals');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'with-1',
        userId: 'usr-creator-1',
        userName: 'Kelson Manuel',
        payoutMethodId: 'paym-1',
        payoutDetails: 'BAI - AO06 0040 0000 1234 5678 9012 3',
        amount: 120000,
        fee: 0,
        netAmount: 120000,
        currency: 'AOA',
        status: 'paid',
        processedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
      }
    ];
  });

  // Affiliate Links
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(() => {
    const saved = localStorage.getItem('martmarket_affiliate_links');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'aff-lnk-1',
        affiliateId: 'usr-creator-1',
        productId: 'prod-guia-financeiro',
        code: 'AFF-FIN-99',
        clicksCount: 142,
        conversionsCount: 18,
        totalCommission: 162000,
        currency: 'AOA',
        createdAt: '2026-02-15T10:00:00Z'
      }
    ];
  });

  // Reviews
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('martmarket_reviews');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'rev-1',
        productId: 'prod-react-fullstack',
        userId: 'usr-buyer-1',
        userName: 'António Silva',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        rating: 5,
        title: 'Excelente curso, muito prático e direto ao ponto!',
        comment: 'As aulas sobre integração de pagamentos e estruturação de banco de dados economizaram meses de desenvolvimento no meu projeto.',
        createdAt: '2026-02-28T10:00:00Z'
      },
      {
        id: 'rev-2',
        productId: 'prod-guia-financeiro',
        userId: 'usr-buyer-2',
        userName: 'Maria Fernandes',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        rating: 5,
        title: 'O melhor material sobre investimentos em Angola.',
        comment: 'A explicação sobre títulos do tesouro e mercado de capitais é super clara e aplicável.',
        createdAt: '2026-03-02T14:30:00Z'
      }
    ];
  });

  // LMS Lesson Progress
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>(() => {
    const saved = localStorage.getItem('martmarket_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('martmarket_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('martmarket_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('martmarket_wallet', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('martmarket_ledger', JSON.stringify(ledger));
  }, [ledger]);

  useEffect(() => {
    localStorage.setItem('martmarket_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('martmarket_payout_methods', JSON.stringify(payoutMethods));
  }, [payoutMethods]);

  useEffect(() => {
    localStorage.setItem('martmarket_affiliate_links', JSON.stringify(affiliateLinks));
  }, [affiliateLinks]);

  useEffect(() => {
    localStorage.setItem('martmarket_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('martmarket_progress', JSON.stringify(lessonProgress));
  }, [lessonProgress]);

  // Product operations
  const addProduct = (productData: Omit<Product, 'id' | 'totalSales' | 'rating' | 'reviewCount' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      totalSales: 0,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    // Optimistic UI update
    setProducts((prev) => [newProduct, ...prev]);

      // Fire and forget to Supabase (Background Sync)
      supabase.from('products').insert([{
        id: newProduct.id,
        slug: newProduct.slug,
        title: newProduct.title,
        short_description: newProduct.shortDescription || '',
        description: newProduct.description || '',
        cover_image: newProduct.coverImage,
        banner_image: newProduct.bannerImage,
        type: newProduct.productType,
        creator_id: newProduct.creatorId,
        category_id: newProduct.categoryId,
        default_price: newProduct.defaultPrice,
        currency: newProduct.currency,
        is_published: newProduct.isPublished || true,
        affiliate_enabled: newProduct.affiliateEnabled || false,
        affiliate_commission_rate: newProduct.affiliateCommissionRate || 0,
        refund_days: newProduct.refundDays || 7,
        webhook_url: newProduct.webhookUrl || null,
        download_url: newProduct.downloadUrl || null,
        features: newProduct.features || []
      }]).then(({ error }) => {
        if (error) console.error("Failed to sync new product to Supabase:", error);
      });

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );

      // Background Sync
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
      if (updates.bannerImage !== undefined) dbUpdates.banner_image = updates.bannerImage;
      if (updates.productType !== undefined) dbUpdates.type = updates.productType;
      if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
      if (updates.defaultPrice !== undefined) dbUpdates.default_price = updates.defaultPrice;
      if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
      if (updates.isPublished !== undefined) dbUpdates.is_published = updates.isPublished;
      if (updates.affiliateEnabled !== undefined) dbUpdates.affiliate_enabled = updates.affiliateEnabled;
      if (updates.affiliateCommissionRate !== undefined) dbUpdates.affiliate_commission_rate = updates.affiliateCommissionRate;
      if (updates.refundDays !== undefined) dbUpdates.refund_days = updates.refundDays;
      if (updates.webhookUrl !== undefined) dbUpdates.webhook_url = updates.webhookUrl;
      if (updates.downloadUrl !== undefined) dbUpdates.download_url = updates.downloadUrl;
      if (updates.features !== undefined) dbUpdates.features = updates.features;

      if (Object.keys(dbUpdates).length > 0) {
        supabase.from('products').update(dbUpdates).eq('id', id).then(({ error }) => {
          if (error) console.error("Failed to sync update to Supabase:", error);
        });
      }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  // Checkout & Order creation with full ledger & commission execution
  const createAndProcessOrder = async (
    product: Product,
    buyer: { name: string; email: string; phone?: string; country: string },
    paymentMethod: string,
    includeBump: boolean,
    couponCode?: string,
    affiliateId?: string
  ): Promise<{ order: Order; paymentResult: PaymentInitiationResult }> => {
    
    // SEC FIX (P0): Price Tampering Defense (Never trust client-side product object)
    const { data: realProduct, error: fetchError } = await supabase
      .from('products')
      .select('default_price') // bump_price could be added to schema later, using default for now
      .eq('id', product.id)
      .single();
      
    if (fetchError || !realProduct) {
      throw new Error('Falha de Segurança: Produto inválido ou preço manipulado.');
    }
    
    // Override potentially spoofed prices with the authoritative DB prices
    const secureProduct = {
      ...product,
      defaultPrice: realProduct.default_price
    };

    const coupon = couponCode ? coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase()) : null;
    const priceCalculation = PaymentEngine.calculateOrderPrice(
      secureProduct,
      includeBump,
      coupon,
      !!affiliateId
    );

    const orderNumber = `MM-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      buyerPhone: buyer.phone,
      buyerCountry: buyer.country || 'AO',
      creatorId: product.creatorId,
      productId: product.id,
      productTitle: product.title,
      productCoverImage: product.coverImage,
      productType: product.productType,
      affiliateId,
      subtotal: priceCalculation.subtotal,
      discount: priceCalculation.discount,
      platformFee: priceCalculation.platformFee,
      affiliateFee: priceCalculation.affiliateFee,
      creatorNet: priceCalculation.creatorNet,
      total: priceCalculation.total,
      currency: product.currency,
      couponCode: coupon?.code,
      bumpAdded: includeBump,
      paymentMethod,
      paymentStatus: 'completed',
      orderStatus: 'completed',
      createdAt: new Date().toISOString()
    };

    // Process through Payment Provider
    const paymentResult = await PaymentEngine.processPayment(newOrder, paymentMethod, {
      expressPhone: buyer.phone
    });

    // If order confirmed, update balances, ledger and product stats
    setOrders((prev) => [newOrder, ...prev]);

    // Update product sales counter
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, totalSales: p.totalSales + 1 } : p))
    );

    // Update Creator Wallet & Ledger
    const newBalance = wallet.availableBalance + priceCalculation.creatorNet;
    setWallet((prev) => ({
      ...prev,
      availableBalance: newBalance,
      updatedAt: new Date().toISOString()
    }));

    const newLedgerEntry: LedgerEntry = {
      id: `ledg_${Date.now()}`,
      userId: product.creatorId,
      orderId: newOrder.id,
      type: 'creator_revenue',
      amount: priceCalculation.creatorNet,
      currency: product.currency,
      balanceAfter: newBalance,
      description: `Venda de ${product.title} (Ordem #${orderNumber})`,
      referenceId: orderNumber,
      createdAt: new Date().toISOString()
    };

    setLedger((prev) => [newLedgerEntry, ...prev]);

    // If affiliate was involved, credit affiliate commission
    if (affiliateId && priceCalculation.affiliateFee > 0) {
      setAffiliateLinks((prev) =>
        prev.map((l) =>
          l.affiliateId === affiliateId && l.productId === product.id
            ? {
                ...l,
                conversionsCount: l.conversionsCount + 1,
                totalCommission: l.totalCommission + priceCalculation.affiliateFee
              }
            : l
        )
      );
    }

    return { order: newOrder, paymentResult };
  };

  // LMS Progress
  const toggleLessonCompleted = (userId: string, lessonId: string) => {
    const key = `${userId}_${lessonId}`;
    setLessonProgress((prev) => {
      const current = prev[key];
      const isCompleted = !current?.isCompleted;
      return {
        ...prev,
        [key]: {
          userId,
          lessonId,
          isCompleted,
          watchedSeconds: isCompleted ? 600 : 0,
          completedAt: isCompleted ? new Date().toISOString() : undefined
        }
      };
    });
  };

  const isLessonCompleted = (userId: string, lessonId: string): boolean => {
    return !!lessonProgress[`${userId}_${lessonId}`]?.isCompleted;
  };

  const getCourseProgressPercent = (userId: string, courseId: string): number => {
    const product = products.find((p) => p.course?.id === courseId);
    if (!product || !product.course) return 0;
    
    const allLessons = product.course.modules.flatMap((m) => m.lessons);
    if (allLessons.length === 0) return 0;

    const completedCount = allLessons.filter((l) => isLessonCompleted(userId, l.id)).length;
    return Math.round((completedCount / allLessons.length) * 100);
  };

  // Affiliate
  const getOrCreateAffiliateLink = (affiliateId: string, productId: string): AffiliateLink => {
    const existing = affiliateLinks.find((l) => l.affiliateId === affiliateId && l.productId === productId);
    if (existing) return existing;

    const newLink: AffiliateLink = {
      id: `aff_${Date.now()}`,
      affiliateId,
      productId,
      code: `AFF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      clicksCount: 0,
      conversionsCount: 0,
      totalCommission: 0,
      currency: 'AOA',
      createdAt: new Date().toISOString()
    };

    setAffiliateLinks((prev) => [...prev, newLink]);
    return newLink;
  };

  const trackAffiliateClick = (code: string) => {
    setAffiliateLinks((prev) =>
      prev.map((l) => (l.code === code ? { ...l, clicksCount: l.clicksCount + 1 } : l))
    );
  };

  // Wallet & Withdrawals
  const requestWithdrawal = (
    userId: string,
    userName: string,
    payoutMethodId: string,
    amount: number
  ): { success: boolean; error?: string } => {
    if (amount <= 0) return { success: false, error: 'Valor de levantamento inválido.' };
    if (amount > wallet.availableBalance) {
      return { success: false, error: 'Saldo disponível insuficiente para este levantamento.' };
    }

    const payoutMethod = payoutMethods.find((p) => p.id === payoutMethodId);
    if (!payoutMethod) {
      return { success: false, error: 'Método de levantamento não encontrado.' };
    }

    const newBalance = wallet.availableBalance - amount;
    const newTotalWithdrawn = wallet.totalWithdrawn + amount;

    setWallet((prev) => ({
      ...prev,
      availableBalance: newBalance,
      totalWithdrawn: newTotalWithdrawn,
      updatedAt: new Date().toISOString()
    }));

    const newWithdrawal: WithdrawalRequest = {
      id: `with_${Date.now()}`,
      userId,
      userName,
      payoutMethodId,
      payoutDetails: `${payoutMethod.bankName} - ${payoutMethod.ibanOrAccount}`,
      amount,
      fee: 0,
      netAmount: amount,
      currency: wallet.currency,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setWithdrawals((prev) => [newWithdrawal, ...prev]);

    const newLedger: LedgerEntry = {
      id: `ledg_${Date.now()}`,
      userId,
      type: 'withdrawal',
      amount: -amount,
      currency: wallet.currency,
      balanceAfter: newBalance,
      description: `Pedido de levantamento para ${payoutMethod.bankName} (${payoutMethod.ibanOrAccount})`,
      referenceId: newWithdrawal.id,
      createdAt: new Date().toISOString()
    };

    setLedger((prev) => [newLedger, ...prev]);

    return { success: true };
  };

  const addPayoutMethod = (methodData: Omit<PayoutMethod, 'id' | 'createdAt'>): PayoutMethod => {
    const newMethod: PayoutMethod = {
      ...methodData,
      id: `paym_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setPayoutMethods((prev) => [newMethod, ...prev]);
    return newMethod;
  };

  const approveWithdrawal = (withdrawalId: string, adminNote?: string) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? { ...w, status: 'paid', adminNote, processedAt: new Date().toISOString() }
          : w
      )
    );
  };

  // Reviews
  const addReview = (reviewData: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating
    const productReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newReview];
    const avgRating = Number(
      (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.id === reviewData.productId
          ? { ...p, rating: avgRating, reviewCount: productReviews.length }
          : p
      )
    );
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        categories,
        orders,
        coupons,
        wallet,
        ledger,
        payoutMethods,
        withdrawals,
        affiliateLinks,
        reviews,
        lessonProgress,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,
        getProductById,
        createAndProcessOrder,
        toggleLessonCompleted,
        isLessonCompleted,
        getCourseProgressPercent,
        getOrCreateAffiliateLink,
        trackAffiliateClick,
        requestWithdrawal,
        addPayoutMethod,
        approveWithdrawal,
        addReview
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
