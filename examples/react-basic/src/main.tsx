import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider } from '@i18n-bakery/react';
import App from './App';

const config = {
  locale: 'en',
  fallbackLocale: 'es',
  loader: {
    load: async (locale: string, ns: string) => {
      console.log(`Loading ${locale}/${ns}...`);
      // Simulate async load
      await new Promise(resolve => setTimeout(resolve, 500));
      if (locale === 'en' && ns === 'common') {
        return { welcome: 'Welcome to the Bakery!', switch: 'Switch Language' };
      }
      if (locale === 'es' && ns === 'common') {
        return { welcome: '¡Bienvenido a la Panadería!', switch: 'Cambiar Idioma' };
      }
      return null;
    }
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider config={config}>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
