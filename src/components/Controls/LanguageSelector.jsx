import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { languages } from '../../i18n/translations';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="control-group">
      <label>{t('language')}</label>
      <select value={language} onChange={e => setLanguage(e.target.value)} className="language-selector">
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.memo(LanguageSelector);
