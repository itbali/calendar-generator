import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultHolidays } from '../utils/constants';
import {
  saveCalendarSettings,
  loadCalendarSettings,
  saveHolidaySettings,
  loadHolidaySettings
} from '../utils/storageUtils';
import { generateHolidayId, parseHolidayDate } from '../utils/dateUtils';

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const todayStr = today.toISOString().split('T')[0];

  // Настройки календаря
  const [viewMode, setViewMode] = useState('month');
  const [orientation, setOrientation] = useState('portrait');
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [weekStart, setWeekStart] = useState(todayStr);
  const [dayDate, setDayDate] = useState(todayStr);
  const [dayStart, setDayStart] = useState(8);
  const [dayEnd, setDayEnd] = useState(22);
  const [taskLines, setTaskLines] = useState(5);
  const [showCheckboxes, setShowCheckboxes] = useState(true);
  const [contrastWeekends, setContrastWeekends] = useState(true);
  const [headerAlignment, setHeaderAlignment] = useState('center');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [theme, setTheme] = useState('blue');

  // Настройки праздников
  const [selectedCountries, setSelectedCountries] = useState(new Set(['russia']));
  const [customHolidays, setCustomHolidays] = useState([]);
  const [enabledHolidays, setEnabledHolidays] = useState(new Set());
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);

  // Тосты
  const [toasts, setToasts] = useState([]);

  // Показать toast
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Загрузка настроек при монтировании
  useEffect(() => {
    // Загружаем настройки календаря
    const savedCalendar = loadCalendarSettings();
    if (savedCalendar) {
      setViewMode(savedCalendar.mode || 'month');
      setOrientation(savedCalendar.orientation || 'portrait');
      setYear(parseInt(savedCalendar.year) || currentYear);
      setMonth(parseInt(savedCalendar.month) || currentMonth);
      setWeekStart(savedCalendar.weekStart || todayStr);
      setDayDate(savedCalendar.dayDate || todayStr);
      setDayStart(parseInt(savedCalendar.dayStart) || 8);
      setDayEnd(parseInt(savedCalendar.dayEnd) || 22);
      setTaskLines(parseInt(savedCalendar.taskLines) || 5);
      setShowCheckboxes(savedCalendar.checkboxes !== undefined ? savedCalendar.checkboxes : true);
      setContrastWeekends(savedCalendar.contrast !== undefined ? savedCalendar.contrast : true);
      setHeaderAlignment(savedCalendar.headerAlign || 'center');
      setCustomSubtitle(savedCalendar.subtitle || '');
      setTheme(savedCalendar.theme || 'blue');
    }

    // Загружаем настройки праздников
    const savedHolidays = loadHolidaySettings();
    if (savedHolidays) {
      setSelectedCountries(new Set(savedHolidays.selectedCountries || ['russia']));
      setCustomHolidays(savedHolidays.customHolidays || []);
      setEnabledHolidays(new Set(savedHolidays.enabledHolidays || []));
      setHasLoadedSettings(true);
    } else {
      // Если настройки не загружены - инициализируем дефолтные праздники России
      const russiaHolidays = defaultHolidays.russia.map(h => `russia-${h.date}`);
      setEnabledHolidays(new Set(russiaHolidays));
    }
  }, []);

  // Сохранение настроек календаря
  useEffect(() => {
    const settings = {
      mode: viewMode,
      orientation,
      year: year.toString(),
      month: month.toString(),
      weekStart,
      dayDate,
      dayStart: dayStart.toString(),
      dayEnd: dayEnd.toString(),
      taskLines: taskLines.toString(),
      checkboxes: showCheckboxes,
      contrast: contrastWeekends,
      headerAlign: headerAlignment,
      subtitle: customSubtitle,
      theme
    };
    saveCalendarSettings(settings);
  }, [
    viewMode, orientation, year, month, weekStart, dayDate,
    dayStart, dayEnd, taskLines, showCheckboxes, contrastWeekends,
    headerAlignment, customSubtitle, theme
  ]);

  // Сохранение настроек праздников
  useEffect(() => {
    const settings = {
      selectedCountries: Array.from(selectedCountries),
      customHolidays,
      enabledHolidays: Array.from(enabledHolidays)
    };
    saveHolidaySettings(settings);
  }, [selectedCountries, customHolidays, enabledHolidays]);

  // Получить все праздники из выбранных стран
  const getAllHolidays = useCallback(() => {
    const holidays = [];

    // Добавляем праздники из выбранных стран
    for (const countryCode of selectedCountries) {
      if (defaultHolidays[countryCode]) {
        defaultHolidays[countryCode].forEach(holiday => {
          holidays.push({
            ...holiday,
            country: countryCode
          });
        });
      }
    }

    // Добавляем пользовательские праздники
    customHolidays.forEach(holiday => {
      holidays.push({
        ...holiday,
        country: 'custom'
      });
    });

    // Сортируем по дате
    holidays.sort((a, b) => {
      const { month: monthA, day: dayA } = parseHolidayDate(a.date);
      const { month: monthB, day: dayB } = parseHolidayDate(b.date);
      return monthA !== monthB ? monthA - monthB : dayA - dayB;
    });

    return holidays;
  }, [selectedCountries, customHolidays]);

  // Проверка, является ли день праздником
  const isHoliday = useCallback((year, month, day) => {
    const dateStr = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const holidays = getAllHolidays();

    const holiday = holidays.find(h => {
      if (h.date !== dateStr) return false;

      const holidayId = h.country === 'custom' ? h.id : `${h.country}-${h.date}`;
      return enabledHolidays.has(holidayId);
    });

    return holiday;
  }, [getAllHolidays, enabledHolidays]);

  // Добавить пользовательский праздник
  const addCustomHoliday = useCallback((date, name) => {
    if (!date || !name.trim()) {
      showToast('Пожалуйста, заполните дату и название праздника', 'error');
      return false;
    }

    // Преобразуем дату из YYYY-MM-DD в MM-DD
    const [year, month, day] = date.split('-');
    const formattedDate = `${month}-${day}`;

    const holidayId = generateHolidayId();

    setCustomHolidays(prev => [...prev, {
      id: holidayId,
      date: formattedDate,
      name: name.trim()
    }]);

    setEnabledHolidays(prev => new Set([...prev, holidayId]));

    showToast('Праздник добавлен', 'success');
    return true;
  }, [showToast]);

  // Удалить пользовательский праздник
  const deleteCustomHoliday = useCallback((id) => {
    setCustomHolidays(prev => prev.filter(h => h.id !== id));
    setEnabledHolidays(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    showToast('Праздник удален', 'info');
  }, [showToast]);

  // Переключить страну
  const toggleCountry = useCallback((countryCode, enabled) => {
    if (enabled) {
      setSelectedCountries(prev => new Set([...prev, countryCode]));
      // Включаем все праздники новой страны по умолчанию
      if (defaultHolidays[countryCode]) {
        setEnabledHolidays(prev => {
          const newSet = new Set(prev);
          defaultHolidays[countryCode].forEach(holiday => {
            newSet.add(`${countryCode}-${holiday.date}`);
          });
          return newSet;
        });
      }
    } else {
      setSelectedCountries(prev => {
        const newSet = new Set(prev);
        newSet.delete(countryCode);
        return newSet;
      });
      // Удаляем праздники этой страны
      if (defaultHolidays[countryCode]) {
        setEnabledHolidays(prev => {
          const newSet = new Set(prev);
          defaultHolidays[countryCode].forEach(holiday => {
            newSet.delete(`${countryCode}-${holiday.date}`);
          });
          return newSet;
        });
      }
    }
  }, []);

  // Переключить праздник
  const toggleHoliday = useCallback((holidayId, enabled) => {
    if (enabled) {
      setEnabledHolidays(prev => new Set([...prev, holidayId]));
    } else {
      setEnabledHolidays(prev => {
        const newSet = new Set(prev);
        newSet.delete(holidayId);
        return newSet;
      });
    }
  }, []);

  const value = {
    // Настройки календаря
    viewMode, setViewMode,
    orientation, setOrientation,
    year, setYear,
    month, setMonth,
    weekStart, setWeekStart,
    dayDate, setDayDate,
    dayStart, setDayStart,
    dayEnd, setDayEnd,
    taskLines, setTaskLines,
    showCheckboxes, setShowCheckboxes,
    contrastWeekends, setContrastWeekends,
    headerAlignment, setHeaderAlignment,
    customSubtitle, setCustomSubtitle,
    theme, setTheme,

    // Настройки праздников
    selectedCountries,
    customHolidays,
    enabledHolidays,
    getAllHolidays,
    isHoliday,
    addCustomHoliday,
    deleteCustomHoliday,
    toggleCountry,
    toggleHoliday,

    // Toast
    toasts,
    showToast
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
