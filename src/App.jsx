import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { WishlistProvider } from "./Context/WishlistContext";
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
import ProtectedRoute from "./Components/ProtectRouter/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import GenzPicks from "./Pages/GenzPicks/Genz";
import Footer from "./Components/Footer";
import FAQ from "./Components/Footer/Faq";
import Contact from "./Components/Footer/Contact";
import Return from "./Components/Footer/Return";
import Payment from "./Pages/Payments/Payments";
import OrderSuccess from "./Pages/Payments/OrderSuccess";
import Orders from "./Pages/Orders/Order";


export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ScrollToTop />
          <Header />
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/cart"
            element={
                    <ProtectedRoute>
                    <Cart />
                    </ProtectedRoute>
            }
            />
            <Route path="/wishlist" element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
              }
             />
            

            <Route path="/products" element={<Products />}>
              <Route index element={<AllProducts />} />
              <Route path="clothes" element={<Clothes />} />
              <Route path="toys" element={<Toys />} />
              <Route path="skincare" element={<SkinCare />} />
            </Route>

            <Route path="/payment" element={<ProtectedRoute>
                                            <Payment /> </ProtectedRoute>} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />

            <Route path="/gen-z-picks" element={<GenzPicks />}></Route>

            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/returns" element={<Return />} />
          </Routes>
          
          <Footer />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
