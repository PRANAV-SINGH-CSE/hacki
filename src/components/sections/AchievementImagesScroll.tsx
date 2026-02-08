import React from 'react';

interface AchievementImagesScrollProps {
  images: string[];
  speed?: number;
  direction?: 'left' | 'right';
}

const AchievementImagesScroll: React.FC<AchievementImagesScrollProps> = ({ 
  images, 
  speed = 90,
  direction = 'left'
}) => {
  const duplicatedImages = [...images, ...images];
  const directionClass = direction === 'right' ? 'infinite-marquee--reverse' : '';

  return (
    <div
      className={`infinite-marquee relative w-full overflow-hidden py-6 md:py-8 px-[2%] ${directionClass}`}
      style={{ ['--duration' as string]: `${speed}s` }}
    >
      <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
      <div className="infinite-marquee__track flex gap-4 md:gap-6">
        {duplicatedImages.map((image, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="relative h-64 w-80 md:h-96 md:w-[512px] rounded-lg overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
              <img
                src={image}
                alt={`Certificate ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                draggable="false"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementImagesScroll;
