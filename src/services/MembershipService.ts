import { MembershipDetails, Venture, Transaction, RedemptionResult } from '../types/membership';
import api from '../utils/api';

export const MembershipService = {
    getMembershipDetails: async (): Promise<MembershipDetails> => {
        return await api.get<MembershipDetails>('/membership/details/');
    },

    getVentures: async (): Promise<Venture[]> => {
        return await api.get<Venture[]>('/vouchers/ventures/');
    },

    getTransactions: async (): Promise<Transaction[]> => {
        return await api.get<Transaction[]>('/membership/transactions/');
    },

    redeemVoucher: async (ventureId: string, branchId: string, billAmount: number): Promise<RedemptionResult> => {
        return await api.post<RedemptionResult>(`/vouchers/redeem/`, {
            venture_id: ventureId,
            branch_id: branchId,
            bill_amount: billAmount
        });
    },

    enableAutoPay: async (): Promise<{ success: boolean; subscription_id: string; key_id: string }> => {
        return await api.post<{ success: boolean; subscription_id: string; key_id: string }>('/autopay/enable/');
    },

    cancelAutoPay: async (): Promise<{ message: string }> => {
        return await api.post<{ message: string }>('/autopay/cancel/');
    }
};

