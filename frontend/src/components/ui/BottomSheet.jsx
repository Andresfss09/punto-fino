import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BottomSheet = ({ isOpen, onClose, title, children, className = '' }) => {
  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose();
              }
            }}
            className={`fixed bottom-0 left-0 right-0 z-50 bg-[#111111] border-t-3 border-[#d4af37] rounded-t-xl md:hidden max-h-[90vh] flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.5)] ${className}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2 w-full touch-none cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-[#333] rounded-full" />
            </div>
            
            {title && (
              <div className="px-6 py-2 border-b-2 border-[#333]">
                <h2 id="sheet-title" className="text-xl font-display text-white">{title}</h2>
              </div>
            )}
            
            {/* Scrollable content */}
            <div className="overflow-y-auto px-6 py-4 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
