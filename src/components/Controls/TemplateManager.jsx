import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSubscription } from '../../context/SubscriptionContext';
import {
  predefinedTemplates,
  saveTemplate,
  getCustomTemplates,
  deleteTemplate,
  applyTemplate,
} from '../../utils/templates';

const TemplateManager = () => {
  const { t } = useLanguage();
  const { checkLimit, getRemainingCount } = useSubscription();
  const calendarContext = useCalendar();
  const {
    viewMode,
    orientation,
    theme,
    darkMode,
    taskLines,
    showCheckboxes,
    contrastWeekends,
    headerAlignment,
    customSubtitle,
    enabledHolidays,
    customHolidays,
    showToast,
    setViewMode,
    setOrientation,
    setTheme,
    setDarkMode,
    setTaskLines,
    setShowCheckboxes,
    setContrastWeekends,
    setHeaderAlignment,
    setCustomSubtitle,
    setEnabledHolidays,
    setCustomHolidays,
  } = calendarContext;

  const [customTemplates, setCustomTemplates] = useState(() => getCustomTemplates());
  const [templateName, setTemplateName] = useState('');

  const loadCustomTemplates = () => {
    setCustomTemplates(getCustomTemplates());
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      showToast(t('templateName'), 'error');
      return;
    }

    // Проверка лимита шаблонов
    const currentTemplateCount = customTemplates.length;
    if (!checkLimit('maxCustomTemplates', currentTemplateCount)) {
      showToast(t('templateLimitMessage'), 'error');
      return;
    }

    const currentSettings = {
      viewMode,
      orientation,
      theme,
      darkMode,
      taskLines,
      showCheckboxes,
      contrastWeekends,
      headerAlignment,
      customSubtitle,
      enabledHolidays,
      customHolidays,
    };

    const success = saveTemplate(templateName, currentSettings);
    if (success) {
      showToast(t('templateSaved'), 'success');
      setTemplateName('');
      loadCustomTemplates();
    }
  };

  const handleLoadTemplate = template => {
    const setters = {
      setViewMode,
      setOrientation,
      setTheme,
      setDarkMode,
      setTaskLines,
      setShowCheckboxes,
      setContrastWeekends,
      setHeaderAlignment,
      setCustomSubtitle,
      setEnabledHolidays,
      setCustomHolidays,
    };

    const success = applyTemplate(template, setters);
    if (success) {
      showToast(t('templateLoaded'), 'success');
    }
  };

  const handleDeleteTemplate = templateId => {
    const success = deleteTemplate(templateId);
    if (success) {
      showToast(t('templateDeleted'), 'success');
      loadCustomTemplates();
    }
  };

  return (
    <div className="template-manager">
      {/* Предустановленные шаблоны */}
      <div className="template-section">
        <label className="section-label">{t('predefinedTemplates')}</label>
        <div className="template-grid">
          <div
            className="template-card predefined"
            onClick={() => handleLoadTemplate(predefinedTemplates.minimalist)}
          >
            <div className="template-icon">✨</div>
            <div className="template-info">
              <div className="template-title">{t('templateMinimalist')}</div>
              <div className="template-desc">{t('templateMinimalistDesc')}</div>
            </div>
            <button className="template-load-btn">{t('loadTemplate')}</button>
          </div>

          <div
            className="template-card predefined"
            onClick={() => handleLoadTemplate(predefinedTemplates.taskPlanner)}
          >
            <div className="template-icon">✅</div>
            <div className="template-info">
              <div className="template-title">{t('templateTaskPlanner')}</div>
              <div className="template-desc">{t('templateTaskPlannerDesc')}</div>
            </div>
            <button className="template-load-btn">{t('loadTemplate')}</button>
          </div>

          <div
            className="template-card predefined"
            onClick={() => handleLoadTemplate(predefinedTemplates.familyCalendar)}
          >
            <div className="template-icon">👨‍👩‍👧‍👦</div>
            <div className="template-info">
              <div className="template-title">{t('templateFamilyCalendar')}</div>
              <div className="template-desc">{t('templateFamilyCalendarDesc')}</div>
            </div>
            <button className="template-load-btn">{t('loadTemplate')}</button>
          </div>
        </div>
      </div>

      {/* Сохранить текущие настройки */}
      <div className="template-section">
        <label className="section-label">
          {t('saveAsTemplate')}
          <span className="template-limit-hint">
            {' '}
            ({customTemplates.length}/
            {getRemainingCount('maxCustomTemplates', customTemplates.length) +
              customTemplates.length}
            )
          </span>
        </label>
        <div className="save-template-form">
          <input
            type="text"
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            placeholder={t('templateName')}
            className="template-name-input"
          />
          <button onClick={handleSaveTemplate} className="btn btn-primary">
            💾 {t('saveAsTemplate')}
          </button>
        </div>
      </div>

      {/* Пользовательские шаблоны */}
      <div className="template-section">
        <label className="section-label">{t('myTemplates')}</label>
        {customTemplates.length === 0 ? (
          <div className="no-templates-message">{t('noCustomTemplates')}</div>
        ) : (
          <div className="custom-templates-list">
            {customTemplates.map(template => (
              <div key={template.id} className="template-card custom">
                <div className="template-icon">📋</div>
                <div className="template-info">
                  <div className="template-title">{template.name}</div>
                  <div className="template-date">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="template-actions">
                  <button
                    onClick={() => handleLoadTemplate(template)}
                    className="template-action-btn load"
                  >
                    {t('loadTemplate')}
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="template-action-btn delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TemplateManager);
