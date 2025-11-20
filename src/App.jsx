import React, { useEffect, useState } from 'react';
import { CalendarProvider, useCalendar } from './context/CalendarContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import Controls from './components/Controls/Controls';
import CalendarPreview from './components/Calendar/CalendarPreview';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import FAQ from './components/FAQ';
import PricingPage from './components/PricingPage';
import { useTheme } from './hooks/useTheme';
import { usePWA } from './hooks/usePWA';
import './styles/App.css';
import './styles/Controls.css';
import './styles/Calendar.css';
import './styles/Print.css';
import './styles/ErrorBoundary.css';
import './styles/FAQ.css';
import './styles/Pricing.css';
import './styles/Paywall.css';

const AppContent = () => {
  const { orientation } = useCalendar();
  const { t } = useLanguage();
  const { subscription, isPro, isBusiness } = useSubscription();
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  // Применяем тему
  useTheme();

  // Регистрируем PWA
  usePWA();

  // Применяем ориентацию к body
  useEffect(() => {
    document.body.className = `orientation-${orientation}`;
  }, [orientation]);

  return (
    <>
      <div className="app-container">
        <div className="header">
          <h1>✦ {t('appTitle')} ✦</h1>
          <p>{t('appSubtitle')}</p>
          <div className="header-buttons">
            <button
              className="pricing-button"
              onClick={() => setShowPricing(true)}
              title={t('pricing')}
            >
              {isPro || isBusiness ? '⭐ Pro' : '💎 Upgrade'}
            </button>
            <button className="faq-button" onClick={() => setShowFAQ(true)} title={t('faq')}>
              ❓
            </button>
          </div>
        </div>
        <Controls />
        <CalendarPreview />
      </div>
      <Toast />
      {showFAQ && <FAQ onClose={() => setShowFAQ(false)} />}
      {showPricing && <PricingPage onClose={() => setShowPricing(false)} />}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <SubscriptionProvider>
          <CalendarProvider>
            <AppContent />
          </CalendarProvider>
        </SubscriptionProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
