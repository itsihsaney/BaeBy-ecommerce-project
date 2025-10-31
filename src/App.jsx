import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { WishlistProvider } from "./Context/WishListContext";
import { CartProvider } from "./Context/CartContext";
import Home from "./Pages/Home";
import Products from "./Pages/Products/Products";
import Clothes from "./Pages/Products/Clothes";
import Toys from "./Pages/Products/Toys";
import SkinCare from "./Pages/Products/SkinCare";
import Header from "./Components/Header";
import AllProducts from "./Pages/Products/AllProducts";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import ScrollToTop from "./Components/Scroll/ScrollToTop";
import Cart from "./Pages/Cart/Cart";
import WishlistPage from "./Pages/Wish/WishlistPage";

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            <Route path="/products" element={<Products />}>
              <Route index element={<AllProducts />} />
              <Route path="clothes" element={<Clothes />} />
              <Route path="toys" element={<Toys />} />
              <Route path="skincare" element={<SkinCare />} />
            </Route>

            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
