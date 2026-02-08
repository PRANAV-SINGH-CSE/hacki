/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

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
  // Duplicate images to ensure seamless loop
  const duplicatedImages = [...images, ...images];
  const directionClass = direction === 'right' ? 'infinite-marquee--reverse' : '';

  return (
    <div
      className={`infinite-marquee relative w-full overflow-hidden py-8 md:py-12 px-[2%] ${directionClass}`}
      style={{ ['--duration' as string]: `${speed}s` }}
    >
      {/* Gradients */}
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
      
      <div
        className="infinite-marquee__track flex gap-4 md:gap-6 items-center"
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center justify-center"
          >
             <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 aspect-[27/13] photo-container rounded-lg overflow-hidden bg-white/5 border border-white/10">            
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
      </div>
    </div>
  );
};

export default EventPhotoMarquee;
