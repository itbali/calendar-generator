import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useLanguage } from '../../context/LanguageContext';
import { monthNames } from '../../utils/constants';

const ViewModeSelector = () => {
  const {
    viewMode,
    setViewMode,
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
  } = useCalendar();
  const { t, translations } = useLanguage();

  return (
    <div className="control-row">
      <div className="control-group">
        <label>{t('viewMode')}</label>
        <select value={viewMode} onChange={e => setViewMode(e.target.value)}>
          <option value="year">{t('year')}</option>
          <option value="month">{t('month')}</option>
          <option value="week">{t('week')}</option>
          <option value="day">{t('day')}</option>
        </select>
      </div>

      <div className="control-group">
        <label>{t('year')}</label>
        <input
          type="number"
          value={year}
          onChange={e => setYear(parseInt(e.target.value))}
          min="2020"
          max="2030"
        />
      </div>

      {(viewMode === 'month' || viewMode === 'week') && (
        <div className="control-group">
          <label>{t('month')}</label>
          <select value={month} onChange={e => setMonth(parseInt(e.target.value))}>
            {translations.months.map((name, index) => (
              <option key={index} value={index}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {viewMode === 'week' && (
        <div className="control-group">
          <label>{t('weekStartLabel')}</label>
          <input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} />
        </div>
      )}

      {viewMode === 'day' && (
        <>
          <div className="control-group">
            <label>{t('day')}</label>
            <input type="date" value={dayDate} onChange={e => setDayDate(e.target.value)} />
          </div>

          <div className="control-group">
            <label>{t('dayStartTime')}</label>
            <select value={dayStart} onChange={e => setDayStart(parseInt(e.target.value))}>
              {Array.from({ length: 13 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>{t('dayEndTime')}</label>
            <select value={dayEnd} onChange={e => setDayEnd(parseInt(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => {
                const hour = i + 12;
                return (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}:00
                  </option>
                );
              })}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(ViewModeSelector);
