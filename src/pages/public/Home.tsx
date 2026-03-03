import React, { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Link } from "react-router-dom";
import aboutImage from "../../../public/images/about.jpeg";
import cuephoriaLogo from "../../../public/images/cuephoria.jpeg";
import aasifeBiriyaniLogo from "../../../public/images/aasife.jpeg";
import bambooGardenLogo from "../../../public/images/bamboo.jpeg";
import turf45Logo from "../../../public/images/turf-45.jpeg";
import sporticLogo from "../../../public/images/sportic-logo.jpeg";
import teashopLogo from "../../../public/images/tea-shop.jpeg";
import unisexLogo from "../../../public/images/unisex.jpeg";
import goatfarmLogo from "../../../public/images/goat-farm.jpeg";
import photographyLogo from "../../../public/images/photography.jpeg";
import medicalLogo from "../../../public/images/medical.jpeg";
import fireworksLogo from "../../../public/images/fireworks.jpeg";
import snookerLogo from "../../../public/images/snooker.jpeg";

const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: APPLE_EASE, delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.55, ease: APPLE_EASE, delay },
  }),
};

const Section: React.FC<{
  id: string;
  className?: string;
  children: React.ReactNode;
}> = ({ id, className = "", children }) => (
  <section
    id={id}
    className={`py-24 md:py-32 border-t border-white/5 ${className}`}
    style={{ contain: "layout style paint" }}
  >
    {children}
  </section>
);

// ─── Component ───────────────────────────────────────────────────────────────

const Home: React.FC = () => {
  // Refs instead of state — writing to a ref never triggers React re-renders.
  const blobRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0 });

  // Store raw mouse delta — no state update, no render.
  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = {
      x: (e.clientX - window.innerWidth / 2) / 80,
      y: (e.clientY - window.innerHeight / 2) / 80,
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      if (blobRef.current) {
        const { x, y } = mouse.current;
        blobRef.current.style.transform = `translate3d(calc(-50% + ${x * 36}px), calc(-50% + ${y * 36}px), 0)`;
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
    <div className="relative min-h-screen text-white selection:bg-primary selection:text-white flex flex-col overflow-hidden">
      <Navbar />

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] bg-primary/5 rounded-full blur-[120px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute top-[25%] right-[5%] w-[35vw] h-[35vw] bg-purple-900/8 rounded-full blur-[100px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute bottom-[-5%] right-[-5%] w-[45vw] h-[45vw] bg-purple-900/8 rounded-full blur-[140px]"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />
      </div>

      <main className="relative z-10 flex-grow">
        {/* ─── 1. HERO ──────────────────────────────────────────────────── */}
        <section
          id="hero"
          className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 relative"
          style={{ contain: "layout style" }}
        >
          <div
            ref={blobRef}
            aria-hidden
            className="absolute top-1/2 left-1/2 w-[480px] h-[480px] bg-primary/5 rounded-full blur-[110px] pointer-events-none"
            style={{
              transform: "translate3d(-50%, -50%, 0)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          />

          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center z-10 w-full"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-primary text-xs md:text-sm font-bold mb-6 tracking-[0.4em] uppercase"
            >
              Learn · Grow · Lead
            </motion.span>

            <motion.h1
              variants={fadeUp}
              custom={0.12}
              className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] mb-8 uppercase"
              style={{ willChange: "opacity, transform" }}
            >
              <span className="block text-white">WELCOME TO</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white animate-gradient bg-[length:200%_auto]">
                CLUB369
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.22}
              className="text-gray-400 text-lg md:text-xl max-w-xl mb-10"
            >
              An exclusive educational community where knowledge becomes your
              greatest asset — 369 members, limitless potential.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={0.3}
              className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-md justify-center"
            >
              <Link
                to="/login"
                className="w-full sm:w-auto overflow-hidden rounded-lg bg-white px-8 md:px-10 py-4 text-black text-center uppercase font-bold text-lg
                  transition-all duration-200 ease-out
                  hover:bg-gray-100 hover:-translate-y-0.5
                  active:scale-[0.98] active:translate-y-0"
                style={{ willChange: "transform" }}
              >
                Join The Club
              </Link>
              <Link
                to="/manifesto"
                className="w-full sm:w-auto px-8 md:px-10 py-4 border border-white/20 rounded-lg text-white font-bold text-lg uppercase tracking-wide text-center
                  transition-all duration-200 ease-out
                  hover:bg-white/5 hover:-translate-y-0.5
                  active:scale-[0.98] active:translate-y-0"
                style={{ willChange: "transform" }}
              >
                Read Manifesto
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator — single translateY loop, stays on GPU */}
          <div
            className="absolute bottom-10 flex flex-col items-center gap-1 opacity-40"
            aria-hidden
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-2 bg-white rounded-full mt-2"
                animate={{ y: [0, 14, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ willChange: "transform" }}
              />
            </div>
          </div>
        </section>

        {/* ─── 2. ABOUT US ──────────────────────────────────────────────── */}
        <Section id="about">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-8"
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase">
                ABOUT <span className="text-primary">US</span>
              </h2>
              <div className="space-y-6 text-gray-400 text-lg md:text-xl leading-relaxed">
                {[
                  "CLUB369 is a dynamic educational community designed to help individuals learn, grow, and launch their own ventures through structured knowledge and mentorship.",
                  "We provide expert guidance in business education, digital skills, and personal development — empowering members to progress with clarity and confidence.",
                  "Members gain exclusive access to CLUB369's learning resources, expert sessions, and a collaborative network that creates a strong ecosystem for lifelong success.",
                ].map((text, i) => (
                  <motion.p
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i * 0.08}
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: APPLE_EASE }}
              className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video md:aspect-square"
              style={{ willChange: "opacity, transform" }}
            >
              <img
                src={aboutImage}
                alt="About CLUB369"
                className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.04]"
                style={{ willChange: "transform" }}
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>
        </Section>

        {/* ─── 3. WHY 369? ──────────────────────────────────────────────── */}
        <Section id="why369">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-6xl font-bold mb-4 uppercase"
            >
              WHY 369?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="text-primary text-xl font-light italic uppercase tracking-widest"
            >
              An exclusive learning circle of only 369 members
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6 text-gray-400 text-lg leading-relaxed"
            >
              {[
                "The 369 learning method is a powerful practice rooted in clarity, intention, and disciplined action — applied here to structured education.",
                "By focusing your effort through guided learning, collaborative projects, and expert mentorship, you align your energy with your career and business goals.",
                "369 is more than a number — it's a mindset that trains focus, consistency, and confidence to turn knowledge into tangible results.",
              ].map((text, i) => (
                <motion.p
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                type: "spring",
                stiffness: 130,
                damping: 18,
              }}
              className="bg-white/5 border border-white/10 p-12 rounded-full aspect-square flex items-center justify-center
                transition-colors duration-300 hover:border-primary/40"
              style={{ willChange: "opacity, transform" }}
            >
              <span className="text-8xl font-bold text-primary select-none">
                369
              </span>
            </motion.div>
          </div>
        </Section>

        {/* ─── 4. OUR VISION ────────────────────────────────────────────── */}
        <Section id="vision">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-6xl font-bold mb-12 uppercase"
            >
              OUR VISION
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: APPLE_EASE }}
              className="bg-white/5 p-12 rounded-3xl border border-white/10 backdrop-blur-sm
                transition-colors duration-300 hover:border-primary/30"
            >
              <p className="text-2xl md:text-4xl font-light italic text-gray-300">
                "We aim to cultivate a generation of knowledgeable, skilled, and
                action-driven individuals — empowering every CLUB369 member to
                achieve educational and financial independence."
              </p>
            </motion.div>
          </div>
        </Section>

        {/* ─── 5. LEARNING & NETWORKING ─────────────────────────────────── */}
        <Section id="networking">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center md:text-left"
            >
              LEARNING & NETWORKING
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Guided Education",
                  desc: "Transforming curiosity into competence through structured courses, live expert sessions, and hands-on business case studies.",
                },
                {
                  title: "Peer Networking",
                  desc: "Connecting you with like-minded learners, mentors, and industry leaders through exclusive workshops, seminars, and collaborative events.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.12}
                  className="p-10 bg-white/5 border border-white/10 rounded-2xl
                    transition-all duration-300 ease-out
                    hover:border-primary/40 hover:-translate-y-1.5"
                  style={{ willChange: "transform" }}
                >
                  <h3 className="text-2xl font-bold text-primary mb-4 uppercase">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 italic">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── 6. KNOWLEDGE PILLARS ─────────────────────────────────────── */}
        <Section id="knowledge">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-6xl font-bold mb-16 uppercase"
            >
              KNOWLEDGE PILLARS
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "DAILY INSIGHTS",
                  desc: "Curated learning content, market insights, and expert tips delivered consistently to keep members ahead.",
                },
                {
                  title: "SKILL CURRICULUM",
                  desc: "Learn from foundational business concepts to advanced digital strategies through structured modules.",
                },
                {
                  title: "FOCUSED MENTORSHIP",
                  desc: "Personalized guidance and 1-on-1 support from experienced mentors dedicated to your growth.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  className="p-8 bg-white/5 border border-white/10 rounded-2xl
                    transition-all duration-300 ease-out
                    hover:border-primary/50 hover:-translate-y-1"
                  style={{ willChange: "transform" }}
                >
                  <h3 className="text-xl font-bold mb-4 uppercase">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── 7. SKILL DEVELOPMENT ─────────────────────────────────────── */}
        <Section id="skills">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center md:text-right"
            >
              SKILL DEVELOPMENT
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Digital Marketing",
                  desc: "Master targeted strategies, social media, SEO, and analytics to build a powerful digital presence.",
                },
                {
                  title: "Business Strategy",
                  desc: "Learn frameworks that help identify opportunities, solve problems, and build scalable ventures.",
                },
                {
                  title: "Startup Fundamentals",
                  desc: "Gain end-to-end guidance on launching, managing, and scaling your own business from scratch.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  className="p-8 border border-white/10 rounded-2xl
                    transition-all duration-300 ease-out
                    hover:bg-white/5 hover:-translate-y-1"
                  style={{ willChange: "transform" }}
                >
                  <h3 className="text-xl font-bold text-primary mb-4 uppercase">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── 8. MEMBER BENEFITS ───────────────────────────────────────── */}
        <Section id="opportunities">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center"
            >
              MEMBER BENEFITS
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {[
                {
                  title: "Club Access",
                  desc: "Full access to all learning modules, live sessions, and current and future educational resources.",
                  icon: "🎓",
                },
                {
                  title: "Expert Meetups",
                  desc: "Regular interactive sessions with industry experts, educators, and successful entrepreneurs.",
                  icon: "🤝",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.12}
                  className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-4
            transition-all duration-300 ease-out
            hover:border-primary/40 hover:-translate-y-1.5"
                  style={{ willChange: "transform" }}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="text-2xl font-bold text-primary uppercase">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 italic leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── 9. ACHIEVEMENTS & REWARDS ────────────────────────────────── */}
        <Section id="rewards">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-6xl font-bold uppercase">
                ACHIEVEMENTS & REWARDS
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed">
                CLUB369 celebrates every milestone. High-achieving members earn
                recognition and exclusive rewards — including educational
                retreats, domestic and international study tours, luxury
                accommodations, and branded achievement gifts that honour their
                dedication to learning and growth.
              </p>
            </motion.div>

            {/* Entry uses opacity+y only — no scale jank */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: APPLE_EASE }}
              className="bg-primary/10 border border-primary/20 p-16 rounded-3xl text-center
                transition-transform duration-300 ease-out hover:-translate-y-1"
              style={{ willChange: "transform" }}
            >
              <span className="text-6xl" role="img" aria-label="Trophy">
                🏆
              </span>
              <p className="text-2xl font-bold mt-6 uppercase">
                Elite Achievers
              </p>
            </motion.div>
          </div>
        </Section>

        {/* ─── 10. OUR VENTURES ─────────────────────────────────────────── */}
        <Section id="ventures">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-8 uppercase text-center"
            >
              OUR VENTURES
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.08}
              className="text-gray-400 text-base sm:text-lg text-center max-w-3xl mx-auto mb-8 md:mb-12 lg:mb-16 px-4"
            >
              These real-world ventures serve as live case studies for our
              members. Understanding them from within teaches practical business
              management, operations, and scalability — learning by doing, not
              just by reading.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  name: "CUEPHORIA",
                  logo: cuephoriaLogo,
                  subtitle: "8-Ball Club Combined with Gaming",
                },
                {
                  name: "Aasife Biriyani",
                  logo: aasifeBiriyaniLogo,
                  subtitle: "Premium Biriyani Restaurant",
                },
                {
                  name: "Bamboo Garden",
                  logo: bambooGardenLogo,
                  subtitle: "Natural Dining Experience",
                },
                {
                  name: "TURF45",
                  logo: turf45Logo,
                  subtitle: "Football & Cricket Turf",
                },
                {
                  name: "SPORTIC",
                  logo: sporticLogo,
                  subtitle: "A Sport App for Enthusiasts",
                },
              ].map((venture, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  custom={i * 0.07}
                  className="group p-4 sm:p-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm flex flex-col items-center
                    transition-all duration-300 ease-out
                    hover:border-primary/50 hover:-translate-y-1"
                  style={{ willChange: "transform" }}
                >
                  {/* Circular logo — uniform size, object-cover fills evenly */}
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white overflow-hidden flex-shrink-0 mb-4 shadow-md ring-2 ring-white/10
                    transition-all duration-300 ease-out group-hover:ring-primary/40"
                  >
                    <img
                      src={venture.logo}
                      alt={venture.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      style={{ willChange: "transform" }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-1 uppercase text-center leading-tight">
                    {venture.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm text-center leading-relaxed">
                    {venture.subtitle}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── 10.5 UPCOMING VENTURES ───────────────────────────────────── */}
        <Section id="upcoming-ventures">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-8 uppercase text-center"
            >
              UPCOMING VENTURES
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.08}
              className="text-gray-400 text-base sm:text-lg text-center max-w-3xl mx-auto mb-8 md:mb-12 lg:mb-16 px-4"
            >
              Our upcoming ventures are designed with educational value in mind
              — each one offering members a chance to study a new industry,
              learn its operations, and contribute to its launch and growth.
            </motion.p>

            {/* Flex wrap — cards stay centered regardless of count */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
              {[
                { name: "Unisex Salon", logo: unisexLogo },
                { name: "Tea Shop", logo: teashopLogo },
                { name: "Goat Farm", logo: goatfarmLogo },
                { name: "Photography Studio", logo: photographyLogo },
                // { name: "Medical Store", logo: medicalLogo },
                { name: "Fireworks Factory", logo: fireworksLogo },
                { name: "Snooker & Sand Sports Club", logo: snookerLogo },
              ].map((venture, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  custom={i * 0.06}
                  className="group w-[calc(50%-6px)] sm:w-36 md:w-40 lg:w-44
            p-3 sm:p-4 md:p-5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm
            transition-all duration-300 ease-out
            hover:border-primary/50 hover:-translate-y-1"
                  style={{ willChange: "transform" }}
                >
                  <div className="aspect-square bg-white/10 rounded-lg sm:rounded-xl mb-2 sm:mb-3 overflow-hidden flex items-center justify-center p-2 sm:p-3 md:p-4">
                    <img
                      src={venture.logo}
                      alt={venture.name}
                      className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                      style={{ willChange: "transform" }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-center leading-tight px-1">
                    {venture.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── 11. LEARNING EXPERIENCE ──────────────────────────────────── */}
        <Section id="ux">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-6xl font-bold mb-12 uppercase"
            >
              LEARNING EXPERIENCE
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.12}
              className="text-2xl text-gray-400 font-light leading-relaxed"
            >
              CLUB369 is designed with learners in mind — offering a seamless
              and intuitive experience across all platforms. From easy access to
              courses, live classes, and venture opportunities, to personalised
              guidance and real-time progress tracking, every interaction is
              crafted to maximise knowledge, growth, and engagement.
            </motion.p>
          </div>
        </Section>

        {/* ─── 12. LEARNING JOURNEY ─────────────────────────────────────── */}
        <Section id="journey">
          <div className="max-w-5xl mx-auto px-6">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center"
            >
              YOUR LEARNING JOURNEY
            </motion.h2>
            <div className="space-y-12">
              {[
                {
                  title: "Foundation & Exploration",
                  desc: "Begin with structured fundamentals — live classes, curated resources, and expert guidance on business, digital marketing, and trading. Build a strong knowledge base at your own pace.",
                },
                {
                  title: "Application & Collaboration",
                  desc: "Apply knowledge through real-world projects, collaborate with peers, and engage with club ventures. Gain hands-on experience that transforms theory into practical insight.",
                },
                {
                  title: "Mastery & Leadership",
                  desc: "Lead initiatives, mentor newcomers, and launch your own ventures. CLUB369 empowers you to convert education into entrepreneurial success and lasting impact.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.12}
                  className="p-8 border-l-4 border-primary bg-white/5
                    transition-all duration-300 ease-out
                    hover:bg-white/[0.08] hover:translate-x-1.5"
                  style={{ marginLeft: `${i * 2}rem`, willChange: "transform" }}
                >
                  <h3 className="text-xl font-bold uppercase mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── 13. FUTURE DEVELOPMENTS ──────────────────────────────────── */}
        <Section id="future">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center"
            >
              FUTURE DEVELOPMENTS
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Global Learning Access",
                  desc: "We are expanding our educational reach globally — enhancing course offerings, partnering with international educators, and introducing new learning opportunities for all CLUB369 members.",
                },
                {
                  title: "AI-Powered Learning",
                  desc: "Incorporating AI-driven personalised learning paths, business analytics tools, and smart study assistants to help members learn more efficiently and make data-backed decisions with confidence.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.15}
                  className="p-12 bg-white/5 border border-white/10 rounded-3xl
                    transition-all duration-300 ease-out
                    hover:border-primary/40 hover:-translate-y-1"
                  style={{ willChange: "transform" }}
                >
                  <h3 className="text-2xl font-bold text-primary mb-6 uppercase">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── 14. OUR PROGRAMS ─────────────────────────────────────────── */}
        <Section id="projects">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center"
            >
              OUR PROGRAMS
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Franchise Education",
                "Digital Skills Academy",
                "E-Commerce Mastery",
                "Trading Fundamentals",
              ].map((p, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.08}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl text-center uppercase text-sm font-bold tracking-widest text-gray-500
                    transition-all duration-200 ease-out
                    hover:bg-primary/10 hover:text-primary hover:border-primary/40 hover:-translate-y-0.5"
                  style={{ willChange: "transform" }}
                >
                  {p}
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── 15. CTA ──────────────────────────────────────────────────── */}
        <motion.section
          id="contact-summary"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: APPLE_EASE }}
          className="py-24 md:py-32 bg-primary text-black relative overflow-hidden"
          style={{ contain: "layout style paint" }}
        >
          {/* Pure CSS dot pattern — zero JS, zero animation, zero GPU cost */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, black 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold mb-8 uppercase tracking-tighter"
            >
              Begin Your Education Today
            </motion.h2>
            <motion.p
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.12}
              className="text-xl md:text-2xl mb-12 opacity-80"
            >
              Join the exclusive community of 369 learners and transform your
              knowledge into entrepreneurial reality.
            </motion.p>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.22}
            >
              <Link
                to="/contact"
                className="inline-block bg-black text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-lg shadow-2xl
                  transition-transform duration-200 ease-out
                  hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                style={{ willChange: "transform" }}
              >
                Get In Touch
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
