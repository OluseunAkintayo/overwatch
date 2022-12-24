import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const token = localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null;

export const BrandsApi = createApi({
	reducerPath: 'brands',
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.REACT_APP_BACKEND_URL,
		// baseUrl: process.env.REACT_APP_DEV_URL,
	}),
	refetchOnReconnect: true,
	endpoints: (build) => ({
		getBrands: build.query({
			query: () => 'products/brands/list',
			keepUnusedDataFor: 600,
			extraOptions: { maxRetries: 2 }
		}),
		newBrand: build.mutation({
			query: (data) => ({
				url: 'products/brands/new',
				method: 'POST',
				body: data
			}),
		}),
		editBrand: build.mutation({
			query: (ctx) => ({
				url: `products/brands/update/${ctx.id}`,
				method: 'PUT',
				body: ctx.payload
			}),
		}),
		deleteBrand: build.mutation({
			query: (id) => ({
				url: `products/brands/delete/${id}`,
				method: 'DELETE'
			}),
		}),
	}),
});

export const {
	useGetBrandsQuery, useNewBrandMutation, useEditBrandMutation, useDeleteBrandMutation
} = BrandsApi;
