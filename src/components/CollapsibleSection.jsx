import React, { useState } from 'react';

const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`collapsible-section ${isOpen ? 'open' : 'closed'}`}>
      <button className="collapsible-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="section-title">{title}</span>
        <span className="collapse-icon">{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && <div className="collapsible-content">{children}</div>}
    </div>
  );
};

export default React.memo(CollapsibleSection);
