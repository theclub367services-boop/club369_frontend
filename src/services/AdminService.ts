import { User } from '../types/auth';
import { Transaction } from '../types/membership';
import api from '../utils/api';

export const PaymentService = {
    createPayment: async (data: any): Promise<any> => {
        return await api.post('/payments/create/', data);
    }
};

export const AdminService = {
    getUsers: async (): Promise<User[]> => {
        return await api.get<User[]>('/admin/users/');
    },

    getTransactions: async (): Promise<Transaction[]> => {
        return await api.get<Transaction[]>('/admin/transactions/');
    },

    getCollections: async (): Promise<{ total_last_30_days: number }> => {
        return await api.get<{ total_last_30_days: number }>('/admin/collections/');
    },

    getAdminVentures: async (search?: string): Promise<any[]> => {
        const q = search ? `?search=${search}` : '';
        return await api.get<any[]>(`/admin/vouchers/ventures/${q}`);
    },

    createAdminVenture: async (data: FormData | any): Promise<any> => {
        return await api.post('/admin/vouchers/ventures/', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    updateAdminVenture: async (id: string, data: FormData | any): Promise<any> => {
        return await api.patch(`/admin/vouchers/ventures/${id}/`, data, {
             headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    toggleAdminVentureStatus: async (id: string): Promise<any> => {
        return await api.patch(`/admin/vouchers/ventures/${id}/toggle/`);
    },

    deleteAdminVenture: async (id: string): Promise<any> => {
        return await api.delete(`/admin/vouchers/ventures/${id}/delete/`);
    },

    getAdminRedemptions: async (scope: string, fromDate?: string, toDate?: string, branchId?: string, ventureId?: string): Promise<any> => {
        let url = `/admin/vouchers/redemptions/?scope=${scope}`;
        if (fromDate) url += `&from_date=${fromDate}`;
        if (toDate) url += `&to_date=${toDate}`;
        if (branchId) url += `&branch_id=${branchId}`;
        if (ventureId) url += `&venture_id=${ventureId}`;
        return await api.get<any>(url);
    },

    deleteUser: async (id: string): Promise<any> => {
        return await api.delete(`/admin/users/${id}/delete/`);
    },

    markAsPaid: async (userId: number): Promise<any> => {
        return await api.post(`/admin/mark-as-paid/${userId}/`);
    }
};

