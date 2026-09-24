import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const PageTransition = ({ children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    initial: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : -20,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
