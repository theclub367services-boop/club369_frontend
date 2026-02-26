import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

// ─── Apple-tuned spring configs ───────────────────────────────────────────────
// Mirrors UISpringTimingParameters "interactive" preset
const APPLE_SPRING = { stiffness: 380, damping: 38, mass: 1 };
const CARD_SPRING = { stiffness: 120, damping: 22, mass: 1 };

// ─── Shared variants ──────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    // Apple's exact CoreAnimation easeInEaseOut cubic
    transition: { duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

// ─── FloatingCard: GPU-composited pointer-tilt via motion values ───────────────
// Zero React re-renders per frame — all math stays on the compositor thread
const FloatingCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring smoothing — soft feel matching Apple trackpad feedback
  const x = useSpring(rawX, CARD_SPRING);
  const y = useSpring(rawY, CARD_SPRING);

  useEffect(() => {
    let raf: number;
    let lx = 0,
      ly = 0;

    const onMove = (e: PointerEvent) => {
      lx = ((e.clientX - window.innerWidth / 2) / 90) * 1.5;
      ly = ((e.clientY - window.innerHeight / 2) / 90) * 1.5;
    };

    const tick = () => {
      rawX.set(lx);
      rawY.set(ly);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [rawX, rawY]);

  return (
    <motion.div
      style={{ x, y, translateZ: 0 }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ─── InputField ───────────────────────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  delay?: number;
  children?: React.ReactNode; // for password toggle slot
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  delay = 0,
  children,
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    custom={delay}
    className="space-y-1"
  >
    <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">
      {label}
    </label>
    <div className="relative group/input">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl
                   py-3 px-4 text-white placeholder:text-white/20
                   focus:border-primary focus:outline-none
                   focus:ring-1 focus:ring-primary/40
                   transition-colors duration-200
                   [-webkit-font-smoothing:antialiased]"
      />
      {children}
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoUrl = "/images/cloud369.png";

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      try {
        await register({ ...formData, profilePicture: profilePic });
        navigate("/payment");
      } catch {
        setError("Registration failed. Please try again.");
      }
    },
    [formData, profilePic, register, navigate],
  );

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center font-display selection:bg-primary selection:text-white py-12">
      {/* ── Background blobs — promoted to GPU layers via translateZ ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[500px] h-[500px] bg-primary/8 rounded-full blur-[130px]"
          style={{ transform: "translateZ(0) translate(-50%, -50%)" }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-[380px] h-[380px]
                     bg-purple-900/8 rounded-full blur-[100px]"
          style={{ transform: "translateZ(0)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px]
                     bg-blue-900/6 rounded-full blur-[90px]"
          style={{ transform: "translateZ(0)" }}
        />
      </div>

      {/* ── Card wrapper ── */}
      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Entry animation wraps FloatingCard so drift starts from resting position */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <FloatingCard>
            <div
              className="bg-[#161118]/80 backdrop-blur-xl border border-white/10
                         rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden
                         hover:border-white/20 transition-colors duration-300"
            >
              {/* Inner corner glows — static, own GPU layer */}
              <div
                className="absolute top-0 right-0 w-48 h-48 bg-primary/6 rounded-full blur-3xl pointer-events-none"
                style={{ transform: "translateZ(0)" }}
              />
              <div
                className="absolute bottom-0 left-0 w-48 h-48 bg-purple-900/6 rounded-full blur-3xl pointer-events-none"
                style={{ transform: "translateZ(0)" }}
              />

              {/* ── Header ── */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-center mb-8 flex flex-col items-center relative z-10"
              >
                <motion.div
                  className="mb-4 drop-shadow-[0_0_10px_rgba(175,37,244,0.4)] will-change-transform"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", ...APPLE_SPRING, delay: 0.05 }}
                  style={{ translateZ: 0 }}
                >
                  <img
                    src={logoUrl}
                    alt="CLUB369 Logo"
                    className="h-16 w-auto"
                  />
                </motion.div>

                <h1 className="text-2xl font-bold tracking-[0.2em] text-white mb-2 [-webkit-font-smoothing:antialiased]">
                  JOIN CLUB369
                </h1>
                <p className="text-gray-500 text-xs uppercase tracking-widest [-webkit-font-smoothing:antialiased]">
                  Begin your learning journey
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", ...APPLE_SPRING }}
                    className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20
                               rounded-lg text-red-500 text-[10px] font-bold uppercase tracking-widest"
                    style={{ translateZ: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>

              {/* ── Avatar upload ── */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.1}
                className="flex justify-center mb-8 relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={APPLE_SPRING}
                  className="relative cursor-pointer will-change-transform"
                  style={{ translateZ: 0 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div
                    className="w-24 h-24 rounded-full border-2 border-dashed border-white/20
                                  flex items-center justify-center overflow-hidden bg-white/5
                                  hover:border-primary/50 transition-colors duration-200"
                  >
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="material-symbols-outlined text-3xl text-white/20
                                       group-hover:text-primary/50 transition-colors duration-200"
                      >
                        add_a_photo
                      </span>
                    )}
                  </div>

                  <motion.div
                    className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 shadow-lg will-change-transform"
                    whileHover={{ scale: 1.15 }}
                    transition={APPLE_SPRING}
                    style={{ translateZ: 0 }}
                  >
                    <span className="material-symbols-outlined text-white text-xs">
                      edit
                    </span>
                  </motion.div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </motion.div>
              </motion.div>

              {/* ── Form ── */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 relative z-10"
              >
                {/* Name + Email row */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0.15}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl
                                 py-3 px-4 text-white placeholder:text-white/20
                                 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40
                                 transition-colors duration-200 [-webkit-font-smoothing:antialiased]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl
                                 py-3 px-4 text-white placeholder:text-white/20
                                 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40
                                 transition-colors duration-200 [-webkit-font-smoothing:antialiased]"
                    />
                  </div>
                </motion.div>

                {/* Phone */}
                <InputField
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 99999 99999"
                  required
                  delay={0.2}
                />

                {/* Password */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0.25}
                  className="space-y-1"
                >
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">
                    Create Password
                  </label>
                  <div className="relative group/input">
                    <span
                      className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2
                                     text-white/40 group-focus-within/input:text-primary
                                     transition-colors duration-200 text-[20px] pointer-events-none"
                    >
                      lock
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl
                                 py-3.5 pl-12 pr-12 text-white placeholder:text-white/20
                                 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none
                                 transition-colors duration-200 [-webkit-font-smoothing:antialiased]"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      transition={APPLE_SPRING}
                      className="absolute right-4 inset-y-0 my-auto h-fit
                                 text-white/40 hover:text-white transition-colors duration-200
                                 focus:outline-none will-change-transform flex items-center"
                      style={{ translateZ: 0 }}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>

                <motion.p
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0.28}
                  className="text-xs text-gray-500 [-webkit-font-smoothing:antialiased]"
                >
                  Please upload your profile picture to complete registration
                  without errors.
                </motion.p>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={authLoading}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0.3}
                  whileHover={{ scale: 1.025, y: -2 }}
                  whileTap={{ scale: 0.975 }}
                  transition={APPLE_SPRING}
                  className="mt-2 w-full bg-white text-black hover:bg-primary hover:text-white
                             font-bold tracking-widest uppercase rounded-xl py-4
                             transition-colors duration-200 shadow-lg
                             flex items-center justify-center gap-2
                             hover:shadow-[0_0_40px_rgba(175,37,244,0.45)]
                             disabled:opacity-60 disabled:cursor-not-allowed
                             will-change-transform
                             [-webkit-font-smoothing:antialiased]"
                  style={{ translateZ: 0 }}
                >
                  {authLoading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="material-symbols-outlined text-[18px] will-change-transform"
                        style={{ translateZ: 0 }}
                      >
                        progress_activity
                      </motion.span>
                      Creating Account…
                    </>
                  ) : (
                    "Enrol Now"
                  )}
                </motion.button>
              </form>

              {/* ── Footer links ── */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.35}
                className="mt-8 text-center flex flex-col gap-3 relative z-10"
              >
                <Link
                  to="/login"
                  className="text-xs text-gray-500 hover:text-white transition-colors duration-200
                             [-webkit-font-smoothing:antialiased]"
                >
                  Already a member?{" "}
                  <span className="text-primary font-bold">Sign In</span>
                </Link>
                <Link
                  to="/"
                  className="text-[10px] text-gray-600 hover:text-white transition-colors duration-200
                             uppercase tracking-widest [-webkit-font-smoothing:antialiased]"
                >
                  Back to Home
                </Link>
              </motion.div>
            </div>
          </FloatingCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
