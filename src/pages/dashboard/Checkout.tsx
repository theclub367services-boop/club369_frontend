import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { PaymentService } from "../../services/PaymentService";
import { useAuth } from "../../context/AuthContext";

// Shared variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay },
  }),
};

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect active members to dashboard
  useEffect(() => {
    if (user?.membership_status === "ACTIVE") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // 3D Card tilt — kept because it's the hero interaction of this page
  // Using low stiffness spring so it's silky, not janky
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 40, damping: 18 });
  const mouseY = useSpring(y, { stiffness: 40, damping: 18 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  const handleCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [x, y]
  );
  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handlePayment = async () => {
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
            alert("Payment Verified & Enrolment Activated!");
            navigate("/dashboard");
          }
          setIsLoading(false);
        },
        onDismiss: () => setIsLoading(false),
        onError: (error: any) => {
          console.error("Payment Error:", error);
          alert(error.message || "Could not connect to payment gateway.");
          setIsLoading(false);
        },
      });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-display text-white flex flex-col selection:bg-primary selection:text-white overflow-hidden relative">
      <Navbar />

      {/* Static background — no looping animations, no particles */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-900/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-[350px] h-[350px] bg-blue-900/6 rounded-full blur-[90px]" />
      </div>

      {/* Static decorative 369 — no y-float loop */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-9xl font-bold text-primary/[0.04] pointer-events-none select-none">
        369
      </div>

      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh] p-6 pt-32 flex-grow relative z-10">

        {/* ─── LEFT: Summary ────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl font-bold"
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
            className="text-gray-400 text-lg"
          >
            Activate your educational membership through our secure gateway and
            unlock full access to all CLUB369 programs, sessions, and resources
            for the next 30 days.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="bg-[#161118] border border-white/10 rounded-xl p-6 space-y-5 relative overflow-hidden hover:border-primary/30 transition-colors duration-300 group"
          >
            {/* Static corner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/8 rounded-full blur-2xl group-hover:bg-primary/15 transition-colors duration-500" />

            {/* Plan details */}
            <div className="space-y-3 relative z-10 border-b border-white/5 pb-4">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Enrolment Plan</span>
                <span className="text-white font-bold">
                  Educational Membership (Monthly)
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Billing Cycle</span>
                <span className="text-white">Every 30 Days</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4 relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                What's Included
              </p>
              {[
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
                {
                  icon: "health_and_safety",
                  title: "Medical Coverage",
                  desc: "Health insurance for your health will be covered.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0.3 + i * 0.08}
                  className="flex items-start gap-3"
                >
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                    {item.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase tracking-tight">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight">
                      {item.desc}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="h-px bg-white/10 my-2 relative z-10" />

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.55}
              className="flex justify-between items-center text-xl font-bold relative z-10"
            >
              <span className="text-sm text-gray-400 font-medium">
                Monthly Fee
              </span>
              <span className="text-white">₹ 4,999</span>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── RIGHT: Payment Card with 3D Tilt ─────────────────────── */}
        <div className="flex justify-center" style={{ perspective: "1000px" }}>
          <motion.div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full max-w-md"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          >
            {/* Glow border — static opacity, no looping pulse */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-25" />

            <div className="relative bg-[#161118] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col gap-8">
              {/* Static inner blobs */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/8 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-900/8 rounded-full blur-3xl" />

              {/* Shine effect — CSS only on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/4 to-transparent opacity-60 pointer-events-none" />

              {/* Card header */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.4}
                className="flex justify-between items-center relative z-10"
              >
                <span className="material-symbols-outlined text-4xl text-white">
                  school
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold bg-primary/20 text-primary px-3 py-1 rounded-full uppercase mb-1">
                    Enrolment
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase">
                    Secure Gateway
                  </span>
                </div>
              </motion.div>

              {/* Amount */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.5}
                className="space-y-1 relative z-10"
              >
                <div className="text-gray-500 text-xs uppercase font-bold">
                  Monthly Tuition
                </div>
                <div className="text-4xl font-bold text-white">
                  ₹ 4,999
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
                custom={0.6}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white hover:bg-gray-200 text-black font-bold text-lg py-4 px-6 rounded-xl shadow-lg transition-colors duration-200 flex justify-center items-center gap-2 relative z-10 overflow-hidden"
              >
                {/* CSS-only shine */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />

                {isLoading ? (
                  <>
                    <motion.span
                      className="material-symbols-outlined"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      progress_activity
                    </motion.span>
                    <span className="relative z-10">Processing...</span>
                  </>
                ) : (
                  <span className="relative z-10 flex items-center gap-2">
                    Activate Membership
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                )}
              </motion.button>

              {/* Security note */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.7}
                className="flex justify-center items-center gap-2 text-gray-600 text-xs relative z-10"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                256-bit Encrypted Transaction
              </motion.div>

              {/* Static corner decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-3xl" />
            </div>
          </motion.div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Checkout;