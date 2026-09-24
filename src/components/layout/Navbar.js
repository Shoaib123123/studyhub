
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  GraduationCap,
  MessageCircle,
  ShoppingCart,
  Library,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <img
            src="/mylogo.png"
            alt="StudyHub"
            className="navbar-logo-image"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="navbar-links">

          {/* HOME */}
          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
            onClick={closeMenu}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          {/* SCHOOL SUBJECTS */}
          <Link
            to="/school-subjects"
            className={
              isActive("/school-subjects") ? "active" : ""
            }
            onClick={closeMenu}
          >
            <BookOpen size={18} />
            <span>School Subjects</span>
          </Link>

          {/* RELIGIOUS BOOKS */}
          <Link
            to="/religious-books"
            className={
              isActive("/religious-books") ? "active" : ""
            }
            onClick={closeMenu}
          >
            <BookOpen size={18} />
            <span>Religious Books</span>
          </Link>

          {/* HIGHER STUDIES */}
          <Link
            to="/HigherStudies"
            className={
              isActive("/HigherStudies") ? "active" : ""
            }
            onClick={closeMenu}
          >
            <GraduationCap size={18} />
            <span>Higher Studies</span>
          </Link>

          {/* HAVE A QUERY */}
          <Link
            to="/have-a-query"
            className={
              isActive("/have-a-query")
                ? "query-link active"
                : "query-link"
            }
            onClick={closeMenu}
          >
            <MessageCircle size={18} />
            <span>Have a Query?</span>
          </Link>

          {/* LOGGED-IN ONLY */}
          {user && (
            <>
              {/* CART */}
              <Link
                to="/cart"
                className={
                  isActive("/cart")
                    ? "cart-link active"
                    : "cart-link"
                }
                onClick={closeMenu}
              >
                <ShoppingCart size={18} />
                <span>Cart</span>

                <span className="cart-count">
                  {totalItems}
                </span>
              </Link>

              {/* MY LIBRARY */}
              <Link
                to="/my-library"
                className={
                  isActive("/my-library") ? "active" : ""
                }
                onClick={closeMenu}
              >
                <Library size={18} />
                <span>My Library</span>
              </Link>

              {/* LOGOUT */}
              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}

          {/* LOGGED-OUT ONLY */}
          {!user && (
            <>
              {/* LOGIN */}
              <Link
                to="/login"
                className={
                  isActive("/login")
                    ? "login-link active"
                    : "login-link"
                }
                onClick={closeMenu}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>

              {/* SIGN UP */}
              <Link
                to="/signup"
                className="signup-button"
                onClick={closeMenu}
              >
                <UserPlus size={18} />
                <span>Sign Up</span>
              </Link>
            </>
          )}

        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className={`mobile-menu-button ${
            menuOpen ? "open" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${
          menuOpen ? "mobile-menu-open" : ""
        }`}
      >

        {/* HOME */}
        <Link
          to="/"
          onClick={closeMenu}
        >
          <Home size={19} />
          <span>Home</span>
        </Link>

        {/* SCHOOL SUBJECTS */}
        <Link
          to="/school-subjects"
          onClick={closeMenu}
        >
          <BookOpen size={19} />
          <span>School Subjects</span>
        </Link>

        {/* RELIGIOUS BOOKS */}
        <Link
          to="/religious-books"
          onClick={closeMenu}
        >
          <BookOpen size={19} />
          <span>Religious Books</span>
        </Link>

        {/* HIGHER STUDIES */}
        <Link
          to="/HigherStudies"
          onClick={closeMenu}
        >
          <GraduationCap size={19} />
          <span>Higher Studies</span>
        </Link>

        {/* HAVE A QUERY */}
        <Link
          to="/have-a-query"
          onClick={closeMenu}
          className={
            isActive("/have-a-query")
              ? "mobile-query-link active"
              : "mobile-query-link"
          }
        >
          <MessageCircle size={19} />
          <span>Have a Query?</span>
        </Link>

        {/* LOGGED-IN MOBILE MENU */}
        {user ? (
          <>
            {/* CART */}
            <Link
              to="/cart"
              onClick={closeMenu}
              className="mobile-cart-link"
            >
              <ShoppingCart size={19} />
              <span>Cart</span>

              <span className="cart-count">
                {totalItems}
              </span>
            </Link>

            {/* MY LIBRARY */}
            <Link
              to="/my-library"
              onClick={closeMenu}
            >
              <Library size={19} />
              <span>My Library</span>
            </Link>

            {/* LOGOUT */}
            <button
              type="button"
              className="mobile-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={19} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            {/* LOGIN */}
            <Link
              to="/login"
              onClick={closeMenu}
            >
              <LogIn size={19} />
              <span>Login</span>
            </Link>

            {/* SIGN UP */}
            <Link
              to="/signup"
              onClick={closeMenu}
              className="mobile-signup-button"
            >
              <UserPlus size={19} />
              <span>Sign Up</span>
            </Link>
          </>
        )}

      </div>
    </header>
  );
}

export default Navbar;