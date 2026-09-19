import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/common/Loader";
import "./SchoolSubjects.css";

function SchoolSubjects() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const classes = ["9th", "10th", "11th", "12th"];

  const materialTypes = [
    {
      title: "Previous Papers",
      description: "Previous year question papers and practice papers",
      icon: "📚",
    },
    {
      title: "Exam Important",
      description: "Important questions for exam preparation",
      icon: "📝",
    },
  ];

  useEffect(() => {
    async function fetchProducts() {
      if (!selectedClass || !selectedType) {
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
        .eq("category", "School Subjects")
        .eq("class_name", selectedClass)
        .eq("material_type", selectedType)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    fetchProducts();
  }, [selectedClass, selectedType]);

  function handleClassSelect(className) {
    setSelectedClass(className);
    setSelectedType("");
    setProducts([]);
  }

  function handleMaterialSelect(type) {
    setSelectedType(type);
  }

  function handleBackToClasses() {
    setSelectedClass("");
    setSelectedType("");
    setProducts([]);
  }

  function handleBackToMaterials() {
    setSelectedType("");
    setProducts([]);
  }

  return (
    <main className="school-page">
      <section className="school-header">
        <p className="school-small-title">STUDYHUB</p>
        <h1>School Subjects</h1>
        <p className="school-description">
          Choose your class to find previous papers and important exam materials.
        </p>
      </section>

      {!selectedClass && (
        <section className="school-section">
          <div className="section-title">
            <h2>Select Your Class</h2>
            <p>Choose your class to continue</p>
          </div>

          <div className="class-container">
            {classes.map((className) => (
              <button
                key={className}
                type="button"
                className="class-card"
                onClick={() => handleClassSelect(className)}
              >
                <span className="class-number">{className}</span>
                <span className="class-label">Class {className}</span>
                <span className="arrow">→</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedClass && !selectedType && (
        <section className="school-section">
          <button
            type="button"
            className="back-button"
            onClick={handleBackToClasses}
          >
            ← Back to Classes
          </button>

          <div className="selected-class">
            <span>Selected Class</span>
            <h2>{selectedClass}</h2>
          </div>

          <div className="section-title">
            <h2>Choose Material</h2>
            <p>Select what you want to study</p>
          </div>

          <div className="material-container">
            {materialTypes.map((material) => (
              <button
                key={material.title}
                type="button"
                className="material-card"
                onClick={() => handleMaterialSelect(material.title)}
              >
                <div className="material-icon">{material.icon}</div>

                <div className="material-info">
                  <h3>{material.title}</h3>
                  <p>{material.description}</p>
                </div>

                <span className="material-arrow">→</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedClass && selectedType && (
        <section className="school-section">
          <div className="product-header">
            <button
              type="button"
              className="back-button"
              onClick={handleBackToMaterials}
            >
              ← Back
            </button>

            <div className="breadcrumb">
              <span>School Subjects</span>
              <b>›</b>
              <span>{selectedClass}</span>
              <b>›</b>
              <span>{selectedType}</span>
            </div>
          </div>

          <div className="products-title">
            <span>{selectedClass}</span>
            <h2>{selectedType}</h2>
            <p>
              {selectedType === "Previous Papers"
                ? `Previous papers for ${selectedClass}`
                : `Important exam material for ${selectedClass}`}
            </p>
          </div>

          {loading ? <Loader /> : <ProductGrid products={products} />}
        </section>
      )}
    </main>
  );
}

export default SchoolSubjects;