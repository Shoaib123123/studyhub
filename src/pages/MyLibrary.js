import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import {
  Eye,
  Download,
  BookOpen,
  ShoppingBag,
} from "lucide-react";
import "./MyLibrary.css";

function MyLibrary() {
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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

  // Get the correct PDF path from the product
  const getFilePath = (book) => {
    return book.pdf_path || book.book_file_path || null;
  };

  // Generate a fresh signed URL from Supabase Storage
  const getPdfUrl = async (filePath) => {
    if (!filePath) {
      return null;
    }

    const { data, error } = await supabase.storage
      .from("studyhub-pdfs")
      .createSignedUrl(filePath, 60 * 60);

    if (error) {
      console.error("Supabase PDF URL error:", error);
      return null;
    }

    return data?.signedUrl || null;
  };

  // VIEW PDF
  const handleView = async (book) => {
    const filePath = getFilePath(book);

    if (!filePath) {
      alert("PDF is not available for this product yet.");
      return;
    }

    setActionLoading(`${book.id}-view`);

    try {
      const pdfUrl = await getPdfUrl(filePath);

      if (!pdfUrl) {
        alert("Unable to open the PDF.");
        return;
      }

      window.open(
        pdfUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error("View PDF error:", error);
      alert("Unable to open the PDF.");
    } finally {
      setActionLoading(null);
    }
  };

  // DOWNLOAD PDF
  const handleDownload = async (book) => {
    const filePath = getFilePath(book);

    if (!filePath) {
      alert("PDF is not available for this product yet.");
      return;
    }

    setActionLoading(`${book.id}-download`);

    try {
      const pdfUrl = await getPdfUrl(filePath);

      if (!pdfUrl) {
        alert("Unable to download the PDF.");
        return;
      }

      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error(
          `Download failed: ${response.status}`
        );
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;

      link.download =
        `${book.title || "StudyHub-Book"}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error("Download PDF error:", error);

      alert(
        "Unable to download the PDF. Please try again."
      );
    } finally {
      setActionLoading(null);
    }
  };

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
                <div className="library-content">

                  <h3>
                    Product unavailable
                  </h3>

                  <p>
                    Product ID: {item.product_id}
                  </p>

                </div>
              </div>
            );
          }

          const filePath = getFilePath(book);

          return (
            <div
              className="library-card"
              key={item.id}
            >

              {/* IMAGE */}

              <div className="library-image-wrapper">

                {book.image ? (

                  <img
                    src={book.image}
                    alt={
                      book.title ||
                      "StudyHub product"
                    }
                    className="library-image"
                  />

                ) : (

                  <div className="library-image-placeholder">
                    <BookOpen size={60} />
                  </div>

                )}

              </div>

              {/* CONTENT */}

              <div className="library-content">

                <h2>
                  {book.title ||
                    "Untitled Product"}
                </h2>

                {book.description && (
                  <p className="library-description">
                    {book.description}
                  </p>
                )}

                {book.price !== undefined &&
                  book.price !== null && (
                    <p className="library-price">
                      ₹
                      {Number(book.price).toFixed(2)}
                    </p>
                  )}

                {/* PDF BUTTONS */}

                {filePath ? (

                  <div className="library-actions">

                    <button
                      type="button"
                      className="library-view-button"
                      onClick={() =>
                        handleView(book)
                      }
                      disabled={
                        actionLoading ===
                        `${book.id}-view`
                      }
                    >

                      <Eye size={18} />

                      {actionLoading ===
                      `${book.id}-view`
                        ? "Opening..."
                        : "View PDF"}

                    </button>

                    <button
                      type="button"
                      className="library-download-button"
                      onClick={() =>
                        handleDownload(book)
                      }
                      disabled={
                        actionLoading ===
                        `${book.id}-download`
                      }
                    >

                      <Download size={18} />

                      {actionLoading ===
                      `${book.id}-download`
                        ? "Downloading..."
                        : "Download PDF"}

                    </button>

                  </div>

                ) : (

                  <div className="library-no-file">

                    <ShoppingBag size={18} />

                    <span>
                      PDF is not available
                      for this product yet.
                    </span>

                  </div>

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