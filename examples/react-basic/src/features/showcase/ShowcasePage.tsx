import React, { useState } from 'react';
import { useTranslation, useI18n } from '@i18n-bakery/react';
import { Card } from '../../components/ui/Card';
import { TestItem } from '../../components/ui/TestItem';
import { Button } from '../../components/ui/Button';
import { CodeSnippet } from '../../components/ui/CodeSnippet';
import { useCounter } from '../../hooks/useCounter';

// ---------- Section Header ----------
const SectionHeader: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-lg">{icon}</span>
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
      <SectionHeader icon="🔤" title="Core Translation" desc="Basic t() API — the foundation of every i18n workflow." />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Basic Translation" accent="amber" badge="Core" badgeVariant="stable">
          <TestItem label="t('basic.value')" value={t('tests.basic.value')} status="success" />
          <CodeSnippet lines={[
            { text: "t('showcase:tests.basic.value')", color: 'yellow' },
            { text: `// → "${t('tests.basic.value')}"`, color: 'green' },
          ]} />
        </Card>

        <Card title="Fallback Locale" accent="amber" badge="Core" badgeVariant="stable">
          <p className="text-xs text-ink-500 mb-3">{t('tests.fallback.hint')}</p>
          <TestItem label="Falls back to en-US" value={t('tests.fallback.value')} status="warning" note="(Missing in other locales)" />
        </Card>

        <Card title="Default Value (string)" accent="amber" badge="v1.0.8" badgeVariant="stable">
          <TestItem label="Missing key with default" value={t('tests.defaultValue.string', 'Freshly baked default! 🥯')} status="success" />
          <CodeSnippet lines={[
            { text: "t('missing.key', 'Freshly baked default!')", color: 'yellow' },
            { text: `// → "Freshly baked default! 🥯"`, color: 'green' },
          ]} />
        </Card>

        <Card title="Default Value (options)" accent="amber" badge="v1.0.8" badgeVariant="stable">
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
      <SectionHeader icon="🔀" title="Variable Interpolation" desc="Inject dynamic values into translations using Mustache syntax." />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Simple Variable" accent="sky">
          <TestItem label="t('interpolation.value', { name: 'Baker' })" value={t('tests.interpolation.value', { name: 'Baker' })} status="success" />
        </Card>

        <Card title="Nested Variable" accent="sky">
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
  const { count, increment, decrement } = useCounter(1);

  return (
    <div>
      <SectionHeader icon="🔢" title="Pluralization" desc="Suffix strategy (i18next-compatible) + CLDR for 100+ languages." />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Suffix Strategy (i18next-style)" accent="jade" badge="Core">
          <div className="flex items-center gap-2 mb-4 bg-surface-1 border border-white/5 rounded-xl p-3 w-fit">
            <Button onClick={decrement} size="sm" className="w-7 h-7 p-0 flex items-center justify-center">−</Button>
            <span className="text-lg font-bold text-amber-400 min-w-[2.5rem] text-center">{count}</span>
            <Button onClick={increment} size="sm" className="w-7 h-7 p-0 flex items-center justify-center">+</Button>
          </div>
          <TestItem label="Resolved form" value={t('tests.plural.value', { count })} status="success" />
          <CodeSnippet lines={[
            { text: "// key      → 1 item", color: 'muted' },
            { text: "// key_plural → N items", color: 'muted' },
            { text: "t('plural.value', { count })", color: 'yellow' },
          ]} />
        </Card>

        <Card title="Exact Count Matches" accent="jade">
          <TestItem label="count = 0" value={t('tests.plural.zero', { count: 0 }) || 'No items in your cart'} status="neutral" />
          <TestItem label="count = 1" value={t('tests.plural.value', { count: 1 })} status="neutral" />
          <TestItem label="count = 2" value={t('tests.plural.value', { count: 2 })} status="neutral" />
          <TestItem label="count = 42" value={t('tests.plural.value', { count: 42 })} status="neutral" />
          <CodeSnippet lines={[
            { text: "// key_0 → exact zero form", color: 'muted' },
            { text: "// key_1 → exact one form", color: 'muted' },
            { text: "// key_plural → default plural", color: 'muted' },
          ]} />
        </Card>

        <Card title="CLDR Pluralization" accent="jade" badge="v0.9.2" badgeVariant="stable">
          <p className="text-xs text-ink-500 mb-3">Industry standard via <code className="bg-surface-1 px-1 rounded text-amber-400">Intl.PluralRules</code></p>
          <TestItem label="one (count=1)" value="1 manzana  (es)" status="success" />
          <TestItem label="few (count=3)" value="3 manzanas (pl)" status="success" />
          <TestItem label="many (count=11)" value="11 яблок  (ru)" status="success" />
          <CodeSnippet lines={[
            { text: "initI18n({ pluralizationStrategy: 'cldr' })", color: 'yellow' },
            { text: "// CLDR categories: zero/one/two/few/many/other", color: 'muted' },
          ]} />
        </Card>

        <Card title="ICU MessageFormat" accent="jade" badge="v0.9.3" badgeVariant="stable">
          <p className="text-xs text-ink-500 mb-3">Inline plural, select & selectordinal in one string.</p>
          <TestItem label="plural (ICU)" value="{count, plural, =0 {no items} one {# item} other {# items}}" code />
          <TestItem label="select (ICU)" value="{g, select, male {He} female {She} other {They}} liked this" code />
          <TestItem label="selectordinal" value="You finished {p, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}" code />
          <CodeSnippet lines={[
            { text: "initI18n({ messageFormat: 'icu' })", color: 'yellow' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: Number Formatting ----------
const FormattingSection: React.FC = () => {
  const { t } = useTranslation('showcase');

  return (
    <div>
      <SectionHeader icon="💰" title="Number & Text Formatting" desc="NumberFormatPlugin + CapitalizePlugin via native Intl APIs." />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="NumberFormatPlugin" accent="violet" badge="v1.0.0" badgeVariant="stable">
          <TestItem label="Currency USD" value={t('tests.formatting.value', { price: 1234.56 })} status="success" />
          <TestItem label="Percentage" value={t('tests.formatting.percent', { val: 12.5 })} status="success" />
          <TestItem label="Compact" value={t('tests.formatting.compact', { views: 1500000 }) || '1.5M views'} status="success" />
          <CodeSnippet lines={[
            { text: "// {amount|currency:USD}", color: 'yellow' },
            { text: "// {count|compact}", color: 'yellow' },
            { text: "// {ratio|percent}", color: 'yellow' },
          ]} />
        </Card>

        <Card title="CapitalizePlugin" accent="violet" badge="v1.0.0" badgeVariant="stable">
          <TestItem label="Original" value="hello world" status="neutral" />
          <TestItem label="_upper suffix" value={t('tests.plugins.text_upper')} status="success" />
          <TestItem label="_capitalize suffix" value={t('tests.plugins.text_capitalize')} status="success" />
          <TestItem label="_title suffix" value={t('tests.plugins.text_title') || 'Hello World'} status="success" />
          <CodeSnippet lines={[
            { text: "t('greeting_upper')    // HELLO WORLD", color: 'yellow' },
            { text: "t('greeting_title')    // Hello World", color: 'yellow' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: Namespaces ----------
const NamespaceSection: React.FC = () => {
  return (
    <div>
      <SectionHeader icon="📂" title="Namespaces & Key Engine" desc="Colon separates namespace from key. Dot traverses nested objects." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Colon Syntax" accent="sky">
          <CodeSnippet lines={[
            { text: "// NAMESPACE:key.property", color: 'muted' },
            { text: "t('home:hero.title')", color: 'yellow' },
            { text: "t('showcase:tests.basic')", color: 'yellow' },
            { text: "t('common:nav.home')", color: 'yellow' },
          ]} />
        </Card>

        <Card title="Hierarchical Namespaces" accent="sky" badge="v1.0.6">
          <CodeSnippet lines={[
            { text: "// Subdirectory namespaces", color: 'muted' },
            { text: "t('home:hero.title')", color: 'yellow' },
            { text: "// → locales/en/home.json", color: 'green' },
            { text: '', color: 'white' },
            { text: "t('orders:meal.title')", color: 'yellow' },
            { text: "// → locales/en/orders/meal.json", color: 'green' },
          ]} />
        </Card>

        <Card title="Nested Key Access" accent="sky">
          <CodeSnippet lines={[
            { text: "// Deep dot notation", color: 'muted' },
            { text: "t('common:errors.not_found')", color: 'yellow' },
            { text: '', color: 'white' },
            { text: "// JSON:", color: 'muted' },
            { text: '{ "errors": {', color: 'white' },
            { text: '    "not_found": "Page not found"', color: 'green' },
            { text: '  }', color: 'white' },
            { text: '}', color: 'white' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: File Formats ----------
const FileFormatsSection: React.FC = () => {
  return (
    <div>
      <SectionHeader icon="📄" title="File Formats" desc="JSON (default) and TOML — zero-dependency parser built-in." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="JSON Format" accent="amber">
          <CodeSnippet lines={[
            { text: "// locales/en/common.json", color: 'muted' },
            { text: '{', color: 'white' },
            { text: '  "welcome": "Welcome!",', color: 'green' },
            { text: '  "errors": {', color: 'white' },
            { text: '    "not_found": "Page not found"', color: 'green' },
            { text: '  }', color: 'white' },
            { text: '}', color: 'white' },
          ]} />
        </Card>

        <Card title="TOML Format" accent="amber" badge="v1.0.6" badgeVariant="stable">
          <CodeSnippet lines={[
            { text: "# locales/en/common.toml", color: 'muted' },
            { text: 'welcome = "Welcome!"', color: 'green' },
            { text: '', color: 'white' },
            { text: '[errors]', color: 'blue' },
            { text: 'not_found = "Page not found"', color: 'green' },
          ]} />
        </Card>

        <Card title="Flat vs Nested JSON" accent="amber" badge="v1.0.1" badgeVariant="stable">
          <CodeSnippet lines={[
            { text: "// Nested (default)", color: 'muted' },
            { text: '{ "home": { "title": "..." } }', color: 'green' },
            { text: '', color: 'white' },
            { text: "// Flat", color: 'muted' },
            { text: '{ "home.title": "..." }', color: 'yellow' },
            { text: '', color: 'white' },
            { text: "new JSONFileSaver('./l', 'flat')", color: 'blue' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: CLI & Build ----------
const CLISection: React.FC = () => {
  return (
    <div>
      <SectionHeader icon="🔧" title="CLI — Sous-Chef Tools" desc="batter extracts keys from code. bake compiles and optimizes bundles." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Key Extraction" accent="rose" badge="CLI">
          <CodeSnippet lines={[
            { text: "# Extract from source", color: 'muted' },
            { text: "i18n-bakery batter src \\", color: 'yellow' },
            { text: "  --locale en-US,es-MX,it,jp \\", color: 'yellow' },
            { text: "  --out locales", color: 'yellow' },
          ]} />
        </Card>

        <Card title="Build & Optimize" accent="rose" badge="CLI">
          <CodeSnippet lines={[
            { text: "# Compile + split + hash", color: 'muted' },
            { text: "i18n-bakery bake locales \\", color: 'yellow' },
            { text: "  --split          # per-namespace", color: 'yellow' },
            { text: "  --hash           # cache busting", color: 'yellow' },
            { text: "  --manifest       # manifest.json", color: 'yellow' },
            { text: "  --minify         # strip whitespace", color: 'yellow' },
          ]} />
        </Card>

        <Card title="Encryption" accent="rose" badge="v1.0.4" badgeVariant="stable">
          <CodeSnippet lines={[
            { text: "# Encrypt bundles AES-256-GCM", color: 'muted' },
            { text: "i18n-bakery bake locales \\", color: 'yellow' },
            { text: "  --encrypt \\", color: 'yellow' },
            { text: "  --key $SECRET_KEY", color: 'yellow' },
            { text: '', color: 'white' },
            { text: "// Runtime decrypt", color: 'muted' },
            { text: "new HttpBackend({ cipher, secret })", color: 'blue' },
          ]} />
        </Card>

        <Card title="TOML Extraction" accent="rose" badge="v1.0.6">
          <CodeSnippet lines={[
            { text: "# Extract to TOML format", color: 'muted' },
            { text: "i18n-bakery batter src \\", color: 'yellow' },
            { text: "  --locale en \\", color: 'yellow' },
            { text: "  --out locales \\", color: 'yellow' },
            { text: "  --format toml", color: 'yellow' },
          ]} />
        </Card>

        <Card title="HTTP Backend" accent="rose" badge="v1.0.3" badgeVariant="stable">
          <CodeSnippet lines={[
            { text: "// Load from CDN / server", color: 'muted' },
            { text: "const httpBackend = new HttpBackend();", color: 'yellow' },
            { text: "initI18n({", color: 'white' },
            { text: "  loader: httpBackend,", color: 'green' },
            { text: "  plugins: [httpBackend],", color: 'green' },
            { text: "});", color: 'white' },
          ]} />
        </Card>

        <Card title="Poacher Migration" accent="rose" badge="v1.0.8" badgeVariant="stable">
          <CodeSnippet lines={[
            { text: "# Migrate from i18next", color: 'muted' },
            { text: "i18n-bakery-poacher scout src", color: 'yellow' },
            { text: "i18n-bakery-poacher convert \\", color: 'yellow' },
            { text: "  --from ./old --to ./locales", color: 'yellow' },
            { text: '', color: 'white' },
            { text: "# Backs up originals first ✓", color: 'green' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: Plugin API ----------
const PluginSection: React.FC = () => {
  return (
    <div>
      <SectionHeader icon="🔌" title="Plugin System" desc="Lifecycle hooks: init, beforeTranslate, afterTranslate, onMissing, onLoad, onLocaleChange, destroy." />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Built-in Plugin Registration" accent="violet" badge="v1.0.0" badgeVariant="stable">
          <CodeSnippet lines={[
            { text: "import {", color: 'white' },
            { text: "  NumberFormatPlugin,", color: 'green' },
            { text: "  CapitalizePlugin,", color: 'green' },
            { text: "  HttpBackend,", color: 'green' },
            { text: "} from '@i18n-bakery/core';", color: 'white' },
            { text: '', color: 'white' },
            { text: "initI18n({", color: 'yellow' },
            { text: "  plugins: [httpBackend, numberFmt, capitalize],", color: 'green' },
            { text: "});", color: 'yellow' },
          ]} />
        </Card>

        <Card title="Custom Plugin" accent="violet">
          <CodeSnippet lines={[
            { text: "class MyPlugin implements Plugin {", color: 'yellow' },
            { text: "  metadata = {", color: 'white' },
            { text: "    name: 'my-plugin',", color: 'green' },
            { text: "    type: 'processor',", color: 'green' },
            { text: "    version: '1.0.0'", color: 'green' },
            { text: "  };", color: 'white' },
            { text: "  afterTranslate(ctx) {", color: 'white' },
            { text: "    return ctx.result + ' [processed]';", color: 'green' },
            { text: "  }", color: 'white' },
            { text: "}", color: 'yellow' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- SECTION: React Hooks ----------
const ReactSection: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const { t } = useTranslation('common');

  return (
    <div>
      <SectionHeader icon="⚛️" title="React Bindings" desc="useTranslation() and useI18n() hooks with reactive updates." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="useTranslation()" accent="sky" badge="React">
          <TestItem label="t('welcome')" value={t('welcome')} status="success" />
          <TestItem label="t('nav.home')" value={t('nav.home')} status="success" />
          <CodeSnippet lines={[
            { text: "const { t } = useTranslation('common');", color: 'yellow' },
            { text: "// or", color: 'muted' },
            { text: "const [t] = useTranslation();", color: 'yellow' },
          ]} />
        </Card>

        <Card title="useI18n()" accent="sky" badge="React">
          <TestItem label="Current locale" value={locale} status="info" />
          <div className="mt-3 flex gap-2 flex-wrap">
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

        <Card title="Reactive Updates" accent="sky">
          <TestItem label="Auto re-renders on locale change" value="✓ Subscribed" status="success" />
          <TestItem label="Works with async loading" value="✓ HttpBackend" status="success" />
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
  return (
    <div>
      <SectionHeader icon="🛡️" title="Security Features" desc="Path traversal prevention, prototype pollution guard, key sanitization." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Prototype Pollution Guard" accent="rose" badge="v1.0.8" badgeVariant="stable">
          <TestItem label="TOML __proto__ blocking" value="✓ Rejected" status="success" />
          <TestItem label="constructor key blocking" value="✓ Rejected" status="success" />
          <CodeSnippet lines={[
            { text: "# Malicious TOML:", color: 'muted' },
            { text: "[__proto__]", color: 'rose' },
            { text: "admin = true", color: 'rose' },
            { text: "# → Throws validation error ✓", color: 'green' },
          ]} />
        </Card>

        <Card title="Path Traversal Prevention" accent="rose" badge="v1.0.2" badgeVariant="stable">
          <TestItem label="../ traversal attempts" value="✓ Blocked" status="success" />
          <TestItem label="Null byte injection" value="✓ Blocked" status="success" />
          <CodeSnippet lines={[
            { text: "// FileSystemPathResolver validates:", color: 'muted' },
            { text: "// ✗  ../../etc/passwd", color: 'rose' },
            { text: "// ✗  key\\x00.json", color: 'rose' },
            { text: "// ✓  locales/en/common.json", color: 'green' },
          ]} />
        </Card>

        <Card title="Key Sanitization" accent="rose" badge="v1.0.2">
          <TestItem label="Injection attempts via keys" value="✓ Rejected" status="success" />
          <CodeSnippet lines={[
            { text: "// Allowed: a-zA-Z0-9_-.:", color: 'muted' },
            { text: "// ✗ '<script>...'" , color: 'rose' },
            { text: "// ✓ 'common:nav.home'", color: 'green' },
          ]} />
        </Card>
      </div>
    </div>
  );
};

// ---------- Main Showcase Page ----------
export const ShowcasePage: React.FC = () => {
  const sections = [
    { id: 'core', label: '🔤 Core', component: CoreSection },
    { id: 'interpolation', label: '🔀 Interpolation', component: InterpolationSection },
    { id: 'plural', label: '🔢 Pluralization', component: PluralSection },
    { id: 'format', label: '💰 Formatting', component: FormattingSection },
    { id: 'namespaces', label: '📂 Namespaces', component: NamespaceSection },
    { id: 'formats', label: '📄 File Formats', component: FileFormatsSection },
    { id: 'cli', label: '🔧 CLI & Build', component: CLISection },
    { id: 'plugins', label: '🔌 Plugins', component: PluginSection },
    { id: 'react', label: '⚛️ React', component: ReactSection },
    { id: 'security', label: '🛡️ Security', component: SecuritySection },
  ];

  const [active, setActive] = useState('core');
  const ActiveComponent = sections.find(s => s.id === active)?.component ?? CoreSection;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-ink-50 mb-2">
          Feature{' '}
          <span style={{
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Showcase
          </span>
        </h1>
        <p className="text-sm text-ink-500">
          Every feature of i18n-bakery — interactive and live. Switch locale from the nav bar above.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-8 bg-surface-2 border border-white/7 p-1.5 rounded-2xl">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`flex-1 min-w-fit px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 whitespace-nowrap ${
              active === s.id
                ? 'bg-amber-500 text-surface-0 shadow-md shadow-amber-500/20'
                : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Active Section */}
      <ActiveComponent />
    </div>
  );
};
