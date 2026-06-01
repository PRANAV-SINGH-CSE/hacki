import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import SmoothImage from '../shared/SmoothImage';

interface EventPhotoMarqueeProps {
  images: string[];
  paused?: boolean;
  onImageClick?: (image: string) => void;
}

const HOLD_DURATION_MS = 1200;
const SLIDE_DURATION_MS = 860;
const REST_SCALES = [0.9, 1.03, 0.9, 0.84];
const SHIFTED_SCALES = [0.84, 0.9, 1.03, 0.9];

const easeInOut = (t: number) => 0.5 * (1 - Math.cos(Math.PI * t));

const wrapIndex = (index: number, len: number) => {
  if (len === 0) return 0;
  return ((index % len) + len) % len;
};

const interpolate = (from: number, to: number, t: number) => from + (to - from) * t;

const getLayoutMetrics = (width: number) => {
  const safeWidth = width > 0 ? width : 1200;
  const cardWidth = Math.min(safeWidth * 0.84, 980);
  const step = Math.max(72, Math.min(safeWidth * 0.34, cardWidth * 0.68));
  const restOffsets = [-step, 0, step, step * 2];
  const shiftedOffsets = [-step * 2, -step, 0, step];
  return { restOffsets, shiftedOffsets };
};

const EventPhotoMarquee: React.FC<EventPhotoMarqueeProps> = ({ images, paused = false, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const phaseRef = useRef<'hold' | 'slide'>('hold');
  const elapsedRef = useRef(0);
  const slideProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const effectivePaused = paused;

  const visibleImages = useMemo(() => {
    if (images.length === 0) return [];
    return [
      images[wrapIndex(currentIndex - 1, images.length)],
      images[wrapIndex(currentIndex, images.length)],
      images[wrapIndex(currentIndex + 1, images.length)],
      images[wrapIndex(currentIndex + 2, images.length)],
    ];
  }, [currentIndex, images]);

  useEffect(() => {
    const applyStyles = (progress: number) => {
      const { restOffsets, shiftedOffsets } = getLayoutMetrics(containerWidth);

      for (let slot = 0; slot < 4; slot += 1) {
        const card = cardRefs.current[slot];
        if (!card) continue;

        const x = interpolate(restOffsets[slot], shiftedOffsets[slot], progress);
        const scale = interpolate(REST_SCALES[slot], SHIFTED_SCALES[slot], progress);
        const distanceFromCenter = Math.abs(x);
        const zIndex = Math.max(1, Math.round(100 - distanceFromCenter / 4));
        const incomingFade = Math.max(0, Math.min(1, (progress - 0.32) / 0.68));
        const opacity = slot === 3 ? incomingFade * 0.92 : 1;

        card.style.transform = `translate3d(${x}px, 0, 0) translateX(-50%) scale(${scale})`;
        card.style.zIndex = `${zIndex}`;
        card.style.opacity = `${opacity}`;
      }
    };

    applyStyles(slideProgressRef.current);

    if (images.length <= 1 || effectivePaused) {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastFrameTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      const prevTime = lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;
      const delta = prevTime ? Math.min(40, timestamp - prevTime) : 0;

      if (phaseRef.current === 'hold') {
        elapsedRef.current += delta;
        if (elapsedRef.current >= HOLD_DURATION_MS) {
          phaseRef.current = 'slide';
          elapsedRef.current = 0;
        }
      } else {
        elapsedRef.current += delta;
        const linearProgress = Math.min(1, elapsedRef.current / SLIDE_DURATION_MS);
        slideProgressRef.current = easeInOut(linearProgress);
        applyStyles(slideProgressRef.current);

        if (linearProgress >= 1) {
          phaseRef.current = 'hold';
          elapsedRef.current = 0;
          slideProgressRef.current = 0;
          setCurrentIndex((prev) => wrapIndex(prev + 1, images.length));
        }
      }

      rafRef.current = window.requestAnimationFrame(loop);
    };

    rafRef.current = window.requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastFrameTimeRef.current = null;
    };
  }, [containerWidth, effectivePaused, images.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () => {
      setContainerWidth(viewport.clientWidth);
    };

    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(viewport);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    slideProgressRef.current = 0;
    phaseRef.current = 'hold';
    elapsedRef.current = 0;
  }, [images]);

  useLayoutEffect(() => {
    const { restOffsets, shiftedOffsets } = getLayoutMetrics(containerWidth);
    const progress = slideProgressRef.current;

    for (let slot = 0; slot < 4; slot += 1) {
      const card = cardRefs.current[slot];
      if (!card) continue;

      const x = interpolate(restOffsets[slot], shiftedOffsets[slot], progress);
      const scale = interpolate(REST_SCALES[slot], SHIFTED_SCALES[slot], progress);
      const distanceFromCenter = Math.abs(x);
      const zIndex = Math.max(1, Math.round(100 - distanceFromCenter / 4));
      const incomingFade = Math.max(0, Math.min(1, (progress - 0.32) / 0.68));
      const opacity = slot === 3 ? incomingFade * 0.92 : 1;

      card.style.transform = `translate3d(${x}px, 0, 0) translateX(-50%) scale(${scale})`;
      card.style.zIndex = `${zIndex}`;
      card.style.opacity = `${opacity}`;
    }
  }, [containerWidth, currentIndex]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full overflow-hidden py-8 md:py-12"
    >
      <div className="absolute left-0 top-0 z-30 h-full w-24 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-30 h-full w-24 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />

      <div ref={viewportRef} className="relative mx-auto h-32 sm:h-60 md:h-80 lg:h-96 max-w-[1400px]">
        {visibleImages.map((image, slot) => {
          const { restOffsets } = getLayoutMetrics(containerWidth);
          const x = restOffsets[slot];
          const scale = REST_SCALES[slot];

          return (
            <button
              key={`slot-${slot}`}
              ref={(element) => {
                cardRefs.current[slot] = element;
              }}
              type="button"
              className="photo-container event-carousel-card absolute left-1/2 top-0 h-full w-[84vw] max-w-[980px] rounded-lg border border-white/10 bg-white/5 overflow-hidden"
              onClick={() => onImageClick?.(image)}
              onDragStart={(event) => event.preventDefault()}
              aria-label={`Open event image ${wrapIndex(currentIndex + slot, images.length) + 1}`}
              style={{
                transform: `translate3d(${x}px, 0, 0) translateX(-50%) scale(${scale})`,
                transformOrigin: 'center center',
                transition: 'none',
                willChange: 'transform',
                opacity: slot === 3 ? 0 : 1,
              }}
            >
              <SmoothImage
                src={image}
                alt="Event moment"
                className="event-carousel-image h-full w-full rounded-lg object-cover"
                loading="lazy"
                decoding="async"
                draggable="false"
                onContextMenu={(event) => event.preventDefault()}
                onError={(event) => {
                  const target = event.target as HTMLImageElement;
                  const container = target.closest('.photo-container') as HTMLElement | null;
                  if (!container) return;
                  container.innerHTML = `
                    <div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
                      <p class="text-white/40 text-sm text-center px-4">Image not found</p>
                    </div>
                  `;
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EventPhotoMarquee;
