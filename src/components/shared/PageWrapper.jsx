import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  createPageTransition,
  pageTransitionConfig,
  reducedMotionPageTransition,
  reducedMotionConfig,
} from '../../lib/routeAnimations';
import { routeBackgrounds } from '../../lib/routeBackgrounds';

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const PageWrapper = ({ children, direction = 1 }) => {
  const shouldReduceMotion = useRef(prefersReducedMotion());
  const location = useLocation();
  const bgPath = routeBackgrounds[location.pathname] || null;
  const currentBg = bgPath ? `${process.env.PUBLIC_URL || ''}${bgPath}` : null;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      shouldReduceMotion.current = mediaQuery.matches;
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const variants = shouldReduceMotion.current
    ? reducedMotionPageTransition
    : createPageTransition(direction);

  const transition = shouldReduceMotion.current
    ? reducedMotionConfig
    : pageTransitionConfig;

  return (
    <>
      {currentBg && (
        <motion.div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `url("${currentBg}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageWrapper;
