import React from 'react';
import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Products from './pages/Products';
import Brands from './pages/Products/Brands';
import Category from './pages/Products/Category';
import Subcategory from './pages/Products/Subcategory';
import Login from './pages/Login';
import NewUser from './pages/Login/NewUser';
import Store from './pages/Store';
import Vendors from './pages/Vendor';
import NewSupply from './pages/Store/NewSupply';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import Reporting from './pages/Reporting';


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Outlet />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<NewUser />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route index element={<Home />} />
          <Route path='/settings' element={<Settings />} />
          <Route path="shop" element={<Shop />} />
          <Route path="products" element={<Outlet />}>
            <Route index element={<Products />} />
            <Route path="brands" element={<Brands />} />
            <Route path="categories" element={<Category />} />
            <Route path="subcategories" element={<Subcategory />} />
          </Route>
          <Route path="/store" element={<Outlet />}>
            <Route index element={<Store />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="new-supply" element={<NewSupply />} />
          </Route>
          <Route path="/reports" element={<Outlet />}>
            <Route path="sales" element={<Reporting />} />
            <Route path="inventory" element={<Reporting />} />
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
