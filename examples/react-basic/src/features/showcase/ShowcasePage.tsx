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
          {t('showcase:page.title')}
        </h1>
        <p className="text-gray-600">
          {t('showcase:page.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Translation */}
        <Card title={t('showcase:tests.basic.title')}>
          <TestItem 
            label="Key exists" 
            value={t('showcase:tests.basic.value')} 
            status="success"
          />
        </Card>

        {/* Fallback Behavior */}
        <Card title={t('showcase:tests.fallback.title')}>
          <p className="text-sm text-gray-500 mb-4">
            {t('showcase:tests.fallback.hint')}
          </p>
          <TestItem 
            label="Fallback to en-US" 
            value={t('showcase:tests.fallback.value')}
            status="warning"
            note="(Missing in es-MX)"
          />
        </Card>

        {/* Interpolation */}
        <Card title={t('showcase:tests.interpolation.title')}>
          <TestItem 
            label="Simple Variable" 
            value={t('showcase:tests.interpolation.value', { name: 'Baker' })} 
          />
        </Card>

        {/* Pluralization */}
        <Card title={t('showcase:tests.plural.title')}>
          <div className="flex gap-3 items-center mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100 w-fit">
            <Button onClick={decrement} variant="secondary" className="w-8 h-8 flex items-center justify-center p-0">-</Button>
            <span className="font-bold text-lg min-w-[24px] text-center">{count}</span>
            <Button onClick={increment} variant="secondary" className="w-8 h-8 flex items-center justify-center p-0">+</Button>
          </div>
          <TestItem 
            label="Result" 
            value={t('showcase:tests.plural.value', { count })} 
            status="success"
          />
        </Card>

        {/* Formatting */}
        <Card title={t('showcase:tests.formatting.title')}>
          <TestItem 
            label="Currency (USD)" 
            value={t('showcase:tests.formatting.value', { price: 1234.56 })} 
          />
          <TestItem 
            label="Percentage" 
            value={t('showcase:tests.formatting.percent', { val: 12.5 })} 
          />
        </Card>

        {/* Plugins */}
        <Card title={t('showcase:tests.plugins.title')}>
          <TestItem 
            label="Original" 
            value="hello world"
          />
          <TestItem 
            label="Uppercase" 
            value={t('showcase:tests.plugins.text_upper')} 
          />
          <TestItem 
            label="Capitalize" 
            value={t('showcase:tests.plugins.text_capitalize')} 
          />
        </Card>
      </div>
    </div>
  );
};
