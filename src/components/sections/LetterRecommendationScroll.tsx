import React, { useRef } from 'react';

interface LetterRecommendationScrollProps {
  images: string[];
  speed?: number;
  direction?: 'left' | 'right';
  paused?: boolean;
  onImageClick?: (image: string) => void;
}

const LetterRecommendationScroll: React.FC<LetterRecommendationScrollProps> = ({ 
  images, 
  speed = 90,
  direction = 'left',
  paused = false,
  onImageClick,
}) => {
  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images];
  const directionClass = direction === 'right' ? 'infinite-marquee--reverse' : '';
  const pauseClass = paused ? 'is-paused' : '';
  const longPressTimerRef = useRef<number | null>(null);
  const lastPointerTypeRef = useRef<string | null>(null);

  return (
    <div 
      className={`infinite-marquee relative w-full overflow-hidden py-6 md:py-8 px-[2%] ${directionClass} ${pauseClass}`}
      style={{ ['--duration' as string]: `${speed}s` }}
    >
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
      
      <div
        className="infinite-marquee__track flex gap-4 md:gap-6"
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0"
          >
            <button
              type="button"
              className="marquee-image-button photo-container relative h-[420px] w-[300px] md:h-[420px] md:w-[300px] rounded-lg overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm"
              onPointerDown={(event) => {
                lastPointerTypeRef.current = event.pointerType;
                if (event.pointerType === 'touch') {
                  event.preventDefault();
                  if (longPressTimerRef.current) {
                    window.clearTimeout(longPressTimerRef.current);
                  }
                  longPressTimerRef.current = window.setTimeout(() => {
                    onImageClick?.(image);
                  }, 450);
                }
              }}
              onPointerUp={(event) => {
                if (event.pointerType !== 'touch') return;
                if (longPressTimerRef.current) {
                  window.clearTimeout(longPressTimerRef.current);
                }
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== 'touch') return;
                if (longPressTimerRef.current) {
                  window.clearTimeout(longPressTimerRef.current);
                }
              }}
              onPointerCancel={(event) => {
                if (event.pointerType !== 'touch') return;
                if (longPressTimerRef.current) {
                  window.clearTimeout(longPressTimerRef.current);
                }
              }}
              onContextMenu={(event) => event.preventDefault()}
              onDragStart={(event) => event.preventDefault()}
              onClick={() => {
                if (lastPointerTypeRef.current === 'touch') return;
                onImageClick?.(image);
              }}
              aria-label={`Open recommendation letter ${index + 1}`}
            >
              <img
                src={image}
                alt={`Letter of Recommendation ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                draggable="false"
                onContextMenu={(event) => event.preventDefault()}
                onTouchStart={(event) => event.preventDefault()}
                onError={(e) => {
                  // Fallback if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LetterRecommendationScroll;
