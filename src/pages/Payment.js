
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import EmptyState from "../components/common/EmptyState";
import { formatPrice } from "../utils/formatPrice";
import { supabase } from "../lib/supabaseClient";
import "./Payment.css";

function Payment() {
  const { cart, totalPrice } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!cart.length) {
    return (
      <main className="page-container">
        <EmptyState
          title="Your cart is empty"
          message="Add a book before proceeding to payment."
        />
      </main>
    );
  }

  const handlePayment = async () => {
    setError("");

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!customerEmail.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!customerPhone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (customerPhone.trim().length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);

      const { data, error: functionError } =
        await supabase.functions.invoke(
          "create-cashfree-order",
          {
            body: {
              amount: Number(totalPrice),
              customer_id: `customer_${Date.now()}`,
              customer_name: customerName.trim(),
              customer_email: customerEmail.trim(),
              customer_phone: customerPhone.trim(),
            },
          }
        );

      if (functionError) {
        throw new Error(
          functionError.message ||
            "Unable to create payment order."
        );
      }

      if (!data?.payment_session_id) {
        throw new Error(
          data?.error ||
            "Cashfree payment session was not created."
        );
      }

      if (
        typeof window.Cashfree !== "function"
      ) {
        throw new Error(
          "Cashfree SDK failed to load. Please refresh the page."
        );
      }

      const cashfree = window.Cashfree({
        mode: "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error("Payment error:", err);

      setError(
        err.message ||
          "Something went wrong while starting payment."
      );

      setLoading(false);
    }
  };

  return (
    <main className="payment-page">
      <Link to="/cart" className="payment-back-link">
        ← Back to Cart
      </Link>

      <section className="payment-card">
        <p className="payment-eyebrow">
          DIGITAL ORDER
        </p>

        <h1>Payment</h1>

        <p className="payment-description">
          Review your order and enter your details to
          continue with Cashfree Sandbox payment.
        </p>

        <div className="payment-order-list">
          {cart.map((item) => (
            <div
              className="payment-order-item"
              key={item.id}
            >
              <span>
                {item.title} × {item.quantity}
              </span>

              <strong>
                {formatPrice(
                  Number(item.price || 0) *
                    item.quantity
                )}
              </strong>
            </div>
          ))}
        </div>

        <div className="payment-total">
          <span>Total to pay</span>

          <strong>
            {formatPrice(totalPrice)}
          </strong>
        </div>

        <div className="payment-form">
          <div className="payment-field">
            <label htmlFor="customerName">
              Full Name
            </label>

            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="payment-field">
            <label htmlFor="customerEmail">
              Email
            </label>

            <input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) =>
                setCustomerEmail(e.target.value)
              }
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="payment-field">
            <label htmlFor="customerPhone">
              Phone Number
            </label>

            <input
              id="customerPhone"
              type="tel"
              value={customerPhone}
              onChange={(e) =>
                setCustomerPhone(e.target.value)
              }
              placeholder="Enter your phone number"
              maxLength="10"
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="payment-error">
            {error}
          </div>
        )}

        <button
          type="button"
          className="payment-button"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading
            ? "Opening Cashfree..."
            : `Pay ${formatPrice(totalPrice)}`}
        </button>

        <p className="payment-note">
          This is a Cashfree Sandbox payment. No real
          money will be charged.
        </p>
      </section>
    </main>
  );
}

export default Payment;