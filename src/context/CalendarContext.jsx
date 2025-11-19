import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultHolidays } from '../utils/constants';
import {
  saveCalendarSettings,
  loadCalendarSettings,
  saveHolidaySettings,
  loadHolidaySettings,
  saveWidgets,
  loadWidgets,
} from '../utils/storageUtils';
import { generateHolidayId, parseHolidayDate } from '../utils/dateUtils';

const CalendarContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
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

  // Инициализация настроек календаря из localStorage
  const initializeCalendarSettings = () => {
    const savedCalendar = loadCalendarSettings();
    // Определяем системную тему, если нет сохраненной настройки
    const prefersDark =
      savedCalendar?.darkMode === undefined
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : savedCalendar.darkMode;

    return {
      viewMode: savedCalendar?.mode || 'month',
      orientation: savedCalendar?.orientation || 'portrait',
      year: parseInt(savedCalendar?.year) || currentYear,
      month: parseInt(savedCalendar?.month) || currentMonth,
      weekStart: savedCalendar?.weekStart || todayStr,
      dayDate: savedCalendar?.dayDate || todayStr,
      dayStart: parseInt(savedCalendar?.dayStart) || 8,
      dayEnd: parseInt(savedCalendar?.dayEnd) || 22,
      taskLines: parseInt(savedCalendar?.taskLines) || 5,
      showCheckboxes: savedCalendar?.checkboxes !== undefined ? savedCalendar.checkboxes : true,
      contrastWeekends: savedCalendar?.contrast !== undefined ? savedCalendar.contrast : true,
      headerAlignment: savedCalendar?.headerAlign || 'center',
      customSubtitle: savedCalendar?.subtitle || '',
      theme: savedCalendar?.theme || 'blue',
      darkMode: prefersDark,
    };
  };

  // Инициализация настроек праздников из localStorage
  const initializeHolidaySettings = () => {
    const savedHolidays = loadHolidaySettings();
    if (savedHolidays) {
      return {
        selectedCountries: new Set(savedHolidays.selectedCountries || ['russia']),
        customHolidays: savedHolidays.customHolidays || [],
        enabledHolidays: new Set(savedHolidays.enabledHolidays || []),
      };
    }
    // Если настройки не загружены - инициализируем дефолтные праздники России
    const russiaHolidays = defaultHolidays.russia.map(h => `russia-${h.date}`);
    return {
      selectedCountries: new Set(['russia']),
      customHolidays: [],
      enabledHolidays: new Set(russiaHolidays),
    };
  };

  // Инициализация виджетов из localStorage
  const initializeWidgets = () => {
    const savedWidgets = loadWidgets();
    if (savedWidgets) {
      return {
        notes: savedWidgets.notes || [],
        habits: savedWidgets.habits || [],
        recurringEvents: savedWidgets.recurringEvents || [],
      };
    }
    return {
      notes: [],
      habits: [],
      recurringEvents: [],
    };
  };

  const calendarSettings = initializeCalendarSettings();
  const holidaySettings = initializeHolidaySettings();
  const widgetsSettings = initializeWidgets();

  // Настройки календаря
  const [viewMode, setViewMode] = useState(calendarSettings.viewMode);
  const [orientation, setOrientation] = useState(calendarSettings.orientation);
  const [year, setYear] = useState(calendarSettings.year);
  const [month, setMonth] = useState(calendarSettings.month);
  const [weekStart, setWeekStart] = useState(calendarSettings.weekStart);
  const [dayDate, setDayDate] = useState(calendarSettings.dayDate);
  const [dayStart, setDayStart] = useState(calendarSettings.dayStart);
  const [dayEnd, setDayEnd] = useState(calendarSettings.dayEnd);
  const [taskLines, setTaskLines] = useState(calendarSettings.taskLines);
  const [showCheckboxes, setShowCheckboxes] = useState(calendarSettings.showCheckboxes);
  const [contrastWeekends, setContrastWeekends] = useState(calendarSettings.contrastWeekends);
  const [headerAlignment, setHeaderAlignment] = useState(calendarSettings.headerAlignment);
  const [customSubtitle, setCustomSubtitle] = useState(calendarSettings.customSubtitle);
  const [theme, setTheme] = useState(calendarSettings.theme);
  const [darkMode, setDarkMode] = useState(calendarSettings.darkMode);

  // Настройки праздников
  const [selectedCountries, setSelectedCountries] = useState(holidaySettings.selectedCountries);
  const [customHolidays, setCustomHolidays] = useState(holidaySettings.customHolidays);
  const [enabledHolidays, setEnabledHolidays] = useState(holidaySettings.enabledHolidays);

  // Виджеты
  const [notes, setNotes] = useState(widgetsSettings.notes);
  const [habits, setHabits] = useState(widgetsSettings.habits);
  const [recurringEvents, setRecurringEvents] = useState(widgetsSettings.recurringEvents);

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
      theme,
      darkMode,
    };
    saveCalendarSettings(settings);
  }, [
    viewMode,
    orientation,
    year,
    month,
    weekStart,
    dayDate,
    dayStart,
    dayEnd,
    taskLines,
    showCheckboxes,
    contrastWeekends,
    headerAlignment,
    customSubtitle,
    theme,
    darkMode,
  ]);

  // Сохранение настроек праздников
  useEffect(() => {
    const settings = {
      selectedCountries: Array.from(selectedCountries),
      customHolidays,
      enabledHolidays: Array.from(enabledHolidays),
    };
    saveHolidaySettings(settings);
  }, [selectedCountries, customHolidays, enabledHolidays]);

  // Сохранение виджетов
  useEffect(() => {
    const widgets = {
      notes,
      habits,
      recurringEvents,
    };
    saveWidgets(widgets);
  }, [notes, habits, recurringEvents]);

  // Получить все праздники из выбранных стран
  const getAllHolidays = useCallback(() => {
    const holidays = [];

    // Добавляем праздники из выбранных стран
    for (const countryCode of selectedCountries) {
      if (defaultHolidays[countryCode]) {
        defaultHolidays[countryCode].forEach(holiday => {
          holidays.push({
            ...holiday,
            country: countryCode,
          });
        });
      }
    }

    // Добавляем пользовательские праздники
    customHolidays.forEach(holiday => {
      holidays.push({
        ...holiday,
        country: 'custom',
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
  const isHoliday = useCallback(
    (year, month, day) => {
      const dateStr = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const holidays = getAllHolidays();

      const holiday = holidays.find(h => {
        if (h.date !== dateStr) return false;

        const holidayId = h.country === 'custom' ? h.id : `${h.country}-${h.date}`;
        return enabledHolidays.has(holidayId);
      });

      return holiday;
    },
    [getAllHolidays, enabledHolidays]
  );

  // Добавить пользовательский праздник
  const addCustomHoliday = useCallback(
    (date, name) => {
      if (!date || !name.trim()) {
        showToast('Пожалуйста, заполните дату и название праздника', 'error');
        return false;
      }

      // Преобразуем дату из YYYY-MM-DD в MM-DD
      const [, month, day] = date.split('-');
      const formattedDate = `${month}-${day}`;

      const holidayId = generateHolidayId();

      setCustomHolidays(prev => [
        ...prev,
        {
          id: holidayId,
          date: formattedDate,
          name: name.trim(),
        },
      ]);

      setEnabledHolidays(prev => new Set([...prev, holidayId]));

      showToast('Праздник добавлен', 'success');
      return true;
    },
    [showToast]
  );

  // Удалить пользовательский праздник
  const deleteCustomHoliday = useCallback(
    id => {
      setCustomHolidays(prev => prev.filter(h => h.id !== id));
      setEnabledHolidays(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      showToast('Праздник удален', 'info');
    },
    [showToast]
  );

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

  // Импортировать праздники из .ics файла
  const importHolidaysFromICS = useCallback(events => {
    if (!events || events.length === 0) {
      return { success: false, count: 0 };
    }

    const newHolidays = [];
    const newEnabledIds = [];

    events.forEach(event => {
      const holidayId = generateHolidayId();
      newHolidays.push({
        id: holidayId,
        date: event.date, // Already in MM-DD format
        name: event.name,
      });
      newEnabledIds.push(holidayId);
    });

    // Add all new holidays
    setCustomHolidays(prev => [...prev, ...newHolidays]);

    // Enable all imported holidays
    setEnabledHolidays(prev => new Set([...prev, ...newEnabledIds]));

    return { success: true, count: newHolidays.length };
  }, []);

  // Добавить заметку
  const addNote = useCallback(text => {
    const newNote = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  // Удалить заметку
  const deleteNote = useCallback(noteId => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  }, []);

  // Добавить привычку
  const addHabit = useCallback(name => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      completedDays: [],
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  // Удалить привычку
  const deleteHabit = useCallback(habitId => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  }, []);

  // Переключить день привычки
  const toggleHabitDay = useCallback((habitId, dayStr) => {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id === habitId) {
          const completedDays = [...habit.completedDays];
          const dayIndex = completedDays.indexOf(dayStr);

          if (dayIndex > -1) {
            completedDays.splice(dayIndex, 1);
          } else {
            completedDays.push(dayStr);
          }

          return { ...habit, completedDays };
        }
        return habit;
      })
    );
  }, []);

  // Добавить повторяющееся событие
  const addRecurringEvent = useCallback(event => {
    const newEvent = {
      id: Date.now().toString(),
      ...event,
      createdAt: new Date().toISOString(),
    };
    setRecurringEvents(prev => [...prev, newEvent]);
  }, []);

  // Удалить повторяющееся событие
  const deleteRecurringEvent = useCallback(eventId => {
    setRecurringEvents(prev => prev.filter(event => event.id !== eventId));
  }, []);

  const value = {
    // Настройки календаря
    viewMode,
    setViewMode,
    orientation,
    setOrientation,
    year,
    setYear,
    month,
    setMonth,
    weekStart,
    setWeekStart,
    dayDate,
    setDayDate,
    dayStart,
    setDayStart,
    dayEnd,
    setDayEnd,
    taskLines,
    setTaskLines,
    showCheckboxes,
    setShowCheckboxes,
    contrastWeekends,
    setContrastWeekends,
    headerAlignment,
    setHeaderAlignment,
    customSubtitle,
    setCustomSubtitle,
    theme,
    setTheme,
    darkMode,
    setDarkMode,

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
    importHolidaysFromICS,

    // Виджеты
    notes,
    habits,
    addNote,
    deleteNote,
    addHabit,
    deleteHabit,
    toggleHabitDay,
    recurringEvents,
    addRecurringEvent,
    deleteRecurringEvent,

    // Toast
    toasts,
    showToast,
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};
