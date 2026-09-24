import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? 'pl-11' : ''} ${error ? '!border-red-500/70 focus:!border-red-500 focus:!ring-red-500/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;