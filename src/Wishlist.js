import React, { useState, useEffect } from 'react';
import './Wishlist.css';
import Product from './Product';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("aura_wishlist") || "[]");
    setWishlistItems(items);

    const handleUpdate = () => {
      setWishlistItems(JSON.parse(localStorage.getItem("aura_wishlist") || "[]"));
    };

    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleUpdate);
  }, []);

  return (
    <div className='wishlist'>
      <div className='wishlist__container'>
        <h1 className="wishlist__title">Your Wishlist ❤️</h1>
        {wishlistItems.length === 0 ? (
          <div className="wishlist__empty">
            <p>Your wishlist is currently empty.</p>
            <p>Explore some amazing styles and click the heart icon to save them!</p>
          </div>
        ) : (
          <div className='wishlist__grid'>
            {wishlistItems.map(item => (
              <Product
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                rating={item.rating}
                image={item.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
