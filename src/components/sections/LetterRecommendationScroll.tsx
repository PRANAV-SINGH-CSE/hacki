import React, { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface LetterRecommendationScrollProps {
  images: string[];
  speed?: number;
  direction?: 'left' | 'right';
}

const LetterRecommendationScroll: React.FC<LetterRecommendationScrollProps> = ({ 
  images, 
  speed = 90,
  direction = 'left'
}) => {
  const controls = useAnimationControls();
  
  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images];
  
  // Calculate animation distance (5:7 aspect ratio: if height is 420px, width is 300px)
  const imageWidth = 300; // 5:7 aspect ratio
  const gap = 24; // gap-6 = 24px
  const totalWidth = (imageWidth + gap) * images.length;
  const animationDirection = direction === 'left' ? -1 : 1;

  useEffect(() => {
    const runAnimation = async () => {
      await controls.start({
        x: animationDirection * totalWidth,
        transition: {
          duration: speed,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    };
    runAnimation();
  }, [controls, totalWidth, speed, animationDirection]);

  return (
    <div 
      className="relative w-full overflow-hidden py-6 md:py-8 px-[2%]"
    >
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
      
      <motion.div
        className="flex gap-4 md:gap-6"
        animate={controls}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0"
          >
            <div className="relative h-[420px] w-[300px] md:h-[420px] md:w-[300px] rounded-lg overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
              <img
                src={image}
                alt={`Letter of Recommendation ${index + 1}`}
                className="h-full w-full object-cover"
                draggable="false"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LetterRecommendationScroll;
