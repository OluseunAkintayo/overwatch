import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const token = localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null;

export const StoreApi = createApi({
	reducerPath: 'suppliers',
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.REACT_APP_DEV_URL,
	}),
	refetchOnReconnect: true,
	endpoints: (build) => ({
		getVendors: build.query({
			query: () => 'suppliers',
			keepUnusedDataFor: 600,
			extraOptions: { maxRetries: 2 }
		}),
		newVendor: build.mutation({
			query: (data) => ({
				url: 'suppliers',
				method: 'POST',
				body: data
			}),
		}),
		editVendor: build.mutation({
			query: (ctx) => ({
				url: `suppliers/${ctx.id}`,
				method: 'PUT',
				body: ctx.payload
			}),
		}),
		deleteVendor: build.mutation({
			query: (id) => ({
				url: `suppliers/${id}`,
				method: 'DELETE'
			}),
		}),
		getSupplies: build.query({
			query: () => 'supplies',
			keepUnusedDataFor: 600,
			extraOptions: { maxRetries: 2 }
		}),
		newSupply: build.mutation({
			query: (data) => ({
				url: 'supplies',
				method: 'POST',
				body: data
			}),
		}),
	}),
});

export const { 
	useGetVendorsQuery, useNewVendorMutation,
	useEditVendorMutation, useDeleteVendorMutation,
	useGetSuppliesQuery, useNewSupplyMutation
} = StoreApi;
