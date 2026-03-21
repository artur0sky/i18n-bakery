import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md';
}

const variantStyles = {
  primary: 'bg-amber-500 text-surface-0 hover:bg-amber-400 font-semibold shadow-lg shadow-amber-500/20',
  secondary: 'bg-surface-4 text-ink-100 hover:bg-ink-700/60 border border-white/8',
  ghost: 'text-ink-300 hover:text-ink-100 hover:bg-white/5',
  outline: 'border border-white/12 text-ink-200 hover:border-amber-500/50 hover:text-amber-400',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center cursor-pointer transition-all duration-150',
        'font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
        'active:scale-95 disabled:opacity-40 disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
