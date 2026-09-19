import React from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroBanner from "../components/home/HeroBanner";
import CategoryCard from "../components/home/CategoryCard";

function Home() {
  const categories = [
    {
      title: "School Subjects",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      link: "/school-subjects",
    },
    {
      title: "Graduation",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
      link: "/graduation",
    },
    {
      title: "Religious Books",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
      link: "/religious-books",
    },
  ];

  return (
    <>
      <Navbar />

      <main>
        <HeroBanner />

        <section className="categories-section">
          <div className="categories-container">
            <h2>Explore Categories</h2>

            <div className="categories-grid">
              {categories.map((category) => (
                <CategoryCard
                  key={category.title}
                  title={category.title}
                  image={category.image}
                  link={category.link}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;