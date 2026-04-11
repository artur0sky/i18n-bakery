import React, { useState } from 'react';
import { useTranslation, useI18n } from '@i18n-bakery/react';
import {
  IconLetterT,
  IconArrowsShuffle,
  IconNumber123,
  IconCurrencyDollar,
  IconBrandReact,
  IconShieldCheck,
} from '@tabler/icons-react';
import { Card } from '../../components/ui/Card';
import { TestItem } from '../../components/ui/TestItem';
import { Button } from '../../components/ui/Button';
import { CodeSnippet } from '../../components/ui/CodeSnippet';
import { useCounter } from '../../hooks/useCounter';

// ---------- Section Header ----------
interface SectionHeaderProps {
  Icon: React.FC<{ size?: number; className?: string }>;
  iconClass?: string;
  title: string;
  desc: string;
}
const SectionHeader: React.FC<SectionHeaderProps> = ({ Icon, iconClass = 'text-amber-400', title, desc }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-1.5">
      <Icon size={18} className={iconClass} />
      <h2 className="text-base font-bold text-ink-50">{title}</h2>
    </div>
    <p className="text-xs text-ink-500 leading-relaxed">{desc}</p>
  </div>
);

// ---------- SECTION: Core Translation ----------
const CoreSection: React.FC = () => {
  const { t } = useTranslation('showcase');

  return (
    <div>
      <SectionHeader 
        Icon={IconLetterT} 
        iconClass="text-amber-400" 
        title={t('sections.core.title')} 
        desc={t('sections.core.desc')} 
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title={t('cards.basic')} accent="amber" badge="Core" badgeVariant="stable">
          <TestItem label="t('basic.value')" value={t('tests.basic.value')} status="success" />
          <CodeSnippet lines={[
            { text: "t('showcase:tests.basic.value')", color: 'yellow' },
            { text: `// → "${t('tests.basic.value')}"`, color: 'green' },
          ]} />
        </Card>

        <Card title={t('cards.fallback')} accent="amber" badge="Core" badgeVariant="stable">
          <p className="text-xs text-ink-500 mb-3">{t('tests.fallback.hint')}</p>
          <TestItem label="Falls back to en-US" value={t('tests.fallback.value')} status="warning" note={t('tests.fallback.note')} />
        </Card>

        <Card title={t('cards.defaultValueString')} accent="amber" badge="v1.0.8" badgeVariant="stable">
          <TestItem label="Missing key with default" value={t('tests.defaultValue.string', 'Freshly baked default!')} status="success" />
          <CodeSnippet lines={[
            { text: "t('missing.key', 'Freshly baked default!')", color: 'yellow' },
            { text: `// → "Freshly baked default!"`, color: 'green' },
          ]} />
        </Card>

        <Card title={t('cards.defaultValueOptions')} accent="amber" badge="v1.0.8" badgeVariant="stable">
          <TestItem label="Options object defaultValue" value={t('tests.defaultValue.object', { defaultValue: 'Default from options object' })} status="success" />
          <CodeSnippet lines={[
            { text: "t('missing', { defaultValue: 'Default...' })", color: 'yellow' },
            { text: `// i18next-compatible syntax`, color: 'muted' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: Interpolation ----------
const InterpolationSection: React.FC = () => {
  const { t } = useTranslation('showcase');

  return (
    <div>
      <SectionHeader 
        Icon={IconArrowsShuffle} 
        iconClass="text-sky-400" 
        title={t('sections.interpolation.title')} 
        desc={t('sections.interpolation.desc')} 
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title={t('cards.simpleVar')} accent="sky">
          <TestItem label="t('interpolation.value', { name: 'Baker' })" value={t('tests.interpolation.value', { name: 'Baker' })} status="success" />
        </Card>

        <Card title={t('cards.nestedVar')} accent="sky">
          <TestItem
            label="Deep interpolation {{user.name}}"
            value={t('tests.interpolation.nested', { user: { name: 'Arturo' } }) || 'Hello, Arturo!'}
            status="success"
          />
          <CodeSnippet lines={[
            { text: "// Translation: 'Hello, {{user.name}}!'", color: 'muted' },
            { text: "t('key', { user: { name: 'Arturo' } })", color: 'yellow' },
            { text: "// → 'Hello, Arturo!'", color: 'green' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: Pluralization ----------
const PluralSection: React.FC = () => {
  const { t } = useTranslation('showcase');
  const { count, increment: inc, decrement: dec, setCount } = useCounter(0);

  return (
    <div>
      <SectionHeader 
        Icon={IconNumber123} 
        iconClass="text-jade-400" 
        title={t('sections.pluralization.title')} 
        desc={t('sections.pluralization.desc')} 
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title={t('cards.standardPlural')} accent="jade">
          <div className="flex items-center gap-3 mb-4">
            <Button onClick={dec} variant="secondary" size="sm">-</Button>
            <span className="text-xl font-black text-jade-400 w-8 text-center">{count}</span>
            <Button onClick={inc} variant="secondary" size="sm">+</Button>
            <Button onClick={(() => setCount(0))} variant="ghost" size="sm">Reset</Button>
          </div>
          <TestItem label="t('plural.value', { count })" value={t('tests.plural.value', { count })} status="success" />
          <CodeSnippet lines={[
            { text: "// CLDR Rules: 1 item, 2 items, 5 items", color: 'muted' },
            { text: `t('key', { count: ${count} })`, color: 'yellow' },
          ]} />
        </Card>

        <Card title={t('cards.zeroPlural')} accent="jade" badge="New" badgeVariant="beta">
          <TestItem label="t('plural.value_0') override" value={t('tests.plural_cases', { count: 0 })} status="success" />
          <CodeSnippet lines={[
            { text: "// i18next-style _0 suffix", color: 'muted' },
            { text: "t('key', { count: 0 }) → 'No items...'", color: 'green' },
          ]} />
        </Card>

        <Card title={t('cards.ordinal')} accent="jade" badge="ICU" badgeVariant="stable">
          <TestItem label="Ordinal (1st, 2nd, 3rd)" value={t('{n, ordinal, one{#st} two{#nd} few{#rd} other{#th}} place', { n: 1 })} status="success" />
          <TestItem label="" value={t('{n, ordinal, one{#st} two{#nd} few{#rd} other{#th}} place', { n: 2 })} status="success" />
          <CodeSnippet lines={[
            { text: "// Built-in ICU support via native Intl", color: 'muted' },
            { text: "t('{n, ordinal, ...}', { n: 2 })", color: 'yellow' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: Formatting ----------
const FormattingSection: React.FC = () => {
  const { t } = useTranslation('showcase');

  return (
    <div>
      <SectionHeader 
        Icon={IconCurrencyDollar} 
        iconClass="text-amber-400" 
        title={t('sections.formatting.title')} 
        desc={t('sections.formatting.desc')} 
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title={t('cards.currency')} accent="amber" badge="Plugin" badgeVariant="stable">
          <TestItem label="Currency pipe: {{val|currency:USD}}" value={t('tests.formatting.value', { price: 42.5 })} status="success" />
          <CodeSnippet lines={[
            { text: "// Plugins: NumberFormat + currency:USD", color: 'muted' },
            { text: "t('key', { price: 42.5 })", color: 'yellow' },
            { text: `// → "${t('tests.formatting.value', { price: 42.5 })}"`, color: 'green' },
          ]} />
        </Card>

        <Card title={t('cards.percentage')} accent="amber" badge="Plugin">
          <TestItem label="Percentage: {{val|percent}}" value={t('tests.formatting.percent', { val: 0.15 })} status="success" />
          <TestItem label="Compact: {{val|compact}}" value={t('tests.formatting.compact', { views: 1250000 })} status="success" />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: React Integration ----------
const ReactSection: React.FC = () => {
  const { t } = useTranslation('showcase');
  const { locale, setLocale } = useI18n();

  return (
    <div>
      <SectionHeader 
        Icon={IconBrandReact} 
        iconClass="text-sky-400" 
        title={t('sections.react.title')} 
        desc={t('sections.react.desc')} 
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title={t('cards.hook')} accent="sky">
          <CodeSnippet lines={[
            { text: "const { t } = useTranslation('showcase');", color: 'yellow' },
            { text: "return <h1>{t('title')}</h1>;", color: 'white' },
          ]} />
          <div className="flex flex-wrap gap-2 mt-4">
            {['en-US', 'es-MX', 'it', 'jp'].map(l => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`text-xs px-2.5 py-1 rounded-lg cursor-pointer transition-all font-medium ${
                  locale === l
                    ? 'bg-amber-500 text-surface-0'
                    : 'bg-surface-1 border border-white/8 text-ink-400 hover:text-ink-100'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </Card>

        <Card title={t('cards.reactive')} accent="sky">
          <TestItem label="Auto re-renders on locale change" value="Subscribed" status="success" />
          <TestItem label="Works with async loading" value="HttpBackend" status="success" />
          <CodeSnippet lines={[
            { text: "// I18nProvider subscribes automatically", color: 'muted' },
            { text: "// Components update on locale change", color: 'muted' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: Security ----------
const SecuritySection: React.FC = () => {
  const { t } = useTranslation('showcase');

  return (
    <div>
      <SectionHeader 
        Icon={IconShieldCheck} 
        iconClass="text-rose-400" 
        title={t('sections.security.title')} 
        desc={t('sections.security.desc')} 
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title={t('cards.prototype')} accent="rose" badge="v1.0.8" badgeVariant="stable">
          <TestItem label="TOML __proto__ blocking" value="Rejected" status="success" />
          <TestItem label="constructor key blocking" value="Rejected" status="success" />
          <CodeSnippet lines={[
            { text: "# Malicious TOML:", color: 'muted' },
            { text: "[__proto__]", color: 'orange' },
            { text: "admin = true", color: 'orange' },
            { text: "# → Throws validation error", color: 'green' },
          ]} />
        </Card>

        <Card title={t('cards.traversal')} accent="rose" badge="v1.0.2" badgeVariant="stable">
          <TestItem label="../ traversal attempts" value="Blocked" status="success" />
          <TestItem label="Null byte injection" value="Blocked" status="success" />
          <CodeSnippet lines={[
            { text: "// FileSystemPathResolver validates:", color: 'muted' },
            { text: "// ✗  ../../etc/passwd", color: 'orange' },
            { text: "// ✗  key\x00.json", color: 'orange' },
            { text: "// ✓  locales/en/common.json", color: 'green' },
          ]} />
        </Card>

        <Card title={t('cards.sanitization')} accent="rose" badge="v1.0.2">
          <TestItem label="Injection attempts via keys" value="Rejected" status="success" />
          <CodeSnippet lines={[
            { text: "// Allowed: a-zA-Z0-9_-.:", color: 'muted' },
            { text: "// ✗ '<script>...'" , color: 'orange' },
            { text: "// ✓ 'common:nav.home'", color: 'green' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- Section Tab Config ----------
interface SectionTab {
  id: string;
  Icon: React.FC<{ size?: number; className?: string }>;
  key: string;
}

const SECTION_TABS: SectionTab[] = [
  { id: 'core', Icon: IconLetterT, key: 'sections.core.title' },
  { id: 'interpolation', Icon: IconArrowsShuffle, key: 'sections.interpolation.title' },
  { id: 'plural', Icon: IconNumber123, key: 'sections.pluralization.title' },
  { id: 'formatting', Icon: IconCurrencyDollar, key: 'sections.formatting.title' },
  { id: 'react', Icon: IconBrandReact, key: 'sections.react.title' },
  { id: 'security', Icon: IconShieldCheck, key: 'sections.security.title' },
];

export const ShowcasePage: React.FC = () => {
  const { t } = useTranslation('showcase');
  const [activeTab, setActiveTab] = useState('core');

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-ink-50 mb-2">
          <span style={{
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{t('page.title')}</span>
        </h1>
        <p className="text-sm text-ink-500 max-w-2xl">
          {t('page.description')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 mb-8 p-1.5 bg-surface-2 border border-white/7 rounded-2xl w-fit overflow-x-auto max-w-full no-scrollbar">
        {SECTION_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-500 text-surface-0 shadow-lg shadow-amber-500/20'
                : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
            }`}
          >
            <tab.Icon size={14} />
            {t(tab.key)}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="bg-surface-0 rounded-2xl">
        {activeTab === 'core' && <CoreSection />}
        {activeTab === 'interpolation' && <InterpolationSection />}
        {activeTab === 'plural' && <PluralSection />}
        {activeTab === 'formatting' && <FormattingSection />}
        {activeTab === 'react' && <ReactSection />}
        {activeTab === 'security' && <SecuritySection />}
      </div>
    </div>
  );
};
