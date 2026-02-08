import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import EventsScrollSections from "../components/sections/EventsScrollSections";
import EventsGrid from "../components/sections/EventsGrid";
import ImpactMetrics from "../components/sections/ImpactMetrics";
import FeaturedEventCard from "../components/sections/FeaturedEventCard";
import EventCTA from "../components/sections/EventCTA";
import {
  leftSectionVariants,
  rightSectionVariants,
  reducedMotionSectionVariants,
} from "../lib/routeAnimations";

const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const Events = () => {
  const shouldReduceMotion = useRef(prefersReducedMotion());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      shouldReduceMotion.current = mediaQuery.matches;
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const leftVariant = shouldReduceMotion.current
    ? reducedMotionSectionVariants
    : leftSectionVariants;
  const rightVariant = shouldReduceMotion.current
    ? reducedMotionSectionVariants
    : rightSectionVariants;

  return (
    <section className="relative min-h-screen bg-[#050505] font-['Times_New_Roman']">
      <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#050505] pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,224,255,0.08),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAyNGMwIDYuNjI3LTUuMzczIDEyLTEyIDEycy0xMi01LjM3My0xMi0xMiA1LjM3My0xMiAxMi0xMiAxMiA1LjM3MyAxMiAxMnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 overflow-visible">
          <div className="mx-auto max-w-5xl text-center overflow-visible">
            <motion.div
              variants={leftVariant}
              initial="hidden"
              animate="visible"
              className="space-y-8 overflow-visible"
            >
              <motion.p
                variants={rightVariant}
                initial="hidden"
                animate="visible"
                className="font-['Times_New_Roman'] text-xs uppercase tracking-[0.4em] text-cyan-400"
              >
                Events
              </motion.p>
              
              <motion.h1
                variants={leftVariant}
                initial="hidden"
                animate="visible"
                className="text-4xl font-['Times_New_Roman'] font-light leading-tight text-white sm:text-5xl md:text-6xl lg:text-8xl xl:text-8xl px-1"
              >
                <span className="whitespace-normal sm:whitespace-nowrap">Cybersecurity Events</span>
                {' '}&{' '}
                <span className="inline bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 bg-clip-text text-transparent">
                  Simulations
                </span>
              </motion.h1>
              
              <motion.p
                variants={rightVariant}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl font-['Times_New_Roman']"
              >
                Three signature programs showcasing Hackiware's research, defense drills, and
                real-time response readiness.
              </motion.p>

              <motion.div
                variants={rightVariant}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap items-center justify-center gap-4 pt-6"
              >
                <Link
                  to="#events"
                  className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-['Times_New_Roman'] uppercase tracking-wider text-cyan-300 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/20"
                >
                  Explore Events
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div id="events">
        <EventsScrollSections paused={isModalOpen} onImageClick={openModal} />
        <EventsGrid />
      </div>

      <ImpactMetrics />

      <div id="kavach-2">
        <FeaturedEventCard />
      </div>

      <EventCTA />

      <div
        className={`image-modal ${isModalOpen ? "is-open" : ""}`}
        aria-hidden={!isModalOpen}
        onClick={closeModal}
      >
        <div
          className="image-modal__card"
          role="dialog"
          aria-modal="true"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="image-modal__close"
            onClick={closeModal}
            aria-label="Close image preview"
          >
            ×
          </button>
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected event"
              className="image-modal__img"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Events;