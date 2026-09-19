import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/common/Loader";

function HigherStudies() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "HigherStudies")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="page-container">
      <h1>Higher Studies</h1>

      <ProductGrid products={products} />
    </main>
  );
}

export default HigherStudies;