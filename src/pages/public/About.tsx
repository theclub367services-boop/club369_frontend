import React, { useEffect, useCallback, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion } from "framer-motion";
import missionImage from "../../../public/images/mission.jpeg";
import visionImage from "../../../public/images/vision.jpeg";

const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: APPLE_EASE, delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.52, ease: APPLE_EASE, delay },
  }),
};

// Section wrapper — CSS paint containment scopes reflows per section
const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={className} style={{ contain: "layout style paint" }}>
    {children}
  </div>
);

const About: React.FC = () => {
  // Ref-based mouse storage — never triggers React re-renders
  const blobRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = {
      x: (e.clientX - window.innerWidth / 2) / 80,
      y: (e.clientY - window.innerHeight / 2) / 80,
    };
  }, []);

  useEffect(() => {
    // Single persistent rAF loop — writes translate3d directly to the DOM.
    // Stays entirely on Safari's Metal compositor thread.
    const tick = () => {
      if (blobRef.current) {
        const { x, y } = mouse.current;
        blobRef.current.style.transform = `translate3d(calc(-50% + ${x * 2}px), calc(-50% + ${y * 2}px), 0)`;
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

  return (
    <div className="min-h-screen font-display text-white selection:bg-primary selection:text-white overflow-hidden flex flex-col">
      <Navbar />

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary/8 rounded-full blur-[120px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-purple-900/8 rounded-full blur-[120px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-primary/4 rounded-full blur-[100px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto flex-grow">
        {/* ─── HERO ─────────────────────────────────────────────────────── */}
        <section style={{ contain: "layout style" }}>
          <motion.div
            initial="hidden"
            animate="visible"
            className="text-center mb-24 relative"
          >
            <div
              ref={blobRef}
              aria-hidden
              className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px] pointer-events-none"
              style={{
                transform: "translate3d(-50%, -50%, 0)",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            />

            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-4 block relative z-10"
            >
              The Philosophy
            </motion.span>

            <motion.h1
              variants={fadeUp}
              custom={0.12}
              className="text-5xl md:text-7xl font-bold mb-8 tracking-tight relative z-10"
              style={{ willChange: "opacity, transform" }}
            >
              <span className="inline-block">LEARNING </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white inline-block">
                TODAY
              </span>
              .
              <br />
              <span className="inline-block">LEADING </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary inline-block">
                TOMORROW
              </span>
              .
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.22}
              className="text-gray-400 text-lg max-w-xl mx-auto relative z-10"
            >
              CLUB369 is an exclusive educational community built to turn
              knowledge into confidence, and ambition into action.
            </motion.p>
          </motion.div>
        </section>

        <div className="grid gap-20">
          {/* ─── VISION ─────────────────────────────────────────────────── */}
          <Section>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col md:flex-row gap-10 items-center"
            >
              <div className="md:w-1/2 space-y-4">
                <motion.h2
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className="text-3xl font-bold text-white border-l-4 border-primary pl-4 uppercase
                    transition-transform duration-300 ease-out hover:translate-x-1.5"
                  style={{ willChange: "transform" }}
                >
                  Our Vision
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.08}
                  className="text-gray-400 text-lg leading-relaxed italic"
                >
                  "We aim to cultivate a generation of knowledgeable, skilled,
                  and action-driven individuals — empowering every CLUB369
                  member to achieve educational excellence and financial
                  independence."
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.52, ease: APPLE_EASE }}
                className="md:w-1/2 h-[300px] bg-white/[0.03] rounded-2xl border border-white/10 relative overflow-hidden group"
                style={{ willChange: "opacity, transform" }}
              >
                {/* Hover overlay — CSS opacity transition, compositor-only */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

                <img
                  src={visionImage}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80
                    transition-all duration-500 ease-out group-hover:scale-[1.04]"
                  style={{ willChange: "transform, opacity" }}
                  alt="Our Vision"
                  loading="lazy"
                  decoding="async"
                />

                {/* Shine sweep — translateX only, CSS-driven, compositor-safe */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out z-20 pointer-events-none" />
              </motion.div>
            </motion.div>
          </Section>

          {/* ─── MISSION ────────────────────────────────────────────────── */}
          <Section>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col md:flex-row-reverse gap-10 items-center"
            >
              <div className="md:w-1/2 space-y-4">
                <motion.h2
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className="text-3xl font-bold text-white border-r-4 border-primary pr-4 text-right uppercase
                    transition-transform duration-300 ease-out hover:-translate-x-1.5"
                  style={{ willChange: "transform" }}
                >
                  Our Mission
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.08}
                  className="text-gray-400 text-lg leading-relaxed text-right"
                >
                  To deliver expert guidance in business education, digital
                  skills, and personal development — empowering members to learn
                  and grow with clarity and confidence.
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.16}
                  className="text-gray-400 text-lg leading-relaxed text-right"
                >
                  Members gain exclusive access to CLUB369's structured learning
                  resources, expert sessions, and a collaborative network that
                  builds a strong ecosystem for lifelong success.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.52, ease: APPLE_EASE }}
                className="md:w-1/2 h-[300px] bg-white/[0.03] rounded-2xl border border-white/10 relative overflow-hidden group"
                style={{ willChange: "opacity, transform" }}
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

                <img
                  src={missionImage}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80
                    transition-all duration-500 ease-out group-hover:scale-[1.04]"
                  style={{ willChange: "transform, opacity" }}
                  alt="Our Mission"
                  loading="lazy"
                  decoding="async"
                />

                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/8 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-700 ease-out z-20 pointer-events-none" />
              </motion.div>
            </motion.div>
          </Section>

          {/* ─── EDUCATIONAL PARTNERSHIPS ───────────────────────────────── */}
          <Section>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.52, ease: APPLE_EASE }}
              className="mt-10 p-10 backdrop-blur-md border border-white/10 rounded-3xl relative overflow-hidden
                transition-colors duration-300 hover:border-primary/40 group"
              style={{ willChange: "opacity, transform" }}
            >
              {/* Static corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-3xl pointer-events-none" />

              {/* Hover bg — CSS opacity transition (compositor-only) */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl font-bold mb-8 text-center uppercase relative z-10"
              >
                Educational Partnerships
              </motion.h2>

              <div className="space-y-6 max-w-3xl mx-auto text-center relative z-10">
                <motion.p
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.08}
                  className="text-gray-400 text-lg leading-relaxed"
                >
                  We believe in collaborative learning. Our educational
                  framework is strengthened by partnerships with experienced
                  mentors, industry practitioners, and learning institutions
                  across business, technology, and digital marketing.
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.16}
                  className="text-gray-400 text-lg leading-relaxed"
                >
                  These partnerships give CLUB369 members access to real-world
                  insights, structured curricula, and expert guidance that
                  simply cannot be found in conventional learning environments.
                </motion.p>
              </div>
            </motion.div>
          </Section>

          {/* ─── CORE VALUES ────────────────────────────────────────────── */}
          <Section className="mt-10">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation",
                  desc: "Pioneering fresh approaches to learning and personal growth",
                  icon: "💡",
                },
                {
                  title: "Excellence",
                  desc: "Commitment to the highest educational and professional standards",
                  icon: "⭐",
                },
                {
                  title: "Community",
                  desc: "Building lasting relationships between learners, mentors, and leaders",
                  icon: "🤝",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={i * 0.12}
                  className="p-8 bg-white/[0.03] border border-white/10 rounded-2xl text-center
                    transition-all duration-300 ease-out
                    hover:border-primary/50 hover:-translate-y-1.5 hover:bg-white/5"
                  style={{ willChange: "transform" }}
                >
                  <div
                    className="text-5xl mb-4 transition-transform duration-300 ease-out group-hover:scale-110"
                    role="img"
                    aria-label={item.title}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-primary uppercase">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
