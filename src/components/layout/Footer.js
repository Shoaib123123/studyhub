import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">📚</span>
            <span>
              Study<span>Hub</span>
            </span>
          </Link>

          <p>
            Your online destination for educational books,
            study materials, and learning resources.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/school-subjects">School Subjects</Link>
          <Link to="/graduation">Graduation</Link>
          <Link to="/religious-books">Religious Books</Link>
        </div>

        {/* Account */}
        <div className="footer-column">
          <h3>Account</h3>

          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/my-library">My Library</Link>
        </div>

        {/* About */}
        <div className="footer-column footer-about">
          <h3>StudyHub</h3>

          <p>
            Making learning easier by bringing useful
            educational resources together in one place.
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} StudyHub. All rights reserved.
        </p>

        <p>
          Learn • Grow • Succeed
        </p>
      </div>
    </footer>
  );
}

export default Footer;