import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { AuthService } from "../../services/AuthService";

// Shared variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay },
  }),
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const logoUrl = "/images/cloud369.png";

  // Throttled mouse handler — rAF prevents excessive updates
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({
      x: (e.clientX - window.innerWidth / 2) / 80,
      y: (e.clientY - window.innerHeight / 2) / 80,
    });
  }, []);

  useEffect(() => {
    let rafId: number;
    const throttled = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => handleMouseMove(e));
    };
    window.addEventListener("mousemove", throttled, { passive: true });
    return () => {
      window.removeEventListener("mousemove", throttled);
      cancelAnimationFrame(rafId);
    };
  }, [handleMouseMove]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      const user = AuthService.getCurrentUser();
      if (user?.role?.toLowerCase() === "admin") {
        navigate("/admin");
      } else if (user?.status === "PENDING") {
        navigate("/payment");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center font-display selection:bg-primary selection:text-white">
      {/* Static background blobs — no looping animations, no particles, no rotating rings */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-purple-900/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-blue-900/6 rounded-full blur-[90px]" />
      </div>

      {/* Static decorative 369 numbers — no float loops */}
      <div
        className="absolute text-[120px] font-bold text-primary/[0.04] pointer-events-none select-none leading-none"
        style={{
          left: "calc(50% - 150px)",
          top: "calc(50% - 100px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        3
      </div>
      <div
        className="absolute text-[120px] font-bold text-primary/[0.04] pointer-events-none select-none leading-none"
        style={{
          left: "calc(50% + 150px)",
          top: "calc(50% - 50px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        6
      </div>
      <div
        className="absolute text-[120px] font-bold text-primary/[0.04] pointer-events-none select-none leading-none"
        style={{
          left: "calc(50%)",
          top: "calc(50% + 120px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        9
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          // Subtle CSS card drift — no Framer state binding per frame
          style={{
            transform: `translate(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px)`,
          }}
          className="bg-[#161118]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden hover:border-white/20 transition-colors duration-300"
        >
          {/* Static inner corner blobs */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-900/6 rounded-full blur-3xl pointer-events-none" />

          {/* Static corner accent lines */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/20 rounded-br-3xl" />

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center mb-10 flex flex-col items-center relative z-10"
          >
            <div className="mb-6 drop-shadow-[0_0_10px_rgba(175,37,244,0.4)]">
              <img
                src={logoUrl}
                alt="CLUB369 Logo"
                className="h-20 w-auto hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-[0.2em] text-white mb-2">
              CLUB369
            </h1>

            {/* Decorative gradient line */}
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mt-3" />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-bold uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-5 relative z-10"
          >
            {/* Email */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="space-y-1"
            >
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Email
              </label>
              <div className="relative group/input">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-primary transition-colors duration-200 text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-200"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.18}
              className="space-y-1"
            >
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Password
              </label>
              <div className="relative group/input">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-primary transition-colors duration-200 text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-200 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={authLoading}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.26}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full bg-white text-black hover:bg-primary hover:text-white font-bold tracking-widest uppercase rounded-xl py-4 transition-colors duration-200 shadow-lg flex items-center justify-center gap-2 relative overflow-hidden"
            >
              {/* CSS-only shine on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500 pointer-events-none" />

              {authLoading && (
                <motion.span
                  className="material-symbols-outlined"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  progress_activity
                </motion.span>
              )}
              <span className="relative z-10">
                {authLoading ? "Signing In..." : "Sign In"}
              </span>
            </motion.button>
          </form>

          {/* Footer links */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.32}
            className="mt-8 text-center flex flex-col gap-4 relative z-10"
          >
            <Link
              to="/register"
              className="text-xs text-gray-400 hover:text-white transition-colors duration-200 inline-block"
            >
              Not a member?{" "}
              <span className="text-primary font-bold">Enrol Now</span>
            </Link>
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-white transition-colors duration-200 inline-block"
            >
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;