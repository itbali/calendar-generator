import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import CollapsibleSection from '../CollapsibleSection';
import ViewModeSelector from './ViewModeSelector';
import ThemeSelector from './ThemeSelector';
import AdditionalSettings from './AdditionalSettings';
import HolidayManagement from './HolidayManagement';
import ExportButtons from './ExportButtons';
import TemplateManager from './TemplateManager';
import WidgetsManager from './WidgetsManager';

const Controls = () => {
  const { t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="controls">
      <CollapsibleSection title={t('templates')} defaultOpen={false}>
        <TemplateManager />
      </CollapsibleSection>

      <CollapsibleSection title={t('displaySettings')} defaultOpen={true}>
        <ViewModeSelector />
        <ThemeSelector />
      </CollapsibleSection>

      <CollapsibleSection title={t('calendarSettings')} defaultOpen={true}>
        <AdditionalSettings />
      </CollapsibleSection>

      <CollapsibleSection title={t('widgets')} defaultOpen={false}>
        <WidgetsManager />
      </CollapsibleSection>

      <CollapsibleSection title={t('holidays')} defaultOpen={true}>
        <HolidayManagement />
      </CollapsibleSection>

      <CollapsibleSection title={t('exportAndActions')} defaultOpen={true}>
        <ExportButtons />
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={handlePrint}>
            🖨️ {t('print')}
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default Controls;
