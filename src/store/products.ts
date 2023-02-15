import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	products: {
		data: null,
		isLoading: false,
		error: null
	},
	brands: {
		data: null,
		isLoading: false,
		error: null
	},
	category: {
		data: null,
		isLoading: false,
		error: null
	},
}

export const productSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		setProducts: (state, action) => {
			state.products.data = action.payload
		},
		setCategories: (state, action) => {
			state.category.data = action.payload
		},
		setBrands: (state, action) => {
			state.brands.data = action.payload
		}
	}
});

export const { setProducts, setCategories, setBrands } = productSlice.actions;
export default productSlice.reducer;