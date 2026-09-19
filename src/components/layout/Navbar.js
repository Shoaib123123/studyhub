import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
          >
            Home
          </Link>

          <Link
            to="/school-subjects"
            className={
              isActive("/school-subjects") ? "active" : ""
            }
          >
            School Subjects
          </Link>

          <Link
            to="/religious-books"
            className={
              isActive("/religious-books") ? "active" : ""
            }
          >
            Religious Books
          </Link>

          <Link
            to="/HigherStudies"
            className={
              isActive("/HigherStudies") ? "active" : ""
            }
          >
            Higher Studies
          </Link>

          {/* LOGGED-IN ONLY */}
          {user && (
            <>
              <Link
                to="/cart"
                className={
                  isActive("/cart")
                    ? "cart-link active"
                    : "cart-link"
                }
              >
                🛒 Cart
                <span className="cart-count">
                  {totalItems}
                </span>
              </Link>

              <Link
                to="/my-library"
                className={
                  isActive("/my-library") ? "active" : ""
                }
              >
                My Library
              </Link>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          {/* LOGGED-OUT ONLY */}
          {!user && (
            <>
              <Link
                to="/login"
                className={
                  isActive("/login")
                    ? "login-link active"
                    : "login-link"
                }
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="signup-button"
              >
                Sign Up
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
        <Link to="/" onClick={closeMenu}>
          🏠 Home
        </Link>

        <Link
          to="/school-subjects"
          onClick={closeMenu}
        >
          📖 School Subjects
        </Link>

        <Link
          to="/religious-books"
          onClick={closeMenu}
        >
          📚 Religious Books
        </Link>

        <Link
          to="/HigherStudies"
          onClick={closeMenu}
        >
          🎓 Higher Studies
        </Link>

        {user ? (
          <>
            <Link
              to="/cart"
              onClick={closeMenu}
              className="mobile-cart-link"
            >
              🛒 Cart
              <span className="cart-count">
                {totalItems}
              </span>
            </Link>

            <Link
              to="/my-library"
              onClick={closeMenu}
            >
              📁 My Library
            </Link>

            <button
              type="button"
              className="mobile-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={closeMenu}
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={closeMenu}
              className="mobile-signup-button"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
