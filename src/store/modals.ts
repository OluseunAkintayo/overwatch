import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	cartModal: false,
	selectItemModal: false,
	deleteModal: false,
	newProductModal: false,
	editProductModal: false,
	deleteProductModal: false,
	newBrandModal: false,
	editBrandModal: false,
	deleteBrandModal: false,
	newCategoryModal: false,
	editCategoryModal: false,
	deleteCategoryModal: false,
}

export const modalSlice = createSlice({
	name: 'modals',
	initialState,
	reducers: {
		setCartModal: (state, action) => {
			state.cartModal = action.payload;
		},
		setItemModal: (state, action) => {
			state.selectItemModal = action.payload;
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
		setNewCategoryModal: (state, action) => {
			state.newCategoryModal = action.payload;
		},
		setEditCategoryModal: (state, action) => {
			state.editCategoryModal = action.payload;
		},
		setDeleteCategoryModal: (state, action) => {
			state.deleteCategoryModal = action.payload;
		}
	}
});

export const { setCartModal, setItemModal, setProductModal, setEditProductModal, setNewBrandModal, setEditBrandModal, setDeleteBrandModal, setCategoryModal, setDeleteProductModal, setNewCategoryModal, setEditCategoryModal, setDeleteCategoryModal } = modalSlice.actions;
export default modalSlice.reducer;