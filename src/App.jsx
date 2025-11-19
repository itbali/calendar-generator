import React, { useEffect } from 'react';
import { CalendarProvider, useCalendar } from './context/CalendarContext';
import Controls from './components/Controls/Controls';
import CalendarPreview from './components/Calendar/CalendarPreview';
import Toast from './components/Toast';
import { useTheme } from './hooks/useTheme';
import './styles/App.css';
import './styles/Controls.css';
import './styles/Calendar.css';
import './styles/Print.css';

const AppContent = () => {
  const { orientation } = useCalendar();

  // Применяем тему
  useTheme();

  // Применяем ориентацию к body
  useEffect(() => {
    document.body.className = `orientation-${orientation}`;
  }, [orientation]);

  return (
    <>
      <div className="app-container">
        <div className="header">
          <h1>✦ Генератор Календарей ✦</h1>
          <p>Создайте идеальный календарь для планирования</p>
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
    <CalendarProvider>
      <AppContent />
    </CalendarProvider>
  );
}

export default App;
