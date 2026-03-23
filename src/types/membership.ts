export type MembershipStatus = 'active' | 'expiring' | 'expired' | 'inactive';
export type AutopayStatus = 'active' | 'failed' | 'inactive';

export interface MembershipDetails {
    status: MembershipStatus;
    startDate?: string;
    expiryDate: string;
    nextBillingDate: string;
    autopayStatus: AutopayStatus;
}

export interface Transaction {
    id: string;
    user: string;
    date: string;
    amount: number;
    status: 'success' | 'failed' | 'pending';
    method: string;
}

export interface Branch {
    id: string;
    venture: string;
    branch_name: string;
}

export interface Venture {
    id: string;
    name: string;
    type: 'OWN' | 'PARTNER';
    discount_percentage: string;
    icon: string | null;
    status: 'ACTIVE' | 'SUSPENDED';
    branches?: Branch[]; 
}

export interface RedemptionResult {
    actual_bill_amount: string;
    discount_amount: string;
    final_paid_amount: string;
    branch_name: string;
    redeemed_at: string;
}
