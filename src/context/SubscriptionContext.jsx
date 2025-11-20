import React, { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext();

// Типы подписок
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  BUSINESS: 'business',
};

// Лимиты для каждого тарифа
export const SUBSCRIPTION_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    maxCustomTemplates: 3,
    exportWatermark: true,
    premiumThemes: false,
    cloudSync: false,
    analytics: false,
    integrations: false,
    aiAssistant: false,
    teamFeatures: false,
    prioritySupport: false,
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    maxCustomTemplates: Infinity,
    exportWatermark: false,
    premiumThemes: true,
    cloudSync: true,
    analytics: false,
    integrations: false,
    aiAssistant: false,
    teamFeatures: false,
    prioritySupport: false,
  },
  [SUBSCRIPTION_TIERS.BUSINESS]: {
    maxCustomTemplates: Infinity,
    exportWatermark: false,
    premiumThemes: true,
    cloudSync: true,
    analytics: true,
    integrations: true,
    aiAssistant: true,
    teamFeatures: true,
    prioritySupport: true,
  },
};

export const SubscriptionProvider = ({ children }) => {
  // В production это будет приходить с сервера
  const [subscription, setSubscription] = useState(() => {
    const saved = localStorage.getItem('subscription_tier');
    return saved || SUBSCRIPTION_TIERS.FREE;
  });

  const [trialEndDate, setTrialEndDate] = useState(() => {
    const saved = localStorage.getItem('trial_end_date');
    return saved ? new Date(saved) : null;
  });

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('subscription_tier', subscription);
  }, [subscription]);

  useEffect(() => {
    if (trialEndDate) {
      localStorage.setItem('trial_end_date', trialEndDate.toISOString());
    }
  }, [trialEndDate]);

  // Проверка активности триала
  const isTrialActive = () => {
    if (!trialEndDate) return false;
    return new Date() < trialEndDate;
  };

  // Получить текущий тариф
  const getCurrentTier = () => {
    if (isTrialActive()) return SUBSCRIPTION_TIERS.PRO;
    return subscription;
  };

  // Получить лимиты текущего тарифа
  const getLimits = () => {
    return SUBSCRIPTION_LIMITS[getCurrentTier()];
  };

  // Проверка доступа к функции
  const hasFeature = feature => {
    const limits = getLimits();
    return limits[feature] === true || limits[feature] === Infinity;
  };

  // Проверка лимита (например, количество шаблонов)
  const checkLimit = (feature, currentCount) => {
    const limits = getLimits();
    const limit = limits[feature];
    if (limit === Infinity) return true;
    return currentCount < limit;
  };

  // Получить оставшееся количество
  const getRemainingCount = (feature, currentCount) => {
    const limits = getLimits();
    const limit = limits[feature];
    if (limit === Infinity) return Infinity;
    return Math.max(0, limit - currentCount);
  };

  // Функция для демо: переключение подписки
  const upgradeTo = tier => {
    setSubscription(tier);
  };

  // Функция для демо: активация триала
  const startTrial = (days = 14) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    setTrialEndDate(endDate);
  };

  const value = {
    subscription: getCurrentTier(),
    isTrialActive: isTrialActive(),
    trialEndDate,
    limits: getLimits(),
    hasFeature,
    checkLimit,
    getRemainingCount,
    upgradeTo,
    startTrial,
    isPro:
      getCurrentTier() === SUBSCRIPTION_TIERS.PRO ||
      getCurrentTier() === SUBSCRIPTION_TIERS.BUSINESS,
    isBusiness: getCurrentTier() === SUBSCRIPTION_TIERS.BUSINESS,
    isFree: getCurrentTier() === SUBSCRIPTION_TIERS.FREE && !isTrialActive(),
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};
