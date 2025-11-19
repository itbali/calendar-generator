import React from 'react';
import { useCalendar } from '../../context/CalendarContext';

const AdditionalSettings = () => {
  const {
    showCheckboxes, setShowCheckboxes,
    contrastWeekends, setContrastWeekends,
    orientation, setOrientation,
    taskLines, setTaskLines,
    headerAlignment, setHeaderAlignment,
    customSubtitle, setCustomSubtitle,
    viewMode
  } = useCalendar();

  return (
    <>
      <div className="control-group">
        <label>Заголовок календаря</label>
        <div className="control-row">
          <select
            value={headerAlignment}
            onChange={(e) => setHeaderAlignment(e.target.value)}
          >
            <option value="left">Слева</option>
            <option value="center">По центру</option>
            <option value="right">Справа</option>
            <option value="hidden">Скрыт</option>
          </select>
          <input
            type="text"
            value={customSubtitle}
            onChange={(e) => setCustomSubtitle(e.target.value)}
            placeholder="Текст под заголовком (необязательно)"
            style={{ flex: 1, minWidth: '200px' }}
          />
        </div>
      </div>

      <div className="control-group">
        <label>Дополнительные настройки</label>
        <div className="settings-grid">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="showCheckboxes"
              checked={showCheckboxes}
              onChange={(e) => setShowCheckboxes(e.target.checked)}
            />
            <label htmlFor="showCheckboxes">Чекбоксы перед строками</label>
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="contrastWeekends"
              checked={contrastWeekends}
              onChange={(e) => setContrastWeekends(e.target.checked)}
            />
            <label htmlFor="contrastWeekends">Контрастные выходные</label>
          </div>
          <div className="setting-item">
            <label htmlFor="orientation">Ориентация:</label>
            <select
              id="orientation"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
            >
              <option value="portrait">Книжная</option>
              <option value="landscape">Альбомная</option>
            </select>
          </div>
          {viewMode !== 'day' && (
            <div className="setting-item">
              <label htmlFor="taskLines">Строк для дел:</label>
              <input
                type="number"
                id="taskLines"
                value={taskLines}
                onChange={(e) => setTaskLines(parseInt(e.target.value))}
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

export default AdditionalSettings;
