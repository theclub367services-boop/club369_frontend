import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useMembership } from "../../hooks/useMembership";
import Profile from "../shared/Profile";
import RenewButton from "../../components/membership/RenewButton";
import VentureSection from "../../components/vouchers/VentureSection";
import { getFullUrl } from "../../utils/url";
import { formatDate } from "../../utils/date";
import { PaymentService } from "../../services/PaymentService";
import LoadingScreen from "../../components/layout/Loadingscreen";

// ─── Apple-tuned constants ────────────────────────────────────────────────────
const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const;
const APPLE_SPRING = { stiffness: 380, damping: 38, mass: 1 } as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.46, ease: APPLE_EASE, delay },
  }),
};

// ─── Nav items ────────────────────────────────────────────────────────────────
// Removed static NAV_ITEMS to use dynamic navItems based on user status

// ─── Vault items ──────────────────────────────────────────────────────────────
const VAULT_ITEMS = [
  {
    title: "Trading Signals",
    desc: "Real-time market insights",
    icon: "monitoring",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Business Strategy",
    desc: "Scale your ventures",
    icon: "business_center",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Member Meetups",
    desc: "Global networking events",
    icon: "groups",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Alpha Library",
    desc: "Curated investment docs",
    icon: "menu_book",
    color: "bg-orange-500/10 text-orange-500",
  },
];

// ─── VaultCard — GPU-composited hover, zero layout triggers ──────────────────
const VaultCard: React.FC<{ item: (typeof VAULT_ITEMS)[0]; delay: number }> = ({
  item,
  delay,
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    custom={delay}
    whileHover={{ y: -5 }}
    transition={APPLE_SPRING}
    className="p-6 bg-[#161118] border border-white/5 rounded-2xl
               hover:border-primary/30 transition-colors duration-300
               will-change-transform"
    style={{ translateZ: 0 } as React.CSSProperties}
  >
    <span
      className={`material-symbols-outlined p-3 rounded-xl ${item.color} mb-4 block w-fit`}
    >
      {item.icon}
    </span>
    <h4 className="font-bold text-white mb-1 [-webkit-font-smoothing:antialiased]">
      {item.title}
    </h4>
    <p className="text-xs text-gray-500 [-webkit-font-smoothing:antialiased]">
      {item.desc}
    </p>
  </motion.div>
);

// ─── Progress bar — spring-driven width, single compositor pass ──────────────
const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => {
  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { stiffness: 60, damping: 22, mass: 1 });

  useEffect(() => {
    raw.set(percent);
  }, [percent, raw]);

  return (
    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div
        style={{ scaleX: smooth, originX: 0, translateZ: 0 }}
        className="h-full w-full bg-gradient-to-r from-primary via-purple-500 to-blue-500
                   will-change-transform"
      />
    </div>
  );
};

// ─── Overview ─────────────────────────────────────────────────────────────────
const Overview: React.FC<{
  user: any;
  details: any;
  transactions: any[];
  daysRemaining: number;
  progressPercent: number;
  onEnableAutoPay: () => void;
  onCancelAutoPay: () => void;
  setIsPaymentLoading: (loading: boolean) => void;
}> = ({ user, details, daysRemaining, progressPercent, onEnableAutoPay, onCancelAutoPay, setIsPaymentLoading }) => (
  <div className="space-y-12">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Subscription card */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="lg:col-span-2 bg-gradient-to-br from-[#161118] to-[#0f0a12]
                   border border-white/10 p-8 rounded-3xl relative overflow-hidden
                   flex flex-col justify-between h-full group
                   hover:border-white/20 transition-colors duration-300"
      >
        {/* Corner glow — opacity only on hover */}
        <div
          className="absolute top-0 right-0 w-48 h-48 bg-primary/6 rounded-full blur-3xl
                     opacity-100 group-hover:opacity-[1.8] transition-opacity duration-500"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        />

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <div
              className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1
                            [-webkit-font-smoothing:antialiased]"
            >
              Status
            </div>
            <div className="flex items-center gap-3">
              <h4 className="text-2xl font-bold [-webkit-font-smoothing:antialiased]">
                Member Account
              </h4>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold border rounded-full uppercase
                               [-webkit-font-smoothing:antialiased]
                               ${details?.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}
              >
                {details?.status || "INACTIVE"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1
                            [-webkit-font-smoothing:antialiased]"
            >
              Next Billing
            </div>
            <div className="text-xl font-bold [-webkit-font-smoothing:antialiased]">
              {details?.status === 'EXPIRED' ? 'N/A' : details?.nextBillingDate ? new Date(details.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
            </div>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
            <span className="text-gray-400">Cycle Progress</span>
            <span className="text-primary">{daysRemaining} Days Left</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary via-purple-500 to-blue-500"
            />
          </div>

          {details?.autopayStatus === 'active' ? (
            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between items-center bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">AutoPay Active</span>
                <button
                  onClick={onCancelAutoPay}
                  className="text-[10px] uppercase font-bold text-red-400 hover:text-red-300 transition-colors"
                >
                  Cancel AutoPay
                </button>
              </div>
              <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">Manual renewals disabled</p>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="relative w-full">
                {details?.status !== 'ACTIVE' && (
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">choose any one option (AutoPay or Manual Renewal)</span>
                )}
                <button
                  onClick={onEnableAutoPay}
                  disabled={details?.status === 'ACTIVE'}
                  className={`peer w-full py-3 rounded-xl border text-xs tracking-widest uppercase font-bold transition-all flex items-center justify-center gap-2
                    ${details?.status === 'ACTIVE'
                      ? 'bg-gray-500/10 border-white/5 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border-primary/30 hover:from-primary/30 hover:to-purple-500/30'
                    }`}
                >
                  <span className="material-symbols-outlined text-sm">autorenew</span>
                  Enable AutoPay
                </button>
                {details?.status === 'ACTIVE' && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black border border-white/10 rounded-lg text-[10px] text-gray-400 opacity-0 peer-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Try enabling next membership payment. You can't enable it in the middle of an active membership.
                  </div>
                )}
              </div>

              <RenewButton
                status={details?.status || 'INACTIVE'}
                expiryDate={details?.expiryDate || ''}
                amount={5000}
                email={user?.email || ''}
                name={user?.name || ''}
                mobile={user?.mobile || ''}
                setIsPaymentLoading={setIsPaymentLoading}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Contact card */}
      <motion.a
        href="mailto:theclub369.services@gmail.com"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
        whileHover={{ y: -4 }}
        transition={APPLE_SPRING}
        className="bg-[#161118] border border-white/10 p-8 rounded-3xl
                   flex flex-col items-center justify-center gap-6 group
                   hover:border-primary/30 transition-colors duration-300 cursor-pointer
                   will-change-transform"
        style={{ translateZ: 0 } as React.CSSProperties}
      >
        <motion.div
          whileHover={{ scale: 1.12 }}
          transition={APPLE_SPRING}
          className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center
                     will-change-transform"
          style={{ translateZ: 0 } as React.CSSProperties}
        >
          <span className="material-symbols-outlined text-primary text-3xl">
            mail
          </span>
        </motion.div>
        <div className="text-center">
          <h5
            className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1
                         [-webkit-font-smoothing:antialiased]"
          >
            Contact Admin
          </h5>
          <p className="text-lg font-bold text-white [-webkit-font-smoothing:antialiased]">
            theclub369.services@gmail.com
          </p>
        </div>
        <div
          className="text-[10px] uppercase font-bold text-primary tracking-[0.2em]
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        [-webkit-font-smoothing:antialiased]"
        >
          Click to Email
        </div>
      </motion.a>
    </div>

    {/* Vault */}
    <section>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.18}
        className="flex justify-between items-center mb-6"
      >
        <h3
          className="text-xl font-bold flex items-center gap-2 text-white
                       [-webkit-font-smoothing:antialiased]"
        >
          <span className="material-symbols-outlined text-primary">
            diamond
          </span>
          Ecosystem Vault
        </h3>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {VAULT_ITEMS.map((item, i) => (
          <VaultCard key={i} item={item} delay={0.24 + i * 0.06} />
        ))}
      </div>
    </section>
  </div>
);

// ─── Ventures (Replaces Vouchers) ──────────────────────────────────────────────

// ─── TransactionLedger ────────────────────────────────────────────────────────
const TransactionLedger: React.FC<{ transactions: any[] }> = ({
  transactions,
}) => (
  <div className="space-y-8">
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2"
    >
      <h3
        className="text-2xl font-bold text-white uppercase tracking-tight
                     [-webkit-font-smoothing:antialiased]"
      >
        Payment History
      </h3>
      <p className="text-gray-500 text-sm [-webkit-font-smoothing:antialiased]">
        Comprehensive record of your subscription payments.
      </p>
    </motion.div>

    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={0.08}
      className="bg-[#161118] border border-white/10 rounded-3xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
              {["Billing Date", "Amount", "Status"].map((h, i) => (
                <th
                  key={i}
                  className={`p-5 [-webkit-font-smoothing:antialiased] ${i === 2 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.map((txn, i) => (
              <motion.tr
                key={txn.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.06 + i * 0.04}
                className="border-t border-white/5 hover:bg-white/[0.025]
                           transition-colors duration-200 text-white"
              >
                <td className="p-5 text-gray-400 [-webkit-font-smoothing:antialiased]">
                  {formatDate(txn.date)}
                </td>
                <td className="p-5 font-bold [-webkit-font-smoothing:antialiased]">
                  ₹ {txn.amount.toLocaleString()}
                </td>
                <td className="p-5 text-right">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase
                                   [-webkit-font-smoothing:antialiased]
                                   ${txn.status === "success"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-red-500/10 text-red-500"
                      }`}
                  >
                    {txn.status === "success" ? "PAID" : txn.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { details, ventures, transactions, isLoading, redeemVoucher, enableAutoPay, cancelAutoPay } =
    useMembership();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);

  const handleEnableAutoPay = useCallback(async () => {
    setIsPaymentLoading(true);
    try {
      const res = await enableAutoPay();
      // Since api.ts strips the outer response and returns .data, we just need to check if subscription_id exists
      if (res && res.subscription_id) {
        PaymentService.handleAutoPay(res.subscription_id, res.key_id, {
          onSuccess: () => {
            alert("AutoPay enabled successfully!");
            window.location.reload();
          },
          onDismiss: () => {
            setErrorModal({ title: "Payment Cancelled", message: "Payment process was cancelled." });
            setIsPaymentLoading(false);
            // We probably shouldn't reload on cancel, or we can just leave it up to the user
            // window.location.reload();
          },
          onError: (error) => {
            setErrorModal({ title: "AutoPay Error", message: "Error setting up AutoPay: " + (error.description || error.message || String(error)) });
            setIsPaymentLoading(false);
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.mobile,
          }
        });
      } else {
        setIsPaymentLoading(false);
      }
    } catch (err: any) {
      setErrorModal({ title: "Setup Failed", message: err.message || err.errors?.error || "Failed to start AutoPay setup." });
      setIsPaymentLoading(false);
    }
  }, [enableAutoPay, user]);

  const handleCancelAutoPay = useCallback(async () => {
    if (window.confirm("Are you sure you want to cancel your AutoPay subscription? This will stop automatic future renewals.")) {
      setIsPaymentLoading(true);
      try {
        await cancelAutoPay();
        alert("AutoPay subscription cancelled.");
        window.location.reload();
      } catch (err: any) {
        setErrorModal({ title: "Cancellation Failed", message: err.message || err.errors?.error || "Failed to cancel AutoPay." });
        setIsPaymentLoading(false);
      }
    }
  }, [cancelAutoPay]);

  const handleLogout = useCallback(async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/login");
    }
  }, [logout, navigate]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div
            className="flex items-center gap-3 text-white/50 font-bold tracking-widest uppercase text-xs
                       [-webkit-font-smoothing:antialiased]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.span
              className="material-symbols-outlined will-change-transform"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ translateZ: 0 } as React.CSSProperties}
            >
              progress_activity
            </motion.span>
            Initializing Dashboard…
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const today = new Date();
  const expiry = details ? new Date(details.expiryDate) : today;
  const start = details?.startDate ? new Date(details.startDate) : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.max(0, Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const totalCycleDays = Math.max(1, Math.ceil((expiry.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercent = details ? Math.min(100, ((totalCycleDays - daysRemaining) / totalCycleDays) * 100) : 0;

  const isUserInactive = user?.status === 'PENDING' || details?.status === 'INACTIVE' || details?.status === 'EXPIRED';

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: 'grid_view' },
    { label: 'Profile', path: '/dashboard/profile', icon: 'account_circle' },
    ...(!isUserInactive ? [{ label: 'Vouchers', path: '/dashboard/vouchers', icon: 'confirmation_number' }] : []),
    { label: 'Payments', path: '/dashboard/payments', icon: 'payments' },
  ];

  return (
    <>
      <LoadingScreen
        isLoading={isPaymentLoading}
        label="Processing Payment..."
        fadeIn={true}
        showDots={true}
      />
      <DashboardLayout>
        {/* ── Header ── */}
        <motion.header
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: APPLE_EASE }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", ...APPLE_SPRING, delay: 0.08 }}
              className="w-12 h-12 rounded-full border-2 border-primary/20 overflow-hidden
                       bg-primary/10 flex items-center justify-center shrink-0
                       will-change-transform"
              style={{ translateZ: 0 } as React.CSSProperties}
            >
              {user?.profile_picture ? (
                <img
                  src={getFullUrl(user.profile_picture) || ""}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <span className="material-symbols-outlined text-2xl text-primary/40">
                  person
                </span>
              )}
            </motion.div>

            <div className="space-y-1">
              <h2
                className="text-3xl font-black tracking-tight text-white
                           [-webkit-font-smoothing:antialiased]"
              >
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                  {user?.name || "Member"}.
                </span>
              </h2>
              {/* <p
              className="text-gray-400 text-sm flex items-center gap-2
                          [-webkit-font-smoothing:antialiased]"
            >
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                style={{ transform: "translateZ(0)" }}
              />
              Member ID: {user?.id ? String(user.id).slice(0, 8) : "N/A"}
            </p> */}
            </div>
          </div>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={APPLE_SPRING}
            className="px-6 py-2.5 bg-red-600/10 border border-red-600/20 text-red-500
                     text-xs font-bold uppercase tracking-widest rounded-xl
                     hover:bg-red-600 hover:text-white
                     transition-colors duration-200
                     flex items-center gap-2
                     will-change-transform
                     [-webkit-font-smoothing:antialiased]"
            style={{ translateZ: 0 } as React.CSSProperties}
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </motion.button>
        </motion.header>

        {/* ── Sub-nav ── */}
        <nav className="flex gap-1 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {navItems.map((item, i) => {
            const active = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, ease: APPLE_EASE, delay: i * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold
                            uppercase tracking-widest transition-colors duration-200
                            [-webkit-font-smoothing:antialiased]
                            ${active
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* ── Route views — y-only transitions, no scale ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: APPLE_EASE }}
            style={{ willChange: "opacity, transform" }}
          >
            <Routes location={location}>
              <Route
                index
                element={
                  <Overview
                    user={user}
                    details={details}
                    transactions={transactions}
                    daysRemaining={daysRemaining}
                    progressPercent={progressPercent}
                    onEnableAutoPay={handleEnableAutoPay}
                    onCancelAutoPay={handleCancelAutoPay}
                    setIsPaymentLoading={setIsPaymentLoading}
                  />
                }
              />
              <Route path="profile" element={<Profile />} />
              {!isUserInactive && (
                <Route
                  path="vouchers"
                  element={
                    <VentureSection
                      user={user}
                      membershipStatus={details?.status || "INACTIVE"}
                      ventures={ventures}
                      onRedeem={redeemVoucher}
                    />
                  }
                />
              )}
              <Route
                path="payments"
                element={<TransactionLedger transactions={transactions} />}
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>

      {/* Error modal */}
      <ErrorModal
        visible={!!errorModal}
        title={errorModal?.title}
        message={errorModal?.message ?? ""}
        onClose={() => setErrorModal(null)}
      />
    </>
  );
};

// ─── ErrorModal ───────────────────────────────────────────────────────────────
const ErrorModal: React.FC<{
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}> = ({ visible, title = "Error", message, onClose }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key="error-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: APPLE_EASE }}
        className="fixed inset-0 z-[9998] flex items-center justify-center px-6 bg-black/70 backdrop-blur-md"
        style={{ willChange: "opacity" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.38, ease: APPLE_EASE, delay: 0.06 }}
          className="relative w-full max-w-sm bg-[#161118] border border-white/10
                     rounded-3xl p-8 shadow-2xl overflow-hidden text-center will-change-transform"
          style={{ translateZ: 0 } as React.CSSProperties}
        >
          {/* Red ambient glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[260px] h-[160px]
                          bg-red-500/12 rounded-full blur-[60px] pointer-events-none"
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />
          <div
            className="absolute bottom-0 right-0 w-40 h-40 bg-red-900/8 rounded-full blur-3xl pointer-events-none"
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />

          {/* Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 340, damping: 28, delay: 0.18 }}
            className="relative z-10 mx-auto mb-6 w-20 h-20 rounded-full
                       bg-red-500/15 border border-red-500/30
                       flex items-center justify-center will-change-transform"
            style={{ translateZ: 0 } as React.CSSProperties}
          >
            <motion.div
              className="absolute inset-0 rounded-full border border-red-500/25 will-change-transform"
              animate={{ opacity: [0.8, 0], scale: [1, 1.55] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              style={{ translateZ: 0 } as React.CSSProperties}
            />
            <motion.span
              className="material-symbols-outlined text-4xl text-red-400"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: APPLE_EASE, delay: 0.32 }}
            >
              error
            </motion.span>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: APPLE_EASE, delay: 0.28 }}
            className="relative z-10 space-y-2 mb-8"
          >
            <h2 className="text-2xl font-bold text-white tracking-tight [-webkit-font-smoothing:antialiased]">
              {title}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed [-webkit-font-smoothing:antialiased]">
              {message}
            </p>
          </motion.div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: APPLE_EASE, delay: 0.38 }}
            className="relative z-10 flex gap-3"
          >
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.975 }}
              className="flex-1 bg-white text-black hover:bg-primary hover:text-white
                         font-bold tracking-widest uppercase rounded-xl py-3.5
                         transition-colors duration-200 shadow-lg
                         hover:shadow-[0_0_30px_rgba(175,37,244,0.35)]
                         flex items-center justify-center gap-1.5
                         will-change-transform [-webkit-font-smoothing:antialiased]"
              style={{ translateZ: 0 } as React.CSSProperties}
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Try Again
            </motion.button>
          </motion.div>

          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-red-500/15 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-red-500/15 rounded-br-3xl" />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Dashboard;