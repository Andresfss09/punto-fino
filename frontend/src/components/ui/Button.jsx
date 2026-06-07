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
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl hover:bg-red-500/30 transition-all font-medium',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: '',
    lg: 'text-lg px-8 py-4',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${(loading || disabled) ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center gap-2 ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
}