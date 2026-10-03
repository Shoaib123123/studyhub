import React from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroBanner from "../components/home/HeroBanner";
import CategoryCard from "../components/home/CategoryCard";
import FreeBookCard from "../components/home/FreeBookCard";
import CompetitiveExamPapers from "../components/home/CompetitiveExamPapers";

function Home() {
  const categories = [
    {
      title: "School Subjects",
      subtitle: "For 9th, 10th, 11th & 12th",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      link: "/school-subjects",
    },
    {
      title: "Higher Studies",
      subtitle: "All Popular Courses",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
      link: "/higher-studies",
    },
    {
      title: "Religious Books",
      subtitle: "All Popular Books",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
      link: "/religious-books",
    },
    {
      title: "Exam Ready Notes",
      subtitle: "For 10th & 12th Class",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
      link: "/exam-ready-notes",
    },
  ];

  /* -------------------------------------------------------
     TEMPORARY FREE BOOKS

     We will replace this with Supabase data.
     ------------------------------------------------------- */

  const freeBooks = [
    {
      id: 1,
      title: "Sample Mathematics Book",
      author: "StudyHub",
      coverUrl:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
      pdfUrl: "",
    },
    {
      id: 2,
      title: "Sample English Book",
      author: "StudyHub",
      coverUrl:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      pdfUrl: "",
    },
    {
      id: 3,
      title: "Sample Science Book",
      author: "StudyHub",
      coverUrl:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
      pdfUrl: "",
    },
    {
      id: 4,
      title: "Sample General Knowledge",
      author: "StudyHub",
      coverUrl:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
      pdfUrl: "",
    },
  ];

  return (
    <>
      <Navbar />

      <main>
        <HeroBanner />

        {/* =================================================
            EXPLORE CATEGORIES
            ================================================= */}

        <section className="categories-section">
          <div className="categories-container">
            <h2>Explore Categories</h2>

            <div className="categories-grid">
              {categories.map((category) => (
                <CategoryCard
                  key={category.title}
                  title={category.title}
                  subtitle={category.subtitle}
                  image={category.image}
                  link={category.link}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            FREE BOOKS
            ================================================= */}

        <section className="free-books-section">
          <div className="free-books-container">
            <div className="free-books-heading">
              <span className="free-books-label">
                INTERESTING
              </span>

              <h2>Free Books</h2>

              <p>
                Read and download useful books completely free.
              </p>
            </div>

            <div className="free-books-grid">
              {freeBooks.map((book) => (
                <FreeBookCard
                  key={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  pdfUrl={book.pdfUrl}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            COMPETITIVE EXAM QUESTION PAPERS
            ================================================= */}

        <CompetitiveExamPapers />
      </main>

      <Footer />
    </>
  );
}

export default Home;