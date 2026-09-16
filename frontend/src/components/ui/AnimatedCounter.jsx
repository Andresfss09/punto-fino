import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';

const AnimatedCounter = ({ 
  value, 
  duration = 1, 
  prefix = '', 
  suffix = '',
  className = ''
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(count, value, {
      duration: duration,
      ease: "easeOut",
    });

    return controls.stop;
  }, [value, duration, count, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    return rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });
  }, [rounded, shouldReduceMotion]);

  const formattedValue = new Intl.NumberFormat('es-CO').format(displayValue);

  return (
    <span className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

export default AnimatedCounter;
