import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Products from './components/Products';
import Store from './components/Store';
import Shop from './components/Shop';
import Suppliers from './components/Suppliers';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';
import NewSupply from './components/Store/NewSupply';
import PrivateRoute from './components/default/PrivateRoute';
import NewUser from './components/Login/NewUser';


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/new-user" element={<NewUser />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/new-supply" element={<NewSupply />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2500}
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
