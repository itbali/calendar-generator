import React from 'react';

const TaskLines = ({ count, showCheckbox }) => {
  return (
    <div className="task-lines">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`task-line ${showCheckbox ? 'with-checkbox' : ''}`}></div>
      ))}
    </div>
  );
};

export default React.memo(TaskLines);
