import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy, useRef, useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PageWrapper from "./components/shared/PageWrapper";
import RouteLoader from "./components/shared/RouteLoader";
import { prefetchPrimaryRoutes } from "./lib/routePrefetch";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Events = lazy(() => import("./pages/Events"));
const Contact = lazy(() => import("./pages/ContactPage"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

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
      <Suspense fallback={<RouteLoader />}>
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
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {
  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const isConstrained = connection?.saveData || connection?.effectiveType?.includes("2g");
    if (isConstrained) return;

    const idleCallback = window.requestIdleCallback?.(() => prefetchPrimaryRoutes(), {
      timeout: 2500,
    });
    const timeoutId = idleCallback ? undefined : window.setTimeout(prefetchPrimaryRoutes, 1800);

    return () => {
      if (idleCallback) window.cancelIdleCallback?.(idleCallback);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <SmoothScroll>
          <div className="min-h-screen bg-transparent font-inter text-white">
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
