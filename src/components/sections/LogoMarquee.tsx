import React from 'react';
import SmoothImage from '../shared/SmoothImage';

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
  const duplicatedLogos = [...logos, ...logos];
  const directionClass = direction === 'right' ? 'infinite-marquee--reverse' : '';

  return (
    <div
      className={`infinite-marquee relative w-full overflow-hidden py-8 md:py-12 px-[2%] ${directionClass}`}
      style={{ ['--duration' as string]: `${speed}s` }}
    >
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
      <div
        className="infinite-marquee__track flex gap-5 md:gap-5 items-center"
      >
        {duplicatedLogos.map((logo, index) => (
          <div key={index} className="flex-shrink-0 flex items-center justify-center logo-container">
            <div className="relative h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 opacity-70">
              <SmoothImage
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
      </div>
    </div>
  );
};

export default LogoMarquee;
