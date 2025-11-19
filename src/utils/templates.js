// Предустановленные шаблоны календаря

export const predefinedTemplates = {
  minimalist: {
    id: 'minimalist',
    viewMode: 'month',
    orientation: 'portrait',
    colorTheme: 'classic',
    darkMode: false,
    taskLines: 0,
    showCheckbox: false,
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
    showCheckbox: true,
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
    showCheckbox: false,
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
    const newTemplate = {
      id: Date.now().toString(),
      name,
      ...settings,
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
      showCheckbox,
      contrastWeekends,
      headerAlignment,
      customSubtitle,
      enabledHolidays,
      customHolidays,
    } = template;

    // Применяем все настройки
    if (setters.setViewMode && viewMode) setters.setViewMode(viewMode);
    if (setters.setOrientation && orientation) setters.setOrientation(orientation);
    if (setters.setColorTheme && colorTheme) setters.setColorTheme(colorTheme);
    if (setters.setDarkMode !== undefined && darkMode !== undefined) setters.setDarkMode(darkMode);
    if (setters.setTaskLines && taskLines !== undefined) setters.setTaskLines(taskLines);
    if (setters.setShowCheckbox && showCheckbox !== undefined)
      setters.setShowCheckbox(showCheckbox);
    if (setters.setContrastWeekends && contrastWeekends !== undefined)
      setters.setContrastWeekends(contrastWeekends);
    if (setters.setHeaderAlignment && headerAlignment) setters.setHeaderAlignment(headerAlignment);
    if (setters.setCustomSubtitle !== undefined) setters.setCustomSubtitle(customSubtitle || '');
    if (setters.setEnabledHolidays && enabledHolidays)
      setters.setEnabledHolidays(enabledHolidays || {});
    if (setters.setCustomHolidays && customHolidays)
      setters.setCustomHolidays(customHolidays || []);

    return true;
  } catch (error) {
    console.error('Ошибка применения шаблона:', error);
    return false;
  }
};
