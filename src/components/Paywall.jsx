import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PricingPage from './PricingPage';
import '../styles/Paywall.css';

const Paywall = ({ feature, children, requiredTier = 'pro' }) => {
  const { t } = useLanguage();
  const [showPricing, setShowPricing] = useState(false);

  const features = {
    exportWatermark: {
      icon: '📄',
      title: t('paywallExportTitle'),
      description: t('paywallExportDesc'),
    },
    premiumThemes: {
      icon: '🎨',
      title: t('paywallThemesTitle'),
      description: t('paywallThemesDesc'),
    },
    cloudSync: {
      icon: '☁️',
      title: t('paywallCloudTitle'),
      description: t('paywallCloudDesc'),
    },
    analytics: {
      icon: '📊',
      title: t('paywallAnalyticsTitle'),
      description: t('paywallAnalyticsDesc'),
    },
    integrations: {
      icon: '🔗',
      title: t('paywallIntegrationsTitle'),
      description: t('paywallIntegrationsDesc'),
    },
    aiAssistant: {
      icon: '🤖',
      title: t('paywallAITitle'),
      description: t('paywallAIDesc'),
    },
  };

  const featureInfo = features[feature] || {
    icon: '⭐',
    title: t('paywallDefaultTitle'),
    description: t('paywallDefaultDesc'),
  };

  return (
    <>
      <div className="paywall-container">
        <div className="paywall-blur">{children}</div>

        <div className="paywall-overlay">
          <div className="paywall-content">
            <div className="paywall-icon">{featureInfo.icon}</div>
            <h3 className="paywall-title">{featureInfo.title}</h3>
            <p className="paywall-description">{featureInfo.description}</p>

            <div className="paywall-badge">
              {requiredTier === 'business' ? '🚀 ' + t('businessPlan') : '⭐ ' + t('proPlan')}
            </div>

            <button className="paywall-cta" onClick={() => setShowPricing(true)}>
              {t('paywallUpgradeButton')}
            </button>

            <div className="paywall-benefits">
              <div className="benefit">
                <span className="benefit-check">✓</span>
                {t('paywallBenefit1')}
              </div>
              <div className="benefit">
                <span className="benefit-check">✓</span>
                {t('paywallBenefit2')}
              </div>
              <div className="benefit">
                <span className="benefit-check">✓</span>
                {t('paywallBenefit3')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPricing && <PricingPage onClose={() => setShowPricing(false)} />}
    </>
  );
};

export default Paywall;
