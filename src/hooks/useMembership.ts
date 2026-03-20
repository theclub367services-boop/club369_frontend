import { useState, useEffect } from 'react';
import { MembershipService } from '../services/MembershipService';
import { MembershipDetails, Venture, Transaction } from '../types/membership';

export const useMembership = () => {
    const [details, setDetails] = useState<MembershipDetails | null>(null);
    const [ventures, setVentures] = useState<Venture[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detailsRes, venturesRes, transactionsRes] = await Promise.all([
                    MembershipService.getMembershipDetails(),
                    MembershipService.getVentures(),
                    MembershipService.getTransactions(),
                ]);
                setDetails(detailsRes);
                setVentures(venturesRes);
                setTransactions(transactionsRes);
            } catch (err) {
                setError('Failed to load membership data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const isRenewalAllowed = () => {
        if (!details) return false; // Keep the initial check for details
        if (details.status === 'EXPIRED' || details.status === 'INACTIVE') return true;

        const expiry = new Date(details.expiryDate);
        const today = new Date();
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 5;
    };

    const redeemVoucher = async (ventureId: string, branchId: string, billAmount: number) => {
        try {
            return await MembershipService.redeemVoucher(ventureId, branchId, billAmount);
        } catch (err: any) {
            setError(err.message || err.errors?.error || 'Failed to redeem venture');
            throw err;
        }
    };

    const enableAutoPay = async () => {
        try {
            const res = await MembershipService.enableAutoPay();
            // Optimistically update or refresh
            if (details) setDetails({ ...details, autopayStatus: 'active' });
            return res;
        } catch (err: any) {
            setError(err.message || err.errors?.error || 'Failed to enable AutoPay');
            throw err;
        }
    };

    const cancelAutoPay = async () => {
        try {
            const res = await MembershipService.cancelAutoPay();
            if (details) setDetails({ ...details, autopayStatus: 'inactive' });
            return res;
        } catch (err: any) {
            setError(err.message || err.errors?.error || 'Failed to cancel AutoPay');
            throw err;
        }
    };

    return { details, ventures, transactions, isLoading, error, isRenewalAllowed, redeemVoucher, enableAutoPay, cancelAutoPay, setDetails };
};
