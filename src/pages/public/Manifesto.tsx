import React, { useRef, useState, useEffect, useCallback } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";

// Shared variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

const Manifesto: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Only keep the lightweight timeline line-draw — single scroll listener
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(timelineProgress, [0, 1], ["0%", "100%"]);

  // Throttled mouse handler
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

  return (
    <div className="relative min-h-screen font-display text-white selection:bg-primary selection:text-white overflow-hidden flex flex-col">
      <Navbar />

      {/* Static decorative numbers — no scroll/mouse transforms */}
      <div className="fixed top-20 right-[10%] text-[20vw] font-bold text-white/[0.025] pointer-events-none select-none z-0 leading-none">
        3
      </div>
      <div className="fixed bottom-20 left-[5%] text-[20vw] font-bold text-white/[0.025] pointer-events-none select-none z-0 leading-none">
        6
      </div>
      <div className="fixed top-[40%] left-[50%] -translate-x-1/2 text-[28vw] font-bold text-primary/[0.04] pointer-events-none select-none z-0 leading-none">
        9
      </div>

      {/* Static background blobs — no animate loops */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[450px] h-[450px] bg-purple-900/8 rounded-full blur-[100px] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex-grow">
        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <div className="text-center mb-24 md:mb-32 relative">
          {/* Single lightweight mouse-tracked glow */}
          <div
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              transform: `translate(calc(-50% + ${mousePosition.x * 3}px), calc(-50% + ${mousePosition.y * 3}px))`,
              transition: "transform 0.12s linear",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-primary text-xs md:text-sm font-bold tracking-[0.5em] uppercase mb-4 md:mb-6 block"
            >
              Exclusive Learning Membership
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-base md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed px-4"
            >
              Where structured knowledge meets purposeful action, and
              disciplined learning unlocks your full potential.
            </motion.p>
          </motion.div>
        </div>

        {/* ─── 369 LEARNING METHOD ──────────────────────────────────── */}
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
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
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
                  custom={i * 0.15}
                  className="text-gray-400 text-lg md:text-xl leading-relaxed"
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border border-white/10 p-8 md:p-10 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-colors duration-300 flex flex-col items-center justify-center"
            >
              {/* Static gradient bg + hover via CSS */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-purple-900/8" />
              <div className="absolute inset-0 border border-primary/10 rounded-3xl" />

              <span className="text-8xl font-bold text-primary/20 mb-4 relative z-10 group-hover:text-primary/30 transition-colors duration-300">
                369
              </span>
              <p className="text-primary text-xl font-light italic relative z-10 text-center">
                An exclusive learning circle of only 369 members
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── TIMELINE ─────────────────────────────────────────────── */}
        <section
          id="timeline"
          ref={timelineRef}
          className="relative py-10 md:py-20"
        >
          {/* Static line base */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-white/5 md:-translate-x-1/2" />

          {/* Scroll-driven line — kept because it's a single lightweight transform */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[19px] md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-primary via-purple-400 to-primary shadow-[0_0_20px_#af25f4] md:-translate-x-1/2 origin-top"
          >
            {/* Pulsing dot at line tip — cheap single element */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_16px_rgba(139,92,246,1)]"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <div className="space-y-20 md:space-y-40">
            {[
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
            ].map((item, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.5 }}
                  className={`md:w-1/2 flex ${i % 2 === 0 ? "md:justify-end" : "md:justify-start"} pl-12 md:pl-0 w-full`}
                >
                  <div className="border border-white/10 p-6 md:p-10 rounded-2xl max-w-lg w-full hover:border-primary/40 transition-colors duration-300 relative group">
                    {/* Corner accents — static, CSS only */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />

                    {/* Hover gradient — CSS only */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl" />

                    <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3 block relative z-10">
                      {item.phase}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 uppercase">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-lg relative z-10">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute left-[11px] md:left-1/2 w-5 h-5 bg-background-dark border-4 border-white rounded-full md:-translate-x-1/2 z-20 shadow-[0_0_16px_rgba(255,255,255,0.4)]"
                />

                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────────── */}
        <div className="mt-24 md:mt-48 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-white/10 relative overflow-hidden group hover:border-primary/30 hover:scale-[1.01] transition-all duration-300"
          >
            {/* Static corner blobs */}
            <div className="absolute -top-[80px] -left-[80px] w-[260px] h-[260px] bg-primary/15 blur-[100px] rounded-full group-hover:bg-primary/25 transition-colors duration-500" />
            <div className="absolute -bottom-[80px] -right-[80px] w-[260px] h-[260px] bg-purple-900/15 blur-[100px] rounded-full" />

            {/* Pulsing ring — single element, cheap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-primary/15 rounded-full animate-ping opacity-20 pointer-events-none" />

            <div className="relative z-10">
              <span className="material-symbols-outlined text-5xl md:text-6xl text-primary mb-6 md:mb-8 block drop-shadow-[0_0_12px_rgba(175,37,244,0.5)]">
                verified
              </span>

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
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-black hover:bg-primary hover:text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold tracking-wide transition-all duration-300 text-base md:text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(175,37,244,0.5)]"
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