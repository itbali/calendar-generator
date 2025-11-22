import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useLanguage } from '../../context/LanguageContext';

const AdditionalSettings = () => {
  const {
    showCheckboxes,
    setShowCheckboxes,
    contrastWeekends,
    setContrastWeekends,
    orientation,
    setOrientation,
    taskLines,
    setTaskLines,
    headerAlignment,
    setHeaderAlignment,
    customSubtitle,
    setCustomSubtitle,
    viewMode,
  } = useCalendar();
  const { t } = useLanguage();

  return (
    <>
      <div className="control-group">
        <label>{t('calendarHeader')}</label>
        <div className="control-row">
          <select value={headerAlignment} onChange={e => setHeaderAlignment(e.target.value)}>
            <option value="left">{t('left')}</option>
            <option value="center">{t('center')}</option>
            <option value="right">{t('right')}</option>
            <option value="hidden">{t('hidden')}</option>
          </select>
          <input
            type="text"
            value={customSubtitle}
            onChange={e => setCustomSubtitle(e.target.value)}
            placeholder={t('customSubtitlePlaceholder')}
            style={{ flex: 1, minWidth: '200px' }}
          />
        </div>
      </div>

      <div className="control-group">
        <label>{t('additionalSettings')}</label>
        <div className="settings-grid">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="showCheckboxes"
              checked={showCheckboxes}
              onChange={e => setShowCheckboxes(e.target.checked)}
            />
            <label htmlFor="showCheckboxes">{t('checkboxesBeforeLines')}</label>
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="contrastWeekends"
              checked={contrastWeekends}
              onChange={e => setContrastWeekends(e.target.checked)}
            />
            <label htmlFor="contrastWeekends">{t('contrastWeekends')}</label>
          </div>
          <div className="setting-item">
            <label htmlFor="orientation">{t('orientationLabel')}</label>
            <select
              id="orientation"
              value={orientation}
              onChange={e => setOrientation(e.target.value)}
            >
              <option value="portrait">{t('portrait')}</option>
              <option value="landscape">{t('landscape')}</option>
            </select>
          </div>
          {viewMode !== 'day' && (
            <div className="setting-item">
              <label htmlFor="taskLines">{t('taskLinesLabel')}</label>
              <input
                type="number"
                id="taskLines"
                value={taskLines}
                onChange={e => setTaskLines(parseInt(e.target.value))}
                min="1"
                max="20"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(AdditionalSettings);
