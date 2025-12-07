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
      <p>{t('description', 'This is a basic example of i18n-bakery.')}</p>
      <p>Current Locale: <strong>{locale}</strong></p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={toggleLocale} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          {t('actions.switch_language')}
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <h3>{t('features.title', 'Features')}</h3>
        <ul>
            <li>{t('features.extraction', 'Automatic Key Extraction')}</li>
            <li>{t('features.compilation', 'Smart Compilation (Baking)')}</li>
            <li>{t('features.splitting', 'Code Splitting & Lazy Loading')}</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
