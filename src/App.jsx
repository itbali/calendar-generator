import React, { useEffect, useState } from 'react';
import { CalendarProvider, useCalendar } from './context/CalendarContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Controls from './components/Controls/Controls';
import CalendarPreview from './components/Calendar/CalendarPreview';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import FAQ from './components/FAQ';
import { useTheme } from './hooks/useTheme';
import { usePWA } from './hooks/usePWA';
import './styles/App.css';
import './styles/Controls.css';
import './styles/Calendar.css';
import './styles/Print.css';
import './styles/ErrorBoundary.css';
import './styles/FAQ.css';

const AppContent = () => {
  const { orientation } = useCalendar();
  const { t } = useLanguage();
  const [showFAQ, setShowFAQ] = useState(false);

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
          <button className="faq-button" onClick={() => setShowFAQ(true)} title={t('faq')}>
            ❓
          </button>
        </div>
        <Controls />
        <CalendarPreview />
      </div>
      <Toast />
      {showFAQ && <FAQ onClose={() => setShowFAQ(false)} />}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <CalendarProvider>
          <AppContent />
        </CalendarProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
