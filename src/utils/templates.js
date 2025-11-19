// Предустановленные шаблоны календаря

export const predefinedTemplates = {
  minimalist: {
    id: 'minimalist',
    viewMode: 'month',
    orientation: 'portrait',
    colorTheme: 'classic',
    darkMode: false,
    taskLines: 0,
    showCheckboxes: false,
    contrastWeekends: false,
    headerAlignment: 'center',
    customSubtitle: '',
    enabledHolidays: {},
    customHolidays: [],
  },

  taskPlanner: {
    id: 'taskPlanner',
    viewMode: 'week',
    orientation: 'portrait',
    colorTheme: 'modern',
    darkMode: false,
    taskLines: 10,
    showCheckboxes: true,
    contrastWeekends: true,
    headerAlignment: 'left',
    customSubtitle: 'Weekly Task Planner',
    enabledHolidays: {},
    customHolidays: [],
  },

  familyCalendar: {
    id: 'familyCalendar',
    viewMode: 'month',
    orientation: 'portrait',
    colorTheme: 'pastel',
    darkMode: false,
    taskLines: 3,
    showCheckboxes: false,
    contrastWeekends: true,
    headerAlignment: 'center',
    customSubtitle: 'Family Calendar',
    enabledHolidays: {
      US: true,
      RU: true,
    },
    customHolidays: [],
  },
};

// Сохранить текущие настройки как шаблон
export const saveTemplate = (name, settings) => {
  try {
    const templates = getCustomTemplates();

    // Convert Set to object for JSON serialization
    const settingsToSave = { ...settings };
    if (settingsToSave.enabledHolidays instanceof Set) {
      const holidaysObj = {};
      settingsToSave.enabledHolidays.forEach(key => {
        holidaysObj[key] = true;
      });
      settingsToSave.enabledHolidays = holidaysObj;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name,
      ...settingsToSave,
      createdAt: new Date().toISOString(),
    };
    templates.push(newTemplate);
    localStorage.setItem('calendar-custom-templates', JSON.stringify(templates));
    return true;
  } catch (error) {
    console.error('Ошибка сохранения шаблона:', error);
    return false;
  }
};

// Получить пользовательские шаблоны
export const getCustomTemplates = () => {
  try {
    const templates = localStorage.getItem('calendar-custom-templates');
    return templates ? JSON.parse(templates) : [];
  } catch (error) {
    console.error('Ошибка загрузки шаблонов:', error);
    return [];
  }
};

// Удалить пользовательский шаблон
export const deleteTemplate = templateId => {
  try {
    const templates = getCustomTemplates();
    const filtered = templates.filter(t => t.id !== templateId);
    localStorage.setItem('calendar-custom-templates', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Ошибка удаления шаблона:', error);
    return false;
  }
};

// Применить шаблон к настройкам
export const applyTemplate = (template, setters) => {
  try {
    const {
      viewMode,
      orientation,
      colorTheme,
      darkMode,
      taskLines,
      showCheckboxes,
      contrastWeekends,
      headerAlignment,
      customSubtitle,
      enabledHolidays,
      customHolidays,
    } = template;

    // Применяем все настройки
    if (typeof setters.setViewMode === 'function' && viewMode) setters.setViewMode(viewMode);
    if (typeof setters.setOrientation === 'function' && orientation)
      setters.setOrientation(orientation);
    if (typeof setters.setColorTheme === 'function' && colorTheme)
      setters.setColorTheme(colorTheme);
    if (typeof setters.setDarkMode === 'function' && darkMode !== undefined)
      setters.setDarkMode(darkMode);
    if (typeof setters.setTaskLines === 'function' && taskLines !== undefined)
      setters.setTaskLines(taskLines);
    if (typeof setters.setShowCheckboxes === 'function' && showCheckboxes !== undefined)
      setters.setShowCheckboxes(showCheckboxes);
    if (typeof setters.setContrastWeekends === 'function' && contrastWeekends !== undefined)
      setters.setContrastWeekends(contrastWeekends);
    if (typeof setters.setHeaderAlignment === 'function' && headerAlignment)
      setters.setHeaderAlignment(headerAlignment);
    if (typeof setters.setCustomSubtitle === 'function')
      setters.setCustomSubtitle(customSubtitle || '');
    if (typeof setters.setEnabledHolidays === 'function' && enabledHolidays) {
      // Convert object to Set for proper state management
      const holidaysSet =
        enabledHolidays instanceof Set
          ? enabledHolidays
          : new Set(Object.keys(enabledHolidays).filter(key => enabledHolidays[key]));
      setters.setEnabledHolidays(holidaysSet);
    }
    if (typeof setters.setCustomHolidays === 'function' && customHolidays)
      setters.setCustomHolidays(customHolidays || []);

    return true;
  } catch (error) {
    console.error('Ошибка применения шаблона:', error);
    return false;
  }
};
