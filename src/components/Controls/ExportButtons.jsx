import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { exportToPNG, exportToPDF, exportToICS } from '../../utils/exportUtils';

const ExportButtons = () => {
  const {
    orientation,
    year,
    getAllHolidays,
    showToast,
    enabledHolidays,
  } = useCalendar();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    const calendarElement = document.querySelector('.calendar-preview');

    if (!calendarElement) {
      showToast('Календарь не найден', 'error');
      setIsExporting(false);
      return;
    }

    const success = await exportToPDF(calendarElement, orientation);
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

    const success = await exportToPNG(calendarElement);
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
      const holidayId = holiday.country === 'custom' ? holiday.id : `${holiday.country}-${holiday.date}`;
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
      <label className="section-label">Экспорт календаря</label>
      <div className="export-buttons">
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="export-btn export-pdf"
          title="Экспорт календаря в PDF"
        >
          {isExporting ? '⏳ Экспорт...' : '📄 PDF'}
        </button>

        <button
          onClick={handleExportPNG}
          disabled={isExporting}
          className="export-btn export-png"
          title="Экспорт календаря в PNG"
        >
          {isExporting ? '⏳ Экспорт...' : '🖼️ PNG'}
        </button>

        <button
          onClick={handleExportICS}
          className="export-btn export-ics"
          title="Экспорт праздников в iCalendar"
        >
          📅 iCal
        </button>
      </div>
      <p className="export-hint">
        PDF/PNG - для печати и сохранения, iCal - для импорта праздников в календарь
      </p>
    </div>
  );
};

export default ExportButtons;
