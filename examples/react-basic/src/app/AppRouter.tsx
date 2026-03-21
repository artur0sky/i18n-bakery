import React from 'react';
import { Route, Switch, Link, useLocation } from 'wouter';
import { useTranslation, useI18n } from '@i18n-bakery/react';
import { HomePage } from '../features/home/HomePage';
import { ShowcasePage } from '../features/showcase/ShowcasePage';
import { DocsPage } from '../features/docs/DocsPage';
import { RoadmapPage } from '../features/roadmap/RoadmapPage';

const LOCALES = [
  { value: 'en-US', label: '🇺🇸 EN' },
  { value: 'es-MX', label: '🇲🇽 ES' },
  { value: 'it', label: '🇮🇹 IT' },
  { value: 'jp', label: '🇯🇵 JP' },
];

export const AppRouter: React.FC = () => {
  const { t } = useTranslation('common');
  const { setLocale, locale } = useI18n();
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/showcase', label: 'Showcase', icon: '⚡' },
    { path: '/docs', label: 'Docs', icon: '📖' },
    { path: '/roadmap', label: 'Roadmap', icon: '🗺️' },
  ];

  return (
    <div className="min-h-screen bg-surface-0 text-ink-50 font-sans">
      {/* Top glow line */}
      <div className="fixed top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent z-50" />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-surface-0/80 backdrop-blur-xl border-b border-white/7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <span className="text-xl transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6">🥯</span>
                <span className="text-sm font-bold text-ink-50 tracking-tight">i18n-bakery</span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                  v1.0.8
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <div
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'text-amber-400 bg-amber-500/8'
                          : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Locale Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-surface-2 border border-white/8 rounded-xl p-0.5 gap-0.5">
                {LOCALES.map((loc) => (
                  <button
                    key={loc.value}
                    onClick={() => setLocale(loc.value)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg cursor-pointer transition-all duration-150 ${
                      locale === loc.value
                        ? 'bg-amber-500 text-surface-0 shadow-md shadow-amber-500/30'
                        : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`whitespace-nowrap flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    isActive ? 'text-amber-400 bg-amber-500/8' : 'text-ink-400 hover:text-ink-100'
                  }`}>
                    {item.icon} {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/showcase" component={ShowcasePage} />
          <Route path="/docs" component={DocsPage} />
          <Route path="/roadmap" component={RoadmapPage} />
          <Route>
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <div className="text-6xl mb-4">🥯</div>
              <h1 className="text-3xl font-bold text-ink-50 mb-2">404</h1>
              <p className="text-ink-400 mb-6">{t('errors.not_found')}</p>
              <Link href="/" className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-sm font-medium hover:bg-amber-500/20 transition-all">
                {t('errors.go_home')}
              </Link>
            </div>
          </Route>
        </Switch>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/7 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥯</span>
              <span className="text-xs font-semibold text-ink-400">
                i18n-bakery &mdash; Fresh translations, baked to perfection
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-ink-600">
              <a
                href="https://github.com/artur0sky/i18n-bakery"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                GitHub ↗
              </a>
              <span>·</span>
              <span>v1.0.8</span>
              <span>·</span>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
