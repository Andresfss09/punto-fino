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
  const baseClasses = 'rounded-[6px] border transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]';
  const paddingClasses = padding ? 'p-4 sm:p-6' : '';
  
  let variantClasses = '';
  switch (variant) {
    case 'green':
    case 'featured':
      variantClasses = 'bg-[#121113] border-[#2d5736] hover:border-[#71d083]/60';
      break;
    case 'gold':
      variantClasses = 'bg-[#121113] border-[#2d5736] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]';
      break;
    case 'secondary':
      variantClasses = 'bg-[#1a191b] border-[#2b292d]';
      break;
    case 'interactive':
      variantClasses = 'bg-[#121113] border-[#2b292d] hover:border-[#3c393f] hover:bg-[#1a191b] cursor-pointer';
      break;
    case 'default':
    default:
      variantClasses = 'bg-[#121113] border-[#2b292d]';
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
