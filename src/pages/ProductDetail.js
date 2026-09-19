import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useCart from "../hooks/useCart";
import Loader from "../components/common/Loader";
import { formatPrice } from "../utils/formatPrice";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!supabase) {
        setLoading(false);
        setErrorMessage("Supabase is not connected.");
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error loading product:", error);
        setErrorMessage("Unable to load this product.");
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);

      // Create a temporary signed URL for the private PDF
      if (data.pdf_url) {
        setPdfLoading(true);

        try {
          let filePath = data.pdf_url;

          /*
            If pdf_url contains a full Supabase Storage URL,
            extract ONLY the file path inside the bucket.
          */
          if (filePath.startsWith("http")) {
            const marker = "/storage/v1/object/";

            if (filePath.includes(marker)) {
              // Extract everything after the marker
              const storagePart = filePath.split(marker)[1];
              
              // Split by "/" to separate the modifier, bucket, and file path
              const parts = storagePart.split("/");
              
              // parts[0] = "public" or "authenticated" or "sign"
              // parts[1] = "studyhub-pdfs" (the bucket name)
              // parts[2+] = the actual file path inside the bucket
              
              // Rejoin everything after the bucket name to get the correct path
              filePath = parts.slice(2).join("/");
            }
          }

          const { data: signedData, error: signedError } =
            await supabase.storage
              .from("studyhub-pdfs")
              .createSignedUrl(filePath, 3600);

          if (signedError) {
            console.error("PDF URL error:", signedError);
          } else {
            setPdfUrl(signedData?.signedUrl || "");
          }
        } catch (error) {
          console.error("PDF error:", error);
        }

        setPdfLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (errorMessage || !product) {
    return (
      <main className="page-container">
        <h1>Book not found</h1>
        {errorMessage && <p>{errorMessage}</p>}
      </main>
    );
  }

  return (
    <main className="product-details">
      {/* Product Image */}
      {product.image ? (
        <img
          src={product.image}
          alt={product.title}
          className="product-details-image"
        />
      ) : (
        <div className="product-no-image">
          <span>📚</span>
          <p>PDF Study Material</p>
        </div>
      )}

      <div className="product-details-content">
        <h1>{product.title}</h1>

        <p className="product-price">
          {formatPrice(product.price)}
        </p>

        {product.description && <p>{product.description}</p>}

        {/* Product Information */}
        {product.class_name && (
          <p>
            <strong>Class:</strong> {product.class_name}
          </p>
        )}

        {product.material_type && (
          <p>
            <strong>Material:</strong> {product.material_type}
          </p>
        )}

        {/* PDF Buttons */}
        {product.pdf_url && (
          <div className="pdf-actions">
            {pdfLoading ? (
              <p>Preparing PDF...</p>
            ) : pdfUrl ? (
              <>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-pdf-button"
                >
                  📖 View PDF
                </a>

                <a
                  href={pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-pdf-button"
                >
                  ⬇ Download PDF
                </a>
              </>
            ) : (
              <p className="pdf-error">
                PDF is currently unavailable.
              </p>
            )}
          </div>
        )}

        {/* Add to Cart */}
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="add-cart-button"
        >
          Add to Cart
        </button>
      </div>
    </main>
  );
}

export default ProductDetails;