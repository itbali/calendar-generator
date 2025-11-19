import React from 'react';
import { monthNames } from '../../utils/constants';

const YearCalendar = ({ year: _year, taskLines, showCheckbox }) => {
  return (
    <div className="year-grid">
      {monthNames.map((monthName, index) => (
        <div key={index} className="month-mini">
          <div className="month-title">{monthName}</div>
          <div className="goal-lines">
            {Array.from({ length: taskLines }, (_, i) => (
              <div key={i} className={`goal-line ${showCheckbox ? 'with-checkbox' : ''}`}></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(YearCalendar);
