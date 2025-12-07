import React from 'react';
import { useTranslation } from '@i18n-bakery/react';
import { Card } from '../../components/ui/Card';

export const DocsPage: React.FC = () => {
  const { t } = useTranslation('docs');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('page.title')}
        </h1>
        <p className="text-gray-600">
          {t('page.description')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Namespace Explanation */}
        <Card title={t('namespaces.title')}>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('namespaces.colon.title')}</h4>
              <p className="text-sm text-gray-600 mb-2">{t('namespaces.colon.description')}</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs">
                <div className="text-green-400">// {t('namespaces.colon.example_label')}</div>
                <div className="text-yellow-300">t('home:hero.title')</div>
                <div className="text-blue-400">t('showcase:tests.basic')</div>
                <div className="text-purple-400">t('docs:namespaces.title')</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('namespaces.dot.title')}</h4>
              <p className="text-sm text-gray-600 mb-2">{t('namespaces.dot.description')}</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs">
                <div className="text-green-400">// {t('namespaces.dot.example_label')}</div>
                <div className="text-yellow-300">hero.title</div>
                <div className="text-blue-400">features.items.multilang.title</div>
                <div className="text-purple-400">navigation.showcase.description</div>
              </div>
            </div>
          </div>
        </Card>

        {/* File Structure */}
        <Card title={t('structure.title')}>
          <p className="text-sm text-gray-600 mb-4">{t('structure.description')}</p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <div className="mb-3 text-green-400 font-semibold">📁 {t('structure.explorer_title')}</div>
            <div className="space-y-0.5">
              <div className="text-blue-400">locales/</div>
              <div className="pl-4">
                <div className="text-blue-400">├── en-US/</div>
                <div className="pl-8">
                  <div className="text-yellow-300">├── home.json       <span className="text-gray-500">// {t('structure.files.home')}</span></div>
                  <div className="text-yellow-300">├── showcase.json   <span className="text-gray-500">// {t('structure.files.showcase')}</span></div>
                  <div className="text-yellow-300">├── docs.json       <span className="text-gray-500">// {t('structure.files.docs')}</span></div>
                  <div className="text-yellow-300">├── common.json     <span className="text-gray-500">// {t('structure.files.common')}</span></div>
                  <div className="text-yellow-300">├── actions.json    <span className="text-gray-500">// {t('structure.files.actions')}</span></div>
                  <div className="text-yellow-300">└── features.json   <span className="text-gray-500">// {t('structure.files.features')}</span></div>
                </div>
                <div className="text-blue-400">├── es-MX/</div>
                <div className="pl-8">
                  <div className="text-yellow-300">└── ...</div>
                </div>
                <div className="text-blue-400">└── ...</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Best Practices */}
        <Card title={t('best_practices.title')}>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h5 className="font-semibold text-gray-900">{t('best_practices.items.organize.title')}</h5>
                <p className="text-sm text-gray-600">{t('best_practices.items.organize.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h5 className="font-semibold text-gray-900">{t('best_practices.items.consistent.title')}</h5>
                <p className="text-sm text-gray-600">{t('best_practices.items.consistent.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h5 className="font-semibold text-gray-900">{t('best_practices.items.namespace.title')}</h5>
                <p className="text-sm text-gray-600">{t('best_practices.items.namespace.description')}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
