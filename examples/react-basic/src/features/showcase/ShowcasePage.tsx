import React from 'react';
import { useTranslation } from '@i18n-bakery/react';
import { Card } from '../../components/ui/Card';
import { TestItem } from '../../components/ui/TestItem';
import { Button } from '../../components/ui/Button';
import { useCounter } from '../../hooks/useCounter';

export const ShowcasePage: React.FC = () => {
  const { t } = useTranslation('showcase');
  const { count, increment, decrement } = useCounter(1);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('page.title')}
        </h1>
        <p className="text-gray-600">
          {t('page.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Translation */}
        <Card title={t('tests.basic_title')}>
          <TestItem 
            label="Key exists" 
            value={t('tests.basic')} 
            status="success"
          />
        </Card>

        {/* Fallback Behavior */}
        <Card title={t('tests.fallback_title')}>
          <p className="text-sm text-gray-500 mb-4">
            {t('tests.fallback_hint')}
          </p>
          <TestItem 
            label="Fallback to en-US" 
            value={t('tests.fallback')}
            status="warning"
            note="(Missing in es-MX)"
          />
        </Card>

        {/* Interpolation */}
        <Card title={t('interpolation_title')}>
          <TestItem 
            label="Simple Variable" 
            value={t('interpolation', { name: 'Baker' })} 
          />
        </Card>

        {/* Pluralization */}
        <Card title={t('plural_title')}>
          <div className="flex gap-3 items-center mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100 w-fit">
            <Button onClick={decrement} variant="secondary" className="w-8 h-8 flex items-center justify-center p-0">-</Button>
            <span className="font-bold text-lg min-w-[24px] text-center">{count}</span>
            <Button onClick={increment} variant="secondary" className="w-8 h-8 flex items-center justify-center p-0">+</Button>
          </div>
          <TestItem 
            label="Result" 
            value={t('plural', { count })} 
            status="success"
          />
        </Card>

        {/* Formatting */}
        <Card title={t('formatting_title')}>
          <TestItem 
            label="Currency (USD)" 
            value={t('currency', { price: 1234.56 })} 
          />
          <TestItem 
            label="Percentage" 
            value={t('percent', { val: 12.5 })} 
          />
        </Card>

        {/* Plugins */}
        <Card title={t('capitalize_title')}>
          <TestItem 
            label="Original" 
            value="hello world"
          />
          <TestItem 
            label="Uppercase" 
            value={t('text_upper')} 
          />
          <TestItem 
            label="Capitalize" 
            value={t('text_capitalize')} 
          />
        </Card>
      </div>
    </div>
  );
};
