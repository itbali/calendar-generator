import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { SUBSCRIPTION_TIERS } from '../context/subscriptionConstants';
import '../styles/Pricing.css';

const PricingPage = ({ onClose }) => {
  const { t } = useLanguage();
  const { upgradeTo, isPro, isBusiness, startTrial } = useSubscription();

  const plans = [
    {
      id: SUBSCRIPTION_TIERS.FREE,
      name: t('pricingFreeName'),
      price: t('pricingFreePrice'),
      period: '',
      icon: '🌱',
      features: [
        t('pricingFreeFeature1'),
        t('pricingFreeFeature2'),
        t('pricingFreeFeature3'),
        t('pricingFreeFeature4'),
        t('pricingFreeFeature5'),
      ],
      cta: t('pricingFreeCTA'),
      popular: false,
    },
    {
      id: SUBSCRIPTION_TIERS.PRO,
      name: t('pricingProName'),
      price: '$12.99',
      period: t('pricingPerMonth'),
      icon: '⭐',
      features: [
        t('pricingProFeature1'),
        t('pricingProFeature2'),
        t('pricingProFeature3'),
        t('pricingProFeature4'),
        t('pricingProFeature5'),
        t('pricingProFeature6'),
      ],
      cta: t('pricingProCTA'),
      popular: true,
      trial: t('pricingTrial14Days'),
    },
    {
      id: SUBSCRIPTION_TIERS.BUSINESS,
      name: t('pricingBusinessName'),
      price: '$24.99',
      period: t('pricingPerMonth'),
      icon: '🚀',
      features: [
        t('pricingBusinessFeature1'),
        t('pricingBusinessFeature2'),
        t('pricingBusinessFeature3'),
        t('pricingBusinessFeature4'),
        t('pricingBusinessFeature5'),
        t('pricingBusinessFeature6'),
        t('pricingBusinessFeature7'),
      ],
      cta: t('pricingBusinessCTA'),
      popular: false,
    },
  ];

  const handleSelectPlan = planId => {
    if (planId === SUBSCRIPTION_TIERS.FREE) {
      upgradeTo(SUBSCRIPTION_TIERS.FREE);
      onClose?.();
    } else if (planId === SUBSCRIPTION_TIERS.PRO) {
      // В production здесь будет редирект на Stripe Checkout
      startTrial(14);
      upgradeTo(SUBSCRIPTION_TIERS.PRO);
      onClose?.();
    } else if (planId === SUBSCRIPTION_TIERS.BUSINESS) {
      // В production здесь будет редирект на Stripe Checkout
      upgradeTo(SUBSCRIPTION_TIERS.BUSINESS);
      onClose?.();
    }
  };

  const isCurrentPlan = planId => {
    if (planId === SUBSCRIPTION_TIERS.FREE) return !isPro && !isBusiness;
    if (planId === SUBSCRIPTION_TIERS.PRO) return isPro && !isBusiness;
    if (planId === SUBSCRIPTION_TIERS.BUSINESS) return isBusiness;
    return false;
  };

  return (
    <div className="pricing-overlay" onClick={onClose}>
      <div className="pricing-modal" onClick={e => e.stopPropagation()}>
        <div className="pricing-header">
          <h2>{t('pricingTitle')}</h2>
          <p className="pricing-subtitle">{t('pricingSubtitle')}</p>
          <button className="pricing-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="pricing-content">
          <div className="pricing-grid">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`pricing-card ${plan.popular ? 'popular' : ''} ${
                  isCurrentPlan(plan.id) ? 'current' : ''
                }`}
              >
                {plan.popular && <div className="popular-badge">{t('pricingPopular')}</div>}

                <div className="plan-icon">{plan.icon}</div>
                <h3 className="plan-name">{plan.name}</h3>

                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  {plan.period && <span className="period">{plan.period}</span>}
                </div>

                {plan.trial && <div className="trial-badge">{plan.trial}</div>}

                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`plan-cta ${plan.popular ? 'primary' : 'secondary'} ${
                    isCurrentPlan(plan.id) ? 'current' : ''
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan(plan.id)}
                >
                  {isCurrentPlan(plan.id) ? t('pricingCurrentPlan') : plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="pricing-faq">
            <h3>{t('pricingFAQTitle')}</h3>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>{t('pricingFAQ1Q')}</h4>
                <p>{t('pricingFAQ1A')}</p>
              </div>
              <div className="faq-item">
                <h4>{t('pricingFAQ2Q')}</h4>
                <p>{t('pricingFAQ2A')}</p>
              </div>
              <div className="faq-item">
                <h4>{t('pricingFAQ3Q')}</h4>
                <p>{t('pricingFAQ3A')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
