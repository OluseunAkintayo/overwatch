import React from 'react';
import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import Shop from './components/Shop';
import Products from './components/Products';
import Brands from './components/Products/Brands';
import Category from './components/Products/Category';
import Subcategory from './components/Products/Subcategory';
import Login from './components/Login';
import NewUser from './components/Login/NewUser';
import Store from './components/Store';
import Vendors from './components/Vendor';
import NewSupply from './components/Store/NewSupply';
import PrivateRoute from './components/default/PrivateRoute';


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/new-user" element={<NewUser />} />
        <Route element={<PrivateRoute />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="products" element={<Outlet />}>
            <Route index element={<Products />} />
            <Route path="brands" element={<Brands />} />
            <Route path="categories" element={<Category />} />
            <Route path="subcategories" element={<Subcategory />} />
          </Route>
          <Route path="/store" element={<Outlet />}>
            <Route index element={<Store />} />
            <Route path="suppliers" element={<Vendors />} />
            <Route path="new-supply" element={<NewSupply />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App;
