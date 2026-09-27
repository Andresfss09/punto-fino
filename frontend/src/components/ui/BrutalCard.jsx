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
  const baseClasses = 'rounded-[4px] border transition-all duration-200';
  const paddingClasses = padding ? 'p-4 sm:p-6' : '';
  
  let variantClasses = '';
  switch (variant) {
    case 'gold':
      variantClasses = 'bg-[#121815] border-[#cfa53b]/40 shadow-sm';
      break;
    case 'interactive':
      variantClasses = 'bg-[#121815] border-[#222a26] hover:border-[#cfa53b]/50 hover:bg-[#151c19] cursor-pointer shadow-subtle';
      break;
    case 'default':
    default:
      variantClasses = 'bg-[#121815] border-[#222a26] shadow-subtle';
      break;
  }

  const combinedClasses = `${baseClasses} ${variantClasses} ${paddingClasses} ${className}`;

  // Only apply animation if it's a motion component
  const animationProps = Component === motion.div || Component === motion.button || Component === motion.article
    ? {
        initial: { opacity: 0, y: 15 },
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

