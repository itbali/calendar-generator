import React from 'react';
import NotesWidget from '../Widgets/NotesWidget';
import HabitTracker from '../Widgets/HabitTracker';
import '../../styles/Widgets.css';

const WidgetsManager = () => {
  return (
    <div className="widgets-container">
      <NotesWidget />
      <HabitTracker />
    </div>
  );
};

export default React.memo(WidgetsManager);
