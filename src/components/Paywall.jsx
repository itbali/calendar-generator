import React, { useState } from 'react';
import { FileText, Palette, Cloud, BarChart, Link, Bot, Star, Rocket, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PricingPage from './PricingPage';
import '../styles/Paywall.css';

const Paywall = ({ feature, children, requiredTier = 'pro' }) => {
  const { t } = useLanguage();
  const [showPricing, setShowPricing] = useState(false);

  const features = {
    exportWatermark: {
      icon: <FileText size={48} />,
      title: t('paywallExportTitle'),
      description: t('paywallExportDesc'),
    },
    premiumThemes: {
      icon: <Palette size={48} />,
      title: t('paywallThemesTitle'),
      description: t('paywallThemesDesc'),
    },
    cloudSync: {
      icon: <Cloud size={48} />,
      title: t('paywallCloudTitle'),
      description: t('paywallCloudDesc'),
    },
    analytics: {
      icon: <BarChart size={48} />,
      title: t('paywallAnalyticsTitle'),
      description: t('paywallAnalyticsDesc'),
    },
    integrations: {
      icon: <Link size={48} />,
      title: t('paywallIntegrationsTitle'),
      description: t('paywallIntegrationsDesc'),
    },
    aiAssistant: {
      icon: <Bot size={48} />,
      title: t('paywallAITitle'),
      description: t('paywallAIDesc'),
    },
  };

  const featureInfo = features[feature] || {
    icon: <Star size={48} />,
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
              {requiredTier === 'business' ? (
                <>
                  <Rocket size={16} /> {t('businessPlan')}
                </>
              ) : (
                <>
                  <Star size={16} /> {t('proPlan')}
                </>
              )}
            </div>

            <button className="paywall-cta" onClick={() => setShowPricing(true)}>
              {t('paywallUpgradeButton')}
            </button>

            <div className="paywall-benefits">
              <div className="benefit">
                <span className="benefit-check">
                  <Check size={16} />
                </span>
                {t('paywallBenefit1')}
              </div>
              <div className="benefit">
                <span className="benefit-check">
                  <Check size={16} />
                </span>
                {t('paywallBenefit2')}
              </div>
              <div className="benefit">
                <span className="benefit-check">
                  <Check size={16} />
                </span>
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
