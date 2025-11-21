import { useEffect, useLayoutEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { themes } from '../utils/constants';

export const useTheme = () => {
  const { theme, contrastWeekends, darkMode, setDarkMode } = useCalendar();

  // Слушаем изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleThemeChange = e => {
      // Обновляем тему только если пользователь не установил явно свою предпочтительную тему
      const savedSettings = localStorage.getItem('calendar-settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : null;

      // Если darkMode не был явно установлен пользователем, используем системную тему
      if (!settings || settings.darkMode === undefined) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [setDarkMode]);

  // Используем useLayoutEffect для синхронного применения темы ДО рендера
  // Это предотвращает мерцание при загрузке страницы
  useLayoutEffect(() => {
    const selectedTheme = themes[theme];
    if (!selectedTheme) return;

    const root = document.documentElement;

    // Применяем или убираем класс dark mode
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    root.style.setProperty('--primary-color', selectedTheme.primary);
    root.style.setProperty('--secondary-color', selectedTheme.secondary);
    root.style.setProperty('--border-color', selectedTheme.border);
    root.style.setProperty('--date-bg', selectedTheme.dateBg);
    root.style.setProperty('--task-bg', selectedTheme.taskBg);
    root.style.setProperty('--line-color', selectedTheme.line);

    // Применяем контрастные выходные или обычные
    if (contrastWeekends) {
      root.style.setProperty('--weekend-bg', selectedTheme.weekendBg);
      root.style.setProperty('--weekend-date-bg', selectedTheme.weekendDateBg);
      root.style.setProperty('--weekend-color', selectedTheme.weekendColor);
    } else {
      // Используем обычные цвета для выходных
      root.style.setProperty('--weekend-bg', darkMode ? '#1e1e1e' : 'white');
      root.style.setProperty('--weekend-date-bg', selectedTheme.dateBg);
      root.style.setProperty('--weekend-color', selectedTheme.primary);
    }

    // Применяем цвета для праздников
    root.style.setProperty('--holiday-bg', selectedTheme.holidayBg);
    root.style.setProperty('--holiday-date-bg', selectedTheme.holidayDateBg);
    root.style.setProperty('--holiday-color', selectedTheme.holidayColor);
  }, [theme, contrastWeekends, darkMode]);
};
