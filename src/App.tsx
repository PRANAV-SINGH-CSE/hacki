import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Achievements from "./pages/Achievements";
import Events from "./pages/Events";
import Contact from "./pages/ContactPage";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageWrapper from "./components/shared/PageWrapper";

const routeOrder: Record<string, number> = {
  "/": 0,
  "/about": 1,
  "/achievements": 2,
  "/events": 3,
  "/leaderboard": 4,
  "/blog": 5,
  "/contact": 5,
  "/login": 6,
  "/register": 7,
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const prevPathname = useRef(location.pathname);

  const currentIndex = routeOrder[location.pathname] ?? 0;
  const prevIndex = routeOrder[prevPathname.current] ?? 0;
  const direction = currentIndex >= prevIndex ? 1 : -1;

  useEffect(() => {
    prevPathname.current = location.pathname;
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper direction={direction}>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper direction={direction}>
              <About />
            </PageWrapper>
          }
        />
        <Route
          path="/achievements"
          element={
            <PageWrapper direction={direction}>
              <Achievements />
            </PageWrapper>
          }
        />
        <Route
          path="/events"
          element={
            <PageWrapper direction={direction}>
              <Events />
            </PageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <PageWrapper direction={direction}>
              <Contact />
            </PageWrapper>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PageWrapper direction={direction}>
              <Leaderboard />
            </PageWrapper>
          }
        />
        <Route
          path="/blog"
          element={
            <PageWrapper direction={direction}>
              <Contact />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper direction={direction}>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper direction={direction}>
              <Register />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const minDurationMs = 2000;
    const exitDurationMs = 900;
    const start = performance.now();
    let timeoutId = 0;

    const startExit = () => {
      setIsExiting(true);
      timeoutId = window.setTimeout(() => setIsLoading(false), exitDurationMs);
    };

    const finish = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(minDurationMs - elapsed, 0);
      timeoutId = window.setTimeout(startExit, remaining);
    };

    if (document.readyState === "complete") {
      finish();
      return undefined;
    }

    const handleLoad = () => finish();
    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <SmoothScroll>
          <div className="min-h-screen bg-[#050505] font-inter text-white">
            {isLoading ? <PageLoader isExiting={isExiting} /> : null}
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                <AnimatedRoutes />
              </main>
              <Footer />
            </div>
          </div>
        </SmoothScroll>
      </BrowserRouter>
    </AuthProvider>
  );
};

const PageLoader = ({ isExiting }: { isExiting: boolean }) => (
  <div className={`page-loader${isExiting ? " is-exiting" : ""}`} aria-hidden="true">
    <div className="page-loader__frame">
      <div className="page-loader__nav">
        <div className="page-loader__brand">
          <div className="skeleton skeleton-circle" />
          <div className="skeleton skeleton-wordmark" />
        </div>
        <div className="page-loader__nav-items">
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-pill" />
        </div>
      </div>
      <div className="page-loader__hero">
        <div className="page-loader__hero-left">
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
          <div className="page-loader__text-lines">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line is-short" />
          </div>
          <div className="page-loader__actions">
            <div className="skeleton skeleton-button" />
            <div className="skeleton skeleton-button is-ghost" />
          </div>
        </div>
        <div className="page-loader__hero-right">
          <div className="page-loader__radar">
            <div className="skeleton skeleton-ring" />
            <div className="skeleton skeleton-ring is-inner" />
            <div className="skeleton skeleton-dot" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isDesktop) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.6,
      smoothWheel: true,
      lerp: 0.2,
      wheelMultiplier: 1.6,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>;
};

export default App;

