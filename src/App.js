import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import HigherStudies from "./pages/HigherStudies";
import MyLibrary from "./pages/MyLibrary";
import ProductDetail from "./pages/ProductDetail";
import ReligiousBooks from "./pages/ReligiousBooks";
import SchoolSubjects from "./pages/SchoolSubjects";

import ProtectedRoute from "./components/common/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>

            {/* ==============================
                PUBLIC PAGES
            ============================== */}

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route
              path="/school-subjects"
              element={<SchoolSubjects />}
            />

            <Route
              path="/religious-books"
              element={<ReligiousBooks />}
            />

            <Route
              path="/HigherStudies"
              element={<HigherStudies />}
            />

            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />

            {/* ==============================
                LOGGED-IN USER PAGES
            ============================== */}

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-library"
              element={
                <ProtectedRoute>
                  <MyLibrary />
                </ProtectedRoute>
              }
            />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
