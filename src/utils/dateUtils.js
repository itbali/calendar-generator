import { monthNames } from './constants';

// Получить количество дней в месяце
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Получить первый день месяца
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Парсинг даты праздника MM-DD
export const parseHolidayDate = (dateStr) => {
  const [month, day] = dateStr.split('-').map(Number);
  return { month, day };
};

// Форматирование даты для отображения
export const formatDateForDisplay = (dateStr) => {
  const { month, day } = parseHolidayDate(dateStr);
  return `${day} ${monthNames[month - 1]}`;
};

// Генерация уникального ID для кастомного праздника
export const generateHolidayId = () => {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

// Найти понедельник недели для заданной даты
export const getMondayOfWeek = (date) => {
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday;
};
