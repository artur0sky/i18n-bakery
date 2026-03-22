import React, { useState, useRef, useEffect } from 'react';
import { Route, Switch, Link, useLocation } from 'wouter';
import { useTranslation, useI18n } from '@i18n-bakery/react';
import ReactCountryFlag from 'react-country-flag';
import {
  IconHome,
  IconBolt,
  IconBook,
  IconMap,
  IconBrandGithub,
  IconBread,
  IconChevronDown,
  IconRobot,
} from '@tabler/icons-react';
import { HomePage } from '../features/home/HomePage';
import { ShowcasePage } from '../features/showcase/ShowcasePage';
import { DocsPage } from '../features/docs/DocsPage';
import { RoadmapPage } from '../features/roadmap/RoadmapPage';
import { TrayPage } from '../features/tray/TrayPage';

const LOCALES = [
  { value: 'en-US', label: 'English (US)', flag: 'US', soon: false },
  { value: 'es-MX', label: 'Español (MX)', flag: 'MX', soon: false },
  { value: 'it', label: 'Italiano', flag: 'IT', soon: false },
  { value: 'jp', label: '日本語', flag: 'JP', soon: false },
  { value: 'fr', label: 'Français', flag: 'FR', soon: true },
  { value: 'pt', label: 'Português', flag: 'PT', soon: true },
  { value: 'zh', label: '中文', flag: 'CN', soon: true },
  { value: 'ru', label: 'Русский', flag: 'RU', soon: true },
  { value: 'ko', label: '한국어', flag: 'KR', soon: true },
  { value: 'de', label: 'Deutsch', flag: 'DE', soon: true },
];

export const AppRouter: React.FC = () => {
  const { t } = useTranslation('common');
  const { setLocale, locale } = useI18n();
  const [location] = useLocation();
  const [isLocaleOpen, setIsLocaleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocaleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLocale = LOCALES.find(l => l.value === locale) || LOCALES[0];

  const navItems = [
    { path: '/', key: 'home', Icon: IconHome },
    { path: '/showcase', key: 'showcase', Icon: IconBolt },
    { path: '/docs', key: 'docs', Icon: IconBook },
    { path: '/roadmap', key: 'roadmap', Icon: IconMap },
    { path: '/tray', key: 'tray', Icon: IconRobot },
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
                <IconBread
                  size={22}
                  className="text-amber-400 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6"
                />
                <span className="text-sm font-bold text-ink-50 tracking-tight">{t('app_name')}</span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                  v1.0.8
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ path, key, Icon }) => {
                const isActive = location === path;
                return (
                  <Link key={path} href={path}>
                    <div
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'text-amber-400 bg-amber-500/8'
                          : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
                      }`}
                    >
                      <Icon size={13} />
                      <span>{t(`nav.${key}`)}</span>
                      {isActive && (
                        <span className="absolute bottom-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Locale Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLocaleOpen(!isLocaleOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-white/8 rounded-xl text-xs font-semibold text-ink-200 hover:text-ink-50 hover:border-white/20 transition-all cursor-pointer shadow-sm active:scale-95 min-w-[140px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <ReactCountryFlag
                    countryCode={currentLocale.flag}
                    svg
                    style={{ width: '16px', height: '12px', borderRadius: '2px', objectFit: 'cover' }}
                  />
                  <span>{currentLocale.label}</span>
                </div>
                <IconChevronDown size={12} className={`text-ink-500 transition-transform duration-200 ${isLocaleOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLocaleOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-surface-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-1.5 space-y-0.5 max-h-[400px] overflow-y-auto no-scrollbar">
                    {LOCALES.map((loc) => {
                      const isActive = locale === loc.value;
                      return (
                        <button
                          key={loc.value}
                          onClick={() => {
                            if (!loc.soon) {
                              setLocale(loc.value);
                            }
                            setIsLocaleOpen(false);
                          }}
                          disabled={loc.soon}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-100 cursor-pointer ${
                            isActive
                              ? 'bg-amber-500 text-surface-0 font-bold'
                              : loc.soon
                                ? 'text-ink-600 cursor-not-allowed opacity-60'
                                : 'text-ink-400 hover:bg-white/5 hover:text-ink-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ReactCountryFlag
                              countryCode={loc.flag}
                              svg
                              style={{ width: '16px', height: '12px', borderRadius: '1.5px', objectFit: 'cover' }}
                            />
                            {loc.label}
                          </div>
                          {loc.soon && (
                            <span className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md bg-white/5 text-ink-600 border border-white/5">
                              Soon
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto no-scrollbar">
            {navItems.map(({ path, key, Icon }) => {
              const isActive = location === path;
              return (
                <Link key={path} href={path}>
                  <div className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    isActive ? 'text-amber-400 bg-amber-500/8' : 'text-ink-400 hover:text-ink-100'
                  }`}>
                    <Icon size={12} />
                    {t(`nav.${key}`)}
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
          <Route path="/tray" component={TrayPage} />
          <Route>
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <IconBread size={64} className="text-amber-500/30 mb-4" />
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
              <IconBread size={18} className="text-amber-400" />
              <span className="text-xs font-semibold text-ink-400">
                {t('footer.description')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-ink-600">
              <a
                href="https://github.com/artur0sky/i18n-bakery"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-amber-400 transition-colors"
              >
                <IconBrandGithub size={13} /> {t('footer.github')}
              </a>
              <span>·</span>
              <span>{t('footer.version', { version: '1.0.8' })}</span>
              <span>·</span>
              <span>{t('footer.mit_license')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
