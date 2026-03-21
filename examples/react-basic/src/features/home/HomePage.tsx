import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from '@i18n-bakery/react';
import {
  IconWorld,
  IconBolt,
  IconPuzzle,
  IconShield,
  IconPackage,
  IconLock,
  IconBrandGithub,
  IconBread,
  IconSparkles,
  IconMap,
  IconBook,
} from '@tabler/icons-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation('home');

  const features = [
    {
      Icon: IconWorld,
      color: 'text-sky-400',
      bg: 'bg-sky-500/8 border-sky-500/15',
      id: 'multi_lang',
    },
    {
      Icon: IconBolt,
      color: 'text-amber-400',
      bg: 'bg-amber-500/8 border-amber-500/15',
      id: 'zero_deps',
    },
    {
      Icon: IconPuzzle,
      color: 'text-violet-400',
      bg: 'bg-violet-500/8 border-violet-500/15',
      id: 'plugin_system',
    },
    {
      Icon: IconShield,
      color: 'text-jade-400',
      bg: 'bg-jade-500/8 border-jade-500/15',
      id: 'type_safe',
    },
    {
      Icon: IconPackage,
      color: 'text-rose-400',
      bg: 'bg-rose-500/8 border-rose-500/15',
      id: 'toml_json',
    },
    {
      Icon: IconLock,
      color: 'text-orange-400',
      bg: 'bg-orange-500/8 border-orange-500/15',
      id: 'encryption',
    },
  ];

  const stats = [
    { value: '100+', id: 'languages' },
    { value: '200+', id: 'tests' },
    { value: '0', id: 'runtime_deps' },
    { value: '100%', id: 'coverage' },
  ];

  const navCards = [
    {
      href: '/showcase',
      Icon: IconBolt,
      iconColor: 'text-amber-400',
      id: 'showcase',
      accent: 'hover:border-amber-500/30 hover:bg-amber-500/4',
    },
    {
      href: '/docs',
      Icon: IconBook,
      iconColor: 'text-sky-400',
      id: 'docs',
      accent: 'hover:border-sky-500/30 hover:bg-sky-500/4',
    },
    {
      href: '/roadmap',
      Icon: IconMap,
      iconColor: 'text-violet-400',
      id: 'roadmap',
      accent: 'hover:border-violet-500/30 hover:bg-violet-500/4',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-16 pt-4">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/8 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full text-xs font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {t('hero.badge')}
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-5 leading-none flex items-center justify-center gap-4 flex-wrap">
          <span className="text-ink-50">i18n</span>
          <span style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{t('hero.title_bakery')}</span>
          <IconBread size={52} className="text-amber-400" />
        </h1>

        <p className="text-lg sm:text-xl text-ink-300 font-medium mb-3">
          {t('hero.subtitle')}
        </p>
        <p className="text-ink-500 max-w-xl mx-auto leading-relaxed text-sm">
          {t('hero.description')}
        </p>

        {/* CTA */}
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/showcase">
            <button className="inline-flex items-center gap-2 bg-amber-500 text-surface-0 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer">
              <IconBolt size={15} /> {t('hero.cta.showcase')}
            </button>
          </Link>
          <a
            href="https://github.com/artur0sky/i18n-bakery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-surface-2 border border-white/10 text-ink-200 px-5 py-2.5 rounded-xl font-semibold text-sm hover:border-white/20 hover:text-ink-50 transition-all active:scale-95"
          >
            <IconBrandGithub size={15} /> {t('hero.cta.github')}
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {stats.map((s) => (
          <div key={s.id} className="bg-surface-2 border border-white/7 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-amber-400 mb-0.5">{s.value}</div>
            <div className="text-xs text-ink-500 font-medium">{t(`stats.${s.id}`)}</div>
          </div>
        ))}
      </div>

      {/* Nav Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-14">
        {navCards.map((c) => (
          <Link key={c.href} href={c.href}>
            <div className={`relative bg-surface-2 border border-white/7 rounded-2xl p-5 cursor-pointer transition-all duration-200 group ${c.accent}`}>
              {t(`nav_cards.${c.id}.badge`) && (
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  {t(`nav_cards.${c.id}.badge`)}
                </span>
              )}
              <c.Icon
                size={28}
                className={`mb-3 transition-transform duration-200 group-hover:scale-110 ${c.iconColor}`}
              />
              <h3 className="text-sm font-bold text-ink-50 mb-1.5">{t(`nav_cards.${c.id}.title`)}</h3>
              <p className="text-xs text-ink-500 leading-relaxed">{t(`nav_cards.${c.id}.desc`)}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-lg font-bold text-ink-50 mb-5 flex items-center gap-2">
          <IconSparkles size={18} className="text-amber-400" /> {t('features.section_title')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <div
              key={f.id}
              className={`flex items-start gap-3.5 p-4 rounded-xl border ${f.bg} transition-all duration-200 hover:scale-[1.02]`}
            >
              <f.Icon size={18} className={`flex-shrink-0 mt-0.5 ${f.color}`} />
              <div>
                <h4 className={`text-sm font-semibold mb-0.5 ${f.color}`}>{t(`features.${f.id}.title`)}</h4>
                <p className="text-xs text-ink-500 leading-relaxed">{t(`features.${f.id}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
