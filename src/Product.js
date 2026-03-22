import React, { useState, useEffect } from "react";
import "./Product.css";
import { useStateValue } from "./StateProvider";
import { Link } from "react-router-dom";

function Product({ id, title, image, price, rating }) {
  const [, dispatch] = useStateValue();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("aura_wishlist") || "[]");
    setLiked(wishlist.some(item => item.id === id));
  }, [id]);

  const toggleLike = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let wishlist = JSON.parse(localStorage.getItem("aura_wishlist") || "[]");
    if (liked) {
      wishlist = wishlist.filter(item => item.id !== id);
    } else {
      wishlist.push({ id, title, image, price, rating });
    }
    localStorage.setItem("aura_wishlist", JSON.stringify(wishlist));
    setLiked(!liked);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToBasket = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch({
      type: "ADD_TO_BASKET",
      item: { id, title, image, price, rating },
    });
  };

  const tryOn = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch({
      type: "SET_TRY_ON_PRODUCT",
      item: { id, title, image, price, rating },
    });
  };

  return (
    <div className="product">
      <Link to={`/product/${id}`} className="product__link">
        <div className="product__imageContainer">
          <div className="product__likeBtn" onClick={toggleLike}>
              {liked ? "❤️" : "🤍"}
          </div>
          <img 
            src={image} 
            alt={title} 
            className="product__image" 
            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x400?text=Image+Not+Found"; }}
          />
          <div className="product__overlay">
            <button className="product__tryOnBtn" onClick={tryOn}>✨ Virtual Try On</button>
            <button className="product__addBtn" onClick={addToBasket}>Add to Bag</button>
          </div>
        </div>
        <div className="product__info">
          <p className="product__title">{title}</p>
          <div className="product__rating">
            {Array(rating).fill().map((_, i) => (<span key={i}>★</span>))}
          </div>
          <p className="product__price">
            <small>$</small>
            <strong>{price.toFixed(2)}</strong>
          </p>
        </div>
      </Link>
    </div>
  );
}

export default Product;

