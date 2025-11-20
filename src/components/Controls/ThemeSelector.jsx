import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useSubscription } from '../../context/SubscriptionContext';
import Paywall from '../Paywall';

const ThemeSelector = () => {
  const { theme, setTheme, darkMode, setDarkMode } = useCalendar();
  const { hasFeature } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const themes = [
    { value: 'blue', gradient: 'linear-gradient(135deg, #2c5f7c, #4a7c95)', isPremium: false },
    { value: 'green', gradient: 'linear-gradient(135deg, #2d7c4f, #4a9d6a)', isPremium: false },
    { value: 'purple', gradient: 'linear-gradient(135deg, #6b4c9a, #8b6bb7)', isPremium: true },
    { value: 'warm', gradient: 'linear-gradient(135deg, #c67a3e, #d4954f)', isPremium: true },
    { value: 'mono', gradient: 'linear-gradient(135deg, #4a4a4a, #6a6a6a)', isPremium: true },
  ];

  const handleThemeChange = (value, isPremium) => {
    if (isPremium && !hasFeature('premiumThemes')) {
      setShowPaywall(true);
      return;
    }
    setTheme(value);
  };

  return (
    <>
      <div className="control-group">
        <label>Цветовая тема</label>
        <div className="color-themes">
          {themes.map(({ value, gradient, isPremium }) => (
            <label
              key={value}
              className={`theme-option ${theme === value ? 'active' : ''} ${isPremium && !hasFeature('premiumThemes') ? 'premium-locked' : ''}`}
              onClick={() => handleThemeChange(value, isPremium)}
            >
              <input
                type="radio"
                name="theme"
                value={value}
                checked={theme === value}
                onChange={() => {}}
                style={{ display: 'none' }}
              />
              <div className="theme-preview" style={{ background: gradient }}>
                {isPremium && !hasFeature('premiumThemes') && (
                  <div className="premium-badge">🔒</div>
                )}
              </div>
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

      {showPaywall && (
        <Paywall
          feature="premiumThemes"
          onClose={() => setShowPaywall(false)}
        />
      )}
    </>
  );
};

export default React.memo(ThemeSelector);
