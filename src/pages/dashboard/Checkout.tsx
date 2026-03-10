import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { PaymentService } from "../../services/PaymentService";
import { useAuth } from "../../context/AuthContext";

// ─── Apple-tuned constants ────────────────────────────────────────────────────
// Matches UISpringTimingParameters "snappy" preset
const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const;
const APPLE_SPRING = { stiffness: 380, damping: 38, mass: 1 } as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: APPLE_EASE, delay },
  }),
};

// ─── Benefit rows ─────────────────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: "menu_book",
    title: "Full Curriculum Access",
    desc: "All courses, modules, and learning materials.",
  },
  {
    icon: "groups",
    title: "Expert-Led Sessions",
    desc: "Regular live classes and mentorship meetups.",
  },
  // {
  //   icon: "health_and_safety",
  //   title: "Medical Coverage",
  //   desc: "Health insurance for your health will be covered.",
  // },
];

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────
// Uses motion values exclusively — zero React re-renders during tilt.
// Spring config: low stiffness = "floaty" card that follows the cursor
// like a physical object, matching Apple's iPad tilt parallax behaviour.
const TiltCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Springs smooth out cursor jitter, matching Apple's CASpringAnimation
  const springX = useSpring(rawX, { stiffness: 42, damping: 19, mass: 1 });
  const springY = useSpring(rawY, { stiffness: 42, damping: 19, mass: 1 });

  // rotateX/Y stay compositor-safe (no layout impact)
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width - 0.5);
      rawY.set((e.clientY - r.top) / r.height - 0.5);
    },
    [rawX, rawY],
  );

  const onLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    // perspective must live on a *parent* element — not the rotating element —
    // to avoid Safari's "flat" compositing bug with perspective + overflow:hidden
    <div style={{ perspective: "1000px" }} className="flex justify-center">
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          // GPU-promote before the first tilt frame
          willChange: "transform",
        }}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.55, ease: APPLE_EASE }}
        className="relative w-full max-w-md"
      >
        {children}
      </motion.div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Checkout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    if (user?.membership_status === "ACTIVE") navigate("/dashboard");
  }, [user, navigate]);

  const handlePayment = useCallback(async () => {
    setIsLoading(true);
    try {
      await PaymentService.handlePayment({
        prefill: {
          name: user?.name || "New Member",
          email: user?.email || "member@club369.com",
          contact: user?.mobile || "9999999999",
        },
        onSuccess: (verifyRes) => {
          if (verifyRes) {
            alert("Payment Successful & Membership Activated!");
            window.location.reload();
            // navigate("/dashboard");
          }
          setIsLoading(false);
        },
        onDismiss: () => setIsLoading(false),
        onError: (error: any) => {
          console.error("Payment Error:", error);
          setErrorModal({ title: "Payment Failed", message: error.message || "Could not connect to payment gateway." });
          setIsLoading(false);
        },
      });
    } catch {
      setIsLoading(false);
    }
  }, [user, navigate]);

  return (
    <div
      className="min-h-screen font-display text-white flex flex-col
                    selection:bg-primary selection:text-white overflow-hidden relative"
    >
      <Navbar />

      {/* ── Background blobs — own Metal layers via translateZ ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px]
                     bg-primary/8 rounded-full blur-[130px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px]
                     bg-purple-900/8 rounded-full blur-[110px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-[350px] h-[350px]
                     bg-blue-900/6 rounded-full blur-[90px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
      </div>

      {/* Decorative 369 watermark */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-9xl font-bold
                      text-primary/[0.04] pointer-events-none select-none"
      >
        369
      </div>

      <main
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2
                       gap-12 items-center min-h-[90vh] p-6 pt-32 flex-grow relative z-10"
      >
        {/* ─── LEFT: Summary ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl font-bold tracking-tight
                       [-webkit-font-smoothing:antialiased]"
          >
            Begin your
            <br />
            <span className="text-primary">Learning Journey</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-gray-400 text-lg leading-relaxed
                       [-webkit-font-smoothing:antialiased]"
          >
            Activate your educational membership through our secure gateway and
            unlock full access to all CLUB369 programs, sessions, and resources
            for the next 30 days.
          </motion.p>

          {/* Summary card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.18}
            whileHover={{ y: -3 }}
            transition={APPLE_SPRING}
            className="bg-[#161118] border border-white/10 rounded-2xl p-6
                       space-y-5 relative overflow-hidden
                       hover:border-primary/30 transition-colors duration-300 group
                       will-change-transform"
            style={{ translateZ: 0 } as React.CSSProperties}
          >
            {/* Corner glow — opacity-only hover (compositor-safe) */}
            <div
              className="absolute top-0 right-0 w-36 h-36 bg-primary/8 rounded-full
                         blur-2xl opacity-100 group-hover:opacity-[2] transition-opacity duration-500"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />

            {/* Plan details */}
            <div className="space-y-3 relative z-10 border-b border-white/5 pb-4">
              {[
                ["Enrolment Plan", "Educational Membership (Monthly)"],
                ["Billing Cycle", "Every 30 Days"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-500 [-webkit-font-smoothing:antialiased]">
                    {label}
                  </span>
                  <span className="text-white font-bold [-webkit-font-smoothing:antialiased]">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-4 relative z-10">
              <p
                className="text-[10px] font-bold uppercase tracking-widest text-primary/80
                            [-webkit-font-smoothing:antialiased]"
              >
                What's Included
              </p>
              {BENEFITS.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0.28 + i * 0.08}
                  className="flex items-start gap-3"
                >
                  <motion.span
                    className="material-symbols-outlined text-primary text-lg mt-0.5
                               will-change-transform"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      ...APPLE_SPRING,
                      delay: 0.32 + i * 0.08,
                    }}
                    style={{ translateZ: 0 } as React.CSSProperties}
                  >
                    {item.icon}
                  </motion.span>
                  <div className="flex flex-col">
                    <span
                      className="text-xs font-bold text-white uppercase tracking-tight
                                     [-webkit-font-smoothing:antialiased]"
                    >
                      {item.title}
                    </span>
                    <span
                      className="text-[10px] text-gray-400 leading-tight
                                     [-webkit-font-smoothing:antialiased]"
                    >
                      {item.desc}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="h-px bg-white/10 relative z-10" />

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.52}
              className="flex justify-between items-center relative z-10"
            >
              <span
                className="text-sm text-gray-400 font-medium
                               [-webkit-font-smoothing:antialiased]"
              >
                Monthly Fee
              </span>
              <span
                className="text-white text-xl font-bold
                               [-webkit-font-smoothing:antialiased]"
              >
                ₹ 5,000
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── RIGHT: 3D Tilt Payment Card ────────────────────────────── */}
        <TiltCard>
          {/* Glow border — static, own GPU layer */}
          <div
            className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600
                       rounded-3xl blur opacity-25 pointer-events-none"
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />

          <div
            className="relative bg-[#161118] border border-white/10 rounded-3xl
                          p-8 shadow-2xl overflow-hidden flex flex-col gap-8"
          >
            {/* Inner blobs — own GPU layers */}
            <div
              className="absolute top-0 right-0 w-36 h-36 bg-primary/8 rounded-full blur-3xl"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-36 h-36 bg-purple-900/8 rounded-full blur-3xl"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />

            {/* Ambient shimmer — opacity + gradient only (no translate on hover) */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/4
                            to-transparent opacity-60 pointer-events-none"
            />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-3xl" />

            {/* Card header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.38}
              className="flex justify-between items-center relative z-10"
            >
              <motion.span
                className="material-symbols-outlined text-4xl text-white will-change-transform"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", ...APPLE_SPRING, delay: 0.4 }}
                style={{ translateZ: 0 } as React.CSSProperties}
              >
                school
              </motion.span>
              <div className="flex flex-col items-end">
                <span
                  className="text-xs font-bold bg-primary/20 text-primary px-3 py-1
                                 rounded-full uppercase mb-1
                                 [-webkit-font-smoothing:antialiased]"
                >
                  Enrolment
                </span>
                <span
                  className="text-[10px] text-gray-500 uppercase
                                 [-webkit-font-smoothing:antialiased]"
                >
                  Secure Gateway
                </span>
              </div>
            </motion.div>

            {/* Amount */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.46}
              className="space-y-1 relative z-10"
            >
              <div
                className="text-gray-500 text-xs uppercase font-bold
                              [-webkit-font-smoothing:antialiased]"
              >
                Monthly Tuition
              </div>
              <div
                className="text-4xl font-bold text-white
                              [-webkit-font-smoothing:antialiased]"
              >
                ₹ 5,000
                <span className="text-lg text-gray-500 font-normal">/mo</span>
              </div>
            </motion.div>

            {/* Pay button */}
            <motion.button
              onClick={handlePayment}
              disabled={isLoading}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.54}
              whileHover={{ scale: 1.025, y: -3 }}
              whileTap={{ scale: 0.975 }}
              transition={APPLE_SPRING}
              className="w-full bg-white hover:bg-gray-100 text-black font-bold text-lg
                         py-4 px-6 rounded-xl shadow-lg
                         transition-colors duration-200
                         flex justify-center items-center gap-2
                         relative z-10 overflow-hidden
                         hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         will-change-transform
                         [-webkit-font-smoothing:antialiased]"
              style={{ translateZ: 0 } as React.CSSProperties}
            >
              {/* CSS-only shimmer sweep on hover — translateX only (compositor-safe) */}
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent
                           via-white/25 to-transparent -translate-x-full
                           hover:translate-x-full transition-transform duration-600
                           pointer-events-none"
              />

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: APPLE_EASE }}
                    className="flex items-center gap-2 relative z-10"
                  >
                    <motion.span
                      className="material-symbols-outlined will-change-transform"
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
                    Processing…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: APPLE_EASE }}
                    className="flex items-center gap-2 relative z-10"
                  >
                    Activate Membership
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Security note */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.62}
              className="flex justify-center items-center gap-2 text-gray-600 text-xs
                         relative z-10 [-webkit-font-smoothing:antialiased]"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              256-bit Encrypted Transaction
            </motion.div>
          </div>
        </TiltCard>
      </main>

      <Footer />

      {/* Error modal */}
      <ErrorModal
        visible={!!errorModal}
        title={errorModal?.title}
        message={errorModal?.message ?? ""}
        onClose={() => setErrorModal(null)}
      />
    </div>
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

export default Checkout;
