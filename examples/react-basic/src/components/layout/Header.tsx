import React from 'react';
import { useTranslation, useI18n } from '@i18n-bakery/react';

export const Header: React.FC = () => {
  const { t } = useTranslation('common');
  const { setLocale, locale } = useI18n();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value);
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-200 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('welcome')}</h1>
        <p className="mt-2 text-gray-500 text-lg">{t('description')}</p>
      </div>
      
      <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
        <label htmlFor="locale-select" className="font-medium text-gray-700 text-sm pl-2">
          {t('common:actions:switch_language')}:
        </label>
        <div className="relative">
          <select 
            id="locale-select"
            value={locale} 
            onChange={handleLocaleChange}
            className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="en-US">🇺🇸 English (US)</option>
            <option value="es-MX">🇲🇽 Español (MX)</option>
            <option value="it">🇮🇹 Italiano</option>
            <option value="jp">🇯🇵 日本語</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};
