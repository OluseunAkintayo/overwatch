import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	cartModal: false,
	deleteModal: false,
	newProductModal: false,
	editProductModal: false,
	deleteProductModal: false,
	newBrandModal: false,
	editBrandModal: false,
	deleteBrandModal: false,
	newCategoryModal: false,
	editCategoryModal: false,
}

export const modalSlice = createSlice({
	name: 'modals',
	initialState,
	reducers: {
		setCartModal: (state, action) => {
			state.cartModal = action.payload;
		},
		setProductModal: (state, action) => {
			state.newProductModal = action.payload;
		},
		setEditProductModal: (state, action) => {
			state.editProductModal = action.payload;
		},
		setDeleteProductModal: (state, action) => {
			state.deleteProductModal = action.payload;
		},
		setNewBrandModal: (state, action) => {
			state.newBrandModal = action.payload;
		},
		setEditBrandModal: (state, action) => {
			state.editBrandModal = action.payload;
		},
		setDeleteBrandModal: (state, action) => {
			state.deleteBrandModal = action.payload;
		},
		setCategoryModal: (state, action) => {
			state.newCategoryModal = action.payload;
		},
	}
});

export const { setCartModal, setProductModal, setEditProductModal, setNewBrandModal, setEditBrandModal, setDeleteBrandModal, setCategoryModal, setDeleteProductModal } = modalSlice.actions;
export default modalSlice.reducer;