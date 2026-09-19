import React from "react";
import { Link } from "react-router-dom";

function CategoryCard({ title, image, link }) {
  return (
    <Link to={link} className="category-card">
      <img src={image} alt={title} />

      <div className="category-card-overlay">
        <h3>{title}</h3>
      </div>
    </Link>
  );
}

export default CategoryCard;