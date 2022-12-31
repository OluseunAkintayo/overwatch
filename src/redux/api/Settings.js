import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const token = localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null;

export const SettingsApi = createApi({
	reducerPath: 'settings',
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
		getOrgSettings: build.query({
			query: () => 'org/settings'
		}),
		editOrgSettings: build.mutation({
			query: (data) => ({
				url: `org/settings/update/${data.id}`,
				method: 'PUT',
				body: data.payload
			}),
		}),
		newOrgSettings: build.mutation({
			query: (data) => ({
				url: 'org/settings',
				method: 'POST',
				body: data
			}),
		}),
	}),
});

export const { useGetOrgSettingsQuery, useNewOrgSettingsMutation, useEditOrgSettingsMutation } = SettingsApi;
