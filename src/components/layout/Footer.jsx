import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  footerVariants,
  reducedMotionFooterVariants,
} from "../../lib/routeAnimations";

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/hackiware?igsh=dWFtMWc2MWl5MHhn",
    icon: (
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        fill="currentColor"
      />
    ),
  },
  // {
  //   label: "GitHub",
  //   href: "https://github.com",
  //   icon: (
  //     <path
  //       d="M9 19c-4 1.2-4-2-6-2m12 4v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 4.77 5.07 5.07 0 0 0 17.91 1S16.73.65 14 2.48a13.38 13.38 0 0 0-10 0C1.27.65.09 1 .09 1A5.07 5.07 0 0 0 0 4.77a5.44 5.44 0 0 0-1.5 3.75c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 4 19.13V23"
  //       stroke="currentColor"
  //       strokeWidth="1.5"
  //       fill="none"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     />
  //   ),
  // },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/hackiware/",
    icon: (
      <>
        <path
          d="M6 9h4v12H6z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="8" cy="5" r="2" fill="currentColor" />
        <path
          d="M14 14a3 3 0 0 1 6 0v7h-4v-6"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </>
    ),
  },
];

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Achievements", href: "/achievements" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
];

const Footer = () => {
  const location = useLocation();
  const shouldReduceMotion = useRef(prefersReducedMotion());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      shouldReduceMotion.current = mediaQuery.matches;
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const footerVariant = shouldReduceMotion.current
    ? reducedMotionFooterVariants
    : footerVariants;

  return (
    <motion.footer
      key={location.pathname}
      variants={footerVariant}
      initial="hidden"
      animate="visible"
      className="border-t border-white/10 bg-[#050506] py-12 text-white"
    >
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="font-orbitron text-sm uppercase tracking-[0.3em] text-hacki-cyan">
          Hackiware
        </p>
        <p className="mt-2 max-w-xs text-sm text-white/70">
          Think LIKE a Hacker,
         <br/> Defend LIKE a Pro
        </p>
      </div>

      <div className="flex flex-col gap-2 text-sm text-white/70">
        <span className="font-semibold text-white">Quick Links</span>
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="transition hover:text-hacki-cyan"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-semibold text-white">Connect</span>
        <div className="flex gap-3">
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition"
              whileHover={{
                boxShadow: "0 0 20px #00E0FF",
                color: "#00FF85",
                scale: 1.08,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition group-hover:drop-shadow-[0_0_12px_#00E0FF]"
              >
                {social.icon}
              </svg>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
      <p className="mt-10 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Hackiware. All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;