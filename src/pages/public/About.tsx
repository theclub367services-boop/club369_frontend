import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion } from "framer-motion";
import missionImage from "../../../public/images/mission.jpeg";
import visionImage from "../../../public/images/vision.jpeg";

// Shared animation variants — defined once, reused everywhere
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

const About: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Throttled via rAF — prevents excessive state updates
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
    <div className="min-h-screen font-display text-white selection:bg-primary selection:text-white overflow-hidden flex flex-col">
      <Navbar />

      {/* Static background blobs — no scroll transforms, no particles */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-purple-900/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-primary/4 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto flex-grow">
        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="text-center mb-24 relative"
        >
          {/* Single lightweight mouse-tracked glow */}
          <div
            className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              transform: `translate(calc(-50% + ${mousePosition.x * 2}px), calc(-50% + ${mousePosition.y * 2}px))`,
              transition: "transform 0.12s linear",
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
            custom={0.15}
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight relative z-10"
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
            custom={0.25}
            className="text-gray-400 text-lg max-w-xl mx-auto relative z-10"
          >
            CLUB369 is an exclusive educational community built to turn
            knowledge into confidence, and ambition into action.
          </motion.p>
        </motion.div>

        <div className="grid gap-20">
          {/* ─── VISION ───────────────────────────────────────────────── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-10 items-center"
          >
            <div className="md:w-1/2 space-y-4">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl font-bold text-white border-l-4 border-primary pl-4 uppercase hover:translate-x-2 transition-transform duration-300"
              >
                Our Vision
              </motion.h2>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
                className="text-gray-400 text-lg leading-relaxed italic"
              >
                "We aim to cultivate a generation of knowledgeable, skilled, and
                action-driven individuals — empowering every CLUB369 member to
                achieve educational excellence and financial independence."
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 h-[300px] bg-white/[0.03] rounded-2xl border border-white/10 relative overflow-hidden group"
            >
              {/* Hover gradient overlay — CSS only, no JS */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              <img
                src={visionImage}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                alt="Our Vision"
              />

              {/* Shine effect — CSS only */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-20" />
            </motion.div>
          </motion.div>

          {/* ─── MISSION ──────────────────────────────────────────────── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse gap-10 items-center"
          >
            <div className="md:w-1/2 space-y-4">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl font-bold text-white border-r-4 border-primary pr-4 text-right uppercase hover:-translate-x-2 transition-transform duration-300"
              >
                Our Mission
              </motion.h2>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
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
                custom={0.2}
                className="text-gray-400 text-lg leading-relaxed text-right"
              >
                Members gain exclusive access to CLUB369's structured learning
                resources, expert sessions, and a collaborative network that
                builds a strong ecosystem for lifelong success.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 h-[300px] bg-white/[0.03] rounded-2xl border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              <img
                src={missionImage}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                alt="Our Mission"
              />

              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-700 z-20" />
            </motion.div>
          </motion.div>

          {/* ─── EDUCATIONAL PARTNERSHIPS ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 p-10 backdrop-blur-md border border-white/10 rounded-3xl relative overflow-hidden hover:border-primary/40 transition-colors duration-300 group"
          >
            {/* Static corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />

            {/* Subtle hover bg — CSS only */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
                custom={0.1}
                className="text-gray-400 text-lg leading-relaxed"
              >
                We believe in collaborative learning. Our educational framework
                is strengthened by partnerships with experienced mentors,
                industry practitioners, and learning institutions across
                business, technology, and digital marketing.
              </motion.p>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2}
                className="text-gray-400 text-lg leading-relaxed"
              >
                These partnerships give CLUB369 members access to real-world
                insights, structured curricula, and expert guidance that simply
                cannot be found in conventional learning environments.
              </motion.p>
            </div>
          </motion.div>

          {/* ─── CORE VALUES ──────────────────────────────────────────── */}
          <div className="grid md:grid-cols-3 gap-8 mt-10">
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
                viewport={{ once: true }}
                custom={i * 0.15}
                className="p-8 bg-white/[0.03] border border-white/10 rounded-2xl text-center hover:border-primary/50 hover:-translate-y-2 hover:bg-white/5 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-primary uppercase">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;