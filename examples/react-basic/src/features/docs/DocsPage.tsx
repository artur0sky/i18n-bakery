import React, { useState } from 'react';
import {
  IconRocket,
  IconFolder,
  IconFolders,
  IconBrandReact,
  IconTerminal2,
  IconListCheck,
  IconBolt,
  IconPackage,
  IconLock,
  IconShield,
  IconBook,
} from '@tabler/icons-react';
import { CodeSnippet } from '../../components/ui/CodeSnippet';

type TablerIconFC = React.FC<{ size?: number; className?: string }>;

interface DocSection {
  id: string;
  Icon: TablerIconFC;
  title: string;
}

const sections: DocSection[] = [
  { id: 'quickstart', Icon: IconRocket, title: 'Quick Start' },
  { id: 'namespaces', Icon: IconFolder, title: 'Namespaces' },
  { id: 'structure', Icon: IconFolders, title: 'File Structure' },
  { id: 'react', Icon: IconBrandReact, title: 'React API' },
  { id: 'cli', Icon: IconTerminal2, title: 'CLI Reference' },
  { id: 'best-practices', Icon: IconListCheck, title: 'Best Practices' },
];

// ---- Quick Start ----
const QuickStartDoc: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">Installation</h3>
      <CodeSnippet lines={[
        { text: 'npm install @i18n-bakery/core @i18n-bakery/react', color: 'yellow' },
        { text: '# or', color: 'muted' },
        { text: 'pnpm add @i18n-bakery/core @i18n-bakery/react', color: 'yellow' },
      ]} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">Initialize</h3>
      <CodeSnippet lines={[
        { text: "import { initI18n } from '@i18n-bakery/core';", color: 'blue' },
        { text: '', color: 'white' },
        { text: 'initI18n({', color: 'yellow' },
        { text: "  locale: 'en-US',", color: 'green' },
        { text: "  fallbackLocale: 'en-US',", color: 'green' },
        { text: "  defaultNamespace: 'common',", color: 'green' },
        { text: '});', color: 'yellow' },
      ]} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">React Provider</h3>
      <CodeSnippet lines={[
        { text: "import { I18nProvider } from '@i18n-bakery/react';", color: 'blue' },
        { text: '', color: 'white' },
        { text: 'ReactDOM.createRoot(root).render(', color: 'white' },
        { text: '  <I18nProvider config={config}>', color: 'green' },
        { text: '    <App />', color: 'white' },
        { text: '  </I18nProvider>', color: 'green' },
        { text: ');', color: 'white' },
      ]} />
    </div>
  </div>
);

// ---- Namespaces ----
const NamespacesDoc: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">Colon Syntax — Namespace Separator</h3>
      <p className="text-xs text-ink-500 leading-relaxed mb-3">
        The colon <code className="text-amber-400">:</code> separates the file name (namespace) from the key path.
      </p>
      <CodeSnippet lines={[
        { text: "t('home:hero.title')", color: 'yellow' },
        { text: "// └── namespace: 'home'  →  locales/en/home.json", color: 'green' },
        { text: "// └── key: 'hero.title'  →  json.hero.title", color: 'green' },
        { text: '', color: 'white' },
        { text: "t('common:nav.home')", color: 'yellow' },
        { text: "t('showcase:tests.basic.value')", color: 'yellow' },
      ]} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">Hierarchical Namespaces (Subdirectories)</h3>
      <p className="text-xs text-ink-500 leading-relaxed mb-3">
        Multiple colons create subdirectory paths inside your locale folder.
      </p>
      <CodeSnippet lines={[
        { text: "t('orders:meal.title')", color: 'yellow' },
        { text: "// → locales/en/orders/meal.json → .title", color: 'green' },
        { text: '', color: 'white' },
        { text: "t('auth:login.button')", color: 'yellow' },
        { text: "// → locales/en/auth/login.json → .button", color: 'green' },
      ]} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">Dot Notation — Nested Object Access</h3>
      <CodeSnippet lines={[
        { text: '// JSON: { "menu": { "items": { "home": "Home" } } }', color: 'muted' },
        { text: "t('common:menu.items.home')  // → 'Home'", color: 'yellow' },
      ]} />
    </div>
  </div>
);

// ---- File Structure ----
const StructureDoc: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">Recommended Directory Layout</h3>
      <CodeSnippet lines={[
        { text: 'project/', color: 'blue' },
        { text: '  locales/', color: 'blue' },
        { text: '    en-US/', color: 'blue' },
        { text: '      common.json', color: 'yellow' },
        { text: '      home.json', color: 'yellow' },
        { text: '      showcase.json', color: 'yellow' },
        { text: '      auth/', color: 'blue' },
        { text: '        login.json', color: 'yellow' },
        { text: '    es-MX/', color: 'blue' },
        { text: '    jp/', color: 'blue' },
        { text: '  vite.config.ts', color: 'muted' },
        { text: '  package.json', color: 'muted' },
      ]} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">Nested vs Flat JSON</h3>
      <CodeSnippet lines={[
        { text: '// NESTED (default) — better organization', color: 'muted' },
        { text: '{', color: 'white' },
        { text: '  "hero": {', color: 'white' },
        { text: '    "title": "Welcome",', color: 'green' },
        { text: '    "subtitle": "Hello world"', color: 'green' },
        { text: '  }', color: 'white' },
        { text: '}', color: 'white' },
        { text: '', color: 'white' },
        { text: '// FLAT — simpler, easier to search', color: 'muted' },
        { text: '{', color: 'white' },
        { text: '  "hero.title": "Welcome",', color: 'yellow' },
        { text: '  "hero.subtitle": "Hello world"', color: 'yellow' },
        { text: '}', color: 'white' },
      ]} />
    </div>
  </div>
);

// ---- React API ----
const ReactAPIDoc: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">useTranslation(namespace?)</h3>
      <CodeSnippet lines={[
        { text: "import { useTranslation } from '@i18n-bakery/react';", color: 'blue' },
        { text: '', color: 'white' },
        { text: "// With namespace prefix", color: 'muted' },
        { text: "const { t } = useTranslation('common');", color: 'yellow' },
        { text: "t('welcome')  // → common:welcome", color: 'green' },
        { text: '', color: 'white' },
        { text: "// Array destructuring (i18next-style)", color: 'muted' },
        { text: "const [t] = useTranslation('home');", color: 'yellow' },
      ]} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">useI18n()</h3>
      <CodeSnippet lines={[
        { text: "const { locale, setLocale } = useI18n();", color: 'yellow' },
        { text: '', color: 'white' },
        { text: "setLocale('es-MX');  // Triggers reactive update", color: 'green' },
      ]} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">t() Signature</h3>
      <CodeSnippet lines={[
        { text: "// Basic", color: 'muted' },
        { text: "t('key')", color: 'yellow' },
        { text: '', color: 'white' },
        { text: "// With variables", color: 'muted' },
        { text: "t('key', { name: 'Baker', count: 5 })", color: 'yellow' },
        { text: '', color: 'white' },
        { text: "// Default value (string)", color: 'muted' },
        { text: "t('key', 'Default text')", color: 'yellow' },
        { text: '', color: 'white' },
        { text: "// Default value (options, i18next-style)", color: 'muted' },
        { text: "t('key', { defaultValue: 'Default text' })", color: 'yellow' },
      ]} />
    </div>
  </div>
);

// ---- CLI ----
const CLIDoc: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">batter — Extract Keys</h3>
      <CodeSnippet lines={[
        { text: 'i18n-bakery batter <src>', color: 'yellow' },
        { text: '  --locale <locale,...>   # required', color: 'muted' },
        { text: '  --out <dir>             # output dir (default: locales)', color: 'muted' },
        { text: '  --format <json|toml>    # output format', color: 'muted' },
      ]} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">bake — Compile & Optimize</h3>
      <CodeSnippet lines={[
        { text: 'i18n-bakery bake <locales>', color: 'yellow' },
        { text: '  --out <dir>             # output dir', color: 'muted' },
        { text: '  --split                 # per-namespace files', color: 'muted' },
        { text: '  --hash                  # cache-busting filenames', color: 'muted' },
        { text: '  --manifest <file>       # generate manifest.json', color: 'muted' },
        { text: '  --minify                # strip whitespace', color: 'muted' },
        { text: '  --encrypt               # AES-256-GCM encryption', color: 'muted' },
        { text: '  --key <secret>          # encryption key', color: 'muted' },
      ]} />
    </div>
    <div>
      <h3 className="text-sm font-bold text-ink-50 mb-1">poacher — Migrate from i18next</h3>
      <CodeSnippet lines={[
        { text: 'i18n-bakery-poacher scout <src>       # scan keys', color: 'yellow' },
        { text: 'i18n-bakery-poacher convert \\', color: 'yellow' },
        { text: '  --from ./old --to ./locales         # convert', color: 'yellow' },
        { text: 'i18n-bakery-poacher serve             # CSV export', color: 'yellow' },
      ]} />
    </div>
  </div>
);

// ---- Best Practices ----
const bestPractices = [
  {
    Icon: IconFolder,
    iconColor: 'text-sky-400',
    title: 'Organize by feature/page',
    desc: 'One JSON/TOML file per page or feature. Avoids bloated single-file translation sets.',
    code: 'home.json / dashboard.json / settings.json',
  },
  {
    Icon: IconListCheck,
    iconColor: 'text-violet-400',
    title: 'Use semantic keys',
    desc: 'Keys should describe the content, not the UI position. Easier for translators.',
    code: "hero.cta_button — correct    button_1 — avoid",
  },
  {
    Icon: IconPackage,
    iconColor: 'text-amber-400',
    title: 'Set defaultNamespace',
    desc: 'Avoid repeating the namespace prefix for common translations.',
    code: "initI18n({ defaultNamespace: 'common' })",
  },
  {
    Icon: IconBolt,
    iconColor: 'text-jade-400',
    title: 'Use HttpBackend + --split',
    desc: 'Lazy-load only the namespaces needed per page. Massive performance win for large apps.',
    code: 'i18n-bakery bake locales --split --manifest',
  },
  {
    Icon: IconLock,
    iconColor: 'text-orange-400',
    title: 'Encrypt sensitive bundles',
    desc: 'Use AES-256-GCM encryption for bundles with sensitive copy (legal, internal tools).',
    code: 'bake locales --encrypt --key $VITE_I18N_KEY',
  },
  {
    Icon: IconShield,
    iconColor: 'text-rose-400',
    title: 'Key whitelist validation',
    desc: "The DefaultKeyParser allows only a-zA-Z0-9_-.:: — safe by default.",
    code: "allowed: 'common:nav.home'    rejected: '<script>alert(1)'",
  },
];

const BestPracticesDoc: React.FC = () => (
  <div className="space-y-4">
    {bestPractices.map(bp => (
      <div key={bp.title} className="flex items-start gap-3.5 p-4 bg-surface-1 border border-white/5 rounded-xl">
        <bp.Icon size={18} className={`flex-shrink-0 mt-0.5 ${bp.iconColor}`} />
        <div>
          <h4 className="text-sm font-semibold text-ink-100 mb-0.5">{bp.title}</h4>
          <p className="text-xs text-ink-500 leading-relaxed mb-2">{bp.desc}</p>
          <code className="text-[11px] font-mono text-amber-400/80">{bp.code}</code>
        </div>
      </div>
    ))}
  </div>
);

const CONTENT: Record<string, React.FC> = {
  quickstart: QuickStartDoc,
  namespaces: NamespacesDoc,
  structure: StructureDoc,
  react: ReactAPIDoc,
  cli: CLIDoc,
  'best-practices': BestPracticesDoc,
};

export const DocsPage: React.FC = () => {
  const [active, setActive] = useState('quickstart');
  const Content = CONTENT[active] ?? QuickStartDoc;
  const activeSection = sections.find(s => s.id === active);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-ink-50 mb-2 flex items-center gap-3">
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Documentation
          </span>
          <IconBook size={24} className="text-sky-400" />
        </h1>
        <p className="text-sm text-ink-500">
          Reference guide for namespaces, file layout, React hooks, CLI commands, and best practices.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="flex-shrink-0 md:w-44">
          <nav className="flex flex-row md:flex-col gap-1 flex-wrap md:flex-nowrap sticky top-20">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-150 text-left ${
                  active === s.id
                    ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                    : 'text-ink-500 hover:text-ink-100 hover:bg-white/4'
                }`}
              >
                <s.Icon size={13} />
                <span className="whitespace-nowrap">{s.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 bg-surface-2 border border-white/7 rounded-2xl p-6">
          <h2 className="text-base font-bold text-ink-50 mb-6 pb-3 border-b border-white/5 flex items-center gap-2">
            {activeSection && <activeSection.Icon size={16} className="text-sky-400" />}
            {activeSection?.title}
          </h2>
          <Content />
        </div>
      </div>
    </div>
  );
};
