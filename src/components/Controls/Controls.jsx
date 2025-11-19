import React from 'react';
import ViewModeSelector from './ViewModeSelector';
import ThemeSelector from './ThemeSelector';
import AdditionalSettings from './AdditionalSettings';
import HolidayManagement from './HolidayManagement';
import ExportButtons from './ExportButtons';

const Controls = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="controls">
      <ViewModeSelector />
      <ThemeSelector />
      <AdditionalSettings />
      <HolidayManagement />
      <ExportButtons />

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={handlePrint}>
          🖨️ Печать
        </button>
      </div>
    </div>
  );
};

export default Controls;
