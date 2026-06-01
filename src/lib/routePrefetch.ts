const routeImports: Record<string, () => Promise<unknown>> = {
  "/": () => import("../pages/Home"),
  "/about": () => import("../pages/About"),
  "/achievements": () => import("../pages/Achievements"),
  "/events": () => import("../pages/Events"),
  "/contact": () => import("../pages/ContactPage"),
  "/leaderboard": () => import("../pages/Leaderboard"),
  "/login": () => import("../pages/Login"),
  "/register": () => import("../pages/Register"),
};

export const prefetchRoute = (path: string) => {
  void routeImports[path]?.();
};

export const prefetchPrimaryRoutes = () => {
  ["/about", "/achievements", "/events", "/contact", "/leaderboard"].forEach(prefetchRoute);
};
