import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { getUserByUid } from '../../firebase/services/users';

const navLinks = [
  { label: 'HOME', path: '/' },
  { label: 'ABOUT', path: '/about' },
  { label: 'ACHIEVEMENTS', path: '/achievements' },
  { label: 'EVENTS', path: '/events' },
  { label: 'CONTACT', path: '/contact' },
];

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState(null);

  const navRef = useRef(null);
  const itemRefs = useRef([]);

  const lensX = useMotionValue(0);
  const lensWidth = useMotionValue(0);
  const lensOpacity = useMotionValue(0);

  const springX = useSpring(lensX, { stiffness: 400, damping: 30 });
  const springWidth = useSpring(lensWidth, { stiffness: 400, damping: 30 });
  const springOpacity = useSpring(lensOpacity, { stiffness: 400, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  useEffect(() => {
    if (user) {
      getUserByUid(user.uid)
        .then((profile) => {
          if (profile) setUserName(profile.name);
          else setUserName(user.email?.split('@')[0] || 'User');
        })
        .catch(() => setUserName(user.email?.split('@')[0] || 'User'));
    } else {
      setUserName(null);
    }
  }, [user]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const isActive = (path) => {
    const currentPath = location.pathname.replace(/\/+$/, "") || "/";
    const targetPath = path.replace(/\/+$/, "") || "/";
    return currentPath === targetPath;
  };

  const handleItemHover = (index, e) => {
    if (!navRef.current) return;
    
    setHoveredIndex(index);

    const target = e.currentTarget; 
    const navRect = navRef.current.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const relativeX = targetRect.left - navRect.left;
    const width = targetRect.width;

    lensX.set(relativeX);
    lensWidth.set(width);
    lensOpacity.set(1);
  };

  const handleNavLeave = () => {
    setHoveredIndex(null);
    lensOpacity.set(0);
  };

  const rawNavY = useMotionValue(0);
  const navY = useSpring(rawNavY, { stiffness: 300, damping: 30 });
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;
      
      if (Math.abs(diff) > 10) {
        if (diff > 0 && currentScrollY > 100) {
          rawNavY.set(-150);
        } else if (diff < 0) {
          rawNavY.set(0);
        }
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [rawNavY]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-start pointer-events-none"
        style={{ y: navY }}
      >
        <div className="w-full sm:w-auto pointer-events-auto py-4 px-3 sm:py-6 sm:px-6">
          <div className="flex w-full items-center justify-between lg:justify-start gap-4 md:gap-8">
            
            {/* Logo Button */}
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-2 z-20 flex-shrink-0 group transition-all duration-300",
                // Mobile: Darker background
                "p-2 pr-4 rounded-full bg-black/40 backdrop-blur-md border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
                // Desktop: Reset
                "sm:p-0 sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:shadow-none sm:rounded-none"
              )}
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-white/10 group-hover:border-[#bd00ff]/50 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <img src="/logo-icon.jpg" alt="Hackiware Logo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent pointer-events-none" />
              </div>
              <span className="font-orbitron font-bold text-lg sm:text-xl tracking-wider text-white group-hover:text-[#bd00ff] transition-colors duration-300" 
                style={{ 
                  textShadow: '0 0 20px rgba(189,0,255,0.5)' 
                }}
              >
                HACKIWARE
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav 
              ref={navRef}
              // Base dark glass container remains the same
              className="hidden lg:flex relative items-center overflow-hidden p-1.5 rounded-full bg-black/20 border border-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] ring-1 ring-white/5"
              onMouseLeave={handleNavLeave}
              style={{
                backdropFilter: 'blur(20px) saturate(180%)'
              }}
            >
              {/* Moving Lens (Background) - Enhanced Glass Effect Here */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 left-0 rounded-full z-0 pointer-events-none"
                style={{
                  x: springX,
                  width: springWidth,
                  opacity: springOpacity,
                  // 1. Stronger, multi-stop gradient for "curved glass" look (strong top highlight, clear middle)
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.02) 30%, rgba(255, 255, 255, 0.0) 70%, rgba(255, 255, 255, 0.1) 100%)',
                  // 2. Added internal backdrop filter to make the lens area brighter and blurrier than the surroundings
                  backdropFilter: 'blur(8px) brightness(1.2) contrast(1.1)',
                  // 3. Sharper rim lighting (inset shadows) for more 3D pop
                  boxShadow: `
                    inset 0 1px 2px rgba(255, 255, 255, 0.5),
                    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
                    0 2px 4px rgba(0, 0, 0, 0.2),
                    0 0 0 1px rgba(255, 255, 255, 0.15)
                  `,
                }}
              />

              {navLinks.map((link, index) => {
                const active = isActive(link.path);
                const isHovered = hoveredIndex === index;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    ref={(el) => (itemRefs.current[index] = el)}
                    onMouseEnter={(e) => handleItemHover(index, e)}
                    className="relative z-10 px-6 py-2 block"
                  >
                    <motion.div
                      animate={{ 
                        scale: isHovered ? 1.1 : 1, 
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 25 
                      }}
                      className="inline-flex flex-col items-center justify-center relative"
                    >
                      <span className={cn(
                        "font-rajdhani font-bold text-sm uppercase tracking-widest transition-all duration-300 block",
                        active ? "text-[#00f3ff] drop-shadow-[0_0_12px_rgba(0,243,255,0.8)]" : "text-white/70",
                        // Increased brightness of text on hover for contrast against new glass
                        isHovered && !active && "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      )}>
                        {link.label}
                      </span>
                      
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 w-full h-[2px] bg-gradient-to-r from-[#00f3ff]/0 via-[#00f3ff] to-[#00f3ff]/0 rounded-full"
                          style={{
                            boxShadow: '0 0 10px 1px rgba(0, 243, 255, 0.7)'
                          }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                "lg:hidden ml-auto text-white/90 hover:text-[#00f3ff] transition-colors z-20",
                "p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              )}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden overflow-y-auto"
            style={{
              background: 'rgba(2, 2, 2, 0.9)',
              backdropFilter: 'blur(30px) saturate(150%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#00f3ff]/5 to-[#bd00ff]/5 pointer-events-none" />
            
            <div className="relative flex flex-col items-center justify-start min-h-screen w-full px-4 py-20 pb-8">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 text-white/60 active:text-white transition-colors hover:rotate-90 duration-300"
              >
                <X size={32} />
              </button>

              <div className="flex items-center gap-3 mb-12 transform scale-110">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <img src="/logo-icon.jpg" alt="Hackiware Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-orbitron font-bold text-2xl tracking-wider text-white" style={{ textShadow: '0 0 15px rgba(189,0,255,0.6)' }}>
                  HACKIWARE
                </span>
              </div>

              <nav className="flex flex-col gap-5 text-center w-full max-w-sm">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: i * 0.05 + 0.1, type: "spring", stiffness: 300, damping: 20 }}
                    className="w-full"
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block py-4 px-6 rounded-xl text-lg font-rajdhani font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden group",
                        isActive(link.path)
                          ? "text-[#00f3ff] bg-white/5 border border-[#00f3ff]/30 shadow-[0_0_25px_rgba(0,243,255,0.15)]"
                          : "text-white/70 active:text-[#00f3ff] border border-transparent hover:bg-white/5 hover:border-white/5"
                      )}
                    >
                       {isActive(link.path) && (
                        <div className="absolute inset-0 bg-[#00f3ff]/5 blur-md" />
                       )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}

                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4 w-full" 
                />

                {user && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col gap-4 w-full"
                  >
                    <div className="text-center text-white/50 font-rajdhani text-sm tracking-widest uppercase">
                      Logged in as <span className="text-white/90 font-bold ml-1">{userName || user.email?.split('@')[0] || 'User'}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full py-4 px-6 rounded-xl font-rajdhani font-bold text-lg uppercase tracking-widest',
                        'border border-[#00f3ff]/30 bg-[#00f3ff]/5 backdrop-blur-sm',
                        'text-[#00f3ff] active:scale-95 transition-all duration-200',
                        'shadow-[0_0_20px_rgba(0,243,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] hover:bg-[#00f3ff]/10'
                      )}
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;