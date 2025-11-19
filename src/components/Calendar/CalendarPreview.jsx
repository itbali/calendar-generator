import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { monthNames, dayNamesFull } from '../../utils/constants';
import { getMondayOfWeek } from '../../utils/dateUtils';
import MonthCalendar from './MonthCalendar';
import YearCalendar from './YearCalendar';
import WeekCalendar from './WeekCalendar';
import DayCalendar from './DayCalendar';

const CalendarPreview = () => {
  const {
    viewMode,
    year,
    month,
    weekStart,
    dayDate,
    dayStart,
    dayEnd,
    taskLines,
    showCheckboxes,
    headerAlignment,
    customSubtitle,
    showToast,
  } = useCalendar();

  const getHeaderClass = () => {
    return headerAlignment === 'hidden'
      ? 'calendar-header hidden'
      : `calendar-header align-${headerAlignment}`;
  };

  const renderCalendar = () => {
    switch (viewMode) {
      case 'month':
        return (
          <div className="calendar-wrapper">
            <div className={getHeaderClass()}>
              <h2>{monthNames[month]}</h2>
              <div className="year">{customSubtitle || year}</div>
            </div>
            <MonthCalendar
              year={year}
              month={month}
              taskLines={taskLines}
              showCheckbox={showCheckboxes}
            />
            <div className="calendar-footer">✦ Планируй • Достигай • Отмечай ✦</div>
          </div>
        );

      case 'year':
        return (
          <div className="calendar-wrapper">
            <div className={getHeaderClass()}>
              <h2>{year}</h2>
              <div className="year">{customSubtitle || 'Годовой планировщик'}</div>
            </div>
            <YearCalendar year={year} taskLines={taskLines} showCheckbox={showCheckboxes} />
            <div className="calendar-footer">✦ Планируй • Достигай • Отмечай ✦</div>
          </div>
        );

      case 'week': {
        if (!weekStart) {
          showToast('Пожалуйста, выберите дату начала недели', 'error');
          return null;
        }
        const monday = getMondayOfWeek(new Date(weekStart));
        const endDate = new Date(monday);
        endDate.setDate(monday.getDate() + 6);

        return (
          <div className="calendar-wrapper">
            <div className={getHeaderClass()}>
              <h2>
                {monday.getDate()} {monthNames[monday.getMonth()]} - {endDate.getDate()}{' '}
                {monthNames[endDate.getMonth()]} {monday.getFullYear()}
              </h2>
              <div className="year">{customSubtitle || 'Недельный планировщик'}</div>
            </div>
            <WeekCalendar
              startDate={weekStart}
              taskLines={taskLines}
              showCheckbox={showCheckboxes}
            />
            <div className="calendar-footer">✦ Планируй • Достигай • Отмечай ✦</div>
          </div>
        );
      }

      case 'day': {
        if (!dayDate) {
          showToast('Пожалуйста, выберите дату', 'error');
          return null;
        }
        if (dayStart >= dayEnd) {
          showToast('Время начала должно быть раньше времени конца', 'error');
          return null;
        }

        const date = new Date(dayDate);
        const dayOfWeek = date.getDay();

        return (
          <div className="calendar-wrapper">
            {headerAlignment !== 'hidden' && (
              <div className={getHeaderClass()}>
                <h2>
                  {date.getDate()} {monthNames[date.getMonth()]} {date.getFullYear()}
                </h2>
                <div className="year">{customSubtitle || dayNamesFull[dayOfWeek]}</div>
              </div>
            )}
            <DayCalendar startHour={dayStart} endHour={dayEnd} showCheckbox={showCheckboxes} />
            <div className="calendar-footer">✦ Планируй • Достигай • Отмечай ✦</div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return <div className="calendar-preview">{renderCalendar()}</div>;
};

export default CalendarPreview;
