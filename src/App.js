import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/default/Layout';
import Products from './components/Products';
import Store from './components/Store';
import Shop from './components/Shop';
import Suppliers from './components/Suppliers';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';
import NewSupply from './components/Store/NewSupply';


const App = () => {

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" index element={<Layout children={<Home />} />} />
        <Route path="/auth/login" element={<Layout children={<Login />} />} />
        <Route path="/shop" element={<Layout children={<Shop />} />} />
        <Route path="/products" element={<Layout children={<Products />} />} />
        <Route path="/suppliers" element={<Layout children={<Suppliers />} />} />
        <Route path="/store" element={<Layout children={<Store />} />} />
        <Route path="/store/new-supply" element={<Layout children={<NewSupply />} />} />
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
    </React.Fragment>
  )
}

export default App;
