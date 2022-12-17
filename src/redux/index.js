import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { ProductsApi } from "./api/Products";
import { BrandsApi } from "./api/Brands";
import { CategoriesApi } from "./api/Categories";
import { StoreApi } from "./api/Store";

const store = configureStore({
	reducer: {
		[ProductsApi.reducerPath]: ProductsApi.reducer,
		[BrandsApi.reducerPath]: BrandsApi.reducer,
		[CategoriesApi.reducerPath]: CategoriesApi.reducer,
		[StoreApi.reducerPath]: StoreApi.reducer,
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware().concat([
			ProductsApi.middleware, BrandsApi.middleware,
			CategoriesApi.middleware, StoreApi.middleware
		])
});

setupListeners(store.dispatch);

export default store;
