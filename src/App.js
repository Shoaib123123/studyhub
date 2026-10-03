
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import HaveAQuery from "./pages/HaveAQuery";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import HigherStudies from "./pages/HigherStudies";
import MyLibrary from "./pages/MyLibrary";
import ProductDetail from "./pages/ProductDetail";
import ReligiousBooks from "./pages/ReligiousBooks";
import SchoolSubjects from "./pages/SchoolSubjects";
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./App.css";
import ExamReadyNotes from "./pages/ExamReadyNotes";
import ExamReadyProducts from "./pages/ExamReadyProducts";
import CompetitiveExamPapersPage from "./pages/CompetitiveExamPapersPage";

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

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/have-a-query"
              element={<HaveAQuery />}
            />

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
            <Route
              path="/competitive-exams/:exam"
              element={<CompetitiveExamPapersPage />}
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
            <Route
              path="/exam-ready-notes"
              element={<ExamReadyNotes />}
            />

            <Route
              path="/exam-ready-notes/:className"
              element={<ExamReadyProducts />}
            />

            {/* ==============================
                PAYMENT SUCCESS
                NOT wrapped in ProtectedRoute
            ============================== */}

            <Route
              path="/payment-success"
              element={<PaymentSuccess />}
            />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;