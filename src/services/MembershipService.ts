import { MembershipDetails, Voucher, Transaction } from '../types/membership';
import api from '../utils/api';

export const MembershipService = {
    getMembershipDetails: async (): Promise<MembershipDetails> => {
        return await api.get<MembershipDetails>('/membership/details/');
    },

    getVouchers: async (): Promise<Voucher[]> => {
        return await api.get<Voucher[]>('/vouchers/');
    },

    getTransactions: async (): Promise<Transaction[]> => {
        return await api.get<Transaction[]>('/membership/transactions/');
    },

    claimVoucher: async (voucherId: string): Promise<Voucher> => {
        return await api.post<Voucher>(`/vouchers/claim/${voucherId}/`);
    },

    enableAutoPay: async (): Promise<{ success: boolean; subscription_id: string; key_id: string }> => {
        return await api.post<{ success: boolean; subscription_id: string; key_id: string }>('/autopay/enable/');
    },

    cancelAutoPay: async (): Promise<{ message: string }> => {
        return await api.post<{ message: string }>('/autopay/cancel/');
    }
};

