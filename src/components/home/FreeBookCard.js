import React from "react";
import { BookOpen, Download } from "lucide-react";
import "./FreeBookCard.css";

function FreeBookCard({ title, author, coverUrl, pdfUrl }) {
  const handleRead = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = title || "free-book";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    }
  };

  return (
    <article className="free-book-card">
      <div className="free-book-cover">
        {coverUrl ? (
          <img src={coverUrl} alt={title} />
        ) : (
          <div className="free-book-no-cover">
            <BookOpen size={38} />
          </div>
        )}
      </div>

      <div className="free-book-content">
        <h3 title={title}>{title}</h3>

        {author && (
          <p className="free-book-author">
            {author}
          </p>
        )}

        <div className="free-book-actions">
          <button
            type="button"
            className="free-book-read"
            onClick={handleRead}
            disabled={!pdfUrl}
          >
            <BookOpen size={15} />
            Read
          </button>

          <button
            type="button"
            className="free-book-download"
            onClick={handleDownload}
            disabled={!pdfUrl}
          >
            <Download size={15} />
            Download
          </button>
        </div>
      </div>
    </article>
  );
}

export default FreeBookCard;