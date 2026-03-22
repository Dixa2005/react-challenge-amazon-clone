import React, { useEffect, useState } from 'react';
import './ProductDetail.css';
import { useParams, Link } from 'react-router-dom';
import { clothingDataset } from './dataset';
import { useStateValue } from './StateProvider';
import Product from './Product';

function ProductDetail() {
  const { id } = useParams();
  const [{ basket }, dispatch] = useStateValue();
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  const product = clothingDataset.find(item => item.id === id);
  
  useEffect(() => {
    // Add to Recently Viewed smoothly 
    if (product) {
      let rv = JSON.parse(localStorage.getItem("aura_recently_viewed") || "[]");
      rv = rv.filter(p => p.id !== product.id);
      rv.unshift(product);
      if (rv.length > 5) rv.pop();
      localStorage.setItem("aura_recently_viewed", JSON.stringify(rv));
      setRecentlyViewed(rv.filter(p => p.id !== product.id)); // others
    }
    window.scrollTo(0, 0); // scroll to top nicely
  }, [product, id]);

  if (!product) {
    return (
      <div className="productDetail__notFound">
        <h2>Product not found!</h2>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: product,
    });
  };

  const tryOn = () => {
    dispatch({
      type: "SET_TRY_ON_PRODUCT",
      item: product,
    });
  };

  const similarProducts = clothingDataset.filter(item => 
    item.id !== product.id && 
    item.category === product.category && 
    Math.abs(item.price - product.price) <= 300
  ).slice(0, 4);

  return (
    <div className="productDetail">
      <div className="productDetail__container">
        <div className="productDetail__left">
          <div className="productDetail__imageWrapper">
            <img 
              src={product.image} 
              alt={product.title} 
              onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x400?text=Image+Not+Found"; }}
            />
          </div>
          <button className="productDetail__tryOnBtn" onClick={tryOn}>✨ Virtual AI Try-On</button>
        </div>
        <div className="productDetail__right">
          <h1 className="productDetail__title">{product.title}</h1>
          <div className="productDetail__rating">
            {Array(product.rating).fill().map((_, i) => (<span key={i}>🌟</span>))}
          </div>
          <p className="productDetail__price">
            <small>$</small><strong>{product.price.toFixed(2)}</strong>
          </p>
          <div className="productDetail__description">
            <h3>Product Overview</h3>
            <p>Premium quality clothing carefully designed to elevate your everyday Aura style. Built with high-grade breathable materials, ensuring comfort combined with ultimate luxury. Experience flawless fit with our AI Try-On.</p>
            <ul>
                <li>100% Quality Fabric</li>
                <li>Machine wash allowed</li>
                <li>Imported</li>
            </ul>
          </div>
          
          <button className="productDetail__addToBasket" onClick={addToBasket}>Add to Basket</button>
        </div>
      </div>

      <div className="productDetail__recommendations">
        {similarProducts.length > 0 && (
          <div className="recommendation__section">
            <h2>Similar Products</h2>
            <div className="recommendation__grid">
              {similarProducts.map(item => <Product key={item.id} {...item} />)}
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="recommendation__section">
            <h2>Recently Viewed</h2>
            <div className="recommendation__grid">
              {recentlyViewed.map(item => <Product key={item.id} {...item} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
