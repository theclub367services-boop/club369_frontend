import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoUrl = "/images/cloud369.png";

  // Throttled mouse handler — rAF prevents excessive updates
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ ...formData, profilePicture: profilePic });
      navigate("/payment");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center font-display selection:bg-primary selection:text-white py-12">
      {/* Static background blobs — no looping animations, no particles */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-purple-900/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-blue-900/6 rounded-full blur-[90px]" />
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-lg px-6">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          // Subtle mouse card drift — CSS transform, not Framer state binding
          style={{
            transform: `translate(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px)`,
            transition: "box-shadow 0.3s",
          }}
          className="bg-[#161118]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden hover:border-white/20 transition-colors duration-300"
        >
          {/* Static inner glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-900/6 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center mb-8 flex flex-col items-center relative z-10"
          >
            <div className="mb-4 drop-shadow-[0_0_10px_rgba(175,37,244,0.4)]">
              <img src={logoUrl} alt="CLUB369 Logo" className="h-16 w-auto" />
            </div>

            <h1 className="text-2xl font-bold tracking-[0.2em] text-white mb-2">
              JOIN CLUB369
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Begin your learning journey
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-bold uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Profile Picture Upload */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="flex justify-center mb-8 relative z-10"
          >
            <div
              className="relative group cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-white/5 group-hover:border-primary/50 transition-colors duration-200">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-3xl text-white/20 group-hover:text-primary/50 transition-colors duration-200">
                    add_a_photo
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 shadow-lg">
                <span className="material-symbols-outlined text-white text-xs">
                  edit
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </motion.div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 relative z-10"
          >
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.15}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors duration-200"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors duration-200"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="space-y-1"
            >
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 99999 99999"
                className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors duration-200"
                required
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.25}
              className="space-y-1"
            >
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Create Password
              </label>
              <div className="relative group/input">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-primary transition-colors duration-200 text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-200 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </motion.div>

            <p className="text-xs text-gray-500">
              Please upload your profile picture to complete registration
              without errors.
            </p>

            <motion.button
              type="submit"
              disabled={authLoading}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full bg-white text-black hover:bg-primary hover:text-white font-bold tracking-widest uppercase rounded-xl py-4 transition-colors duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              {authLoading ? "Creating Account..." : "Enrol Now"}
            </motion.button>
          </form>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.35}
            className="mt-8 text-center flex flex-col gap-3 relative z-10"
          >
            <Link
              to="/login"
              className="text-xs text-gray-500 hover:text-white transition-colors duration-200"
            >
              Already a member?{" "}
              <span className="text-primary font-bold">Sign In</span>
            </Link>
            <Link
              to="/"
              className="text-[10px] text-gray-600 hover:text-white transition-colors duration-200 uppercase tracking-widest"
            >
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;