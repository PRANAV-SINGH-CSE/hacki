import React, { useEffect, useRef } from 'react';

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
  const touchMovedRef = useRef(false);
  const lastPointerTypeRef = useRef<string | null>(null);
  const touchActiveRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastScrollTimeRef = useRef(0);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const pointerMovedRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      lastScrollTimeRef.current = Date.now();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                  if (touchActiveRef.current) return;
                  touchMovedRef.current = false;
                  touchStartRef.current = {
                    x: event.clientX,
                    y: event.clientY,
                  };
                  if (longPressTimerRef.current) {
                    window.clearTimeout(longPressTimerRef.current);
                  }
                  longPressTimerRef.current = window.setTimeout(() => {
                    if (!touchMovedRef.current) {
                      onImageClick?.(image);
                    }
                  }, 450);
                  return;
                }
                pointerMovedRef.current = false;
                pointerStartRef.current = {
                  x: event.clientX,
                  y: event.clientY,
                };
              }}
              onTouchStart={(event) => {
                touchActiveRef.current = true;
                lastPointerTypeRef.current = 'touch';
                touchMovedRef.current = false;
                touchStartRef.current = null;
                const touch = event.touches[0];
                if (touch) {
                  touchStartRef.current = { x: touch.clientX, y: touch.clientY };
                }
                if (longPressTimerRef.current) {
                  window.clearTimeout(longPressTimerRef.current);
                }
                longPressTimerRef.current = window.setTimeout(() => {
                  if (!touchMovedRef.current) {
                    onImageClick?.(image);
                  }
                }, 450);
              }}
              onTouchMove={(event) => {
                if (!touchStartRef.current) return;
                const touch = event.touches[0];
                if (!touch) return;
                const dx = Math.abs(touch.clientX - touchStartRef.current.x);
                const dy = Math.abs(touch.clientY - touchStartRef.current.y);
                if (dx > 8 || dy > 8) {
                  touchMovedRef.current = true;
                  if (longPressTimerRef.current) {
                    window.clearTimeout(longPressTimerRef.current);
                  }
                }
              }}
              onTouchEnd={() => {
                touchActiveRef.current = false;
                if (longPressTimerRef.current) {
                  window.clearTimeout(longPressTimerRef.current);
                }
              }}
              onTouchCancel={() => {
                touchActiveRef.current = false;
                if (longPressTimerRef.current) {
                  window.clearTimeout(longPressTimerRef.current);
                }
              }}
              onPointerMove={(event) => {
                if (event.pointerType === 'touch') {
                  if (!touchStartRef.current) return;
                  const dx = Math.abs(event.clientX - touchStartRef.current.x);
                  const dy = Math.abs(event.clientY - touchStartRef.current.y);
                  if (dx > 8 || dy > 8) {
                    touchMovedRef.current = true;
                    if (longPressTimerRef.current) {
                      window.clearTimeout(longPressTimerRef.current);
                    }
                  }
                  return;
                }
                if (!pointerStartRef.current) return;
                const dx = Math.abs(event.clientX - pointerStartRef.current.x);
                const dy = Math.abs(event.clientY - pointerStartRef.current.y);
                if (dx > 6 || dy > 6) {
                  pointerMovedRef.current = true;
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
                if (pointerMovedRef.current) return;
                if (Date.now() - lastScrollTimeRef.current < 200) return;
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
