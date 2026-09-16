// ==============================================================================
// MARTMARKET PAYMENT ENGINE & TRANSACTION ORCHESTRATOR
// ==============================================================================

import { Product, Coupon, Order, SupportedCurrency } from '../../types';
import { AngolaPaymentAdapter } from './AngolaPaymentAdapter';
import { GlobalBankAdapter } from './GlobalBankAdapter';
import { PaymentInitiationResult } from './PaymentProvider';

export interface PriceBreakdown {
  basePrice: number;
  bumpPrice: number;
  subtotal: number;
  discount: number;
  platformFee: number;
  affiliateFee: number;
  creatorNet: number;
  total: number;
  currency: SupportedCurrency;
  appliedCoupon?: Coupon;
}

export class PaymentEngine {
  private static angolaAdapter = new AngolaPaymentAdapter();
  private static globalAdapter = new GlobalBankAdapter();

  /**
   * Calculates transparent and secure order breakdown on the engine side
   */
  static calculateOrderPrice(
    product: Product,
    includeBump: boolean = false,
    coupon?: Coupon | null,
    hasAffiliate: boolean = false
  ): PriceBreakdown {
    const basePrice = Number(product.defaultPrice);
    const bumpPrice = (includeBump && product.bumpEnabled && product.bumpPrice) ? Number(product.bumpPrice) : 0;
    const subtotal = basePrice + bumpPrice;

    // Calculate discount
    let discount = 0;
    if (coupon && coupon.isActive) {
      if (coupon.discountType === 'percentage') {
        discount = Number(((subtotal * coupon.discountValue) / 100).toFixed(2));
      } else {
        discount = Math.min(Number(coupon.discountValue), subtotal);
      }
    }

    const total = Math.max(0, subtotal - discount);

    // Platform Fee: 7.9%
    const platformFeeRate = 0.079;
    const platformFee = Number((total * platformFeeRate).toFixed(2));

    // Affiliate Commission
    let affiliateFee = 0;
    if (hasAffiliate && product.affiliateEnabled) {
      const commissionRate = (product.affiliateCommissionRate || 40) / 100;
      // Commission is calculated on the net amount after platform fee
      const netBeforeAffiliate = total - platformFee;
      affiliateFee = Number((netBeforeAffiliate * commissionRate).toFixed(2));
    }

    // Creator Net Revenue
    const creatorNet = Number((total - platformFee - affiliateFee).toFixed(2));

    return {
      basePrice,
      bumpPrice,
      subtotal,
      discount,
      platformFee,
      affiliateFee,
      creatorNet,
      total,
      currency: product.currency,
      appliedCoupon: coupon || undefined
    };
  }

  /**
   * Dispatches payment initiation to appropriate provider adapter
   */
  static async processPayment(
    order: Order,
    paymentMethod: string,
    metadata?: Record<string, any>
  ): Promise<PaymentInitiationResult> {
    const request = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.total,
      currency: order.currency,
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
      buyerPhone: order.buyerPhone,
      paymentMethod,
      metadata
    };

    if (['multicaixa_express', 'bank_reference', 'unitel_money'].includes(paymentMethod)) {
      return await this.angolaAdapter.initiatePayment(request);
    }

    return await this.globalAdapter.initiatePayment(request);
  }
}
