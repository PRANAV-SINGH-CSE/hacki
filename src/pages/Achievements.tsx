import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import AchievementsGrid from "../components/sections/AchievementsGrid";
import CountUpMetrics from "../components/ui/CountUp";
import SpatialProductShowcase from "../components/ui/spatial-product-showcase";
import CommandCenter from "../components/sections/CommandCenter";
import LogoMarquee from "../components/sections/LogoMarquee";
import AchievementImagesScroll from "../components/sections/AchievementImagesScroll";
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

// Logo paths - Using images from public/logos/ folder
const partnerLogos = [
  '/logos/1.jpg',
  '/logos/2.jpg',
  '/logos/3.jpg',
  '/logos/4.jpg',
  '/logos/5.jpg',
  '/logos/6.jpg',
  '/logos/7.jpg',
  '/logos/8.jpg',
  '/logos/9.jpg',
  '/logos/10.jpg',
  '/logos/11.jpg',
  '/logos/12.jpg',
  '/logos/13.jpg',
  '/logos/14.jpg',
  '/logos/15.jpg',
  '/logos/16.jpg',
  '/logos/17.jpg',
  '/logos/18.jpg',
  '/logos/19.jpg',
  '/logos/20.jpg',
  '/logos/21.jpg',
  '/logos/22.jpg',
  '/logos/23.jpg',
  '/logos/24.jpg',
  '/logos/25.jpg',
];

// Achievement images - Using images from public/achievements/ folder
const achievementImages = [
  '/achievements/1.jpg',
  '/achievements/2.jpg',
  '/achievements/3.jpg',
  '/achievements/4.jpg',
  '/achievements/5.jpg',
  '/achievements/6.jpg',
  '/achievements/7.jpg',
  '/achievements/8.jpg',
  '/achievements/9.jpg',
  '/achievements/10.jpg',
  '/achievements/11.jpg',
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
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen my-16 md:my-24">
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
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen my-16 md:my-24">
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
          <AchievementImagesScroll images={achievementImages} speed={90} direction="left" />
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

