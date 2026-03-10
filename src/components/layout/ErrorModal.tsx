import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const;

interface ErrorModalProps {
    visible: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ visible, title = "Error", message, onClose }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                key="error-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: APPLE_EASE }}
                className="fixed inset-0 z-[9999] flex items-center justify-center px-6 bg-black/70 backdrop-blur-md"
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

export default ErrorModal;
