import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, BookOpenCheck, ArrowRight } from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "./ExamReadyNotes.css";

function ExamReadyNotes() {
  const classes = [
    {
      title: "10th",
      description: "Exam Ready Notes for Class 10",
      icon: GraduationCap,
      link: "/exam-ready-notes/10th",
    },
    {
      title: "12th",
      description: "Exam Ready Notes for Class 12",
      icon: BookOpenCheck,
      link: "/exam-ready-notes/12th",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="exam-ready-section">
        <div className="exam-ready-container">

          <div className="exam-ready-heading">
            <span className="exam-ready-label">
              <BookOpenCheck size={18} />
              EXAM PREPARATION
            </span>

            <h1>Exam Ready Notes</h1>

            <p>
              Choose your class and explore useful notes
              for your exam preparation.
            </p>
          </div>

          <div className="exam-ready-grid">
            {classes.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.link}
                  className="exam-ready-card"
                >
                  <div className="exam-ready-icon">
                    <Icon size={32} strokeWidth={1.8} />
                  </div>

                  <div className="exam-ready-content">
                    <h2>{item.title}</h2>
                    <span>{item.description}</span>
                  </div>

                  <div className="exam-ready-arrow">
                    <ArrowRight size={20} />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default ExamReadyNotes;