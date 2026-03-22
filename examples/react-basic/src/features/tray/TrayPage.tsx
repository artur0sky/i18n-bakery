import React, { useState } from 'react';
import { useTranslation } from '@i18n-bakery/react';
import {
  IconRobot,
  IconSearch,
  IconFlame,
  IconBread,
  IconPencil,
  IconTerminal2,
  IconCheck,
  IconChevronRight,
  IconSparkles,
  IconBolt,
  IconShieldCheck,
} from '@tabler/icons-react';
import { CodeSnippet } from '../../components/ui/CodeSnippet';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrayTool {
  id: string;
  icon: React.FC<{ size?: number; className?: string }>;
  color: string;
  bg: string;
  border: string;
  command: string;
}

const TOOLS: TrayTool[] = [
  {
    id: 'check_pantry',
    icon: IconSearch,
    color: 'text-violet-400',
    bg: 'bg-violet-500/8',
    border: 'border-violet-500/20',
    command: 'check_pantry',
  },
  {
    id: 'fry_batter',
    icon: IconBread,
    color: 'text-amber-400',
    bg: 'bg-amber-500/8',
    border: 'border-amber-500/20',
    command: 'fry_batter',
  },
  {
    id: 'update_recipe',
    icon: IconPencil,
    color: 'text-sky-400',
    bg: 'bg-sky-500/8',
    border: 'border-sky-500/20',
    command: 'update_recipe',
  },
  {
    id: 'bake_bundle',
    icon: IconFlame,
    color: 'text-orange-400',
    bg: 'bg-orange-500/8',
    border: 'border-orange-500/20',
    command: 'bake_bundle',
  },
];

// ─── Sub-sections ─────────────────────────────────────────────────────────────

const OverviewSection: React.FC = () => {
  const { t } = useTranslation('tray');

  const steps = [
    { n: '1', key: 'workflow.step1', Icon: IconSearch, color: 'text-violet-400' },
    { n: '2', key: 'workflow.step2', Icon: IconSparkles, color: 'text-amber-400' },
    { n: '3', key: 'workflow.step3', Icon: IconPencil, color: 'text-sky-400' },
    { n: '4', key: 'workflow.step4', Icon: IconFlame, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-400 leading-relaxed">
        {t('overview.body')}
      </p>

      {/* Workflow diagram */}
      <div>
        <h3 className="text-xs font-bold text-ink-300 uppercase tracking-widest mb-4">
          {t('workflow.title')}
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={step.n}>
              <div className="flex items-center gap-3 bg-surface-1 border border-white/7 rounded-xl px-4 py-3 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${step.color} border-current bg-current/10`}>
                  {step.n}
                </div>
                <step.Icon size={14} className={`flex-shrink-0 ${step.color}`} />
                <span className="text-xs text-ink-300 leading-snug">{t(step.key)}</span>
              </div>
              {i < steps.length - 1 && (
                <IconChevronRight size={16} className="text-ink-700 hidden sm:block mx-1 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Claude Desktop config */}
      <div>
        <h3 className="text-sm font-bold text-ink-50 mb-3">{t('setup.claude_title')}</h3>
        <CodeSnippet lines={[
          { text: '// ~/.config/claude/claude_desktop_config.json', color: 'muted' },
          { text: '{', color: 'white' },
          { text: '  "mcpServers": {', color: 'white' },
          { text: '    "i18n-bakery": {', color: 'white' },
          { text: '      "command": "pnpm",', color: 'blue' },
          { text: '      "args": ["i18n:tray"],', color: 'blue' },
          { text: '      "cwd": "/path/to/your/project"', color: 'blue' },
          { text: '    }', color: 'white' },
          { text: '  }', color: 'white' },
          { text: '}', color: 'white' },
        ]} />
      </div>

      {/* This project config */}
      <div>
        <h3 className="text-sm font-bold text-ink-50 mb-3">{t('setup.this_project')}</h3>
        <CodeSnippet lines={[
          { text: '# From the react-basic example root:', color: 'muted' },
          { text: 'pnpm i18n:tray', color: 'yellow' },
          { text: '# → Starts MCP server on stdio', color: 'blue' },
          { text: '# → AI agents can now call fry_batter, check_pantry, etc.', color: 'blue' },
        ]} />
      </div>
    </div>
  );
};

const ToolsSection: React.FC = () => {
  const { t } = useTranslation('tray');
  const [activeToolId, setActiveToolId] = useState<string>(TOOLS[0].id);
  const activeTool = TOOLS.find(tool => tool.id === activeToolId)!;

  const toolCodeMap: Record<string, Array<{ text: string; color: 'green' | 'yellow' | 'blue' | 'purple' | 'cyan' | 'orange' | 'white' | 'muted' | undefined }>> = {
    check_pantry: [
      { text: '// AI calls: check_pantry', color: 'muted' },
      { text: '{', color: 'white' },
      { text: '  "localesDir": "locales",', color: 'blue' },
      { text: '  "referenceLocale": "en-US",', color: 'blue' },
      { text: '  "cwd": "/your/project"', color: 'blue' },
      { text: '}', color: 'white' },
      { text: '', color: 'white' },
      { text: '// → Returns:', color: 'muted' },
      { text: '// es-MX [████████░░] 80% (missing 12 keys)', color: 'yellow' },
      { text: '// it    [██████░░░░] 60% (missing 24 keys)', color: 'yellow' },
      { text: '// jp    [████░░░░░░] 40% (missing 36 keys)', color: 'yellow' },
    ],
    fry_batter: [
      { text: '// AI calls: fry_batter', color: 'muted' },
      { text: '{', color: 'white' },
      { text: '  "source": "src",', color: 'blue' },
      { text: '  "locales": "en-US,es-MX,it,jp",', color: 'blue' },
      { text: '  "out": "locales",', color: 'blue' },
      { text: '  "cwd": "/your/project"', color: 'blue' },
      { text: '}', color: 'white' },
      { text: '', color: 'white' },
      { text: '// → Scans t() calls, writes placeholder keys', color: 'muted' },
      { text: '// → en-US: +3 new keys  |  es-MX: +3 new keys', color: 'yellow' },
    ],
    update_recipe: [
      { text: '// AI calls: update_recipe (once per key)', color: 'muted' },
      { text: '{', color: 'white' },
      { text: '  "locale": "es-MX",', color: 'blue' },
      { text: '  "namespace": "tray",', color: 'blue' },
      { text: '  "key": "tools.check_pantry.title",', color: 'blue' },
      { text: '  "value": "Verificar Despensa",', color: 'blue' },
      { text: '  "localesDir": "locales",', color: 'blue' },
      { text: '  "cwd": "/your/project"', color: 'blue' },
      { text: '}', color: 'white' },
      { text: '// → ➕ Created — es-MX/tray.json updated', color: 'yellow' },
    ],
    bake_bundle: [
      { text: '// AI calls: bake_bundle', color: 'muted' },
      { text: '{', color: 'white' },
      { text: '  "source": "locales",', color: 'blue' },
      { text: '  "out": "dist/locales",', color: 'blue' },
      { text: '  "split": true,', color: 'blue' },
      { text: '  "hash": true,', color: 'blue' },
      { text: '  "manifest": "manifest.json",', color: 'blue' },
      { text: '  "cwd": "/your/project"', color: 'blue' },
      { text: '}', color: 'white' },
      { text: '// → Baked 4 locales × 5 namespaces = 20 files', color: 'yellow' },
    ],
  };

  return (
    <div className="space-y-4">
      {/* Tool tabs */}
      <div className="flex flex-wrap gap-2">
        {TOOLS.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveToolId(tool.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all duration-150 ${
              activeToolId === tool.id
                ? `${tool.bg} ${tool.border} ${tool.color}`
                : 'bg-surface-1 border-white/7 text-ink-500 hover:text-ink-200 hover:border-white/15'
            }`}
          >
            <tool.icon size={13} />
            <code>{tool.command}</code>
          </button>
        ))}
      </div>

      {/* Tool detail */}
      <div className={`rounded-2xl border p-5 ${activeTool.bg} ${activeTool.border}`}>
        <div className="flex items-start gap-3 mb-4">
          <activeTool.icon size={20} className={`flex-shrink-0 mt-0.5 ${activeTool.color}`} />
          <div>
            <h4 className={`text-sm font-bold mb-0.5 ${activeTool.color}`}>
              {t(`tools.${activeTool.id}.title`)}
            </h4>
            <p className="text-xs text-ink-400 leading-relaxed">
              {t(`tools.${activeTool.id}.desc`)}
            </p>
          </div>
        </div>
        <CodeSnippet lines={toolCodeMap[activeTool.id]} />
      </div>
    </div>
  );
};

const SecuritySection: React.FC = () => {
  const { t } = useTranslation('tray');

  const items = [
    { key: 'traversal', Icon: IconShieldCheck, color: 'text-jade-400' },
    { key: 'prototype', Icon: IconShieldCheck, color: 'text-jade-400' },
    { key: 'encryption', Icon: IconShieldCheck, color: 'text-jade-400' },
    { key: 'validation', Icon: IconShieldCheck, color: 'text-jade-400' },
  ];

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.key} className="flex items-start gap-3 p-4 bg-surface-1 border border-white/5 rounded-xl">
          <IconCheck size={16} className="flex-shrink-0 mt-0.5 text-jade-400" />
          <div>
            <h4 className="text-sm font-semibold text-ink-100 mb-0.5">
              {t(`security.${item.key}.title`)}
            </h4>
            <p className="text-xs text-ink-500 leading-relaxed">
              {t(`security.${item.key}.desc`)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabId = 'overview' | 'tools' | 'security';

interface Tab {
  id: TabId;
  icon: React.FC<{ size?: number; className?: string }>;
  key: string;
}

const TABS: Tab[] = [
  { id: 'overview', icon: IconRobot, key: 'tabs.overview' },
  { id: 'tools', icon: IconTerminal2, key: 'tabs.tools' },
  { id: 'security', icon: IconShieldCheck, key: 'tabs.security' },
];

const TAB_CONTENT: Record<TabId, React.FC> = {
  overview: OverviewSection,
  tools: ToolsSection,
  security: SecuritySection,
};

export const TrayPage: React.FC = () => {
  const { t } = useTranslation('tray');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const Content = TAB_CONTENT[activeTab];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-violet-500/8 border border-violet-500/20 text-violet-400 px-3 py-1.5 rounded-full text-xs font-semibold mb-5">
          <IconRobot size={13} />
          MCP Server
        </div>

        <h1 className="text-2xl font-black text-ink-50 mb-2 flex items-center gap-3">
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {t('title')}
          </span>
          <IconRobot size={24} className="text-violet-400" />
        </h1>
        <p className="text-sm text-ink-500">{t('description')}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                : 'text-ink-500 hover:text-ink-100 hover:bg-white/4'
            }`}
          >
            <tab.icon size={13} />
            {t(tab.key)}
          </button>
        ))}
      </div>

      {/* Content panel */}
      <div className="bg-surface-2 border border-white/7 rounded-2xl p-6">
        <Content />
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 p-5 bg-gradient-to-r from-violet-500/5 to-amber-500/5 border border-violet-500/15 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <IconBolt size={20} className="text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-ink-50">{t('cta.title')}</p>
            <p className="text-xs text-ink-500">{t('cta.subtitle')}</p>
          </div>
        </div>
        <code className="text-xs font-mono text-amber-400 bg-amber-500/8 border border-amber-500/15 px-3 py-1.5 rounded-lg whitespace-nowrap">
          pnpm i18n:tray
        </code>
      </div>
    </div>
  );
};
