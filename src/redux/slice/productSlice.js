import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	products: {
		data: null,
		loading: false,
		error: null,
	},
}

export const productSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {},
	extraReducers: {}
});

