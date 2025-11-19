import { useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { themes } from '../utils/constants';

export const useTheme = () => {
  const { theme, contrastWeekends, darkMode } = useCalendar();

  useEffect(() => {
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
