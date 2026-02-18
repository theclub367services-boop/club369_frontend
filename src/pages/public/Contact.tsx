import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion } from 'framer-motion';

// Shared variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay },
  }),
};

const Contact: React.FC = () => {
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
    window.addEventListener('mousemove', throttled, { passive: true });
    return () => {
      window.removeEventListener('mousemove', throttled);
      cancelAnimationFrame(rafId);
    };
  }, [handleMouseMove]);

  return (
    <div className="min-h-screen font-display text-white selection:bg-primary selection:text-white flex flex-col overflow-hidden">
      <Navbar />

      {/* Static background blobs — no scroll transforms, no looping animations */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-900/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/3 w-[350px] h-[350px] bg-purple-900/8 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto flex-grow w-full">

        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <div className="text-center mb-20 relative">
          {/* Single lightweight mouse-tracked glow */}
          <div
            className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              transform: `translate(calc(-50% + ${mousePosition.x * 2.5}px), calc(-50% + ${mousePosition.y * 2.5}px))`,
              transition: 'transform 0.12s linear',
            }}
          />

          <motion.span
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-4 block relative z-10"
          >
            Member Support & Admissions
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold tracking-tight relative z-10"
          >
            GET IN{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white">
              TOUCH
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-400 text-lg mt-4 max-w-lg mx-auto relative z-10"
          >
            Have questions about our programs, curriculum, or membership? We're
            here to guide you every step of the way.
          </motion.p>
        </div>

        {/* ─── CONTACT INFO ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-12 max-w-2xl mx-auto"
        >

          {/* Learning Centre Location */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="hover:translate-x-2 transition-transform duration-300"
          >
            <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-primary pl-4">
              Learning Centre
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              CLUB369's primary learning hub is open to enrolled members,
              prospective applicants, and anyone seeking guidance on our
              educational programs.
            </p>
            <div className="flex items-start gap-4 text-gray-300 group hover:translate-x-1 transition-transform duration-200">
              <span className="material-symbols-outlined text-primary mt-1">
                location_on
              </span>
              <span>
                Door No. D-16/3, First Floor, 6th Cross, Western Extension,
                Thillai Nagar,
                <br />
                Near KIMS Hospital, Tiruchirappalli — 620018
                <br />
                Tamil Nadu, India
              </span>
            </div>
          </motion.div>

          {/* Contact Lines */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
          >
            <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-primary pl-4">
              Contact Us
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: 'mail',
                  label: 'Admissions & Program Inquiries',
                  value: 'theclub369.services@gmail.com',
                },
                {
                  icon: 'call',
                  label: 'Student Support Line',
                  value: '+91 6380343437',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  className="flex items-center gap-4 text-gray-300 group cursor-pointer hover:translate-x-2 transition-transform duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-bold">
                      {item.label}
                    </div>
                    <div className="text-white group-hover:text-primary transition-colors duration-200">
                      {item.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enrolment Status */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
            className="p-8 bg-gradient-to-br from-[#161118] to-black border border-white/10 rounded-2xl relative overflow-hidden hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 group"
          >
            {/* Static corner glow — no looping animate */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-primary/15 rounded-full blur-3xl group-hover:bg-primary/25 transition-colors duration-500" />

            <h3 className="text-xl font-bold mb-2 relative z-10">
              Enrolment Status
            </h3>
            <p className="text-gray-400 text-sm mb-4 relative z-10">
              Current review time for new membership applications.
            </p>
            <div className="flex items-center gap-2 text-accent-green font-mono text-sm relative z-10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-green" />
              </span>
              48 – 72 Hours
            </div>
          </motion.div>

          {/* What to Expect */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.3}
            className="p-8 border border-white/10 rounded-2xl space-y-4 hover:border-primary/30 transition-colors duration-300"
          >
            <h3 className="text-xl font-bold text-white">
              What Happens After You Apply?
            </h3>
            <div className="space-y-3">
              {[
                { step: '01', text: 'Application reviewed by our admissions team within 48–72 hours.' },
                { step: '02', text: 'A brief onboarding call to understand your learning goals.' },
                { step: '03', text: 'Full access to the CLUB369 curriculum, live sessions, and community.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.08}
                  className="flex items-start gap-4"
                >
                  <span className="text-primary font-bold text-sm font-mono mt-0.5 shrink-0">
                    {item.step}
                  </span>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;