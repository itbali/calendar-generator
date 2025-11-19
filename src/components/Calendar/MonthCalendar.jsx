import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { monthNames, dayNames } from '../../utils/constants';
import { getDaysInMonth, getFirstDayOfMonth } from '../../utils/dateUtils';
import TaskLines from './TaskLines';

const MonthCalendar = ({ year, month, taskLines, showCheckbox }) => {
  const { isHoliday } = useCalendar();
  const daysInMonth = getDaysInMonth(year, month);
  let firstDay = getFirstDayOfMonth(year, month);

  // Преобразуем воскресенье (0) в 7 для понедельника как первого дня
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const totalRows = Math.ceil((firstDay + daysInMonth) / 7);
  let day = 1;

  return (
    <table className="calendar-table">
      <tbody>
        {Array.from({ length: totalRows }, (_, row) => (
          <tr key={row}>
            {Array.from({ length: 7 }, (_, col) => {
              const cellIndex = row * 7 + col;

              if (cellIndex < firstDay || day > daysInMonth) {
                return <td key={col} className="empty-cell"></td>;
              }

              const currentDay = day++;
              const date = new Date(year, month, currentDay);
              const dayOfWeek = date.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const holiday = isHoliday(year, month, currentDay);

              const cellClasses = [];
              if (isWeekend) cellClasses.push('weekend');
              if (holiday) cellClasses.push('holiday');

              return (
                <td key={col} className={cellClasses.join(' ')}>
                  <div className="date-number">
                    {currentDay}{' '}
                    <span className="weekday">{dayNames[dayOfWeek]}</span>
                  </div>
                  {holiday && (
                    <div className="holiday-name">{holiday.name}</div>
                  )}
                  <TaskLines count={taskLines} showCheckbox={showCheckbox} />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MonthCalendar;
