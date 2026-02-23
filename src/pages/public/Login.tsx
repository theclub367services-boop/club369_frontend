import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { useAuth } from "../../context/AuthContext";
import { AuthService } from "../../services/AuthService";

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

  // Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const logoUrl = "/images/cloud369.png";

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

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for password reset service goes here
    console.log("Reset email sent to:", resetEmail);
    setIsForgotModalOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center font-display selection:bg-primary selection:text-white">
      {/* Background Blobs (unchanged) */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-purple-900/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-blue-900/6 rounded-full blur-[90px]" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            transform: `translate(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px)`,
          }}
          className="bg-[#161118]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center mb-10 flex flex-col items-center relative z-10"
          >
            <div className="mb-6 drop-shadow-[0_0_10px_rgba(175,37,244,0.4)]">
              <img src={logoUrl} alt="CLUB369 Logo" className="h-20 w-auto" />
            </div>
            <h1 className="text-3xl font-bold tracking-[0.2em] text-white mb-2">
              CLUB369
            </h1>
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

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-5 relative z-10"
          >
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Email
              </label>
              <div className="relative group/input">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-primary text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Password
              </label>
              <div className="relative group/input">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-primary text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white focus:border-primary focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {/* Forgot Password Link - Only shows on Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-end pt-1"
                  >
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-[10px] font-bold text-primary/80 hover:text-primary uppercase tracking-tighter transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={authLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full bg-white text-black hover:bg-primary hover:text-white font-bold tracking-widest uppercase rounded-xl py-4 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              {authLoading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          {/* Footer links */}
          <div className="mt-8 text-center flex flex-col gap-4 relative z-10">
            <Link
              to="/register"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Not a member?{" "}
              <span className="text-primary font-bold">Enrol Now</span>
            </Link>
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[#1a151c] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              {/* Corner Accents for Modal */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs text-gray-400 mb-6">
                Enter your email and we'll send you instructions to reset your
                password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(175,37,244,0.3)]"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;