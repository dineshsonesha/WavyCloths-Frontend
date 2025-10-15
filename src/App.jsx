import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/user/Home';
import Products from './pages/user/Products';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageCategories from './pages/admin/ManageCategories.jsx'
import ManageProducts from './pages/admin/ManageProducts' 
import UserLayout from './layout/UserLayout'
import MyOrders from './pages/user/MyOrders.jsx';
import ManageOrders from './pages/admin/ManageOrders.jsx';
import AdminLayout from './layout/AdminLayout.jsx';
import AddCategory from './components/admin/AddCategory.jsx';
import UpdateCategory from './components/admin/UpdateCategory.jsx';
import AddProduct from './components/admin/AddProduct.jsx';
import UpdateProduct from './components/admin/UpdateProduct.jsx';
import AboutUs from './pages/user/AboutUs.jsx';
import Wishlist from './pages/user/WishList.jsx';
import ViewCartProducts from './pages/admin/ViewCartProducts.jsx';

export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:categoryId" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart/:userId" element={<Cart />}/>
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/about" element={<AboutUs />} />
        <Route path="/wishlist/:userId" element={<Wishlist />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/category/:id/products" element={<ManageProducts />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
          <Route path="/orders/:orderId/cart-products" element={<ViewCartProducts />} />
          <Route path="/admin/category/add" element={<AddCategory />} />
          <Route path="/admin/category/update/:id" element={<UpdateCategory />} />
          <Route path="/admin/product/add" element={<AddProduct />} />
          <Route path="/admin/product/update/:id" element={<UpdateProduct />} />
        </Route>
      </Routes>
    </div>
  )
}
