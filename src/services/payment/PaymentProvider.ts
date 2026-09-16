// ==============================================================================
// MARTMARKET MODULAR PAYMENT PROVIDER ABSTRACTION
// ==============================================================================

import { SupportedCurrency, PaymentStatus } from '../../types';

export interface PaymentInitiationRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: SupportedCurrency;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  paymentMethod: string;
  metadata?: Record<string, any>;
}

export interface PaymentInitiationResult {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  provider: string;
  providerTransactionId?: string;
  entityCode?: string;
  referenceNumber?: string;
  expressPhone?: string;
  instructions?: string;
  qrCodeData?: string;
  expiresAt?: string;
  errorMessage?: string;
}

export interface PaymentVerificationResult {
  paymentId: string;
  status: PaymentStatus;
  paidAt?: string;
  amount: number;
  currency: SupportedCurrency;
  providerTransactionId: string;
  isIdempotentVerified: boolean;
}

export interface IPaymentProviderAdapter {
  readonly providerId: string;
  readonly supportedCurrencies: SupportedCurrency[];
  readonly supportedMethods: string[];
  
  initiatePayment(request: PaymentInitiationRequest): Promise<PaymentInitiationResult>;
  verifyPayment(paymentId: string, providerTransactionId?: string): Promise<PaymentVerificationResult>;
  refundPayment?(paymentId: string, amount: number): Promise<{ success: boolean; refundId?: string }>;
}
