import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Auth.css";

function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { data, error } = await signup(email, password);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        setMessage(
          "Account created successfully. Check your email if confirmation is required."
        );
      }

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      {error && <p className="error-message">{error}</p>}

      {message && <p className="success-message">{message}</p>}

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      <input
        type="password"
        placeholder="Password"
        minLength="6"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Sign Up"}
      </button>

      <p className="auth-switch">
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default SignupForm;