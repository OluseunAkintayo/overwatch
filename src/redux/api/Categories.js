import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const token = localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null;

export const CategoriesApi = createApi({
	reducerPath: 'category',
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.REACT_APP_DEV_URL,
	}),
	refetchOnReconnect: true,
	endpoints: (build) => ({
		getCateories: build.query({
			query: () => 'category',
			keepUnusedDataFor: 600,
			extraOptions: { maxRetries: 2 }
		}),
		newCategory: build.mutation({
			query: (data) => ({
				url: 'category',
				method: 'POST',
				body: data
			}),
		}),
		editCategory: build.mutation({
			query: (ctx) => ({
				url: `category/${ctx.id}`,
				method: 'PUT',
				body: ctx.payload
			}),
		}),
		deleteCategory: build.mutation({
			query: (id) => ({
				url: `category/${id}`,
				method: 'DELETE'
			}),
		}),
		getSubcateories: build.query({
			query: () => 'subcategory',
			keepUnusedDataFor: 600,
			extraOptions: { maxRetries: 2 }
		}),
		newSubcategory: build.mutation({
			query: (data) => ({
				url: 'subcategory',
				method: 'POST',
				body: data
			}),
		}),
		editSubcategory: build.mutation({
			query: (ctx) => ({
				url: `subcategory/${ctx.id}`,
				method: 'PUT',
				body: ctx.payload
			}),
		}),
		deleteSubcategory: build.mutation({
			query: (id) => ({
				url: `subcategory/${id}`,
				method: 'DELETE'
			}),
		}),
	}),
});

export const {
	useGetCateoriesQuery, useNewCategoryMutation, useEditCategoryMutation, useDeleteCategoryMutation,
	useGetSubcateoriesQuery, useNewSubcategoryMutation, useEditSubcategoryMutation, useDeleteSubcategoryMutation,
} = CategoriesApi;
