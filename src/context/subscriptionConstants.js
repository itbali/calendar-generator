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
