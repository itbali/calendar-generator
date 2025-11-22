import React, { useState } from 'react';
import { CheckSquare, Check, Trash2 } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { useLanguage } from '../../context/LanguageContext';
import { MILLIS_PER_DAY } from '../../utils/recurringUtils';

const HabitTracker = () => {
  const { t } = useLanguage();
  const { habits, addHabit, deleteHabit, toggleHabitDay, showToast } = useCalendar();
  const [habitName, setHabitName] = useState('');

  const handleAddHabit = () => {
    if (!habitName.trim()) {
      showToast(t('habitName'), 'error');
      return;
    }

    addHabit(habitName.trim());
    setHabitName('');
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleAddHabit();
    }
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const calculateStreak = completedDays => {
    if (completedDays.length === 0) return { current: 0, best: 0 };

    const sortedDays = [...completedDays].sort((a, b) => new Date(b) - new Date(a));
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak
    for (let i = 0; i < sortedDays.length; i++) {
      const dayDate = new Date(sortedDays[i]);
      dayDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (dayDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    for (let i = 0; i < sortedDays.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedDays[i - 1]);
        const currDate = new Date(sortedDays[i]);
        prevDate.setHours(0, 0, 0, 0);
        currDate.setHours(0, 0, 0, 0);

        const diffTime = prevDate - currDate;
        const diffDays = Math.ceil(diffTime / MILLIS_PER_DAY);

        if (diffDays === 1) {
          tempStreak++;
        } else {
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    return { current: currentStreak, best: bestStreak };
  };

  return (
    <div className="habit-tracker-widget">
      <div className="widget-header">
        <h3>
          <CheckSquare size={20} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
          {t('habitTracker')}
        </h3>
      </div>

      <div className="add-habit-section">
        <input
          type="text"
          value={habitName}
          onChange={e => setHabitName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('habitName')}
          className="habit-input"
        />
        <button onClick={handleAddHabit} className="btn btn-primary btn-add-habit">
          {t('addHabit')}
        </button>
      </div>

      <div className="habits-list">
        {habits.length === 0 ? (
          <div className="empty-state">{t('noHabits')}</div>
        ) : (
          habits.map(habit => {
            const today = getTodayString();
            const isCompletedToday = habit.completedDays.includes(today);
            const streaks = calculateStreak(habit.completedDays);

            return (
              <div key={habit.id} className="habit-item">
                <div className="habit-header">
                  <div className="habit-name-section">
                    <button
                      onClick={() => toggleHabitDay(habit.id, today)}
                      className={`habit-checkbox ${isCompletedToday ? 'completed' : ''}`}
                      title={isCompletedToday ? t('habitUncompleted') : t('habitCompleted')}
                    >
                      {isCompletedToday ? <Check size={16} /> : ''}
                    </button>
                    <span className="habit-name">{habit.name}</span>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="btn-delete-habit"
                    title={t('delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="habit-stats">
                  <div className="stat">
                    <span className="stat-label">{t('completedDays')}:</span>
                    <span className="stat-value">{habit.completedDays.length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">{t('currentStreak')}:</span>
                    <span className="stat-value">
                      {streaks.current} {t('days')}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">{t('bestStreak')}:</span>
                    <span className="stat-value">
                      {streaks.best} {t('days')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default React.memo(HabitTracker);
