import React from 'react';
import { useTranslation } from '@i18n-bakery/react';
import { MainLayout } from './components/layout/MainLayout';
import { Card } from './components/ui/Card';
import { TestItem } from './components/ui/TestItem';
import { Button } from './components/ui/Button';
import { useCounter } from './hooks/useCounter';

function App() {
  const { t } = useTranslation('common');
  const { count, increment, decrement } = useCounter(1);

  return (
    <MainLayout>
      {/* Basic Translation */}
      <Card title={t('showcase.tests.basic_title', 'Basic Translation')}>
        <TestItem 
          label="Key exists" 
          value={t('showcase.tests.basic', 'This key should exist in all locales.')} 
          status="success"
        />
      </Card>

      {/* Fallback Behavior */}
      <Card title={t('showcase.tests.fallback_title', 'Fallback Behavior')}>
          <p className="text-sm text-gray-500 mb-4">
            Switch to <span className="font-semibold text-gray-700">Español (MX)</span> to see fallback in action.
          </p>
          <TestItem 
            label="Fallback to en-US" 
            value={t('showcase.tests.fallback', 'This content is from en-US because it is missing in the current locale.')}
            status="warning"
            note="(Missing in es-MX)"
          />
          <TestItem 
            label="Missing Key" 
            value={t('showcase.tests.missing_completely')}
            status="error"
            note="(Missing everywhere, shows key)"
          />
      </Card>

      {/* Interpolation */}
      <Card title={t('showcase.interpolation_title', 'Interpolation')}>
        <TestItem 
          label="Simple Variable" 
          value={t('showcase.interpolation', 'Hello {{name}}!', { name: 'Baker' })} 
        />
          <TestItem 
          label="Missing Variable" 
          value={t('showcase.interpolation', 'Hello {{name}}!', { })} 
          note="(Shows empty string for missing var)"
        />
      </Card>

      {/* Pluralization */}
      <Card title={t('showcase.plural_title', 'Pluralization')}>
        <div className="flex gap-3 items-center mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100 w-fit">
          <Button onClick={decrement} variant="secondary" className="w-8 h-8 flex items-center justify-center p-0">-</Button>
          <span className="font-bold text-lg min-w-[24px] text-center">{count}</span>
          <Button onClick={increment} variant="secondary" className="w-8 h-8 flex items-center justify-center p-0">+</Button>
        </div>
        <TestItem 
          label="Result" 
          value={t('showcase.plural', 'You have {{count}} item', { count })} 
          status="success"
        />
      </Card>

      {/* Formatting */}
      <Card title={t('showcase.formatting_title', 'Formatting')}>
        <TestItem 
          label="Currency (USD)" 
          value={t('showcase.currency', 'Price: {price|currency:USD}', { price: 1234.56 })} 
        />
          <TestItem 
          label="Percentage" 
          value={t('showcase.percent', 'Growth: {val|percent}', { val: 12.5 })} 
        />
      </Card>

      {/* Plugins */}
      <Card title={t('showcase.capitalize_title', 'Plugins (Capitalize)')}>
        <TestItem 
          label="Original" 
          value="hello world"
        />
        <TestItem 
          label="Uppercase" 
          value={t('showcase.text_upper', 'hello world')} 
        />
        <TestItem 
          label="Capitalize" 
          value={t('showcase.text_capitalize', 'hello world')} 
        />
      </Card>

      {/* Namespaces */}
      <Card title={t('showcase.namespaces_title', 'Namespaces')}>
          <TestItem 
            label="From features.json" 
            value={t('features:title')} 
          />
          <TestItem 
            label="From actions.json" 
            value={t('actions:switch_language')} 
          />
      </Card>
    </MainLayout>
  );
}

export default App;
