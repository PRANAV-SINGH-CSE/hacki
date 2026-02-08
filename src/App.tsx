import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useRef, useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Achievements from "./pages/Achievements";
import Events from "./pages/Events";
import Contact from "./pages/ContactPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageWrapper from "./components/shared/PageWrapper";

const routeOrder: Record<string, number> = {
  "/": 0,
  "/about": 1,
  "/achievements": 2,
  "/events": 3,
  "/blog": 4,
  "/contact": 4,
  "/login": 5,
  "/register": 6,
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

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <SmoothScroll>
        <div className="min-h-screen bg-[#050505] font-inter text-white">
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
      duration: 1.6,
      smoothWheel: true,
      lerp: 0.07,
      wheelMultiplier: 0.9,
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

