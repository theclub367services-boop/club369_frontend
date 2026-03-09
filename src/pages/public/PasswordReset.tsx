import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import api from "../../utils/api";

// ─── Apple-tuned constants ────────────────────────────────────────────────────
const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const;
const APPLE_SPRING = { stiffness: 380, damping: 38, mass: 1 } as const;
const CARD_SPRING = { stiffness: 120, damping: 22, mass: 1 } as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: APPLE_EASE, delay },
  }),
};

// ─── PasswordInput ────────────────────────────────────────────────────────────
interface PasswordInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  delay?: number;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  value,
  onChange,
  delay = 0,
}) => {
  const [show, setShow] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
      className="relative group/input"
    >
      {/* Lock icon — inset-y centering, GPU layer */}
      <span
        className="material-symbols-outlined absolute left-4 inset-y-0 my-auto h-fit
                   flex items-center text-white/30 group-focus-within/input:text-primary
                   transition-colors duration-200 text-[20px] pointer-events-none select-none"
        style={{ translateZ: 0 } as React.CSSProperties}
      >
        lock
      </span>

      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-black/40 border border-white/10 rounded-xl
                   py-3.5 pl-12 pr-12 text-white
                   placeholder:text-white/20
                   focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30
                   transition-colors duration-200
                   [-webkit-font-smoothing:antialiased]"
      />

      {/* Eye toggle — inset-y centering fix */}
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-4 inset-y-0 my-auto h-fit flex items-center
                   text-white/30 hover:text-white transition-colors duration-200
                   focus:outline-none"
        style={{ willChange: "transform" }}
      >
        <span className="material-symbols-outlined text-[20px]">
          {show ? "visibility_off" : "visibility"}
        </span>
      </button>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PasswordReset: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ─── Mouse parallax — zero React re-renders per frame ──────────────────
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: PointerEvent) => {
    mouse.current = {
      x: (e.clientX - window.innerWidth / 2) / 90,
      y: (e.clientY - window.innerHeight / 2) / 90,
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      if (cardRef.current) {
        const { x, y } = mouse.current;
        cardRef.current.style.transform = `translate3d(${x * 1.4}px, ${y * 1.4}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMouseMove);
    };
  }, [onMouseMove]);

  // ─── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatusMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    setStatusMsg(null);
    try {
      await api.post(`/auth/password/reset/confirm/${uid}/${token}/`, { password });
      setStatusMsg({
        type: "success",
        text: "Password updated! Redirecting to login…",
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.response?.data?.error || err.message || "Link invalid, malformed, or has expired.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center
                    bg-[#0a0a0a] px-6 overflow-hidden font-display
                    selection:bg-primary selection:text-white"
    >
      {/* ── Background blobs — own Metal layers ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px]
                     bg-primary/8 rounded-full blur-[130px]"
          style={{
            transform: "translateZ(0) translate(-50%, -50%)",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-[360px] h-[360px]
                     bg-purple-900/8 rounded-full blur-[100px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px]
                     bg-blue-900/6 rounded-full blur-[90px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-md">
        {/* Entry — opacity + y only (no scale = no Metal re-rasterize) */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, ease: APPLE_EASE }}
          style={{ willChange: "opacity, transform" }}
        >
          {/* Mouse-drift target — rAF writes translate3d here */}
          <div
            ref={cardRef}
            style={{
              transform: "translate3d(0,0,0)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
            className="bg-[#161118]/85 backdrop-blur-xl border border-white/10
                       rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden
                       hover:border-white/20 transition-colors duration-300"
          >
            {/* Corner glows */}
            <div
              className="absolute top-0 right-0 w-52 h-52 bg-primary/6
                         rounded-full blur-3xl pointer-events-none"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-40 h-40 bg-purple-900/6
                         rounded-full blur-3xl pointer-events-none"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 border-primary/20 rounded-br-3xl" />

            {/* ── Header ── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-center mb-8 relative z-10"
            >
              {/* Icon badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", ...APPLE_SPRING, delay: 0.06 }}
                className="inline-flex items-center justify-center w-14 h-14
                           rounded-2xl bg-primary/10 border border-primary/20
                           mb-5 shadow-[0_0_24px_rgba(175,37,244,0.2)]
                           will-change-transform"
                style={{ translateZ: 0 } as React.CSSProperties}
              >
                <span className="material-symbols-outlined text-primary text-2xl">
                  lock_reset
                </span>
              </motion.div>

              <h2
                className="text-2xl font-bold text-white mb-2 tracking-tight
                             [-webkit-font-smoothing:antialiased]"
              >
                New Password
              </h2>
              <p className="text-gray-400 text-sm [-webkit-font-smoothing:antialiased]">
                Please enter your new secure password.
              </p>
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4" />
            </motion.div>

            {/* ── Status message ── */}
            <AnimatePresence mode="wait">
              {statusMsg && (
                <motion.div
                  key={statusMsg.type + statusMsg.text}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: APPLE_EASE }}
                  className={`mb-6 p-3 rounded-xl text-xs font-bold uppercase
                              tracking-widest text-center border
                              [-webkit-font-smoothing:antialiased]
                              ${statusMsg.type === "error"
                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                      : "bg-primary/10 border-primary/20 text-primary"
                    }`}
                  style={{ willChange: "opacity, transform" }}
                >
                  {statusMsg.type === "success" && (
                    <span className="material-symbols-outlined text-[14px] align-middle mr-1">
                      check_circle
                    </span>
                  )}
                  {statusMsg.type === "error" && (
                    <span className="material-symbols-outlined text-[14px] align-middle mr-1">
                      error
                    </span>
                  )}
                  {statusMsg.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <PasswordInput
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                delay={0.1}
              />
              <PasswordInput
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                delay={0.16}
              />

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.22}
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.975 }}
                transition={APPLE_SPRING}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl
                           uppercase tracking-widest text-sm mt-2
                           hover:brightness-110
                           hover:shadow-[0_0_40px_rgba(175,37,244,0.45)]
                           shadow-[0_0_20px_rgba(175,37,244,0.25)]
                           transition-[box-shadow,filter] duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2
                           will-change-transform
                           [-webkit-font-smoothing:antialiased]"
                style={{ translateZ: 0 } as React.CSSProperties}
              >
                {loading ? (
                  <>
                    <motion.span
                      className="material-symbols-outlined text-[18px] will-change-transform"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{ translateZ: 0 } as React.CSSProperties}
                    >
                      progress_activity
                    </motion.span>
                    Updating…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      lock
                    </span>
                    Update Password
                  </>
                )}
              </motion.button>
            </form>

            {/* ── Back to login ── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.28}
              className="mt-6 text-center relative z-10"
            >
              <a
                href="/login"
                className="text-[10px] text-gray-600 hover:text-white uppercase
                           tracking-widest transition-colors duration-200
                           [-webkit-font-smoothing:antialiased]"
              >
                Back to Sign In
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PasswordReset;