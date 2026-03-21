import React from 'react';
import { useTranslation, useI18n } from '@i18n-bakery/react';

function App() {
  const { t } = useTranslation('common');
  const { setLocale, locale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'es' : 'en');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>{t('welcome')}</h1>
      <p>Current Locale: <strong>{locale}</strong></p>
      <button onClick={toggleLocale}>
        {t('switch')}
      </button>
    </div>
  );
}

export default App;
