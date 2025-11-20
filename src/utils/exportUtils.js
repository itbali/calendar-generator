import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Добавить водяной знак на canvas
 */
const addWatermarkToCanvas = canvas => {
  const ctx = canvas.getContext('2d');
  const watermarkText = 'Calendar Generator - Get Pro';

  // Настройки водяного знака
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#666666';
  ctx.textAlign = 'center';

  // Размещаем водяной знак в центре внизу
  const x = canvas.width / 2;
  const y = canvas.height - 30;

  ctx.fillText(watermarkText, x, y);
  ctx.restore();
};

/**
 * Экспорт календаря в PNG
 */
export const exportToPNG = async (calendarElement, addWatermark = false) => {
  try {
    const canvas = await html2canvas(calendarElement, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true,
    });

    // Добавляем водяной знак если необходимо
    if (addWatermark) {
      addWatermarkToCanvas(canvas);
    }

    // Создаем ссылку для скачивания
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `calendar-${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    return true;
  } catch (error) {
    console.error('Ошибка экспорта в PNG:', error);
    return false;
  }
};

/**
 * Экспорт календаря в PDF
 */
export const exportToPDF = async (calendarElement, orientation = 'portrait', addWatermark = false) => {
  try {
    const canvas = await html2canvas(calendarElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
    });

    // Добавляем водяной знак если необходимо
    if (addWatermark) {
      addWatermarkToCanvas(canvas);
    }

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: orientation === 'landscape' ? 'l' : 'p',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Вычисляем размеры изображения для PDF
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Если изображение выше страницы, масштабируем
    if (imgHeight > pdfHeight) {
      const scale = pdfHeight / imgHeight;
      const scaledWidth = imgWidth * scale;
      const scaledHeight = pdfHeight;
      const xOffset = (pdfWidth - scaledWidth) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, scaledHeight);
    } else {
      const yOffset = (pdfHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
    }

    const timestamp = new Date().toISOString().split('T')[0];
    pdf.save(`calendar-${timestamp}.pdf`);

    return true;
  } catch (error) {
    console.error('Ошибка экспорта в PDF:', error);
    return false;
  }
};

/**
 * Генерация iCalendar (.ics) файла для праздников
 */
export const exportToICS = (holidays, year) => {
  try {
    const events = [];

    holidays.forEach(holiday => {
      // Парсим дату праздника (формат MM-DD)
      const [month, day] = holiday.date.split('-').map(Number);

      // Форматируем дату для ICS (YYYYMMDD)
      const dateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;

      const event = [
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `SUMMARY:${holiday.name}`,
        `DESCRIPTION:${holiday.name}`,
        `UID:${holiday.id || `${holiday.date}-${year}`}@calendar-generator.com`,
        'STATUS:CONFIRMED',
        'TRANSP:TRANSPARENT',
        'END:VEVENT',
      ].join('\r\n');

      events.push(event);
    });

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Calendar Generator//RU',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Праздники',
      'X-WR-TIMEZONE:Europe/Moscow',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n');

    // Создаем Blob и скачиваем файл
    // eslint-disable-next-line no-undef
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    // eslint-disable-next-line no-undef
    link.href = URL.createObjectURL(blob);
    link.download = `holidays-${year}.ics`;
    link.click();
    // eslint-disable-next-line no-undef
    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error('Ошибка экспорта в ICS:', error);
    return false;
  }
};
