import React from 'react';
import { motion } from 'framer-motion';

const BrutalCard = ({ 
  variant = 'default', 
  className = '', 
  children, 
  as: Component = motion.div,
  onClick,
  padding = true,
  ...props 
}) => {
  const baseClasses = 'rounded-[4px] border-2';
  const paddingClasses = padding ? 'p-4 sm:p-6' : '';
  
  let variantClasses = '';
  switch (variant) {
    case 'gold':
      variantClasses = 'bg-[#111111] border-[#d4af37] shadow-[4px_4px_0_#d4af37]';
      break;
    case 'interactive':
      variantClasses = 'bg-[#111111] border-[#333] shadow-[4px_4px_0_#333] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[6px_6px_0_#333] transition-all cursor-pointer';
      break;
    case 'default':
    default:
      variantClasses = 'bg-[#111111] border-[#333] shadow-[4px_4px_0_#333]';
      break;
  }

  const combinedClasses = `${baseClasses} ${variantClasses} ${paddingClasses} ${className}`;

  // Only apply animation if it's a motion component
  const animationProps = Component === motion.div || Component === motion.button || Component === motion.article
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      }
    : {};

  return (
    <Component 
      className={combinedClasses} 
      onClick={onClick}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default BrutalCard;
