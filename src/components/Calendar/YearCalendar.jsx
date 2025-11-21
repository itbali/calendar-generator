import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const YearCalendar = ({ taskLines, showCheckbox }) => {
  const { translations } = useLanguage();

  return (
    <div className="year-grid">
      {translations.months.map((monthName, index) => (
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
