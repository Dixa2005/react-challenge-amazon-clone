import React from "react";
import "./Home.css";
import Product from "./Product";

function Home() {
  return (
    <div className="home">
      <div className="home__container">
        <img
          className="home__image"
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Aura Style Premium Fashion"
        />

        <div className="home__row">
          <Product
            id="12321341"
            title="Aura Signature - Men's Premium Slim Fit Solid Cotton Polo T-Shirt"
            price={29.99}
            rating={5}
            image="https://m.media-amazon.com/images/I/713n6G8A1mL._AC_UX679_.jpg"
          />
          <Product
            id="49538094"
            title="Aura Luxe - Women's Classic Floral Print Summer Midi Dress"
            price={45.0}
            rating={4}
            image="https://m.media-amazon.com/images/I/71X8kC2mSXL._AC_UY1100_.jpg"
          />
        </div>

        <div className="home__row">
          <Product
            id="4903850"
            title="Aura Vision - Polarized Retro Wayfarer Sunglasses for Men and Women"
            price={15.99}
            rating={3}
            image="https://m.media-amazon.com/images/I/61N9e5G6pEL._AC_UX679_.jpg"
          />
          <Product
            id="23445930"
            title="Aura Sport - Men's Performance Running Shoes - Lightweight & Breathable"
            price={89.99}
            rating={5}
            image="https://m.media-amazon.com/images/I/71NnE9X5Y6L._AC_UY695_.jpg"
          />
          <Product
            id="3254354345"
            title="Aura Elegance - Unisex Classic Minimalist Wrist Watch with Leather Strap"
            price={120.99}
            rating={4}
            image="https://m.media-amazon.com/images/I/71OnyV7Wp-L._AC_UX679_.jpg"
          />
        </div>

        <div className="home__row">
          <Product
            id="90829332"
            title="Aura Rugged - Men's Genuine Leather Bomber Jacket with Quilted Lining"
            price={199.98}
            rating={4}
            image="https://m.media-amazon.com/images/I/71vH9D0yLUL._AC_UX679_.jpg"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
