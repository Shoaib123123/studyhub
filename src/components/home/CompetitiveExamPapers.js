import React from "react";
import {
  GraduationCap,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

function CompetitiveExamPapers() {
  const exams = [
    {
      name: "JEE",
      description: "Engineering entrance exam papers",
    },
    {
      name: "NEET",
      description: "Medical entrance exam papers",
    },
    {
      name: "GATE",
      description: "Graduate aptitude test papers",
    },
    {
      name: "CAT",
      description: "Management entrance exam papers",
    },
    {
      name: "CLAT",
      description: "Law entrance exam papers",
    },
  ];

  return (
    <section
      id="competitive-exams"
      className="competitive-exams-section"
    >
      <div className="competitive-exams-container">

        {/* Heading */}
        <div className="competitive-exams-heading">

          <span className="competitive-exams-label">
            <GraduationCap size={17} />
            EXAM PREPARATION
          </span>

          <h2>
            Competitive Exam Question Papers
          </h2>

          <p>
            Access previous year question papers for
            popular competitive exams.
          </p>

        </div>

        {/* Exam Cards */}
        <div className="competitive-exams-grid">

          {exams.map((exam) => (
            <Link
              key={exam.name}
              to={`/competitive-exams/${exam.name}`}
              className="competitive-exam-card"
            >

              <div className="competitive-exam-card-left">

                <div className="competitive-exam-icon">
                  <FileText size={22} />
                </div>

                <div className="competitive-exam-card-content">

                  <span className="competitive-exam-name">
                    {exam.name}
                  </span>

                  <span className="competitive-exam-description">
                    {exam.description}
                  </span>

                </div>

              </div>

              <div className="competitive-exam-arrow">
                <ArrowRight size={19} />
              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}

export default CompetitiveExamPapers;