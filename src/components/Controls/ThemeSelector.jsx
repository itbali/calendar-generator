import React from 'react';
import { useCalendar } from '../../context/CalendarContext';

const ThemeSelector = () => {
  const { theme, setTheme, darkMode, setDarkMode } = useCalendar();

  const themes = [
    { value: 'blue', gradient: 'linear-gradient(135deg, #2c5f7c, #4a7c95)' },
    { value: 'green', gradient: 'linear-gradient(135deg, #2d7c4f, #4a9d6a)' },
    { value: 'purple', gradient: 'linear-gradient(135deg, #6b4c9a, #8b6bb7)' },
    { value: 'warm', gradient: 'linear-gradient(135deg, #c67a3e, #d4954f)' },
    { value: 'mono', gradient: 'linear-gradient(135deg, #4a4a4a, #6a6a6a)' },
  ];

  return (
    <>
      <div className="control-group">
        <label>Цветовая тема</label>
        <div className="color-themes">
          {themes.map(({ value, gradient }) => (
            <label key={value} className={`theme-option ${theme === value ? 'active' : ''}`}>
              <input
                type="radio"
                name="theme"
                value={value}
                checked={theme === value}
                onChange={e => setTheme(e.target.value)}
              />
              <div className="theme-preview" style={{ background: gradient }}></div>
            </label>
          ))}
        </div>
      </div>

      <div className="control-group">
        <label>
          <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
          Темная тема
        </label>
      </div>
    </>
  );
};

export default ThemeSelector;
