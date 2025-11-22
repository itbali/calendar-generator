import React, { useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { useLanguage } from '../../context/LanguageContext';

const RecurringEvents = () => {
  const { t } = useLanguage();
  const { recurringEvents, addRecurringEvent, deleteRecurringEvent, showToast } = useCalendar();

  const [eventTitle, setEventTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hasEndDate, setHasEndDate] = useState(false);
  const [repeatPattern, setRepeatPattern] = useState('monthly');
  const [interval, setInterval] = useState(1);

  const handleAddEvent = () => {
    if (!eventTitle.trim()) {
      showToast(t('eventTitle'), 'error');
      return;
    }

    if (!startDate) {
      showToast(t('startDate'), 'error');
      return;
    }

    const newEvent = {
      title: eventTitle.trim(),
      startDate,
      endDate: hasEndDate ? endDate : null,
      pattern: repeatPattern,
      interval: parseInt(interval, 10),
    };

    addRecurringEvent(newEvent);
    setEventTitle('');
    setStartDate('');
    setEndDate('');
    setHasEndDate(false);
    setRepeatPattern('monthly');
    setInterval(1);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddEvent();
    }
  };

  const getIntervalLabel = () => {
    const num = parseInt(interval, 10);
    if (isNaN(num) || num <= 0) return '';

    const patternKeyMap = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
      yearly: 'year',
    };
    let key = patternKeyMap[repeatPattern] || 'year';

    // Русская множественность
    if (num === 1) {
      key += '_one';
    } else if (num >= 2 && num <= 4) {
      key += '_few';
    } else {
      key += '_many';
    }

    return t(key);
  };

  return (
    <div className="recurring-events-widget">
      <div className="widget-header">
        <h3>
          <RefreshCw size={20} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
          {t('recurringEvents')}
        </h3>
      </div>

      <div className="add-recurring-event-section">
        <input
          type="text"
          value={eventTitle}
          onChange={e => setEventTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('eventTitle')}
          className="event-input"
        />

        <div className="date-row">
          <div className="date-input-group">
            <label>{t('startDate')}</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="date-input-group">
            <label>
              <input
                type="checkbox"
                checked={hasEndDate}
                onChange={e => setHasEndDate(e.target.checked)}
              />{' '}
              {t('endDate')}
            </label>
            {hasEndDate && (
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="date-input"
                min={startDate}
              />
            )}
          </div>
        </div>

        <div className="repeat-row">
          <div className="select-group">
            <label>{t('repeatPattern')}</label>
            <select
              value={repeatPattern}
              onChange={e => setRepeatPattern(e.target.value)}
              className="pattern-select"
            >
              <option value="daily">{t('daily')}</option>
              <option value="weekly">{t('weekly')}</option>
              <option value="monthly">{t('monthly')}</option>
              <option value="yearly">{t('yearly')}</option>
            </select>
          </div>

          <div className="interval-group">
            <label>{t('repeatEvery')}</label>
            <div className="interval-input-wrapper">
              <input
                type="number"
                value={interval}
                onChange={e => setInterval(e.target.value)}
                min="1"
                max="99"
                className="interval-input"
              />
              <span className="interval-label">{getIntervalLabel()}</span>
            </div>
          </div>
        </div>

        <button onClick={handleAddEvent} className="btn btn-primary btn-add-event">
          {t('addRecurringEvent')}
        </button>
      </div>

      <div className="recurring-events-list">
        {recurringEvents.length === 0 ? (
          <div className="empty-state">{t('noRecurringEvents')}</div>
        ) : (
          recurringEvents.map(event => (
            <div key={event.id} className="recurring-event-item">
              <div className="event-header">
                <span className="event-title">{event.title}</span>
                <button
                  onClick={() => deleteRecurringEvent(event.id)}
                  className="btn-delete-event"
                  title={t('delete')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="event-details">
                <span className="event-detail">
                  {t('startDate')}: {new Date(event.startDate).toLocaleDateString()}
                </span>
                {event.endDate && (
                  <span className="event-detail">
                    {t('endDate')}: {new Date(event.endDate).toLocaleDateString()}
                  </span>
                )}
                <span className="event-detail">
                  {t('repeatPattern')}: {t(event.pattern)} ({t('repeatEvery')} {event.interval}{' '}
                  {(() => {
                    const patternKeyMap = {
                      daily: 'day',
                      weekly: 'week',
                      monthly: 'month',
                      yearly: 'year',
                    };
                    const baseKey = patternKeyMap[event.pattern] || 'year';
                    const num = event.interval;
                    if (num === 1) return t(`${baseKey}_one`);
                    if (num >= 2 && num <= 4) return t(`${baseKey}_few`);
                    return t(`${baseKey}_many`);
                  })()}
                  )
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(RecurringEvents);
