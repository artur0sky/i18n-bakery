import React from 'react';
import { useTranslation } from '@i18n-bakery/react';
import { Link } from 'wouter';

export const HomePage: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Using home namespace with nested keys */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('hero.subtitle')}
        </p>
        <p className="text-gray-500">
          {t('hero.description')}
        </p>
      </div>

      {/* Navigation cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link href="/showcase">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('navigation.showcase.title')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('navigation.showcase.description')}
            </p>
          </div>
        </Link>

        <Link href="/docs">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('navigation.docs.title')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('navigation.docs.description')}
            </p>
          </div>
        </Link>

        <a href="https://github.com/artur0sky/i18n-bakery" target="_blank" rel="noopener noreferrer">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('navigation.github.title')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('navigation.github.description')}
            </p>
          </div>
        </a>
      </div>

      {/* Features section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('features.title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌍</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('features.items.multilang.title')}</h4>
              <p className="text-sm text-gray-600">{t('features.items.multilang.description')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('features.items.performance.title')}</h4>
              <p className="text-sm text-gray-600">{t('features.items.performance.description')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔌</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('features.items.plugins.title')}</h4>
              <p className="text-sm text-gray-600">{t('features.items.plugins.description')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('features.items.typesafe.title')}</h4>
              <p className="text-sm text-gray-600">{t('features.items.typesafe.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
