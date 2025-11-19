import React from 'react';

const DayCalendar = ({ startHour, endHour, showCheckbox }) => {
  return (
    <div className="day-view">
      <div className="time-slots">
        {Array.from({ length: endHour - startHour + 1 }, (_, i) => {
          const hour = startHour + i;
          return (
            <div key={hour} className="time-slot">
              <div className="time-label">{hour.toString().padStart(2, '0')}:00</div>
              <div className={`time-content ${showCheckbox ? 'with-checkbox' : ''}`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(DayCalendar);
