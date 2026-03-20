import { baseApi } from './baseApi';
import { MembershipDetails, Venture, Transaction, RedemptionResult } from '../../types/membership';

export const membershipApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMembershipDetails: builder.query<MembershipDetails, void>({
            query: () => '/membership/details/',
            providesTags: ['Dashboard'],
        }),
        getVentures: builder.query<Venture[], void>({
            query: () => '/vouchers/ventures/',
        }),
        getTransactions: builder.query<Transaction[], void>({
            query: () => '/membership/transactions/',
        }),
        redeemVoucher: builder.mutation<RedemptionResult, { venture_id: string; branch_id: string; bill_amount: number }>({
            query: (payload) => ({
                url: `/vouchers/redeem/`,
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const {
    useGetMembershipDetailsQuery,
    useGetVenturesQuery,
    useGetTransactionsQuery,
    useRedeemVoucherMutation,
} = membershipApi;
