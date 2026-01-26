/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface EventPhotoMarqueeProps {
  images: string[];
  speed?: number;
  direction?: 'left' | 'right';
}

const EventPhotoMarquee: React.FC<EventPhotoMarqueeProps> = ({ 
  images, 
  speed = 40,
  direction = 'left'
}) => {
  const controls = useAnimationControls();
  const [width, setWidth] = useState(0);
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  // Duplicate images to ensure seamless loop
  const duplicatedImages = [...images, ...images];

  useEffect(() => {
    const measureWidth = () => {
      if (marqueeRef.current) {
        const totalWidth = marqueeRef.current.scrollWidth;
        setWidth(totalWidth / 2);
      }
    };

    measureWidth();
    
    window.addEventListener('resize', measureWidth);
    return () => window.removeEventListener('resize', measureWidth);
  }, [images]);

  useEffect(() => {
    if (width === 0) return;

    const runAnimation = async () => {
      if (direction === 'right') {
        controls.set({ x: -width });
      } else {
        controls.set({ x: 0 });
      }

      await controls.start({
        x: direction === 'left' ? -width : 0,
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
      {/* Gradients */}
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
      
      <motion.div
        ref={marqueeRef}
        className="flex gap-4 md:gap-6 items-center"
        style={{ width: "max-content" }} 
        animate={controls}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center justify-center"
          >
            <div className="relative h-32 w-80 sm:h-40 sm:w-[400px] md:h-48 md:w-[480px] lg:h-56 lg:w-[560px] photo-container rounded-lg overflow-hidden bg-white/5 border border-white/10">
              <img
                src={image}
                alt="Event moment"
                className="h-full w-full object-cover rounded-lg"
                loading="lazy"
                draggable="false"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const container = target.closest('.photo-container') as HTMLElement;
                  if (container) {
                    // Show placeholder with text
                    container.innerHTML = `
                      <div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
                        <p class="text-white/40 text-sm text-center px-4">Image not found</p>
                      </div>
                    `;
                  }
                  console.warn(`Failed to load image: ${image}`);
                }}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default EventPhotoMarquee;
