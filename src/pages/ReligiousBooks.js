import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/common/Loader";
import "./ReligiousBooks.css";

const religions = [
  {
    name: "Islam",
    icon: "☪️",
    description: "Explore Islamic books",
  },
  {
    name: "Hinduism",
    icon: "🕉️",
    description: "Explore Hindu books",
  },
  {
    name: "Christianity",
    icon: "✝️",
    description: "Explore Christian books",
  },
];

function ReligiousBooks() {
  const [selectedReligion, setSelectedReligion] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      if (!selectedReligion) {
        setProducts([]);
        return;
      }

      if (!supabase) {
        console.error("Supabase is not connected.");
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Religious Books")
        .eq("religion", selectedReligion)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching religious books:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    fetchProducts();
  }, [selectedReligion]);

  function handleReligionSelect(religionName) {
    setSelectedReligion(religionName);
    setProducts([]);
  }

  function handleBack() {
    setSelectedReligion("");
    setProducts([]);
  }

  const currentReligion = religions.find(
    (religion) => religion.name === selectedReligion
  );

  return (
    <main className="page-container">
      <section className="religious-header">
        <p className="religious-small-title">STUDYHUB</p>
        <h1>Religious Books</h1>
        <p className="religious-description">
          Discover and purchase books from different religions.
        </p>
      </section>

      {!selectedReligion ? (
        <section className="religion-selection">
          <div className="section-title">
            <h2>Select a Religion</h2>
            <p>Choose a religion to explore available books.</p>
          </div>

          <div className="religion-cards">
            {religions.map((religion) => (
              <button
                type="button"
                key={religion.name}
                className="religion-card"
                onClick={() => handleReligionSelect(religion.name)}
              >
                <span className="religion-icon">{religion.icon}</span>
                <h2>{religion.name}</h2>
                <p>{religion.description}</p>
                <span className="religion-arrow">→</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="religion-books-section">
          <div className="product-header">
            <button type="button" className="back-button" onClick={handleBack}>
              ← Back to Religions
            </button>

            <div className="breadcrumb">
              <span>Religious Books</span>
              <b>›</b>
              <span>{selectedReligion}</span>
            </div>
          </div>

          <div className="products-title">
            <span>{currentReligion?.icon}</span>
            <h2>{selectedReligion} Books</h2>
            <p>Browse books available for purchase.</p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <ProductGrid
              products={products}
              emptyTitle={`No ${selectedReligion} books found`}
              emptyMessage={`There are no ${selectedReligion} books available yet.`}
            />
          )}
        </section>
      )}
    </main>
  );
}

export default ReligiousBooks;