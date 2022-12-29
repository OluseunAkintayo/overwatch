import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const token = localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null;

export const UsersApi = createApi({
	reducerPath: 'users',
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.REACT_APP_BACKEND_URL,
		// baseUrl: process.env.REACT_APP_DEV_URL,
	}),
	refetchOnReconnect: true,
	endpoints: (build) => ({
		newUser: build.mutation({
			query: (data) => ({
				url: 'users/register',
				method: 'POST',
				body: data
			}),
		}),
	}),
});

export const {
	useNewUserMutation
} = UsersApi;
