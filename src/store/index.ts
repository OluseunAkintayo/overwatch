import products from "./products";
import modals from "./modals";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const reducers = combineReducers({ products, modals });

const store = configureStore({
	reducer: reducers,
	middleware: (middleware) => middleware({ serializableCheck: false })
});

export default store;