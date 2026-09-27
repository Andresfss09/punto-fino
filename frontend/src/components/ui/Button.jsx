import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    gold: 'btn-ferrari-gold',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-none hover:bg-red-500/20 transition-all font-sans font-medium uppercase tracking-[0.16em] text-xs',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: '',
    lg: 'text-sm px-7 py-3.5',
  };

  return (
    <button
      className={`${variants[variant] || variants.primary} ${sizes[size] || ''} ${(loading || disabled) ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center gap-2 rounded-none ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
}