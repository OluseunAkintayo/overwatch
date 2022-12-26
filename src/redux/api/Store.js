import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const token = localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null;

export const StoreApi = createApi({
	reducerPath: 'store',
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.REACT_APP_BACKEND_URL,
	}),
	refetchOnReconnect: true,
	endpoints: (build) => ({
		getVendors: build.query({
			query: () => 'store/vendors/list',
			keepUnusedDataFor: 600,
			extraOptions: { maxRetries: 2 }
		}),
		newVendor: build.mutation({
			query: (data) => ({
				url: 'store/vendors/new',
				method: 'POST',
				body: data
			}),
		}),
		editVendor: build.mutation({
			query: (ctx) => ({
				url: `store/vendors/update/${ctx.id}`,
				method: 'PUT',
				body: ctx.payload
			}),
		}),
		deleteVendor: build.mutation({
			query: (id) => ({
				url: `store/vendors/delete/${id}`,
				method: 'PUT'
			}),
		}),
		getSupplies: build.query({
			query: () => 'store/supplies',
			keepUnusedDataFor: 600,
			extraOptions: { maxRetries: 2 }
		}),
		newSupply: build.mutation({
			query: (data) => ({
				url: 'store/new-supply',
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
