import React from 'react';
import axios from 'axios';
import Login from './pages/Login';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Products from './pages/Products';
import Brands from './pages/Products/Brands';
import Category from './pages/Products/Category';
import SalesReport from './pages/Reporting/Sales';
import ErrorPage from './pages/NotFound';

type Props = {};

axios.defaults.baseURL = import.meta.env.REACT_APP_BACKEND_URL;

const App = (props: Props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth/login' element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products" element={<Outlet />}>
            <Route index element={<Products />} />
            <Route path="brands" element={<Brands />} />
            <Route path="categories" element={<Category />} />
          </Route>
          <Route path="/reports" element={<Outlet />}>
            <Route path="sales" element={<SalesReport />} />
          </Route>
          <Route path="/*" element={<ErrorPage />} />
        </Route>
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App