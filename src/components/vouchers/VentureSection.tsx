import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Venture, RedemptionResult } from '../../types/membership';
import { getFullUrl } from '../../utils/url';

interface VentureSectionProps {
    user: any;
    membershipStatus: string;
    ventures: Venture[];
    onRedeem: (ventureId: string, branchId: string, billAmount: number) => Promise<RedemptionResult>;
}

const VentureSection: React.FC<VentureSectionProps> = ({ user, membershipStatus, ventures, onRedeem }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);
    const [selectedBranchId, setSelectedBranchId] = useState<string>('');
    const [billAmount, setBillAmount] = useState<string>('');
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [redemptionResult, setRedemptionResult] = useState<RedemptionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const filteredVentures = useMemo(() => {
        return ventures.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [ventures, searchTerm]);

    const handleRedeemClick = (venture: Venture) => {
        setSelectedVenture(venture);
        setSelectedBranchId('');
        setBillAmount('');
        setError(null);
        setRedemptionResult(null);
    };

    const handleConfirm = async () => {
        if (!selectedVenture || !selectedBranchId || !billAmount) {
            setError('Please fill all fields');
            return;
        }

        setIsRedeeming(true);
        setError(null);
        try {
            const result = await onRedeem(selectedVenture.id, selectedBranchId, parseFloat(billAmount));
            setRedemptionResult(result);
        } catch (err: any) {
            // The API interceptor unwraps the response, so we check those fields directly
            const errorMsg = err.message || err.errors?.error || err.error || 'Failed to redeem';
            setError(errorMsg);
        } finally {
            setIsRedeeming(false);
        }
    };

    const closeModal = () => {
        setSelectedVenture(null);
        setRedemptionResult(null);
        setError(null);
    };

    const discountValue = selectedVenture && billAmount
        ? (parseFloat(billAmount) * (parseFloat(selectedVenture.discount_percentage) / 100))
        : 0;
    const finalAmount = selectedVenture && billAmount
        ? (parseFloat(billAmount) - discountValue)
        : 0;

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">
                        Venture Discounts
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Exclusive benefits curated for your membership tier.
                    </p>
                </div>
                <div className="w-full md:w-64 relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search ventures..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredVentures.map((venture, i) => (
                    <motion.div
                        key={venture.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-[#161118]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all flex flex-col group h-full"
                    >
                        <div className="aspect-[2/3] w-full relative bg-black/40 overflow-hidden">
                            {venture.poster ? (
                                <img 
                                    src={getFullUrl(venture.poster)} 
                                    alt={venture.name} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-white/5">
                                    <span className="material-symbols-outlined text-3xl mb-1">image_not_supported</span>
                                    <span className="text-[10px] font-bold uppercase">No Poster</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-primary/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg backdrop-blur-sm">
                                {venture.discount_percentage}% OFF
                            </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
                                    {venture.icon ? (
                                        <img src={getFullUrl(venture.icon)} alt="icon" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-gray-500 text-sm">storefront</span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xs font-bold text-white truncate">{venture.name}</h3>
                                    <div className="text-[8px] uppercase font-bold text-gray-500 truncate">
                                        {venture.type === 'OWN' ? 'Club369 Owned' : 'Club369 Partnered'}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRedeemClick(venture)}
                                className="w-full py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-[10px] font-black tracking-widest uppercase shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all transform active:scale-95"
                            >
                                Redeem
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedVenture && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#161118] border border-white/10 p-8 rounded-3xl w-full max-w-md relative overflow-hidden"
                        >
                            {/* Ambient background blur */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

                            <button onClick={closeModal} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            {redemptionResult ? (
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2 uppercase">Approved!</h3>
                                    <p className="text-sm text-gray-400 mb-8">Though there'll be no claimed record in your side, Dont close this window until you show this confirmation to the retailer or take screenshot.</p>
                                    
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4 shadow-lg shadow-primary/5">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Venture</span>
                                            <span className="font-bold text-white">{selectedVenture.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Branch</span>
                                            <span className="font-bold text-white">{redemptionResult.branch_name}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Redeemed Date</span>
                                            <span className="font-bold text-white">{redemptionResult.redeemed_date}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Actual Bill</span>
                                            <span className="font-bold text-white">₹ {parseFloat(redemptionResult.actual_bill_amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Discount</span>
                                            <span className="font-bold text-emerald-500">- ₹ {parseFloat(redemptionResult.discount_amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-sm font-black text-white uppercase tracking-widest">Final Amount</span>
                                            <span className="text-xl font-black text-primary">₹ {parseFloat(redemptionResult.final_paid_amount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-6 pr-8">Redeem at {selectedVenture.name}</h3>

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                                            <span className="material-symbols-outlined shrink-0 text-red-400">error</span>
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Branch *</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedBranchId}
                                                    onChange={(e) => setSelectedBranchId(e.target.value)}
                                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-white hover:border-white/20 focus:border-primary/50 focus:outline-none transition-colors appearance-none"
                                                >
                                                    <option value="">Choose a branch...</option>
                                                    {selectedVenture.branches?.map(b => (
                                                        <option key={b.id} value={b.id}>{b.branch_name}</option>
                                                    ))}
                                                </select>
                                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
                                            </div>
                                            <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2 text-amber-500 text-xs text-left">
                                                <span className="material-symbols-outlined shrink-0 text-amber-400 text-[16px]">warning</span>
                                                <span><strong className="uppercase">High Priority Note:</strong> Enter Bill Amount exactly. Please check twice before redeeming.</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Actual Bill Amount *</label>
                                            <div className="relative font-mono">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">₹</span>
                                                <input
                                                    type="number"
                                                    value={billAmount}
                                                    onChange={(e) => setBillAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-xl focus:outline-none focus:border-primary/50 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {billAmount && !isNaN(parseFloat(billAmount)) && (
                                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-400 font-bold uppercase">Discount ({selectedVenture.discount_percentage}%)</span>
                                                    <span className="text-emerald-400 font-mono">-₹{discountValue.toFixed(2)}</span>
                                                </div>
                                                <div className="h-px bg-white/10 w-full" />
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-black text-white py-1 uppercase tracking-wider">Final Payable</span>
                                                    <span className="text-xl font-black text-primary font-mono">₹{finalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleConfirm}
                                            disabled={isRedeeming}
                                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold tracking-widest uppercase rounded-xl py-4 disabled:opacity-50 transition-all flex justify-center items-center gap-2 mt-4"
                                        >
                                            {isRedeeming ? (
                                                <span className="material-symbols-outlined animate-spin text-white/50">progress_activity</span>
                                            ) : (
                                                <>
                                                    Confirm & Generate Code
                                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VentureSection;
