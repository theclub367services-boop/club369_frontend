import React, { useEffect, useCallback, useRef } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion } from "framer-motion";

const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: APPLE_EASE, delay },
  }),
};

// Section wrapper — CSS paint containment scopes reflows per block
const Block: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={className} style={{ contain: "layout style paint" }}>
    {children}
  </div>
);

const Contact: React.FC = () => {
  // Ref-based mouse — zero React re-renders per mouse event
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
    // Single rAF loop — writes translate3d() directly to DOM.
    // Stays on Safari's Metal compositor thread. Zero React involvement.
    const tick = () => {
      if (blobRef.current) {
        const { x, y } = mouse.current;
        blobRef.current.style.transform = `translate3d(calc(-50% + ${x * 2.5}px), calc(-50% + ${y * 2.5}px), 0)`;
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
    <div className="min-h-screen font-display text-white selection:bg-primary selection:text-white flex flex-col overflow-hidden">
      <Navbar />

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-900/8 rounded-full blur-[120px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-[350px] h-[350px] bg-purple-900/8 rounded-full blur-[100px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto flex-grow w-full">
        {/* ─── HERO ───────────────────────────────────────────────────── */}
        <section
          className="text-center mb-20 relative"
          style={{ contain: "layout style" }}
        >
          <div
            ref={blobRef}
            aria-hidden
            className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none"
            style={{
              transform: "translate3d(-50%, -50%, 0)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Hero entries unified under shared fadeUp — fewer JS objects on mount */}
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-4 block relative z-10"
          >
            Member Support & Admissions
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.08}
            className="text-5xl md:text-7xl font-bold tracking-tight relative z-10"
            style={{ willChange: "opacity, transform" }}
          >
            GET IN{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white">
              TOUCH
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.16}
            className="text-gray-400 text-lg mt-4 max-w-lg mx-auto relative z-10"
          >
            Have questions about our programs, curriculum, or membership? We're
            here to guide you every step of the way.
          </motion.p>
        </section>

        {/* ─── CONTACT CONTENT ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.52, ease: APPLE_EASE }}
          className="space-y-12 max-w-2xl mx-auto"
          style={{ willChange: "opacity, transform" }}
        >
          {/* Learning Centre Location */}
          <Block>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="transition-transform duration-300 ease-out hover:translate-x-1.5"
              style={{ willChange: "transform" }}
            >
              <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-primary pl-4">
                Learning Centre
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                CLUB369's primary learning hub is open to enrolled members,
                prospective applicants, and anyone seeking guidance on our
                educational programs.
              </p>
              <div className="flex items-start gap-4 text-gray-300">
                <span className="material-symbols-outlined text-primary mt-1 flex-shrink-0">
                  location_on
                </span>
                <span className="leading-relaxed">
                  Door No. D-16/3, First Floor, 6th Cross, Western Extension,
                  Thillai Nagar,
                  <br />
                  Near KIMS Hospital, Tiruchirappalli — 620018
                  <br />
                  Tamil Nadu, India
                </span>
              </div>
            </motion.div>
          </Block>

          {/* Contact Lines */}
          <Block>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={0.08}
            >
              <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-primary pl-4">
                Contact Us
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: "mail",
                    label: "Admissions & Program Inquiries",
                    value: "theclub369.services@gmail.com",
                  },
                  {
                    icon: "call",
                    label: "Student Support Line",
                    value: "+91 6380343437",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i * 0.08}
                    className="flex items-center gap-4 text-gray-300 group cursor-pointer
                      transition-transform duration-200 ease-out hover:translate-x-1.5"
                    style={{ willChange: "transform" }}
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0
                      transition-colors duration-300 group-hover:bg-primary group-hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                        {item.label}
                      </div>
                      <div className="text-white transition-colors duration-200 group-hover:text-primary">
                        {item.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Block>

          {/* Enrolment Status */}
          <Block>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={0.16}
              className="p-8 bg-gradient-to-br from-[#161118] to-black border border-white/10 rounded-2xl relative overflow-hidden group
                transition-all duration-300 ease-out
                hover:border-primary/40 hover:-translate-y-1"
              style={{ willChange: "transform" }}
            >
              <div
                className="absolute top-0 right-0 w-36 h-36 bg-primary/15 rounded-full blur-3xl pointer-events-none
                  transition-colors duration-500 group-hover:bg-primary/25"
                style={{
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              />

              <h3 className="text-xl font-bold mb-2 relative z-10">
                Enrolment Status
              </h3>
              <p className="text-gray-400 text-sm mb-4 relative z-10">
                Current review time for new membership applications.
              </p>

              {/* animate-ping is a CSS animation — cheap, acceptable for a 3px dot */}
              <div className="flex items-center gap-2 text-accent-green font-mono text-sm relative z-10">
                <span className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-green" />
                </span>
                48 – 72 Hours
              </div>
            </motion.div>
          </Block>

          {/* What to Expect */}
          <Block>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={0.24}
              className="p-8 border border-white/10 rounded-2xl space-y-4
                transition-colors duration-300 hover:border-primary/30"
            >
              <h3 className="text-xl font-bold text-white">
                What Happens After You Apply?
              </h3>
              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    text: "Application reviewed by our admissions team within 48–72 hours.",
                  },
                  {
                    step: "02",
                    text: "A brief onboarding call to understand your learning goals.",
                  },
                  {
                    step: "03",
                    text: "Full access to the CLUB369 curriculum, live sessions, and community.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i * 0.07}
                    className="flex items-start gap-4"
                  >
                    <span className="text-primary font-bold text-sm font-mono mt-0.5 shrink-0">
                      {item.step}
                    </span>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Block>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;