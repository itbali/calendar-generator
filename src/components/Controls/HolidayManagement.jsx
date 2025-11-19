import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { countries } from '../../utils/constants';
import { formatDateForDisplay } from '../../utils/dateUtils';

const HolidayManagement = () => {
  const {
    selectedCountries,
    getAllHolidays,
    enabledHolidays,
    addCustomHoliday,
    deleteCustomHoliday,
    toggleCountry,
    toggleHoliday,
  } = useCalendar();

  const [customDate, setCustomDate] = useState('');
  const [customName, setCustomName] = useState('');

  const handleAddHoliday = () => {
    if (addCustomHoliday(customDate, customName)) {
      setCustomDate('');
      setCustomName('');
    }
  };

  const allHolidays = getAllHolidays();

  return (
    <div className="control-group">
      <label>Управление праздниками</label>
      <div className="countries-section">
        <label className="section-label">Выберите страны:</label>
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

        <label className="section-label section-label-spacing">Праздники:</label>
        <div className="holidays-list">
          {allHolidays.length === 0 ? (
            <div className="no-holidays-message">Выберите страны для отображения праздников</div>
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
                      <div className="holiday-country">Пользовательский</div>
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
          <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} />
          <input
            type="text"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            className="custom-holiday-name-input"
            placeholder="Название праздника"
          />
          <button onClick={handleAddHoliday}>Добавить</button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HolidayManagement);
