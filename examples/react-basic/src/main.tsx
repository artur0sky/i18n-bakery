import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { I18nProvider } from '@i18n-bakery/react';
import { HttpBackend, NumberFormatPlugin, CapitalizePlugin } from '@i18n-bakery/core';

// Initialize plugins
const httpBackend = new HttpBackend({
  loadPath: '/locales/{{lng}}/{{ns}}.json'
});

const numberFormat = new NumberFormatPlugin();
const capitalize = new CapitalizePlugin();

const config = {
  locale: 'en-US',
  fallbackLocale: 'en-US',
  supportedLocales: ['en-US', 'es-MX', 'it', 'jp'],
  defaultNamespace: 'common', // Set default namespace to 'common'
  plugins: [httpBackend, numberFormat, capitalize], // Register plugins
  loader: httpBackend,
  debug: true
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider config={config}>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
