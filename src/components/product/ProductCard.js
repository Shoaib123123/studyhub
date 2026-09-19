import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (added) return;

    addToCart(product);
    setAdded(true);

    setTimeout(() => {
      navigate("/cart");
    }, 2000);
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
          />
        ) : (
          <div className="product-image-placeholder">📚</div>
        )}
      </Link>

      <div className="product-card-content">
        <h3>{product.title}</h3>

        <p className="product-price">{formatPrice(product.price)}</p>

        <button
          type="button"
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={added}
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>

        {added && (
          <p className="cart-success-message" role="status">
            ✓ Added to cart! Opening your cart...
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;