import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useLanguage } from '../../context/LanguageContext';
import { countries } from '../../utils/constants';
import { formatDateForDisplay } from '../../utils/dateUtils';
import { syncHolidaysFromAPI } from '../../utils/holidaysApi';

const HolidayManagement = () => {
  const { t } = useLanguage();
  const {
    selectedCountries,
    getAllHolidays,
    enabledHolidays,
    addCustomHoliday,
    deleteCustomHoliday,
    toggleCountry,
    toggleHoliday,
    showToast,
    year,
  } = useCalendar();

  const [customDate, setCustomDate] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAddHoliday = () => {
    if (addCustomHoliday(customDate, customName)) {
      setCustomDate('');
      setCustomName('');
    }
  };

  const handleSyncHolidays = async () => {
    if (selectedCountries.size === 0) {
      showToast(t('selectCountries'), 'error');
      return;
    }

    setIsSyncing(true);

    try {
      // Создаем объект enabledCountries из Set
      const enabledCountriesObj = {};
      selectedCountries.forEach(code => {
        enabledCountriesObj[code] = true;
      });

      const result = await syncHolidaysFromAPI(enabledCountriesObj, year);

      if (result.success) {
        showToast(t('holidaysSynced'), 'success');
        // В будущем можно добавить эти праздники в календарь через CalendarContext
      } else {
        showToast(t('holidaysSyncError'), 'error');
      }
    } catch (error) {
      console.error('Sync error:', error);
      showToast(t('holidaysSyncError'), 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const allHolidays = getAllHolidays();

  return (
    <div className="control-group">
      <label>{t('holidays')}</label>
      <div className="countries-section">
        <label className="section-label">{t('selectCountries')}</label>
        <div className="countries-grid">
          {Object.entries(countries).map(([code, country]) => {
            const isSelected = selectedCountries.has(code);
            return (
              <div key={code} className={`country-checkbox ${isSelected ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  id={`country-${code}`}
                  checked={isSelected}
                  onChange={e => toggleCountry(code, e.target.checked)}
                />
                <span className="country-flag">{country.flag}</span>
                <label htmlFor={`country-${code}`} className="country-label">
                  {country.name}
                </label>
              </div>
            );
          })}
        </div>

        {/* Кнопка синхронизации с API */}
        <div className="sync-holidays-section">
          <button
            onClick={handleSyncHolidays}
            disabled={isSyncing || selectedCountries.size === 0}
            className="btn btn-primary sync-holidays-btn"
          >
            🔄 {isSyncing ? t('syncingHolidays') : t('syncFromAPI')}
          </button>
        </div>

        <label className="section-label section-label-spacing">{t('holidays')}:</label>
        <div className="holidays-list">
          {allHolidays.length === 0 ? (
            <div className="no-holidays-message">{t('noHolidaysSelected')}</div>
          ) : (
            allHolidays.map((holiday, index) => {
              const holidayId =
                holiday.country === 'custom' ? holiday.id : `${holiday.country}-${holiday.date}`;
              const isEnabled = enabledHolidays.has(holidayId);

              return (
                <div key={`${holidayId}-${index}`} className="holiday-item">
                  <input
                    type="checkbox"
                    id={`holiday-${index}`}
                    checked={isEnabled}
                    onChange={e => toggleHoliday(holidayId, e.target.checked)}
                  />
                  <div className="holiday-info">
                    <div className="holiday-date">{formatDateForDisplay(holiday.date)}</div>
                    <div className="holiday-title">{holiday.name}</div>
                    {holiday.country !== 'custom' ? (
                      <div className="holiday-country">
                        {countries[holiday.country].name} {countries[holiday.country].flag}
                      </div>
                    ) : (
                      <div className="holiday-country">{t('customHolidays')}</div>
                    )}
                  </div>
                  {holiday.country === 'custom' && (
                    <span
                      className="delete-holiday"
                      onClick={() => deleteCustomHoliday(holiday.id)}
                    >
                      ×
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="custom-holiday-form">
          <input
            type="date"
            value={customDate}
            onChange={e => setCustomDate(e.target.value)}
            aria-label={t('date')}
          />
          <input
            type="text"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            className="custom-holiday-name-input"
            placeholder={t('holidayName')}
          />
          <button onClick={handleAddHoliday}>{t('add')}</button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HolidayManagement);
