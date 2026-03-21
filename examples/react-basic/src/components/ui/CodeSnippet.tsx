import React from 'react';

interface CodeSnippetProps {
  lines: Array<{
    text: string;
    color?: 'green' | 'yellow' | 'blue' | 'purple' | 'cyan' | 'orange' | 'white' | 'muted';
  }>;
}

const colorMap: Record<string, string> = {
  green: 'text-jade-400',
  yellow: 'text-amber-400',
  blue: 'text-sky-400',
  purple: 'text-violet-400',
  cyan: 'text-cyan-400',
  orange: 'text-orange-400',
  white: 'text-ink-100',
  muted: 'text-ink-500',
};

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ lines }) => {
  return (
    <div className="bg-surface-0 border border-white/7 rounded-xl p-4 font-mono text-xs leading-6 overflow-x-auto">
      {lines.map((line, i) => (
        <div key={i} className={colorMap[line.color ?? 'white']}>
          {line.text || '\u00a0'}
        </div>
      ))}
    </div>
  );
};
