import React from "react";
import "./Home.css";
import Product from "./Product";
import { clothingDataset } from "./dataset";

function Home() {
  // Real-feeling recommendations by mixing categories
  const recommended = [clothingDataset[0], clothingDataset[5], clothingDataset[12], clothingDataset[21]];
  const trending = [clothingDataset[1], clothingDataset[6], clothingDataset[18], clothingDataset[23], clothingDataset[13], clothingDataset[9]];
  const newArrivals = clothingDataset.slice(9, 15);

  return (
    <div className="home">
      <div className="home__container">
        <div className="home__heroSection">
          <img
            className="home__heroImage"
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80"
            alt="Aura Style Premium Fashion"
          />
          <div className="home__heroText">
            <h1>Discover Your Aura</h1>
            <p>Experience the latest in fashion with our AI-powered virtual try-on.</p>
          </div>
        </div>

        <div className="home__section">
          <h2 className="home__sectionTitle">Recommended For You</h2>
          <div className="home__clothingGrid">
            {recommended.map((item) => (
              <Product key={item.id} {...item} />
            ))}
          </div>
        </div>

        <div className="home__section">
          <h2 className="home__sectionTitle">Trending Now</h2>
          <div className="home__clothingGrid">
            {trending.map((item) => (
              <Product key={item.id} {...item} />
            ))}
          </div>
        </div>

        <div className="home__section">
          <h2 className="home__sectionTitle">New Arrivals</h2>
          <div className="home__clothingGrid">
            {newArrivals.map((item) => (
              <Product key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
