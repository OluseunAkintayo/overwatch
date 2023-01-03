import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const token = localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null;

export const TransactionsApi = createApi({
	reducerPath: 'transactions',
	baseQuery: fetchBaseQuery({
		// baseUrl: process.env.REACT_APP_DEV_URL,
		baseUrl: process.env.REACT_APP_BACKEND_URL,
		prepareHeaders: (headers) => {
			if(token) {
				headers.set('authorization', `Bearer ${token}`);
				headers.set('Access-Control-Allow-Headers', "*");
				headers.set('Accept', "application/json");
			}
			return headers;
		}
	}),
	refetchOnReconnect: true,
	endpoints: (build) => ({
		newOrder: build.mutation({
			query: (data) => ({
				url: 'transactions/order',
				method: 'POST',
				body: data
			}),
		}),
		getSales: build.query({
			query: () => 'transactions/sales'
		}),
	}),
});

export const {
	useNewOrderMutation, useGetSalesQuery
} = TransactionsApi;
