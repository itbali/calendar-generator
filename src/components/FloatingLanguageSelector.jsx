import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { languages } from '../i18n/translations';

const FloatingLanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="floating-language-selector">
      <button
        className={`language-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Change Language / Cambiar idioma / Mudar idioma / Sprache ändern"
      >
        <span className="language-flag">{currentLanguage?.flag}</span>
        <span className="language-chevron">{isOpen ? '×' : '◀'}</span>
      </button>

      {isOpen && (
        <div className="language-menu">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(FloatingLanguageSelector);
