import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const token = localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null;

export const BrandsApi = createApi({
	reducerPath: 'brands',
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.REACT_APP_DEV_URL,
	}),
	refetchOnReconnect: true,
	endpoints: (build) => ({
		getBrands: build.query({
			query: () => 'brands',
			keepUnusedDataFor: 600,
			extraOptions: { maxRetries: 2 }
		}),
		newBrand: build.mutation({
			query: (data) => ({
				url: 'brands',
				method: 'POST',
				body: data
			}),
		}),
		editBrand: build.mutation({
			query: (ctx) => ({
				url: `brands/${ctx.id}`,
				method: 'PUT',
				body: ctx.payload
			}),
		}),
		deleteBrand: build.mutation({
			query: (id) => ({
				url: `brands/${id}`,
				method: 'DELETE'
			}),
		}),
	}),
});

export const {
	useGetBrandsQuery, useNewBrandMutation, useEditBrandMutation, useDeleteBrandMutation
} = BrandsApi;
