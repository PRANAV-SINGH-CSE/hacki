import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  createPageTransition,
  pageTransitionConfig,
  reducedMotionPageTransition,
  reducedMotionConfig,
} from '../../lib/routeAnimations';
import { routeBackgrounds } from '../../lib/routeBackgrounds';
import RouteLoader from './RouteLoader';

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const PageWrapper = ({ children, direction = 1 }) => {
  const shouldReduceMotion = useRef(prefersReducedMotion());
  const location = useLocation();
  const [bgLoaded, setBgLoaded] = useState(false);
  const [currentBg, setCurrentBg] = useState(null);

  const bgPath = routeBackgrounds[location.pathname] || null;

  useEffect(() => {
    if (!bgPath) {
      setCurrentBg(null);
      setBgLoaded(true);
      return;
    }

    setBgLoaded(false);
    const fullUrl = `${process.env.PUBLIC_URL || ''}${bgPath}`;
    
    const img = new Image();
    img.src = fullUrl;
    img.onload = () => {
      setCurrentBg(fullUrl);
      setBgLoaded(true);
    };
    img.onerror = () => {
      console.warn("Failed to load background image:", fullUrl);
      setCurrentBg(null);
      setBgLoaded(true);
    };
  }, [bgPath]);

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

  if (!bgLoaded) {
    return <RouteLoader />;
  }

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
