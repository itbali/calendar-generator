import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getMondayOfWeek } from '../../utils/dateUtils';

const WeekCalendar = ({ startDate, taskLines, showCheckbox }) => {
  const date = new Date(startDate);
  const monday = getMondayOfWeek(date);
  const { translations } = useLanguage();

  return (
    <div className="week-view">
      {Array.from({ length: 7 }, (_, i) => {
        const currentDay = new Date(monday);
        currentDay.setDate(monday.getDate() + i);
        const dayOfWeek = currentDay.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Для отображения названия дня недели (индекс с понедельника)
        const dayNameIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        return (
          <div key={i} className={`week-column ${isWeekend ? 'weekend' : ''}`}>
            <div className="week-column-header">{translations.daysFull[(dayNameIndex + 1) % 7 || 0]}</div>
            <div className="week-column-date">{currentDay.getDate()}</div>
            <div className="week-column-content">
              <div className="task-lines">
                {Array.from({ length: taskLines }, (_, j) => (
                  <div key={j} className={`task-line ${showCheckbox ? 'with-checkbox' : ''}`}></div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(WeekCalendar);
