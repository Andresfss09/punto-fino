export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-dark-50 text-gray-300 border border-white/10',
    gold: 'bg-gold-500/20 text-gold-400 border border-gold-500/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}