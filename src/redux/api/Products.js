import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const token = localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null;

export const ProductsApi = createApi({
	reducerPath: 'products',
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.REACT_APP_DEV_URL,
		// prepareHeaders: (headers) => {
		// 	if(token) {
		// 		headers.set('authorization', `Bearer ${token}`);
		// 		headers.set('Access-Control-Allow-Headers', "*");
		// 		headers.set('Accept', "application/json");
		// 	}
		// 	return headers;
		// }
	}),
	refetchOnReconnect: true,
	endpoints: (build) => ({
		getProducts: build.query({
			query: () => 'products',
			keepUnusedDataFor: 600,
			extraOptions: { maxRetries: 2 }
		}),
		newProduct: build.mutation({
			query: (data) => ({
				url: 'products',
				method: 'POST',
				body: data
			}),
		}),
		editProduct: build.mutation({
			query: (ctx) => ({
				url: `products/${ctx.id}`,
				method: 'PUT',
				body: ctx.payload
			}),
		}),
		deleteProduct: build.mutation({
			query: (id) => ({
				url: `products/${id}`,
				method: 'DELETE'
			}),
		}),
	}),
});

export const { 
	useGetProductsQuery, useNewProductMutation, useEditProductMutation, useDeleteProductMutation,
} = ProductsApi;
