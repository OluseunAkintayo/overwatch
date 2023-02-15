import React from 'react';
import axios from 'axios';
import Login from './pages/Login';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Products from './pages/Products';
import Brands from './pages/Products/Brands';

type Props = {};

axios.defaults.baseURL = "http://localhost:5500/api/";

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
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App