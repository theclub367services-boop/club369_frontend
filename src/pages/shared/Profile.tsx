import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/AuthService';
import { getFullUrl } from '../../utils/url';
import { formatDate } from '../../utils/date';

const APPLE_EASE = [0.25, 0.1, 0.25, 1] as const;

const Profile: React.FC = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        mobile: user?.mobile || '',
    });
    const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
    const [profilePic, setProfilePic] = useState<string | null>(user?.profile_picture || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                setErrorModal({ title: "File Too Large", message: "File size exceeds 1MB limit" });
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            // 1. If new file selected, handle Cloudinary upload
            if (selectedFile) {
                // Get signed upload config
                const signatureData = await AuthService.getUploadSignature();

                // Upload to Cloudinary
                const cloudinaryResponse = await AuthService.uploadToCloudinary(selectedFile, signatureData);

                // Save to backend
                await AuthService.saveProfilePic(
                    cloudinaryResponse.secure_url,
                    cloudinaryResponse.public_id
                );
            }

            // 2. Update other profile data
            const updateData: any = {
                name: formData.name,
                mobile: formData.mobile,
            };

            await updateProfile(updateData);

            alert('Profile updated successfully!');
            setIsEditing(false);
            setSelectedFile(null);
        } catch (err: any) {
            console.error("Save error:", err);
            const raw = err?.response?.data ?? err?.data ?? err;
            const backendMsg = raw?.detail || raw?.message || raw?.errors?.detail || (typeof raw === 'string' ? raw : null);
            setErrorModal({
                title: "Update Failed",
                message: backendMsg || err.message || 'Failed to update profile.'
            });
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Section 1: Profile Header */}
            <motion.div
                className="bg-gradient-to-br from-[#161118] to-[#0f0a12] border border-white/10 rounded-3xl p-8 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    {/* Large Profile Picture */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-primary/10 flex items-center justify-center">
                            {profilePic ? (
                                <img src={getFullUrl(profilePic) || ''} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-6xl text-primary/40">person</span>
                            )}
                        </div>
                        {isEditing && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full shadow-lg border-2 border-[#161118] text-white"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </motion.button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                            <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold border border-primary/30 rounded-full uppercase tracking-tighter">
                                {user.role}
                            </span>
                            {user.role?.toLowerCase() !== 'admin' && (
                                <span className={`px-3 py-1 ${user.membership_status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} text-[10px] font-bold border rounded-full uppercase tracking-tighter`}>
                                    {user.membership_status || 'INACTIVE'}
                                </span>
                            )}
                        </div>
                        {/* <p className="text-gray-500 text-sm mb-4">Member ID: {user.id}</p> */}

                        {!isEditing ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                            >
                                Edit Profile
                            </motion.button>
                        ) : (
                            <div className="flex gap-3 justify-center md:justify-start">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    disabled={saveLoading}
                                    className="px-6 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {saveLoading ? 'Saving...' : 'Save Changes'}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setIsEditing(false);
                                        setProfilePic(user.profile_picture || null);
                                        setFormData({ name: user.name, mobile: user.mobile || '' });
                                    }}
                                    className="px-6 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/10"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-8 text-primary/5 opacity-35 pointer-events-none">
                    <span className="material-symbols-outlined text-9xl">verified_user</span>
                </div>
            </motion.div>

            {/* Section 2: Personal Information Card */}
            <motion.div
                className="bg-[#161118] border border-white/10 rounded-3xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">person_outline</span>
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none transition-colors"
                            />
                        ) : (
                            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-white font-medium">{user.name}</div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email (Read-only)</label>
                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 font-medium">{user.email}</div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mobile Number</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none transition-colors"
                            />
                        ) : (
                            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-white font-medium">{user.mobile || 'Not set'}</div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Account Created</label>
                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 font-medium">{formatDate(user.created_at)}</div>
                    </div>
                </div>
            </motion.div>

            {/* Error modal */}
            <ErrorModal
                visible={!!errorModal}
                title={errorModal?.title}
                message={errorModal?.message ?? ""}
                onClose={() => setErrorModal(null)}
            />
        </div>
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

export default Profile;
