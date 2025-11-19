// Сохранение настроек календаря
export const saveCalendarSettings = settings => {
  try {
    localStorage.setItem('calendarSettings', JSON.stringify(settings));
  } catch (e) {
    console.error('Calendar settings save failed:', e);
  }
};

// Загрузка настроек календаря
export const loadCalendarSettings = () => {
  try {
    const saved = localStorage.getItem('calendarSettings');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Calendar settings load failed:', e);
    return null;
  }
};

// Сохранение настроек праздников
export const saveHolidaySettings = settings => {
  try {
    localStorage.setItem('holidaySettings', JSON.stringify(settings));
  } catch (e) {
    console.error('Holiday settings save failed:', e);
  }
};

// Загрузка настроек праздников
export const loadHolidaySettings = () => {
  try {
    const saved = localStorage.getItem('holidaySettings');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Holiday settings load failed:', e);
    return null;
  }
};

// Сохранение виджетов (заметок и привычек)
export const saveWidgets = widgets => {
  try {
    localStorage.setItem('calendarWidgets', JSON.stringify(widgets));
  } catch (e) {
    console.error('Widgets save failed:', e);
  }
};

// Загрузка виджетов
export const loadWidgets = () => {
  try {
    const saved = localStorage.getItem('calendarWidgets');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Widgets load failed:', e);
    return null;
  }
};
