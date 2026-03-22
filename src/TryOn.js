import React, { useState } from "react";
import "./TryOn.css";
import { useStateValue } from "./StateProvider";

function TryOn() {
  const [{ tryOnProduct }, dispatch] = useStateValue();
  const [userImage, setUserImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  if (!tryOnProduct) return null;

  const handleClose = () => {
    dispatch({
      type: "CLEAR_TRY_ON",
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const container = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - container.left - 50; // Adjust offsets as needed
      const y = e.clientY - container.top - 50;
      setPosition({ x, y });
    }
  };

  return (
    <div className="tryon">
      <div className="tryon__container">
        <button className="tryon__close" onClick={handleClose}>
          ✕
        </button>

        <div className="tryon__left">
          <div
            className="tryon__canvas"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {userImage ? (
              <img src={userImage} alt="User" className="tryon__userImage" />
            ) : (
              <div className="tryon__placeholder">
                <p>Please upload your photo</p>
                <input
                  type="file"
                  id="userImageUpload"
                  hidden
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <button
                  className="tryon__uploadBtn"
                  onClick={() =>
                    document.getElementById("userImageUpload").click()
                  }
                >
                  Upload Photo
                </button>
              </div>
            )}

            {userImage && (
              <div
                className="tryon__productOverlay"
                onMouseDown={handleMouseDown}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotate}deg)`,
                  width: "150px", // Fixed width for overlay logic
                }}
              >
                <img
                  src={tryOnProduct.image}
                  alt={tryOnProduct.title}
                  style={{ width: "100%" }}
                  draggable="false"
                />
              </div>
            )}
          </div>

          {userImage && (
            <div className="tryon__controls">
              <div className="tryon__controlGroup">
                <label>Scale: {scale.toFixed(2)}x</label>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                />
              </div>
              <div className="tryon__controlGroup">
                <label>Rotate: {rotate}°</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotate}
                  onChange={(e) => setRotate(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>

        <div className="tryon__right">
          <div className="tryon__productInfo">
            <h2>{tryOnProduct.title}</h2>
            <p className="product__price">
              <small>$</small>
              <strong>{tryOnProduct.price}</strong>
            </p>
            <div className="tryon__description">
              <h3>Virtual Try-On Guide:</h3>
              <ol>
                <li>Upload a clear, front-facing photo of yourself.</li>
                <li>Drag the product to position it correctly.</li>
                <li>Use the sliders to adjust scale and rotation for a perfect fit.</li>
              </ol>
            </div>
            <button
              className="tryon__uploadBtn"
              style={{ width: "100%", marginTop: "40px" }}
              onClick={() => {
                alert("Virtual sizing complete! Added to cart with these adjustments.");
                // Optionally add to basket logic here
              }}
            >
              Confirm Fit & Add to Basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TryOn;
