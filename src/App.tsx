import React, { useEffect, useState, useRef } from "react";
import {
  HashRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import FixedBackground from "./components/layout/FixedBackground";
import LoadingScreen from "./components/layout/Loadingscreen";
import PasswordReset from "./pages/public/PasswordReset";

// Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Login from "./pages/public/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Admin from "./pages/admin/Admin";
import Checkout from "./pages/dashboard/Checkout";
import Contact from "./pages/public/Contact";
import Manifesto from "./pages/public/Manifesto";
import Register from "./pages/public/Register";

// ─── ScrollToTop ──────────────────────────────────────────────────────────────
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
const ProtectedRoute = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "ADMIN" | "USER";
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // While auth is resolving, render nothing — LoadingScreen covers the gap
  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (role && user?.role?.toLowerCase() !== role.toLowerCase()) {
    return user?.role?.toUpperCase() === "ADMIN" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  if (
    user?.role?.toUpperCase() === "USER" &&
    user?.status === "PENDING" &&
    window.location.hash !== "#/payment"
  ) {
    return <Navigate to="/payment" replace />;
  }

  return <>{children}</>;
};

// ─── PublicRoute ──────────────────────────────────────────────────────────────
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return user?.role?.toUpperCase() === "ADMIN" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  return <>{children}</>;
};

// ─── AppRoutes ────────────────────────────────────────────────────────────────
import { useHeartbeat } from "./hooks/useHeartbeat";

const AppRoutes = () => {
  const location = useLocation();
  const { isLoading: authLoading } = useAuth();

  useHeartbeat(300000);

  const [appReady, setAppReady] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  // Track previous value without causing re-renders
  const prevLoading = useRef<boolean>(true); // boot starts as true

  useEffect(() => {
    const was = prevLoading.current;
    prevLoading.current = authLoading;

    // ── BOOT phase ──
    if (!appReady) {
      if (!authLoading) {
        // First authLoading→false: boot complete
        const t = setTimeout(() => setAppReady(true), 300);
        return () => clearTimeout(t);
      }
      return; // still booting, do nothing else
    }

    // ── POST-BOOT: action tracking ──
    if (!was && authLoading) {
      // false → true: user action started (login, register…)
      setActionLoading(true);
    }

    if (was && !authLoading) {
      // true → false: action resolved, short settle buffer
      const t = setTimeout(() => setActionLoading(false), 380);
      return () => clearTimeout(t);
    }
  }, [authLoading, appReady]);

  const showLoader = !appReady || actionLoading;

  const isDashboardOrAdmin =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      {/*
        LoadingScreen is visible during:
        ① Initial boot  — session rehydration via getMe()
        ② Login action  — bridges blank gap while ProtectedRoute returns null
        ③ Register      — same gap coverage
      */}
      <LoadingScreen isLoading={showLoader} />

      {/* Brand background — public/marketing pages only */}
      {!isDashboardOrAdmin && <FixedBackground />}

      <div className="relative z-[2]">
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PublicRoute>
                <About />
              </PublicRoute>
            }
          />
          <Route
            path="/manifesto"
            element={
              <PublicRoute>
                <Manifesto />
              </PublicRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicRoute>
                <Contact />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Password reset — no auth guard */}
          <Route
            path="/password-reset/:uid/:token"
            element={<PasswordReset />}
          />

          {/* Checkout */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute role="USER">
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Secure */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute role="USER">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="ADMIN">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <AuthProvider>
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  </AuthProvider>
);

export default App;