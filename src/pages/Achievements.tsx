/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import AchievementsGrid from "../components/sections/AchievementsGrid";
import CountUpMetrics from "../components/ui/CountUp";
import SpatialProductShowcase from "../components/ui/spatial-product-showcase";
import CommandCenter from "../components/sections/CommandCenter";
import LogoMarquee from "../components/sections/LogoMarquee";
import AchievementImagesScroll from "../components/sections/AchievementImagesScroll";
import LetterRecommendationScroll from "../components/sections/LetterRecommendationScroll";
import {
  containerVariants,
  headingVariants,
  paragraphVariants,
  cardVariants,
  buttonVariants,
  leftSectionVariants,
  rightSectionVariants,
  reducedMotionContainerVariants,
  reducedMotionVariants,
  reducedMotionSectionVariants,
} from '../lib/routeAnimations';

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface Achievement {
  category: string;
  title: string;
  description: string;
  year: string;
}

const achievements: Achievement[] = [
  {
    category: 'Recognition',
    title: 'Kavach Suraksha 2.0',
    description: 'Successfully organized and executed a national-level cybersecurity hackathon with participation from leading institutions.',
    year: '2024',
  },
  {
    category: 'Partnership',
    title: 'Institutional Collaborations',
    description: 'Established partnerships with premier technical institutions and cybersecurity organizations across India.',
    year: '2024',
  },
  {
    category: 'Media',
    title: 'Industry Recognition',
    description: 'Featured in leading cybersecurity publications and recognized for innovative research contributions.',
    year: '2024',
  },
  {
    category: 'Training',
    title: 'Workshops & Labs Delivered',
    description: 'Delivered hands-on workshops and lab modules across multiple universities, focusing on applied defensive techniques and incident response.',
    year: '2023-2024',
  },
  {
    category: 'Platform',
    title: 'Labs & Learning Modules Launched',
    description: 'Launched a modular lab platform with curated exercises, guided walkthroughs, and automated assessment for real-world skills.',
    year: '2024',
  },
];

// Logo paths - Using PNG images from public/logos/ folder
const partnerLogos = [
  '/logos/2-removebg-preview.png',
  '/logos/3-removebg-preview.png',
  '/logos/4-removebg-preview.png',
  '/logos/5-removebg-preview.png',
  '/logos/6-removebg-preview.png',
  '/logos/7-removebg-preview.png',
  '/logos/8-removebg-preview.png',
  '/logos/9-removebg-preview.png',
  '/logos/10-removebg-preview.png',
  '/logos/11-removebg-preview.png',
  '/logos/12-Photoroom.png',
  '/logos/13-removebg-preview.png',
  '/logos/15-removebg-preview.png',
  '/logos/16-removebg-preview.png',
  '/logos/17-removebg-preview.png',
  '/logos/18-removebg-preview.png',
  '/logos/19-removebg-preview.png',
  '/logos/20-removebg-preview.png',
  '/logos/21-removebg-preview.png',
  '/logos/22-removebg-preview.png',
  '/logos/23-removebg-preview.png',
  '/logos/24-removebg-preview.png',
  '/logos/25.png',
];

// Achievement images - Using images from public/achievements/ folder
const achievementImages = [
  '/achievements/1.png',
  '/achievements/2.png',
  '/achievements/3.png',
  '/achievements/4.png',
  // '/achievements/Info system computer.jpg',
  // '/achievements/Mahatma gandhi gov. School.jpg',
  // '/achievements/Saraswati vidhya mandir.jpg',
  // '/achievements/Swami nityanand academy.jpg',
  // '/achievements/Vinayak world school.jpg',
  // '/achievements/VSI global.jpg',
  // '/achievements/Screenshot_20260112_120015_LinkedIn.jpg',
  // '/achievements/Screenshot_20260112_120042_LinkedIn.jpg',
  // '/achievements/Screenshot_20260112_120103_LinkedIn.jpg',
  // '/achievements/Screenshot_20260112_120120_LinkedIn.jpg',
];

// Letter of Recommendation images - Only displaying image files (not PDFs)
// Note: PDF files won't render as images in the marquee - convert them to JPG/PNG for display
const letterRecommendationImages = [
  // '/letters/Appreciation letter -1.pdf',  // Commented out - PDF not displayable
  // '/letters/Appreciation letter .pdf',    // Commented out - PDF not displayable
  // '/letters/City international.pdf',      // Commented out - PDF not displayable
  '/letters/Info system computer.jpg',
  '/letters/Mahatma gandhi gov. School.jpg',
  '/letters/Saraswati vidhya mandir.jpg',
  '/letters/Screenshot_20260112_120015_LinkedIn.jpg',
  '/letters/Screenshot_20260112_120042_LinkedIn.jpg',
  '/letters/Screenshot_20260112_120103_LinkedIn.jpg',
  '/letters/Screenshot_20260112_120120_LinkedIn.jpg',
  '/letters/Swami nityanand academy.jpg',
  '/letters/Vinayak world school.jpg',
  '/letters/VSI global.jpg',
];

const Achievements = () => {
  const shouldReduceMotion = useRef(prefersReducedMotion());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      shouldReduceMotion.current = mediaQuery.matches;
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const container = shouldReduceMotion.current
    ? reducedMotionContainerVariants
    : containerVariants;
  const heading = shouldReduceMotion.current ? reducedMotionVariants : headingVariants;
  const paragraph = shouldReduceMotion.current ? reducedMotionVariants : paragraphVariants;
  const card = shouldReduceMotion.current ? reducedMotionVariants : cardVariants;
  const button = shouldReduceMotion.current ? reducedMotionVariants : buttonVariants;

  const leftVariant = shouldReduceMotion.current
    ? reducedMotionSectionVariants
    : leftSectionVariants;
  const rightVariant = shouldReduceMotion.current
    ? reducedMotionSectionVariants
    : rightSectionVariants;

  return (
    <section className="relative min-h-screen bg-[#050505] pt-32 pb-24">
      {/* OUTER WRAPPER */}
      <div className="container mx-auto px-6">

        {/* NARROW CONTENT */}
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 mb-16">
            <motion.div
              variants={leftVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="mb-4 font-orbitron text-xs uppercase tracking-[0.4em] text-cyan-400">
                Our Impact
              </p>
              <h1 className="text-4xl font-light text-white sm:text-5xl md:text-6xl">
                Our Impact &{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                  Achievements
                </span>
              </h1>
            </motion.div>

            <motion.div
              variants={rightVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg md:mt-0">
                Building a legacy of excellence in cybersecurity research and execution.
              </p>
            </motion.div>
          </div>

          {/* Showcase */}
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-6">
  <SpatialProductShowcase />
</div>
        </div>

        {/* FULL WIDTH — Applied Programs Section - COMMENTED OUT */}
        {/* <AchievementsGrid /> */}

        {/* BACK TO NARROW */}
        <div className="mx-auto max-w-4xl">
          <CountUpMetrics />
        </div>

        {/* Logo Marquee Section - Partner/Sponsor Logos - FULL WIDTH */}
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen my-8 md:my-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl mb-8 px-6"
          >
            <h2 className="text-2xl md:text-6xl font-light text-white text-center mb-2">
              Our <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">Partners</span>
            </h2>
            <p className="text-white/60 text-center text-sm md:text-base">
              Trusted by leading institutions and organizations
            </p>
          </motion.div>
          <LogoMarquee logos={partnerLogos} speed={50} />
        </div>

        {/* Achievement Images Scroll Section - FULL WIDTH */}
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen my-8 md:my-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl mb-8 px-6"
          >
            <h2 className="text-3xl md:text-5xl font-light text-white text-center mb-2">
              Certificate <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">Gallery</span>
            </h2>
            <p className="text-white/60 text-center text-sm md:text-base">
              Moments that define our journey
            </p>
          </motion.div>
          <AchievementImagesScroll images={achievementImages} speed={50} direction="left" />
        </div>

        {/* Letter of Recommendation Section - FULL WIDTH */}
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen my-16 md:my-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl mb-8 px-6"
          >
            <h2 className="text-3xl md:text-5xl font-light text-white text-center mb-2">
              Letter of <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">Recommendation</span>
            </h2>
            <p className="text-white/60 text-center text-sm md:text-base">
              Recognition from industry leaders and academic institutions
            </p>
          </motion.div>
          <LetterRecommendationScroll images={letterRecommendationImages} speed={50} direction="left" />
        </div>

        {/* BACK TO NARROW */}
        <div className="mx-auto max-w-4xl">
          <CommandCenter />

          {/* CTA */}
          <motion.div
            variants={button}
            initial="hidden"
            animate="visible"
            className="mt-16 text-center"
          >
            <motion.p variants={paragraph} className="mb-6 text-white/70">
              Learn more about our research and initiatives
            </motion.p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-medium uppercase tracking-wider text-cyan-300 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/20"
            >
              About Hackiware
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;

