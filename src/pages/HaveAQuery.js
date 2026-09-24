import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./HaveAQuery.css";

function HaveAQuery() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  });

  const [recentQueries, setRecentQueries] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingQueries, setLoadingQueries] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch latest 4 queries
  const fetchRecentQueries = async () => {
    try {
      setLoadingQueries(true);

      const { data, error } = await supabase
        .from("queries")
        .select("id, name, query, created_at")
        .order("created_at", {
          ascending: false,
        })
        .limit(4);

      if (error) {
        throw error;
      }

      setRecentQueries(data || []);
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      setLoadingQueries(false);
    }
  };

  // Load queries when page opens
  useEffect(() => {
    fetchRecentQueries();
  }, []);

  // Submit query
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Basic validation
    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.query.trim()) {
      setError("Please write your query.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("queries")
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            query: formData.query.trim(),
          },
        ]);

      if (error) {
        throw error;
      }

      setMessage(
        "Your query has been submitted successfully!"
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        query: "",
      });

      // Refresh recent queries
      fetchRecentQueries();
    } catch (error) {
      console.error("Error submitting query:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="query-page">

      {/* HERO / HEADING */}
      <section className="query-header">
        <div className="query-header-content">
          <span className="query-icon">💬</span>

          <h1>Have a Query?</h1>

          <p>
            Have a question about our books, study material,
            previous papers or anything else? Ask us!
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="query-container">

        {/* QUERY FORM */}
        <section className="query-form-section">

          <div className="query-card">

            <h2>Ask Your Question</h2>

            <p className="query-subtitle">
              Fill in the details below and send us your query.
            </p>

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="form-group">
                <label htmlFor="name">
                  Your Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* QUERY */}
              <div className="form-group">
                <label htmlFor="query">
                  Your Query
                </label>

                <textarea
                  id="query"
                  name="query"
                  rows="6"
                  placeholder="Write your question here..."
                  value={formData.query}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* SUCCESS MESSAGE */}
              {message && (
                <div className="query-success">
                  ✓ {message}
                </div>
              )}

              {/* ERROR MESSAGE */}
              {error && (
                <div className="query-error">
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="query-submit-button"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Query"}
              </button>

            </form>
          </div>

        </section>

        {/* RECENT QUERIES */}
        <section className="recent-queries-section">

          <div className="recent-header">
            <h2>Recent Queries</h2>

            <p>
              See what other StudyHub visitors are asking.
            </p>
          </div>

          {loadingQueries ? (
            <div className="queries-loading">
              Loading recent queries...
            </div>
          ) : recentQueries.length === 0 ? (
            <div className="no-queries">
              <span>💬</span>
              <p>
                No queries yet. Be the first to ask a question!
              </p>
            </div>
          ) : (
            <div className="queries-list">

              {recentQueries.map((item, index) => (
                <div
                  className="recent-query-card"
                  key={item.id}
                >
                  <div className="query-number">
                    {index + 1}
                  </div>

                  <div className="recent-query-content">

                    <div className="recent-query-top">
                      <h3>{item.name}</h3>

                      <span>
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <p>{item.query}</p>

                  </div>
                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default HaveAQuery;