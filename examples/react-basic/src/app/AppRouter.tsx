import React from 'react';
import { Route, Switch, Link, useLocation } from 'wouter';
import { useTranslation, useI18n } from '@i18n-bakery/react';
import { HomePage } from '../features/home/HomePage';
import { ShowcasePage } from '../features/showcase/ShowcasePage';
import { DocsPage } from '../features/docs/DocsPage';

export const AppRouter: React.FC = () => {
  const { t } = useTranslation('common');
  const { setLocale, locale } = useI18n();
  const [location] = useLocation();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value);
  };

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/showcase', label: t('nav.showcase') },
    { path: '/docs', label: t('nav.docs') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-2xl">🥯</span>
                <span className="text-xl font-bold text-gray-900">i18n-bakery</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location === item.path
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-3">
              <select
                value={locale}
                onChange={handleLocaleChange}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en-US">🇺🇸 English</option>
                <option value="es-MX">🇲🇽 Español</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="jp">🇯🇵 日本語</option>
              </select>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-3 flex gap-4 overflow-x-auto">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`text-sm font-medium whitespace-nowrap transition-colors ${
                  location === item.path
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/showcase" component={ShowcasePage} />
          <Route path="/docs" component={DocsPage} />
          <Route>
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-6">{t('errors.not_found')}</p>
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('errors.go_home')}
              </Link>
            </div>
          </Route>
        </Switch>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>{t('footer.powered_by')} <span className="font-semibold">i18n-bakery 🥯</span></p>
            <p className="mt-1">{t('footer.version', { version: '1.0.5' })}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
