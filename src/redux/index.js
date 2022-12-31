import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { ProductsApi } from "./api/Products";
import { BrandsApi } from "./api/Brands";
import { CategoriesApi } from "./api/Categories";
import { StoreApi } from "./api/Store";
import { UsersApi } from "./api/Users";
import { TransactionsApi } from "./api/Transactions";
import { SettingsApi } from "./api/Settings";

const store = configureStore({
	reducer: {
		[ProductsApi.reducerPath]: ProductsApi.reducer,
		[BrandsApi.reducerPath]: BrandsApi.reducer,
		[CategoriesApi.reducerPath]: CategoriesApi.reducer,
		[StoreApi.reducerPath]: StoreApi.reducer,
		[UsersApi.reducerPath]: UsersApi.reducer,
		[TransactionsApi.reducerPath]: TransactionsApi.reducer,
		[SettingsApi.reducerPath]: SettingsApi.reducer,
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware().concat([
			ProductsApi.middleware, BrandsApi.middleware,
			CategoriesApi.middleware, StoreApi.middleware,
			UsersApi.middleware, TransactionsApi.middleware,
			SettingsApi.middleware
		])
});

setupListeners(store.dispatch);

export default store;
