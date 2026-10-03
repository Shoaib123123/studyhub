import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowLeft,
  FileText,
  GraduationCap,
  LoaderCircle,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";

function CompetitiveExamPapersPage() {
  const { exam } = useParams();

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const examName = exam ? exam.toUpperCase() : "";

  /*
   * Fetch papers for selected exam
   */
  const fetchPapers = useCallback(async () => {
  setLoading(true);

  const { data, error } = await supabase
    .from("competitive_exam_papers")
    .select("*")
    .eq("exam", examName)
    .order("year", { ascending: false })
    .order("subject", { ascending: true });

  console.log("=================================");
  console.log("Exam:", examName);
  console.log("Papers:", data);
  console.log("Supabase Error:", error);
  console.log("=================================");

  if (error) {
    console.error(
      "Error fetching competitive exam papers:",
      error
    );

    setPapers([]);
  } else {
    setPapers(data || []);
  }

  setLoading(false);
}, [examName]);
  /*
   * Fetch whenever exam changes
   */
  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  /*
   * Download PDF
   */
  const handleDownload = async (paper) => {
    try {
      setDownloadingId(paper.id);

      const { data, error } = await supabase.storage
        .from("competitive-exams")
        .download(paper.file_path);

      if (error) {
        console.error(
          "PDF download error:",
          error
        );

        alert(
          "Unable to download this question paper. Please try again."
        );

        return;
      }

      const url = window.URL.createObjectURL(data);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${paper.paper_name}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(
        "Download error:",
        error
      );

      alert(
        "Something went wrong while downloading the paper."
      );

    } finally {
      setDownloadingId(null);
    }
  };

  /*
   * Back to Competitive Exam section
   */
  const handleBackToExams = () => {
    window.location.href = "/#competitive-exams";
  };

  return (
    <section className="competitive-papers-page">

      <div className="competitive-papers-page-container">

        {/* Back Button */}
        <button
          type="button"
          className="competitive-papers-back"
          onClick={handleBackToExams}
        >
          <ArrowLeft size={18} />

          <span>
            Back to Competitive Exams
          </span>
        </button>

        {/* Page Header */}
        <div className="competitive-papers-page-header">

          <div className="competitive-papers-page-icon">
            <GraduationCap size={28} />
          </div>

          <div>

            <span className="competitive-papers-page-label">
              EXAM PREPARATION
            </span>

            <h1>
              {examName} Question Papers
            </h1>

            <p>
              Previous year question papers for{" "}
              {examName}.
            </p>

          </div>

        </div>

        {/* Paper Count */}
        {!loading && papers.length > 0 && (
          <div className="competitive-papers-result-info">

            <span>
              {papers.length}{" "}
              {papers.length === 1
                ? "paper"
                : "papers"}{" "}
              available
            </span>

          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="competitive-page-loading">

            <LoaderCircle
              size={28}
              className="competitive-loading-icon"
            />

            <p>
              Loading question papers...
            </p>

          </div>

        ) : papers.length === 0 ? (

          /* Empty State */
          <div className="competitive-page-empty">

            <div className="competitive-empty-icon">
              <FileText size={28} />
            </div>

            <h3>
              No papers available
            </h3>

            <p>
              There are no {examName} question papers
              available yet.
            </p>

            <button
              type="button"
              className="competitive-empty-back"
              onClick={handleBackToExams}
            >
              Back to Competitive Exams
            </button>

          </div>

        ) : (

          /* Papers List */
          <div className="competitive-paper-list">

            {papers.map((paper) => (

              <div
                key={paper.id}
                className="competitive-paper-row"
              >

                {/* Left Side */}
                <div className="competitive-paper-row-info">

                  <div className="competitive-paper-row-icon">
                    <FileText size={21} />
                  </div>

                  <div className="competitive-paper-row-details">

                    <h3>
                      {paper.paper_name}
                    </h3>

                    <div className="competitive-paper-row-meta">

                      <span>
                        {paper.year}
                      </span>

                      {paper.subject && (
                        <>
                          <span className="competitive-meta-dot">
                            •
                          </span>

                          <span>
                            {paper.subject}
                          </span>
                        </>
                      )}

                    </div>

                  </div>

                </div>

                {/* Download Button */}
                <button
                  type="button"
                  className="competitive-download-button"
                  onClick={() =>
                    handleDownload(paper)
                  }
                  disabled={
                    downloadingId === paper.id
                  }
                >

                  {downloadingId === paper.id ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="competitive-loading-icon"
                      />

                      <span>
                        Downloading...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Download
                      </span>

                      <ArrowDownToLine
                        size={17}
                      />
                    </>
                  )}

                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}

export default CompetitiveExamPapersPage;