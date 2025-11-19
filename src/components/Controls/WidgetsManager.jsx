import React from 'react';
import NotesWidget from '../Widgets/NotesWidget';
import HabitTracker from '../Widgets/HabitTracker';
import RecurringEvents from '../Widgets/RecurringEvents';
import '../../styles/Widgets.css';

const WidgetsManager = () => {
  return (
    <div className="widgets-container">
      <RecurringEvents />
      <NotesWidget />
      <HabitTracker />
    </div>
  );
};

export default React.memo(WidgetsManager);
