import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useLanguage } from '../../context/LanguageContext';
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
  const { t, translations } = useLanguage();

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
              <h2>{translations.months[month]}</h2>
              <div className="year">{customSubtitle || year}</div>
            </div>
            <MonthCalendar
              year={year}
              month={month}
              taskLines={taskLines}
              showCheckbox={showCheckboxes}
            />
            <div className="calendar-footer">{t('footer')}</div>
          </div>
        );

      case 'year':
        return (
          <div className="calendar-wrapper">
            <div className={getHeaderClass()}>
              <h2>{year}</h2>
              <div className="year">{customSubtitle || t('yearPlanner')}</div>
            </div>
            <YearCalendar taskLines={taskLines} showCheckbox={showCheckboxes} />
            <div className="calendar-footer">{t('footer')}</div>
          </div>
        );

      case 'week': {
        if (!weekStart) {
          showToast(t('pleaseSelectWeekStart'), 'error');
          return null;
        }
        const monday = getMondayOfWeek(new Date(weekStart));
        const endDate = new Date(monday);
        endDate.setDate(monday.getDate() + 6);

        return (
          <div className="calendar-wrapper">
            <div className={getHeaderClass()}>
              <h2>
                {monday.getDate()} {translations.months[monday.getMonth()]} - {endDate.getDate()}{' '}
                {translations.months[endDate.getMonth()]} {monday.getFullYear()}
              </h2>
              <div className="year">{customSubtitle || t('weekPlanner')}</div>
            </div>
            <WeekCalendar
              startDate={weekStart}
              taskLines={taskLines}
              showCheckbox={showCheckboxes}
            />
            <div className="calendar-footer">{t('footer')}</div>
          </div>
        );
      }

      case 'day': {
        if (!dayDate) {
          showToast(t('pleaseSelectDate'), 'error');
          return null;
        }
        if (dayStart >= dayEnd) {
          showToast(t('startTimeBeforeEndTime'), 'error');
          return null;
        }

        const date = new Date(dayDate);
        const dayOfWeek = date.getDay();

        return (
          <div className="calendar-wrapper">
            {headerAlignment !== 'hidden' && (
              <div className={getHeaderClass()}>
                <h2>
                  {date.getDate()} {translations.months[date.getMonth()]} {date.getFullYear()}
                </h2>
                <div className="year">{customSubtitle || translations.daysFull[dayOfWeek]}</div>
              </div>
            )}
            <DayCalendar startHour={dayStart} endHour={dayEnd} showCheckbox={showCheckboxes} />
            <div className="calendar-footer">{t('footer')}</div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return <div className="calendar-preview">{renderCalendar()}</div>;
};

export default React.memo(CalendarPreview);
