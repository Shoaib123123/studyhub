import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { downloadFile } from "../utils/downloadHelper";

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
        console.error(error);
      } else {
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
    <main className="page-container">
      <h1>My Library</h1>

      <div className="library-grid">
        {books.map((item) => {
          const book = item.products;

          return (
            <div className="library-card" key={item.id}>
              <img
                src={book.image}
                alt={book.title}
              />

              <h3>{book.title}</h3>

              {book.file_url && (
                <button
                  onClick={() =>
                    downloadFile(
                      book.file_url,
                      `${book.title}.pdf`
                    )
                  }
                >
                  Download
                </button>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default MyLibrary;