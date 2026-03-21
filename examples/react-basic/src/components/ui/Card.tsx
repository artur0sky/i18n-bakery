import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  accent?: 'amber' | 'jade' | 'violet' | 'rose' | 'sky' | 'none';
  badge?: string;
  badgeVariant?: 'stable' | 'planned' | 'upcoming' | 'beta';
}

const accentBorder: Record<string, string> = {
  amber: 'border-t-amber-500/60',
  jade: 'border-t-jade-500/60',
  violet: 'border-t-violet-500/60',
  rose: 'border-t-rose-500/60',
  sky: 'border-t-sky-500/60',
  none: 'border-t-transparent',
};

const badgeStyles: Record<string, string> = {
  stable: 'bg-jade-500/10 text-jade-400 border border-jade-500/20',
  beta: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  planned: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  upcoming: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className,
  accent = 'none',
  badge,
  badgeVariant = 'stable',
}) => {
  return (
    <div
      className={twMerge(
        'relative bg-surface-2 rounded-2xl border border-white/7 border-t-2 overflow-hidden',
        'transition-all duration-200 hover:border-white/12 hover:bg-surface-3',
        accentBorder[accent],
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-ink-50 tracking-tight">{title}</h3>
          {badge && (
            <span className={twMerge('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', badgeStyles[badgeVariant])}>
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
