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
  const baseClasses = 'rounded-none border transition-all duration-200';
  const paddingClasses = padding ? 'p-4 sm:p-6' : '';
  
  let variantClasses = '';
  switch (variant) {
    case 'gold':
      variantClasses = 'bg-[#0d0d0d] border-gold-400/40 shadow-sm';
      break;
    case 'interactive':
      variantClasses = 'bg-[#0a0a0a] border-[#1e1e1e] hover:border-[#383838] hover:bg-[#111111] cursor-pointer';
      break;
    case 'default':
    default:
      variantClasses = 'bg-[#0a0a0a] border-[#1e1e1e]';
      break;
  }

  const combinedClasses = `${baseClasses} ${variantClasses} ${paddingClasses} ${className}`;

  const animationProps = Component === motion.div || Component === motion.button || Component === motion.article
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25 }
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
