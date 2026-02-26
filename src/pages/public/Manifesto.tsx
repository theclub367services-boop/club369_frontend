import React, { useRef, useState, useEffect, useCallback } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";

// ─── Apple-tuned spring configs ───────────────────────────────────────────────
// Matches UISpringTimingParameters: damping ~0.86, response ~0.38s
const APPLE_SPRING = { stiffness: 380, damping: 38, mass: 1 };
const SOFT_SPRING = { stiffness: 160, damping: 28, mass: 1 };

// ─── Shared animation variants ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

// ─── Timeline phases ──────────────────────────────────────────────────────────
const PHASES = [
  {
    phase: "Phase 1",
    title: "THE FOUNDATION",
    desc: "CLUB369 began as a vision to create a community where individuals could learn business fundamentals, explore digital skills, and build a strong educational base for sustainable growth.",
  },
  {
    phase: "Phase 2",
    title: "CURRICULUM & COMMUNITY",
    desc: "As the community grew, we expanded our learning offerings — structured courses in business strategy, digital marketing, trading fundamentals, and exclusive expert-led networking sessions.",
  },
  {
    phase: "Phase 3",
    title: "TODAY & BEYOND",
    desc: "Today, CLUB369 is a thriving educational ecosystem where members launch their own ventures, apply real-world skills, and achieve financial independence through guided learning and community support.",
  },
];

// ─── MagneticGlow: GPU-composited pointer-following glow ──────────────────────
// Uses motion values → CSS transform only (no layout reflow)
const MagneticGlow: React.FC<{ className?: string }> = ({ className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs set to Apple interpolation curve
  const springX = useSpring(x, SOFT_SPRING);
  const springY = useSpring(y, SOFT_SPRING);

  useEffect(() => {
    let raf: number;
    let lx = 0,
      ly = 0;

    const onMove = (e: PointerEvent) => {
      lx = (e.clientX - window.innerWidth / 2) / 90;
      ly = (e.clientY - window.innerHeight / 2) / 90;
    };

    const tick = () => {
      x.set(lx * 3.5);
      y.set(ly * 3.5);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [x, y]);

  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none will-change-transform ${className}`}
      style={{
        x: springX,
        y: springY,
        // translateZ forces GPU layer
        translateZ: 0,
      }}
    />
  );
};

// ─── TimelineCard ─────────────────────────────────────────────────────────────
const TimelineCard: React.FC<{
  item: (typeof PHASES)[0];
  index: number;
}> = ({ item, index }) => {
  const even = index % 2 === 0;

  return (
    <div
      className={`flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center ${
        !even ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, x: even ? -44 : 44 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`md:w-1/2 flex ${even ? "md:justify-end" : "md:justify-start"} pl-12 md:pl-0 w-full`}
      >
        <motion.div
          whileHover={{ scale: 1.025, y: -4 }}
          transition={APPLE_SPRING}
          className="border border-white/10 p-6 md:p-10 rounded-2xl max-w-lg w-full
                     relative group cursor-default
                     hover:border-primary/40
                     transition-colors duration-300
                     will-change-transform"
          style={{ translateZ: 0 }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />

          {/* Hover reveal — opacity only (compositor layer) */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-500 rounded-2xl"
          />

          <span className="text-primary text-xs font-bold uppercase tracking-[0.22em] mb-3 block relative z-10">
            {item.phase}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 uppercase tracking-tight">
            {item.title}
          </h3>
          <p className="text-gray-400 text-lg relative z-10 leading-relaxed">
            {item.desc}
          </p>
        </motion.div>
      </motion.div>

      {/* Timeline dot — spring pop */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ type: "spring", ...APPLE_SPRING, delay: 0.08 }}
        className="absolute left-[11px] md:left-1/2 w-5 h-5
                   bg-background-dark border-4 border-white rounded-full
                   md:-translate-x-1/2 z-20
                   shadow-[0_0_18px_rgba(255,255,255,0.5)]
                   will-change-transform"
        style={{ translateZ: 0 }}
      />

      <div className="hidden md:block md:w-1/2" />
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Manifesto: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  // Spring-smooth line draw — far silkier than raw scrollYProgress on Apple
  const smoothProgress = useSpring(timelineProgress, {
    stiffness: 100,
    damping: 28,
    restDelta: 0.001,
  });
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative min-h-screen font-display text-white selection:bg-primary selection:text-white overflow-hidden flex flex-col">
      <Navbar />

      {/* ── Static decorative numerals ── */}
      <div className="fixed top-20 right-[10%] text-[20vw] font-bold text-white/[0.025] pointer-events-none select-none z-0 leading-none">
        3
      </div>
      <div className="fixed bottom-20 left-[5%] text-[20vw] font-bold text-white/[0.025] pointer-events-none select-none z-0 leading-none">
        6
      </div>
      <div className="fixed top-[40%] left-[50%] -translate-x-1/2 text-[28vw] font-bold text-primary/[0.04] pointer-events-none select-none z-0 leading-none">
        9
      </div>

      {/* ── Background blobs — GPU layers via translateZ ── */}
      <div
        className="fixed top-0 left-0 w-[520px] h-[520px] bg-primary/8 rounded-full blur-[130px] pointer-events-none z-0"
        style={{ transform: "translateZ(0)" }}
      />
      <div
        className="fixed bottom-0 right-0 w-[460px] h-[460px] bg-purple-900/8 rounded-full blur-[110px] pointer-events-none z-0"
        style={{ transform: "translateZ(0)" }}
      />

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex-grow">
        {/* ─── HERO ─────────────────────────────────────────────────────────── */}
        <div className="text-center mb-24 md:mb-32 relative">
          {/* GPU-composited pointer glow — compositor layer only */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] pointer-events-none">
            <MagneticGlow className="inset-0 w-full h-full bg-primary/10 blur-[160px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-primary text-xs md:text-sm font-bold tracking-[0.5em] uppercase mb-4 md:mb-6 block"
            >
              Exclusive Learning Membership
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.18,
                duration: 0.65,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="text-4xl md:text-6xl lg:text-9xl font-bold mb-6 md:mb-8 leading-none tracking-tighter"
            >
              <span className="inline-block">THE </span>
              <span className="text-stroke-1 text-transparent font-outline-2 inline-block">
                CODE
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white animate-gradient bg-[length:200%_auto] inline-block">
                TO LEARN
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.32,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="text-base md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed px-4"
            >
              Where structured knowledge meets purposeful action, and
              disciplined learning unlocks your full potential.
            </motion.p>
          </motion.div>
        </div>

        {/* ─── 369 LEARNING METHOD ──────────────────────────────────────────── */}
        <section id="method" className="mb-32 md:mb-48">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 md:mb-16 text-center tracking-tight uppercase"
          >
            The 369 Learning Method
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-6"
            >
              {[
                "The 369 Learning Method is a powerful framework rooted in clarity, consistent practice, and intentional application. By focusing your study, applying skills daily, and reinforcing knowledge at key intervals, you align your effort with your educational and career goals.",
                "369 is more than a method — it's a learning mindset that builds focus, discipline, and confidence to turn knowledge into measurable results.",
              ].map((text, i) => (
                <motion.p
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.12}
                  className="text-gray-400 text-lg md:text-xl leading-relaxed"
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.02, y: -3 }}
              // @ts-ignore
              transition_hover={APPLE_SPRING}
              className="border border-white/10 p-8 md:p-10 rounded-3xl relative overflow-hidden group
                         hover:border-primary/50 transition-colors duration-300
                         flex flex-col items-center justify-center cursor-default
                         will-change-transform"
              style={{ translateZ: 0 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-purple-900/8" />
              <div className="absolute inset-0 border border-primary/10 rounded-3xl" />

              <motion.span
                className="text-8xl font-bold text-primary/20 mb-4 relative z-10"
                whileHover={{ scale: 1.06 }}
                transition={APPLE_SPRING}
              >
                369
              </motion.span>
              <p className="text-primary text-xl font-light italic relative z-10 text-center">
                An exclusive learning circle of only 369 members
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── TIMELINE ─────────────────────────────────────────────────────── */}
        <section
          id="timeline"
          ref={timelineRef}
          className="relative py-10 md:py-20"
        >
          {/* Base track */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-white/5 md:-translate-x-1/2" />

          {/* Spring-driven line fill */}
          <motion.div
            style={{ height: lineHeight, translateZ: 0 }}
            className="absolute left-[19px] md:left-1/2 top-0 w-0.5
                       bg-gradient-to-b from-primary via-purple-400 to-primary
                       shadow-[0_0_22px_rgba(175,37,244,0.8)]
                       md:-translate-x-1/2 origin-top will-change-transform"
          >
            {/* Dot at tip */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2
                         w-3 h-3 bg-primary rounded-full
                         shadow-[0_0_18px_rgba(175,37,244,1)]
                         will-change-transform"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                // Use Apple's preferred repeat timing
                repeatType: "loop",
              }}
              style={{ translateZ: 0 }}
            />
          </motion.div>

          <div className="space-y-20 md:space-y-40">
            {PHASES.map((item, i) => (
              <TimelineCard key={i} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────────────────── */}
        <div className="mt-24 md:mt-48 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.012, y: -2 }}
            // @ts-ignore
            whileHover_transition={APPLE_SPRING}
            className="p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-white/10
                       relative overflow-hidden group
                       hover:border-primary/30
                       transition-colors duration-300
                       will-change-transform"
            style={{ translateZ: 0 }}
          >
            {/* Corner blobs — static, GPU layer */}
            <div
              className="absolute -top-[80px] -left-[80px] w-[280px] h-[280px]
                          bg-primary/15 blur-[110px] rounded-full
                          group-hover:bg-primary/25 transition-colors duration-500"
              style={{ transform: "translateZ(0)" }}
            />
            <div
              className="absolute -bottom-[80px] -right-[80px] w-[280px] h-[280px]
                          bg-purple-900/15 blur-[110px] rounded-full"
              style={{ transform: "translateZ(0)" }}
            />

            {/* Ping ring — single element */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[200px] h-[200px] border border-primary/15 rounded-full
                          animate-ping opacity-20 pointer-events-none"
              style={{ transform: "translateZ(0) translate(-50%, -50%)" }}
            />

            <div className="relative z-10">
              <motion.span
                className="material-symbols-outlined text-5xl md:text-6xl text-primary mb-6 md:mb-8 block
                           drop-shadow-[0_0_14px_rgba(175,37,244,0.6)]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", ...APPLE_SPRING }}
                style={{ translateZ: 0 }}
              >
                verified
              </motion.span>

              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight"
              >
                Ready to Start Learning?
              </motion.h2>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
                className="text-gray-400 mb-8 md:mb-10 text-lg max-w-2xl mx-auto"
              >
                Membership is by application only. Spots are limited to 369
                dedicated learners who are committed to growth and action.
              </motion.p>

              <motion.button
                onClick={() => (window.location.href = "/")}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2}
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={APPLE_SPRING}
                className="bg-white text-black hover:bg-primary hover:text-white
                           px-8 md:px-10 py-4 md:py-5 rounded-xl
                           font-bold tracking-wide
                           transition-colors duration-300
                           text-base md:text-lg
                           shadow-[0_0_30px_rgba(255,255,255,0.2)]
                           hover:shadow-[0_0_50px_rgba(175,37,244,0.55)]
                           will-change-transform"
                style={{ translateZ: 0 }}
              >
                Begin Application
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Manifesto;