// ==============================================================================
// MARTMARKET CURRENCY CONVERSION & FORMATTING ENGINE
// ==============================================================================

import { SupportedCurrency } from '../types';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateToUsd: number; // 1 USD = X Currency
  decimals: number;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  AOA: {
    code: 'AOA',
    symbol: 'Kz',
    name: 'Kwanza Angolano',
    rateToUsd: 915.50, // Realistic benchmark exchange
    decimals: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateToUsd: 1.0,
    decimals: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateToUsd: 0.92,
    decimals: 2,
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Real Brasileiro',
    rateToUsd: 5.65,
    decimals: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateToUsd: 0.78,
    decimals: 2,
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    rateToUsd: 18.20,
    decimals: 2,
  },
};

export function convertAmount(
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = CURRENCIES[fromCurrency].rateToUsd;
  const toRate = CURRENCIES[toCurrency].rateToUsd;
  // Convert from origin to USD then to target currency
  const amountInUsd = amount / fromRate;
  const targetAmount = amountInUsd * toRate;
  return Number(targetAmount.toFixed(CURRENCIES[toCurrency].decimals));
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = 'AOA'
): string {
  const config = CURRENCIES[currency] || CURRENCIES.AOA;
  
  // Format numbers with thousands separators
  const formattedNumber = new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount);

  if (currency === 'AOA') {
    return `${formattedNumber} ${config.symbol}`;
  }
  return `${config.symbol} ${formattedNumber}`;
}
