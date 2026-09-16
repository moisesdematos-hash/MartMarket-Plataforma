// ==============================================================================
// MARTMARKET I18N & MULTI-CURRENCY CONTEXT
// ==============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, SupportedCurrency } from '../types';
import { translations, TranslationKeys } from '../lib/i18n/translations';
import { formatCurrency as formatCurrencyHelper, convertAmount as convertAmountHelper } from '../lib/currencies';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currency: SupportedCurrency;
  setCurrency: (curr: SupportedCurrency) => void;
  t: (key: TranslationKeys) => string;
  formatMoney: (amount: number, customCurrency?: SupportedCurrency) => string;
  convertMoney: (amount: number, from: SupportedCurrency, to: SupportedCurrency) => number;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('martmarket_lang') as SupportedLanguage;
    return saved || 'pt';
  });

  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    const saved = localStorage.getItem('martmarket_curr') as SupportedCurrency;
    return saved || 'AOA';
  });

  useEffect(() => {
    localStorage.setItem('martmarket_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('martmarket_curr', currency);
  }, [currency]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const setCurrency = (curr: SupportedCurrency) => {
    setCurrencyState(curr);
  };

  const t = (key: TranslationKeys): string => {
    const currentDict = translations[language] || translations.pt;
    const value = currentDict[key];
    if (value) return value;
    // Fallback to Portuguese dictionary if key missing in translation
    return translations.pt[key] || String(key);
  };

  const formatMoney = (amount: number, customCurrency?: SupportedCurrency): string => {
    return formatCurrencyHelper(amount, customCurrency || currency);
  };

  const convertMoney = (amount: number, from: SupportedCurrency, to: SupportedCurrency): number => {
    return convertAmountHelper(amount, from, to);
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatMoney,
        convertMoney,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
