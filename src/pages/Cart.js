import React from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import EmptyState from "../components/common/EmptyState";
import { formatPrice } from "../utils/formatPrice";
import "./Cart.css";

function Cart() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart.length) {
    return (
      <main className="page-container">
        <EmptyState
          title="Your cart is empty"
          message="Add some books to your cart."
        />
      </main>
    );
  }

  return (
    <main className="page-container">
      <h1>Your Cart</h1>

      <div className="cart-list">
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
          />
        ))}
      </div>

      <div className="cart-summary">
        <h2>Total: {formatPrice(totalPrice)}</h2>
        <button
          type="button"
          className="clear-cart-button"
          onClick={clearCart}
        >
          Clear Cart
        </button>

        <button
          type="button"
          className="checkout-button"
          onClick={() => navigate("/payment")}
        >
          Proceed to Payment
        </button>
      </div>
    </main>
  );
}

export default Cart;
