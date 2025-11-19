import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
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

  return (
    <div className="control-row">
      <div className="control-group">
        <label>Режим отображения</label>
        <select value={viewMode} onChange={e => setViewMode(e.target.value)}>
          <option value="year">Год</option>
          <option value="month">Месяц</option>
          <option value="week">Неделя</option>
          <option value="day">День</option>
        </select>
      </div>

      <div className="control-group">
        <label>Год</label>
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
          <label>Месяц</label>
          <select value={month} onChange={e => setMonth(parseInt(e.target.value))}>
            {monthNames.map((name, index) => (
              <option key={index} value={index}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {viewMode === 'week' && (
        <div className="control-group">
          <label>Неделя (начало)</label>
          <input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} />
        </div>
      )}

      {viewMode === 'day' && (
        <>
          <div className="control-group">
            <label>День</label>
            <input type="date" value={dayDate} onChange={e => setDayDate(e.target.value)} />
          </div>

          <div className="control-group">
            <label>Начало дня</label>
            <select value={dayStart} onChange={e => setDayStart(parseInt(e.target.value))}>
              {Array.from({ length: 13 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Конец дня</label>
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

export default ViewModeSelector;
