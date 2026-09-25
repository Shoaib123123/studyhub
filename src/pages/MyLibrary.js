
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { downloadFile } from "../utils/downloadHelper";
import "./MyLibrary.css";

function MyLibrary() {
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLibrary() {
      if (!supabase || !user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("library")
        .select(`
          id,
          user_id,
          product_id,
          products (*)
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Library loading error:", error);
      } else {
        console.log("Library products:", data);
        setBooks(data || []);
      }

      setLoading(false);
    }

    loadLibrary();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  if (!books.length) {
    return (
      <main className="page-container">
        <EmptyState
          title="Your library is empty"
          message="Your purchased books will appear here."
        />
      </main>
    );
  }

  return (
    <main className="library-page">
      <div className="library-header">
        <p className="library-eyebrow">
          YOUR PURCHASES
        </p>

        <h1>My Library</h1>

        <p>
          Access and download your purchased books
          and study materials.
        </p>
      </div>

      <div className="library-grid">
        {books.map((item) => {
          const book = item.products;

          if (!book) {
            return (
              <div
                className="library-card"
                key={item.id}
              >
                <h3>Product unavailable</h3>

                <p>
                  Product ID: {item.product_id}
                </p>
              </div>
            );
          }

          return (
            <div
              className="library-card"
              key={item.id}
            >
              {/* Product Image */}
              <div className="library-image-wrapper">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title || "StudyHub product"}
                    className="library-image"
                  />
                ) : (
                  <div className="library-image-placeholder">
                    📚
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="library-content">
                <h2>
                  {book.title || "Untitled Product"}
                </h2>

                {book.description && (
                  <p className="library-description">
                    {book.description}
                  </p>
                )}

                {book.price !== undefined &&
                  book.price !== null && (
                    <p className="library-price">
                      ₹{Number(book.price).toFixed(2)}
                    </p>
                  )}

                {/* PDF Actions */}
                {book.file_url ? (
                  <div className="library-actions">
                    <button
                      type="button"
                      className="library-download-button"
                      onClick={() =>
                        downloadFile(
                          book.file_url,
                          `${book.title || "StudyHub-Book"}.pdf`
                        )
                      }
                    >
                      📥 Download PDF
                    </button>

                    <a
                      href={book.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="library-open-button"
                    >
                      📖 Open PDF
                    </a>
                  </div>
                ) : (
                  <p className="library-no-file">
                    PDF is not available for this product yet.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default MyLibrary;