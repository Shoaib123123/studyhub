import React from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import EmptyState from "../components/common/EmptyState";
import { formatPrice } from "../utils/formatPrice";
import "./Payment.css";

function Payment() {
  const { cart, totalPrice } = useCart();

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

  return (
    <main className="payment-page">
      <Link to="/cart" className="payment-back-link">
        ← Back to Cart
      </Link>

      <section className="payment-card">
        <p className="payment-eyebrow">DIGITAL ORDER</p>
        <h1>Payment</h1>
        <p className="payment-description">
          Review your order. No delivery address is required for digital books.
        </p>

        <div className="payment-order-list">
          {cart.map((item) => (
            <div className="payment-order-item" key={item.id}>
              <span>
                {item.title} × {item.quantity}
              </span>
              <strong>{formatPrice(Number(item.price || 0) * item.quantity)}</strong>
            </div>
          ))}
        </div>

        <div className="payment-total">
          <span>Total to pay</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </div>

        <button
          type="button"
          className="payment-button"
          disabled
        >
          Payment method coming soon
        </button>

        <p className="payment-note">
          Connect a payment provider before accepting payments.
        </p>
      </section>
    </main>
  );
}

export default Payment;
