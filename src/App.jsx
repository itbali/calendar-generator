import React, { useEffect } from 'react';
import { CalendarProvider, useCalendar } from './context/CalendarContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Controls from './components/Controls/Controls';
import CalendarPreview from './components/Calendar/CalendarPreview';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from './hooks/useTheme';
import { usePWA } from './hooks/usePWA';
import './styles/App.css';
import './styles/Controls.css';
import './styles/Calendar.css';
import './styles/Print.css';
import './styles/ErrorBoundary.css';

const AppContent = () => {
  const { orientation } = useCalendar();
  const { t } = useLanguage();

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
        </div>
        <Controls />
        <CalendarPreview />
      </div>
      <Toast />
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
