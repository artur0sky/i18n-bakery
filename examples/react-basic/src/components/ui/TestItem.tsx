import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TestItemProps {
  label: string;
  value: string;
  status?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
  note?: string;
  code?: boolean;
}

const statusColor: Record<string, string> = {
  success: 'text-jade-400',
  warning: 'text-amber-400',
  error: 'text-rose-400',
  info: 'text-sky-400',
  neutral: 'text-ink-100',
};

export const TestItem: React.FC<TestItemProps> = ({
  label,
  value,
  status = 'neutral',
  note,
  code = false,
}) => {
  return (
    <div className="py-2 border-b border-white/5 last:border-0 last:pb-0">
      <div className="text-[11px] font-medium text-ink-500 uppercase tracking-widest mb-1">{label}</div>
      <div
        className={twMerge(
          'text-sm font-medium leading-relaxed',
          code && 'font-mono bg-surface-1 px-2 py-1 rounded-lg border border-white/5',
          statusColor[status]
        )}
      >
        {value}
        {note && (
          <span className="text-[11px] text-ink-500 ml-2 font-normal italic">{note}</span>
        )}
      </div>
    </div>
  );
};
