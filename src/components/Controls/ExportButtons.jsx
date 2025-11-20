import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useLanguage } from '../../context/LanguageContext';
import { exportToPNG, exportToPDF, exportToICS } from '../../utils/exportUtils';

const ExportButtons = () => {
  const { orientation, year, getAllHolidays, showToast, enabledHolidays } = useCalendar();
  const { hasFeature } = useSubscription();
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    const calendarElement = document.querySelector('.calendar-preview');

    if (!calendarElement) {
      showToast('Календарь не найден', 'error');
      setIsExporting(false);
      return;
    }

    const addWatermark = !hasFeature('exportWatermark');
    const success = await exportToPDF(calendarElement, orientation, addWatermark);
    setIsExporting(false);

    if (success) {
      showToast('Календарь экспортирован в PDF', 'success');
    } else {
      showToast('Ошибка экспорта в PDF', 'error');
    }
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    const calendarElement = document.querySelector('.calendar-preview');

    if (!calendarElement) {
      showToast('Календарь не найден', 'error');
      setIsExporting(false);
      return;
    }

    const addWatermark = !hasFeature('exportWatermark');
    const success = await exportToPNG(calendarElement, addWatermark);
    setIsExporting(false);

    if (success) {
      showToast('Календарь экспортирован в PNG', 'success');
    } else {
      showToast('Ошибка экспорта в PNG', 'error');
    }
  };

  const handleExportICS = () => {
    const allHolidays = getAllHolidays();

    // Фильтруем только включенные праздники
    const activeHolidays = allHolidays.filter(holiday => {
      const holidayId =
        holiday.country === 'custom' ? holiday.id : `${holiday.country}-${holiday.date}`;
      return enabledHolidays.has(holidayId);
    });

    if (activeHolidays.length === 0) {
      showToast('Нет активных праздников для экспорта', 'error');
      return;
    }

    const success = exportToICS(activeHolidays, year);

    if (success) {
      showToast(`Экспортировано ${activeHolidays.length} праздников в ICS`, 'success');
    } else {
      showToast('Ошибка экспорта праздников', 'error');
    }
  };

  return (
    <div className="export-section">
      <label className="section-label">{t('exportCalendar')}</label>
      <div className="export-buttons">
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="export-btn export-pdf"
          title={t('exportToPDFTitle')}
        >
          {isExporting ? '⏳ ' + t('importing') : '📄 PDF'}
        </button>

        <button
          onClick={handleExportPNG}
          disabled={isExporting}
          className="export-btn export-png"
          title={t('exportToPNGTitle')}
        >
          {isExporting ? '⏳ ' + t('importing') : '🖼️ PNG'}
        </button>

        <button
          onClick={handleExportICS}
          className="export-btn export-ics"
          title={t('exportToICalTitle')}
        >
          {t('exportICalButton')}
        </button>
      </div>
      <p className="export-hint">{t('exportHint')}</p>
    </div>
  );
};

export default React.memo(ExportButtons);
