import React from "react";
import { Link } from "react-router-dom";

function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-content">
        <h1>Study Smarter, Score Higher</h1>

        <p>
          Explore books for school, Higher Studies, religious studies
          and more.
        </p>

        <Link to="/school-subjects" className="hero-button">
          Explore Books
        </Link>
      </div>
    </section>
  );
}

export default HeroBanner;