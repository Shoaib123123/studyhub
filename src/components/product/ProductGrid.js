import React from "react";
import ProductCard from "./ProductCard";
import EmptyState from "../common/EmptyState";
import "./ProductGrid.css";

function ProductGrid({
  products = [],
  variant = "products",
  emptyTitle = "No books found",
  emptyMessage = "There are currently no books in this category.",
}) {
  if (!products.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  if (variant === "religious-pdf") {
    return (
      <div className="product-grid pdf-books-grid">
        {products.map((book) => (
          <article className="pdf-book-card" key={book.id || book.name}>
            <span className="pdf-icon">📕</span>

            <h3>{book.displayName}</h3>

            <a
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="read-book-button"
            >
              Read PDF
            </a>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;