import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider } from '@i18n-bakery/react';
import { HttpBackend } from '@i18n-bakery/core';
import App from './App';

// Initialize the HttpBackend plugin
const httpBackend = new HttpBackend({
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  manifestPath: '/locales/manifest.json'
});

const config = {
  locale: 'en',
  fallbackLocale: 'en',
  plugins: [httpBackend], // Register the plugin
  loader: httpBackend,    // Use it as the loader
  debug: true
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider config={config}>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
