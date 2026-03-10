import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { AuthService } from "../../services/AuthService";
import LoadingScreen from "../../components/layout/Loadingscreen";

const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: APPLE_EASE, delay },
  }),
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resetMessage, setResetMessage] = useState("");

  // Controls the LoadingScreen overlay during sign-in
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !signingIn) {
      if (user?.role?.toUpperCase() === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, signingIn, user, navigate]);

  // Mouse-parallax card drift
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = {
      x: (e.clientX - window.innerWidth / 2) / 80,
      y: (e.clientY - window.innerHeight / 2) / 80,
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      if (cardRef.current) {
        const { x, y } = mouse.current;
        cardRef.current.style.transform = `translate3d(${x * 1.5}px, ${y * 1.5}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseMove]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorModal(null);
    setSigningIn(true); // ← show LoadingScreen

    try {
      await login(email, password);

      // LoadingScreen's own stepped progress runs up to ~90%.
      // A 420 ms pause lets it spring to 100% before we navigate.
      await new Promise((r) => setTimeout(r, 420));

      const user = AuthService.getCurrentUser();
      if (user?.role?.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setSigningIn(false); // ← hide LoadingScreen, show error
      const raw = err?.response?.data ?? err?.data ?? err;
      const backendMsg =
        raw?.detail ||
        raw?.message ||
        raw?.errors?.detail ||
        (typeof raw === "string" ? raw : null);

      setErrorModal({
        title: "Login Failed",
        message: backendMsg || "Invalid credentials. Please try again.",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setResetStatus("loading");
    setResetMessage("");

    try {
      await AuthService.forgotPassword(resetEmail);
      setResetStatus("success");
      setResetMessage("A reset link has been sent to your email address.");
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setResetEmail("");
        setResetStatus("idle");
        setResetMessage("");
      }, 3000);
    } catch (error: any) {
      setResetStatus("error");
      setResetMessage(error?.message || error?.errors || "Failed to send reset link. Please try again.");
    }
  };
  const logoUrl = "/images/cloud369.png";

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center
                    justify-center font-display selection:bg-primary selection:text-white"
    >
      {/* Static background blobs */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-purple-900/8 rounded-full blur-[100px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-blue-900/6 rounded-full blur-[90px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: APPLE_EASE }}
          style={{ willChange: "opacity, transform" }}
        >
          <div
            ref={cardRef}
            style={{
              transform: "translate3d(0, 0, 0)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
            className="bg-[#161118]/80 backdrop-blur-xl border border-white/10 rounded-3xl
                       p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-52 h-52 bg-primary/6 rounded-full blur-3xl pointer-events-none"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/15 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/15 rounded-br-3xl" />

            {/* Header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-center mb-10 flex flex-col items-center relative z-10"
            >
              <div className="mb-6 drop-shadow-[0_0_10px_rgba(175,37,244,0.35)]">
                <img
                  src={logoUrl}
                  alt="CLUB369 Logo"
                  className="h-20 w-auto transition-transform duration-300 ease-out hover:scale-[1.04]"
                  style={{ willChange: "transform" }}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <h1
                className="text-3xl font-bold tracking-[0.2em] text-white mb-2
                             [-webkit-font-smoothing:antialiased]"
              >
                CLUB369
              </h1>
              <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mt-3" />

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
                custom={0.08}
                className="space-y-1"
              >
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 [-webkit-font-smoothing:antialiased]">
                  Email
                </label>
                <div className="relative group/input">
                  <span
                    className="material-symbols-outlined absolute left-4 inset-y-0 my-auto h-fit flex items-center
                                   text-white/40 group-focus-within/input:text-primary transition-colors duration-200
                                   text-[20px] pointer-events-none"
                  >
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white
                               focus:border-primary focus:outline-none transition-colors duration-200
                               [-webkit-font-smoothing:antialiased]"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.14}
                className="space-y-1"
              >
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 [-webkit-font-smoothing:antialiased]">
                  Password
                </label>
                <div className="relative group/input">
                  <span
                    className="material-symbols-outlined absolute left-4 inset-y-0 my-auto h-fit flex items-center
                                   text-white/40 group-focus-within/input:text-primary transition-colors duration-200
                                   text-[20px] pointer-events-none"
                  >
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white
                               focus:border-primary focus:outline-none transition-colors duration-200
                               [-webkit-font-smoothing:antialiased]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 inset-y-0 my-auto h-fit flex items-center
                               text-white/40 hover:text-white transition-colors duration-200 focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotModalOpen(true);
                      setResetStatus("idle");
                      setResetMessage("");
                      setResetEmail("");
                    }}
                    className="text-[10px] font-bold text-primary/80 hover:text-primary uppercase
                               tracking-tighter transition-colors duration-200
                               [-webkit-font-smoothing:antialiased]"
                  >
                    Forgot Password?
                  </button>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={authLoading || signingIn}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.2}
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.975 }}
                className="mt-2 w-full bg-white text-black hover:bg-primary hover:text-white
                           font-bold tracking-widest uppercase rounded-xl py-4
                           transition-colors duration-200 shadow-lg
                           flex items-center justify-center gap-2
                           disabled:opacity-60 disabled:cursor-not-allowed
                           will-change-transform [-webkit-font-smoothing:antialiased]"
                style={{ willChange: "transform" }}
              >
                {(authLoading || signingIn) && (
                  <motion.span
                    className="material-symbols-outlined text-lg will-change-transform"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ willChange: "transform" }}
                  >
                    progress_activity
                  </motion.span>
                )}
                {authLoading || signingIn ? "Signing In..." : "Sign In"}
              </motion.button>
            </form>

            {/* Footer */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.26}
              className="mt-8 text-center flex flex-col gap-4 relative z-10"
            >
              <Link
                to="/register"
                className="text-xs text-gray-400 hover:text-white transition-colors duration-200
                           [-webkit-font-smoothing:antialiased]"
              >
                Not a member?{" "}
                <span className="text-primary font-bold">Enrol Now</span>
              </Link>
              <Link
                to="/"
                className="text-xs text-gray-500 hover:text-white transition-colors duration-200
                           [-webkit-font-smoothing:antialiased]"
              >
                Back to Home
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div >

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {
          isForgotModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: APPLE_EASE }}
                onClick={() => setIsForgotModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.3, ease: APPLE_EASE }}
                style={{ willChange: "opacity, transform" }}
                className="relative w-full max-w-sm bg-[#1a151c] border border-white/10
                         rounded-3xl p-8 shadow-2xl overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 bg-primary/8 rounded-full blur-3xl pointer-events-none"
                  style={{
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                />
                <h2
                  className="text-xl font-bold text-white mb-2 tracking-tight relative z-10
                             [-webkit-font-smoothing:antialiased]"
                >
                  Reset Password
                </h2>
                <p className="text-xs text-gray-400 mb-6 relative z-10 [-webkit-font-smoothing:antialiased]">
                  Enter your email and we'll send you instructions to reset your
                  password.
                </p>

                {resetMessage && (
                  <div className={`mb-4 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest relative z-10
                                [-webkit-font-smoothing:antialiased] ${resetStatus === "success"
                      ? "bg-green-500/10 border border-green-500/20 text-green-500"
                      : "bg-red-500/10 border border-red-500/20 text-red-500"
                    }`}>
                    {resetMessage}
                  </div>
                )}

                <form
                  onSubmit={handleResetPassword}
                  className="space-y-4 relative z-10"
                >
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={resetStatus === "loading" || resetStatus === "success"}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white
                             focus:border-primary focus:outline-none transition-colors duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             [-webkit-font-smoothing:antialiased]"
                    required
                  />
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      disabled={resetStatus === "loading"}
                      className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white text-xs
                               font-bold uppercase tracking-widest transition-colors duration-200
                               hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed
                               [-webkit-font-smoothing:antialiased]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetStatus === "loading" || resetStatus === "success"}
                      className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-xs font-bold
                               uppercase tracking-widest transition-all duration-200 ease-out
                               hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0
                               shadow-[0_0_15px_rgba(175,37,244,0.3)] disabled:opacity-50 disabled:cursor-not-allowed
                               [-webkit-font-smoothing:antialiased] flex items-center justify-center gap-2"
                      style={{ willChange: "transform" }}
                    >
                      {resetStatus === "loading" ? (
                        <>
                          <motion.span
                            className="material-symbols-outlined text-[16px] will-change-transform"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            progress_activity
                          </motion.span>
                          Sending...
                        </>
                      ) : (
                        "Send Link"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )
        }
      </AnimatePresence >
      <LoadingScreen isLoading={signingIn} label="Signing In" fadeIn showDots />
      {/* Error modal — validation + API errors */}
      <ErrorModal
        visible={!!errorModal}
        title={errorModal?.title}
        message={errorModal?.message ?? ""}
        onClose={() => setErrorModal(null)}
      />
    </div >
  );
};

// ─── ErrorModal ───────────────────────────────────────────────────────────────
const ErrorModal: React.FC<{
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}> = ({ visible, title = "Error", message, onClose }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key="error-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: APPLE_EASE }}
        className="fixed inset-0 z-[9998] flex items-center justify-center px-6 bg-black/70 backdrop-blur-md"
        style={{ willChange: "opacity" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.38, ease: APPLE_EASE, delay: 0.06 }}
          className="relative w-full max-w-sm bg-[#161118] border border-white/10
                     rounded-3xl p-8 shadow-2xl overflow-hidden text-center will-change-transform"
          style={{ translateZ: 0 } as React.CSSProperties}
        >
          {/* Red ambient glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[260px] h-[160px]
                          bg-red-500/12 rounded-full blur-[60px] pointer-events-none"
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />
          <div
            className="absolute bottom-0 right-0 w-40 h-40 bg-red-900/8 rounded-full blur-3xl pointer-events-none"
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />

          {/* Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 340, damping: 28, delay: 0.18 }}
            className="relative z-10 mx-auto mb-6 w-20 h-20 rounded-full
                       bg-red-500/15 border border-red-500/30
                       flex items-center justify-center will-change-transform"
            style={{ translateZ: 0 } as React.CSSProperties}
          >
            <motion.div
              className="absolute inset-0 rounded-full border border-red-500/25 will-change-transform"
              animate={{ opacity: [0.8, 0], scale: [1, 1.55] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              style={{ translateZ: 0 } as React.CSSProperties}
            />
            <motion.span
              className="material-symbols-outlined text-4xl text-red-400"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: APPLE_EASE, delay: 0.32 }}
            >
              error
            </motion.span>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: APPLE_EASE, delay: 0.28 }}
            className="relative z-10 space-y-2 mb-8"
          >
            <h2 className="text-2xl font-bold text-white tracking-tight [-webkit-font-smoothing:antialiased]">
              {title}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed [-webkit-font-smoothing:antialiased]">
              {message}
            </p>
          </motion.div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: APPLE_EASE, delay: 0.38 }}
            className="relative z-10 flex gap-3"
          >
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.975 }}
              className="flex-1 bg-white text-black hover:bg-primary hover:text-white
                         font-bold tracking-widest uppercase rounded-xl py-3.5
                         transition-colors duration-200 shadow-lg
                         hover:shadow-[0_0_30px_rgba(175,37,244,0.35)]
                         flex items-center justify-center gap-1.5
                         will-change-transform [-webkit-font-smoothing:antialiased]"
              style={{ translateZ: 0 } as React.CSSProperties}
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Try Again
            </motion.button>
          </motion.div>

          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-red-500/15 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-red-500/15 rounded-br-3xl" />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Login;
