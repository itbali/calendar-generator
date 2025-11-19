import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import ViewModeSelector from './ViewModeSelector';
import ThemeSelector from './ThemeSelector';
import AdditionalSettings from './AdditionalSettings';
import HolidayManagement from './HolidayManagement';
import ExportButtons from './ExportButtons';

const Controls = () => {
  const { t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="controls">
      <LanguageSelector />
      <ViewModeSelector />
      <ThemeSelector />
      <AdditionalSettings />
      <HolidayManagement />
      <ExportButtons />

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={handlePrint}>
          🖨️ {t('print')}
        </button>
      </div>
    </div>
  );
};

export default Controls;
