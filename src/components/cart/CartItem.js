import React from "react";
import useCart from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";
import "./CartItem.css";

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img
        src={item.image}
        alt={item.title}
        className="cart-item-image"
      />

      <div className="cart-item-info">
        <h3>{item.title}</h3>

        <p>{formatPrice(item.price)}</p>

        <div className="quantity-controls">
          <button
            onClick={() =>
              updateQuantity(item.id, item.quantity - 1)
            }
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() =>
              updateQuantity(item.id, item.quantity + 1)
            }
          >
            +
          </button>
        </div>

        <button
          className="remove-button"
          onClick={() => removeFromCart(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;