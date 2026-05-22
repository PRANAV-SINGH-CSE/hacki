import { motion } from 'framer-motion';
import GlassyButton from '../ui/GlassyButton';
import {
  containerVariants,
  headingVariants,
  buttonVariants,
  reducedMotionContainerVariants,
  reducedMotionVariants,
} from '../../lib/routeAnimations';
import { useEffect, useRef } from 'react';

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const NetworkMesh = () => (
  <motion.div
    className="h-full w-full"
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
    style={{ transformOrigin: "50% 50%" }}
  >
    <svg className="w-full h-full opacity-80 drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="150" stroke="url(#paint0_linear)" strokeWidth="0.8" strokeDasharray="4 4" />
      <circle cx="200" cy="200" r="100" stroke="url(#paint0_linear)" strokeWidth="0.8" />
      <path d="M200 50 L200 350" stroke="rgba(0, 243, 255, 0.4)" strokeWidth="0.8" />
      <path d="M50 200 L350 200" stroke="rgba(0, 243, 255, 0.4)" strokeWidth="0.8" />
      
      {/* Floating Nodes */}
      <circle cx="200" cy="50" r="2.5" fill="#00F3FF" />
      <circle cx="350" cy="200" r="2.5" fill="#00F3FF" />
      <circle cx="200" cy="350" r="2.5" fill="#00F3FF" />
      <circle cx="50" cy="200" r="2.5" fill="#00F3FF" />
      
      {/* Connecting Arcs */}
      <path d="M200 50 Q 280 80 306 150" stroke="rgba(0, 243, 255, 0.3)" strokeWidth="0.8" fill="none" />
      <path d="M200 350 Q 120 320 94 250" stroke="rgba(0, 243, 255, 0.3)" strokeWidth="0.8" fill="none" />
      <defs>
        <linearGradient id="paint0_linear" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(0, 243, 255, 0)" />
          <stop offset="0.5" stopColor="rgba(0, 243, 255, 0.7)" />
          <stop offset="1" stopColor="rgba(0, 243, 255, 0)" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

const Hero = () => {
  const shouldReduceMotion = useRef(prefersReducedMotion());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      shouldReduceMotion.current = mediaQuery.matches;
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const container = shouldReduceMotion.current
    ? reducedMotionContainerVariants
    : containerVariants;
  const heading = shouldReduceMotion.current ? reducedMotionVariants : headingVariants;
  const textFade = shouldReduceMotion.current ? reducedMotionVariants : buttonVariants; 
  const button = shouldReduceMotion.current ? reducedMotionVariants : buttonVariants;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#000000] pb-0">
      <div
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${process.env.PUBLIC_URL}/hero/background_image_1.png")`,
        }}
        aria-hidden="true"
      />

      {/* NOISE OVERLAY */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* LAYOUT CONTAINER */}
      {/* UPDATE: Reduced mobile pt-24 to pt-20 (80px). Keeps content very high. */}
      <div className="container relative z-[10] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center h-full pt-50 pb-10 lg:pt-[130px] lg:pb-[68px] scale-100 lg:scale-[1.05] origin-center">
        
        {/* LEFT COLUMN */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="lg:col-span-8 mx-auto lg:mx-0 text-center lg:text-left w-full lg:pl-[105px]"
        >
          {/* UPDATE: Reduced mobile gap-5 to gap-4 (16px) for maximum density */}
          <div className="flex flex-col gap-4 lg:gap-12 items-center lg:items-start w-full">
            
            {/* Badge */}
            <motion.div
              layout
              variants={button}
              className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-950/10 px-4 py-1.5 lg:px-6 lg:py-2 backdrop-blur-sm w-fit"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,243,255,0.8)] animate-pulse" />
              <span className="font-orbitron text-sm uppercase tracking-widest text-cyan-200/80">
                From Curiosity to Defense
              </span>
            </motion.div>

            {/* Typography */}
            <motion.h1
              layout
              variants={heading}
              className="font-sans font-medium text-white relative z-10 tracking-tight leading-[1.05] w-full"
            >
              <span 
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2"
                style={{ 
                  color: '#FFFFFF',
                  textShadow: '0 0 10px rgba(0,243,255,0.35)'
                }}
              >
                HACKIWARE
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-cyan-400 to-cyan-200/50 bg-clip-text text-transparent font-light tracking-tight">
                From Curiosity to Defense
              </span>
            </motion.h1>

            {/* Paragraph */}
            <motion.p 
              variants={textFade}
              className="text-white/60 text-base md:text-xl font-light leading-relaxed w-full max-w-none"
            >
              The gap between classroom theory and operational security ends here. 
              We build the next generation of defenders through immersive research and live simulations.
            </motion.p>

            {/* Buttons */}
            <motion.div
              layout
              variants={button}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-5 pt-2 lg:pt-4 w-full"
            >
              <GlassyButton href="/events" glowColor="transparent">
                View Events
              </GlassyButton>
              <GlassyButton
                href="/about"
                glowColor="transparent"
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white/80"
              >
                Learn More
              </GlassyButton>
            </motion.div>

            {/* Trust Strip */}
           
          </div>
        </motion.div>

        {/* RIGHT COLUMN (Unchanged) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="hidden lg:flex lg:col-span-4 justify-center items-center relative h-[600px]"
        >
          {/* Abstract Cyber Element */}
          <div
            className="absolute pointer-events-none"
            style={{
              right: '0%',
              top: '42%',
              transform: 'translateY(-50%)',
              width: '500px',
              height: '500px',
            }}
          >
            {/* Removed subtle glow behind the mesh */}
            <div style={{ width: '100%', height: '100%' }}>
              <NetworkMesh />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;