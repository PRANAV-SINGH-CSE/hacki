/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';

interface EventPhotoMarqueeProps {
  images: string[];
  speed?: number;
  direction?: 'left' | 'right';
  paused?: boolean;
  onImageClick?: (image: string) => void;
}

const EventPhotoMarquee: React.FC<EventPhotoMarqueeProps> = ({ 
  images, 
  speed = 40,
  direction = 'left',
  paused = false,
  onImageClick,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const longPressTimerRef = useRef<number | null>(null);
  const touchMovedRef = useRef(false);
  const lastPointerTypeRef = useRef<string | null>(null);
  const longPressTriggeredRef = useRef(false);
  const touchActiveRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastScrollTimeRef = useRef(0);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const pointerMovedRef = useRef(false);
  // Duplicate images to ensure seamless loop
  const duplicatedImages = [...images, ...images];
  const directionClass = direction === 'right' ? 'infinite-marquee--reverse' : '';
  const pauseClass = paused || isPressing ? 'is-paused' : '';

  useEffect(() => {
    const handleRelease = () => setIsPressing(false);
    const handleContextMenu = () => setIsPressing(false);
    const handleScroll = () => {
      touchMovedRef.current = true;
      lastScrollTimeRef.current = Date.now();
      if (longPressTimerRef.current) {
        window.clearTimeout(longPressTimerRef.current);
      }
    };
    window.addEventListener('pointerup', handleRelease);
    window.addEventListener('pointercancel', handleRelease);
    window.addEventListener('touchend', handleRelease);
    window.addEventListener('touchcancel', handleRelease);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('pointerup', handleRelease);
      window.removeEventListener('pointercancel', handleRelease);
      window.removeEventListener('touchend', handleRelease);
      window.removeEventListener('touchcancel', handleRelease);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`infinite-marquee relative w-full overflow-hidden py-8 md:py-12 px-[2%] ${directionClass} ${pauseClass}`}
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
            <button
              type="button"
              className="marquee-image-button relative h-32 sm:h-40 md:h-48 lg:h-56 aspect-[2.5/1] photo-container rounded-lg overflow-hidden bg-white/5 border border-white/10"
              onPointerDown={(event) => {
                lastPointerTypeRef.current = event.pointerType;
                if (event.pointerType === 'touch') {
                  if (touchActiveRef.current) return;
                  longPressTriggeredRef.current = false;
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
                      longPressTriggeredRef.current = true;
                      onImageClick?.(image);
                    }
                  }, 450);
                  return;
                }
                setIsPressing(true);
                pointerMovedRef.current = false;
                pointerStartRef.current = {
                  x: event.clientX,
                  y: event.clientY,
                };
                event.currentTarget.setPointerCapture?.(event.pointerId);
              }}
              onTouchStart={(event) => {
                touchActiveRef.current = true;
                lastPointerTypeRef.current = 'touch';
                longPressTriggeredRef.current = false;
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
                    longPressTriggeredRef.current = true;
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
                if (event.pointerType === 'touch') {
                  if (longPressTimerRef.current) {
                    window.clearTimeout(longPressTimerRef.current);
                  }
                  return;
                }
                setIsPressing(false);
                event.currentTarget.releasePointerCapture?.(event.pointerId);
              }}
              onPointerLeave={() => setIsPressing(false)}
              onPointerOut={() => setIsPressing(false)}
              onPointerCancel={() => setIsPressing(false)}
              onContextMenu={(event) => {
                event.preventDefault();
                setIsPressing(false);
              }}
              onDragStart={(event) => event.preventDefault()}
              onClick={() => {
                if (lastPointerTypeRef.current === 'touch') return;
                if (pointerMovedRef.current) return;
                if (Date.now() - lastScrollTimeRef.current < 200) return;
                onImageClick?.(image);
              }}
              aria-label={`Open event image ${index + 1}`}
            >
              <img
                src={image}
                alt="Event moment"
                className="h-full w-full object-cover rounded-lg"
                loading="lazy"
                draggable="false"
                onContextMenu={(event) => event.preventDefault()}
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
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPhotoMarquee;
