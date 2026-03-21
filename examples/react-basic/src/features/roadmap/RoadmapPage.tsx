import React, { useState } from 'react';

interface RoadmapItem {
  phase: number;
  version: string;
  title: string;
  subtitle: string;
  status: 'done' | 'in-progress' | 'planned' | 'future';
  eta: string;
  features: string[];
  icon: string;
  iNext?: string;
}

const roadmapData: RoadmapItem[] = [
  // ---- DONE ----
  {
    phase: 1, version: 'v0.1.0', title: 'Runtime Core', subtitle: 'The Foundation', status: 'done',
    eta: 'Dec 2024', icon: '🏗️',
    features: ['I18nService', 'MemoryStore', 'Mustache Interpolation', 'initI18n / t / setLocale'],
  },
  {
    phase: 2, version: 'v0.2.0', title: 'Auto-Save', subtitle: 'Self-Rising', status: 'done',
    eta: 'Dec 2024', icon: '💾',
    features: ['JSONFileSaver', 'ConsoleSaver', 'saveMissing detection'],
  },
  {
    phase: 3, version: 'v0.3.0', title: 'CLI', subtitle: 'The Mixer', status: 'done',
    eta: 'Dec 2024', icon: '⚙️',
    features: ['batter — key extraction', 'bake — compile JSON', 'Babel AST parsing'],
  },
  {
    phase: 4, version: 'v0.4.0', title: 'React Bindings', subtitle: 'The Glaze', status: 'done',
    eta: 'Dec 2024', icon: '⚛️',
    features: ['I18nProvider', 'useTranslation()', 'useI18n()', 'Namespace prefixes'],
  },
  {
    phase: 9, version: 'v0.9.1–0.9.3', title: 'Advanced Pluralization', subtitle: 'The Counter', status: 'done',
    eta: 'Dec 2024', icon: '🔢',
    features: ['Suffix pluralization (i18next-style)', 'CLDR via Intl.PluralRules (100+ langs)', 'ICU MessageFormat (plural/select/ordinal)'],
  },
  {
    phase: 13, version: 'v1.0.0', title: 'Plugin System', subtitle: 'First Stable Release 🎉', status: 'done',
    eta: 'Dec 2024', icon: '🔌',
    features: ['Plugin lifecycle hooks', 'NumberFormatPlugin (currency/percent/compact)', 'CapitalizePlugin (upper/lower/title)', '190+ tests, 100% coverage'],
  },
  {
    phase: 14, version: 'v1.0.1–1.0.8', title: 'The Head Chef Era', subtitle: 'Security, Formats, Migration', status: 'done',
    eta: 'Dec 2024', icon: '🧑‍🍳',
    features: [
      'Flat/Nested JSON structures',
      'Path traversal & injection prevention',
      'AES-256-GCM encryption (CLI + HttpBackend)',
      '--hash --split --manifest --minify flags',
      'TOML v1.0.0 support (zero-dep)',
      'Multi-locale extraction (comma-separated)',
      'HttpBackend with manifest lazy loading',
      'Poacher migration tool (from i18next)',
      'Prototype pollution protection',
      'defaultValue as string or options object',
    ],
  },
  // ---- PLANNED ----
  {
    phase: 15, version: 'v1.1.0', title: 'Context Support', subtitle: 'The Context Baker',
    status: 'planned', eta: 'Q2 2025', icon: '🎭',
    features: [
      't("friend", { context: "male" }) → friend_male',
      't("friend", { context: "female" }) → friend_female',
      'Configurable contextSeparator',
      'Context + pluralization combined',
    ],
  },
  {
    phase: 16, version: 'v1.1.0', title: 'Language Detection', subtitle: 'The Detector Baker',
    status: 'planned', eta: 'Q2 2025', icon: '🔍',
    features: [
      'Auto-detect from navigator.language',
      'Detection order: querystring → localStorage → cookie → navigator → htmlTag',
      'Cache persistence (localStorage/cookie)',
      'BrowserLanguageDetector plugin',
    ],
  },
  {
    phase: 17, version: 'v1.2.0', title: 'Event System', subtitle: 'The Observer Baker',
    status: 'planned', eta: 'Q2 2025', icon: '📡',
    features: [
      'i18n.on("languageChanged", handler)',
      'i18n.on("loaded", handler)',
      'i18n.on("missingKey", handler)',
      'Events: initialized / loaded / failedLoading / added',
    ],
  },
  {
    phase: 18, version: 'v1.3.0', title: 'Nesting Translations', subtitle: 'The Nesting Baker',
    status: 'planned', eta: 'Q3 2025', icon: '🪆',
    features: [
      '$t(key) — reference other translations',
      '"greeting": "$t(hello) $t(user.name)!"',
      'Nested option prefix/suffix customization',
      'Circular reference detection',
    ],
  },
  {
    phase: 19, version: 'v1.3.0', title: 'Return Objects', subtitle: 'The Object Baker',
    status: 'planned', eta: 'Q3 2025', icon: '📦',
    features: [
      't("menu", { returnObjects: true }) → { home, about, contact }',
      't("key", { returnDetails: true }) → { res, usedKey, usedLng, usedNS }',
      'Array returns',
    ],
  },
  {
    phase: 20, version: 'v1.4.0', title: 'Multiple Instances', subtitle: 'The Multi-Baker',
    status: 'future', eta: 'Q4 2025', icon: '🏭',
    features: [
      'createI18nInstance() factory',
      'Instance isolation (no globals)',
      'React context per instance',
      'Concurrent usage without conflicts',
    ],
  },
  {
    phase: 21, version: 'v1.4.0', title: 'Advanced Formatting', subtitle: 'The Format Baker',
    status: 'future', eta: 'Q4 2025', icon: '🗓️',
    features: [
      'DateTimeFormatPlugin via Intl.DateTimeFormat',
      'ListFormatPlugin via Intl.ListFormat',
      't("lastSeen", { date, formatParams: { date: { weekday: "long" } } })',
    ],
  },
  {
    phase: 22, version: 'v1.5.0', title: 'Missing Key Handler', subtitle: 'The Handler Baker',
    status: 'future', eta: 'Q1 2026', icon: '🚨',
    features: [
      'missingKeyHandler callback in config',
      'Send missing keys to error tracking',
      'Custom fallback strategies',
    ],
  },
];

const statusStyles: Record<string, { label: string; badge: string; dot: string; border: string }> = {
  done: {
    label: 'Released',
    badge: 'bg-jade-500/10 text-jade-400 border-jade-500/20',
    dot: 'bg-jade-400',
    border: 'border-jade-500/20',
  },
  'in-progress': {
    label: 'In Progress',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-400 animate-pulse',
    border: 'border-amber-500/20',
  },
  planned: {
    label: 'Planned',
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    dot: 'bg-violet-400',
    border: 'border-violet-500/20',
  },
  future: {
    label: 'Future',
    badge: 'bg-ink-600/40 text-ink-400 border-ink-600/20',
    dot: 'bg-ink-500',
    border: 'border-ink-600/30',
  },
};

const RoadmapCard: React.FC<{ item: RoadmapItem; index: number }> = ({ item, index }) => {
  const [open, setOpen] = useState(item.status === 'done' && index < 2);
  const s = statusStyles[item.status];

  return (
    <div className={`bg-surface-2 border ${s.border} rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/12`}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left p-5 flex items-center gap-4 cursor-pointer group"
      >
        {/* Icon + timeline dot */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <span className="text-xl">{item.icon}</span>
          <div className={`w-2 h-2 rounded-full ${s.dot}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-sm font-bold text-ink-50">{item.title}</span>
            <span className="text-xs text-ink-500 font-medium">— {item.subtitle}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-[11px] font-mono bg-surface-1 px-1.5 py-0.5 rounded text-amber-400 border border-white/5">
              {item.version}
            </code>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${s.badge}`}>
              {s.label}
            </span>
            <span className="text-[11px] text-ink-500">📅 {item.eta}</span>
          </div>
        </div>

        {/* Chevron */}
        <span className={`text-ink-500 transition-transform duration-200 text-xs ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Features list */}
      {open && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4">
          <ul className="space-y-2">
            {item.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-ink-300">
                <span className={`flex-shrink-0 mt-0.5 text-[8px] ${
                  item.status === 'done' ? 'text-jade-400' : 'text-ink-500'
                }`}>
                  {item.status === 'done' ? '✓' : '○'}
                </span>
                <span className="font-mono text-[11px] leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const RoadmapPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'done' | 'planned' | 'future'>('all');

  const filters: Array<{ key: 'all' | 'done' | 'planned' | 'future'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'done', label: '✓ Released' },
    { key: 'planned', label: '◉ Planned' },
    { key: 'future', label: '○ Future' },
  ];

  const filtered = filter === 'all' ? roadmapData : roadmapData.filter(r => {
    if (filter === 'done') return r.status === 'done';
    if (filter === 'planned') return r.status === 'planned' || r.status === 'in-progress';
    if (filter === 'future') return r.status === 'future';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-ink-50 mb-2">
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Roadmap</span>
          {' '}🗺️
        </h1>
        <p className="text-sm text-ink-500 leading-relaxed">
          From v0.1.0 to seamless i18next parity — every phase planned and tracked.
          Estimated dates are targets, not guarantees.
        </p>

        {/* Progress bar */}
        <div className="mt-4 bg-surface-2 border border-white/7 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-300">Overall Progress</span>
            <span className="text-xs font-bold text-amber-400">~70% i18next parity</span>
          </div>
          <div className="h-2 bg-surface-0 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: '70%' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-ink-600">
            <span>v0.1.0</span>
            <span>v1.0.8 (current)</span>
            <span>v1.5.0 (target: 98%)</span>
          </div>
        </div>

        {/* Next release teaser */}
        <div className="mt-3 flex items-center gap-3 bg-violet-500/5 border border-violet-500/15 rounded-xl px-4 py-3">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse flex-shrink-0" />
          <div>
            <span className="text-xs font-bold text-violet-300">Next: v1.1.0</span>
            <span className="text-xs text-ink-500 ml-2">— Context Support + Language Detection — ETA Q2 2025</span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-6 bg-surface-2 border border-white/7 p-1.5 rounded-xl w-fit">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
              filter === f.key
                ? 'bg-amber-500 text-surface-0 shadow-md shadow-amber-500/20'
                : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((item, i) => (
          <RoadmapCard key={`${item.version}-${item.phase}`} item={item} index={i} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-4 text-[11px] text-ink-500">
        {Object.entries(statusStyles).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${val.dot}`} />
            <span>{val.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
