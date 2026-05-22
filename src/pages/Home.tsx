import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Hero from "../components/sections/Hero";
import CountUpMetrics from "../components/ui/CountUp";
import QuoteSection from "../components/sections/QuoteSection";
import WhatWeDo from "../components/sections/WhatWeDo";
import WhyHackiware from "../components/sections/WhyHackiware";
import {
  containerVariants,
  reducedMotionContainerVariants,
} from "../lib/routeAnimations";

const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const Home = () => {
  const shouldReduceMotion = useRef(prefersReducedMotion());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      shouldReduceMotion.current = mediaQuery.matches;
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Mount background image natively to DOM body
    // @ts-ignore
    document.body.style.backgroundImage = `url("${process.env.PUBLIC_URL}/hero/background_image_1.png")`;
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundSize = "cover";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundSize = "";
    };
  }, []);

  const container = shouldReduceMotion.current
    ? reducedMotionContainerVariants
    : containerVariants;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <Hero />
      <WhatWeDo />
      <WhyHackiware />
      
      {/* Moved CountUpMetrics here (After WhyHackiware) */}
      <CountUpMetrics />
      
      <QuoteSection />
      
      {/* SplineSection removed to prevent lag/video */}
      {/* <SplineSection /> */}
    </motion.div>
  );
};

export default Home;