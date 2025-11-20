import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Определяем язык браузера или используем русский по умолчанию
  const getBrowserLanguage = () => {
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'ru';
  };

  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('calendar-language');
    return saved || getBrowserLanguage();
  });

  // Сохраняем язык в localStorage
  useEffect(() => {
    localStorage.setItem('calendar-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback(lang => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  }, []);

  const t = useCallback(
    key => {
      return translations[language]?.[key] || translations.ru[key] || key;
    },
    [language]
  );

  const value = {
    language,
    setLanguage,
    t,
    translations: translations[language] || translations.ru,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
