// Nager.Date API для получения государственных праздников
// Бесплатный публичный API без необходимости регистрации
const API_BASE_URL = 'https://date.nager.at/api/v3';

/**
 * Получить список доступных стран
 */
export const getAvailableCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/AvailableCountries`);
    if (!response.ok) throw new Error('Failed to fetch countries');
    return await response.json();
  } catch (error) {
    console.error('Error fetching available countries:', error);
    return [];
  }
};

/**
 * Получить праздники для страны и года
 */
export const getPublicHolidays = async (countryCode, year) => {
  try {
    const response = await fetch(`${API_BASE_URL}/PublicHolidays/${year}/${countryCode}`);
    if (!response.ok) throw new Error(`Failed to fetch holidays for ${countryCode}`);
    const data = await response.json();

    // Преобразуем формат API в наш формат
    return data.map(holiday => ({
      date: holiday.date, // Формат: YYYY-MM-DD
      name: holiday.localName || holiday.name,
      country: countryCode,
    }));
  } catch (error) {
    console.error(`Error fetching holidays for ${countryCode}:`, error);
    return [];
  }
};

/**
 * Получить праздники для нескольких стран
 */
export const getHolidaysForCountries = async (countryCodes, year) => {
  try {
    const promises = countryCodes.map(code => getPublicHolidays(code, year));
    const results = await Promise.all(promises);

    // Объединяем все праздники
    const allHolidays = results.flat();

    // Группируем по дате (MM-DD)
    const holidaysByDate = {};

    allHolidays.forEach(holiday => {
      const parts = holiday.date.split('-'); // YYYY-MM-DD
      const dateKey = `${parts[1]}-${parts[2]}`;

      if (!holidaysByDate[dateKey]) {
        holidaysByDate[dateKey] = [];
      }

      holidaysByDate[dateKey].push({
        title: holiday.name,
        country: holiday.country,
      });
    });

    return holidaysByDate;
  } catch (error) {
    console.error('Error fetching holidays for multiple countries:', error);
    return {};
  }
};

/**
 * Мапинг кодов стран между нашей системой и API
 */
export const COUNTRY_CODE_MAP = {
  US: 'US', // United States
  RU: 'RU', // Russia
  GB: 'GB', // United Kingdom
  DE: 'DE', // Germany
  FR: 'FR', // France
  IT: 'IT', // Italy
  ES: 'ES', // Spain
  JP: 'JP', // Japan
  CN: 'CN', // China
  IN: 'IN', // India
  BR: 'BR', // Brazil
  CA: 'CA', // Canada
  AU: 'AU', // Australia
  MX: 'MX', // Mexico
  KR: 'KR', // South Korea
};

/**
 * Синхронизировать праздники из API
 */
export const syncHolidaysFromAPI = async (enabledCountries, year) => {
  try {
    // Получаем коды включенных стран
    const countryCodes = Object.keys(enabledCountries).filter(code => enabledCountries[code]);

    if (countryCodes.length === 0) {
      return { success: false, message: 'No countries selected' };
    }

    // Загружаем праздники
    const holidays = await getHolidaysForCountries(countryCodes, year);

    return {
      success: true,
      holidays,
      message: `Loaded holidays for ${countryCodes.length} ${countryCodes.length === 1 ? 'country' : 'countries'}`,
    };
  } catch (error) {
    console.error('Error syncing holidays:', error);
    return {
      success: false,
      message: 'Failed to sync holidays',
      error,
    };
  }
};
