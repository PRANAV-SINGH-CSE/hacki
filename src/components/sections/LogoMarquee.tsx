import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface LogoMarqueeProps {
  logos: string[];
  speed?: number;
  direction?: 'left' | 'right';
}

const LogoMarquee: React.FC<LogoMarqueeProps> = ({ 
  logos, 
  speed = 40,
  direction = 'left'
}) => {
  const controls = useAnimationControls();
  const [width, setWidth] = useState(0);
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  const duplicatedLogos = [...logos, ...logos];

  useEffect(() => {
    const measureWidth = () => {
      if (marqueeRef.current) {
        setWidth(marqueeRef.current.scrollWidth / 2);
      }
    };
    measureWidth();
    const t = setTimeout(measureWidth, 150);
    window.addEventListener('resize', measureWidth);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measureWidth);
    };
  }, [logos]);

  useEffect(() => {
    if (width === 0) return;
    controls.set({ x: 0 });
    const runAnimation = async () => {
      await controls.start({
        x: direction === 'left' ? -width : width,
        transition: {
          duration: speed,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    };
    runAnimation();
  }, [controls, width, speed, direction]);

  return (
    <div className="relative w-full overflow-hidden py-8 md:py-12 px-[2%]">
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
      <motion.div
        ref={marqueeRef}
        className="flex gap-5 md:gap-5 items-center"
        style={{ width: "max-content" }}
        animate={controls}
      >
        {duplicatedLogos.map((logo, index) => (
          <div key={index} className="flex-shrink-0 flex items-center justify-center logo-container">
            <div className="relative h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 opacity-70">
              <img
                src={logo}
                alt={`Partner logo ${index + 1}`}
                className="h-full w-full object-cover rounded-2xl"
                loading="lazy"
                draggable="false"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const container = target.closest('.logo-container') as HTMLElement;
                  if (container) container.style.display = 'none';
                }}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LogoMarquee;
