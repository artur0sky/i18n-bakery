import React from 'react';
import { useTranslation } from 'react-i18next';

export const App = () => {
  const { t } = useTranslation('common');

  return (
    <div>
      {t('welcome')}
      {t('auth:title')}
      <button>{t('auth:submit', 'Submit Default')}</button>
      <span>{t('missing.key', 'This is a default value')}</span>
    </div>
  );
};
