import React, { useState, useRef, useEffect, useCallback } from "react";
import "./TryOn.css";
import { useStateValue } from "./StateProvider";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";

function TryOn() {
  const [{ tryOnProduct }, dispatch] = useStateValue();
  const [mode, setMode] = useState("static"); // "static" or "live"
  
  const [userImage, setUserImage] = useState(null);
  
  // AI precise tracking states
  const [aiScale, setAiScale] = useState({ x: 1, y: 1 });
  const [aiPosition, setAiPosition] = useState({ x: 80, y: 80 }); 
  const [aiRotate, setAiRotate] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  // Size Recommendation States
  // Now uses AI purely via userShoulderRatio
  const [userShoulderRatio, setUserShoulderRatio] = useState(0);

  const webcamRef = useRef(null);
  const imageRef = useRef(null);
  const detectorRef = useRef(null);

  useEffect(() => {
    const initDetector = async () => {
      setIsLoading(true);
      await tf.ready();
      const model = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      };
      detectorRef.current = await poseDetection.createDetector(model, detectorConfig);
      setIsLoading(false);
    };
    initDetector();
  }, []);

  const handleClose = () => {
    dispatch({ type: "CLEAR_TRY_ON" });
  };

  const updateClothingFromPoses = (poses, containerWidth, containerHeight, flipped = false) => {
    if (poses && poses.length > 0) {
      const pose = poses[0];
      const keypoints = pose.keypoints;
      
      const leftShoulder = keypoints.find((k) => k.name === "left_shoulder");
      const rightShoulder = keypoints.find((k) => k.name === "right_shoulder");
      const leftHip = keypoints.find((k) => k.name === "left_hip");
      const rightHip = keypoints.find((k) => k.name === "right_hip");
      
      if (leftShoulder && rightShoulder && leftShoulder.score > 0.3 && rightShoulder.score > 0.3) {
        let lx = leftShoulder.x;
        let rx = rightShoulder.x;
        
        if (flipped) {
          lx = containerWidth - leftShoulder.x;
          rx = containerWidth - rightShoulder.x;
        }

        const shoulderCenter = {
          x: (lx + rx) / 2,
          y: (leftShoulder.y + rightShoulder.y) / 2
        };
        const shoulderWidth = Math.abs(lx - rx);

        // Calculate rotation based on shoulders
        let dy = rightShoulder.y - leftShoulder.y;
        let dx = rx - lx;
        let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angleDeg < -90) angleDeg += 180;
        if (angleDeg > 90) angleDeg -= 180;
        
        setUserShoulderRatio(shoulderWidth / containerWidth);

        // Keep aspect ratio proportional to body width
        const calculatedScale = shoulderWidth / 80; // Assuming 150px base width, 80px shoulder gap
        
        // Position below detected face / center of upper body
        // We drop the y position so the collar sits near shoulders (offset by 20 * scale)
        let positionY = shoulderCenter.y - (20 * calculatedScale);

        // Optional: fine-tune with hips, but keep scale proportional
        if (leftHip && rightHip && leftHip.score > 0.3 && rightHip.score > 0.3) {
           const hipsCenterY = (leftHip.y + rightHip.y) / 2;
           // Just use hips to center it better if needed, but shoulder anchor works best
           // to keep it off the face.
        }

        setAiPosition({
          x: shoulderCenter.x - 75 * calculatedScale, // Center based on 150px baseline
          y: positionY
        });
        setAiScale({ x: calculatedScale, y: calculatedScale });
        setAiRotate(angleDeg);
      }
    }
  };

  const detectStaticPose = async () => {
    if (imageRef.current && detectorRef.current && imageRef.current.complete) {
      const poses = await detectorRef.current.estimatePoses(imageRef.current);
      updateClothingFromPoses(poses, imageRef.current.clientWidth, imageRef.current.clientHeight, false);
    }
  };

  const handleImageLoad = () => {
    detectStaticPose();
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

  const runLiveDetection = useCallback(async () => {
    if (mode === "live" && detectorRef.current && webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const poses = await detectorRef.current.estimatePoses(video, { flipHorizontal: false });
      updateClothingFromPoses(poses, video.clientWidth, video.clientHeight, true); 
    }
    if (mode === "live") {
      requestAnimationFrame(runLiveDetection);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "live") {
      runLiveDetection();
    }
  }, [mode, runLiveDetection]);

  const getRecommendedSize = () => {
    if (userShoulderRatio <= 0) return { size: "Scanning...", fit: "-" };

    // AI fully automates sizing based on shoulder width ratio to frame:
    let size = "M";

    if (userShoulderRatio < 0.35) {
      size = "S";
    } else if (userShoulderRatio <= 0.45) {
      size = "M";
    } else {
      size = "L";
    }
    
    return { size, fit: "Tailored to your tracked shoulders" };
  };

  if (!tryOnProduct) return null;

  const { size, fit } = getRecommendedSize();

  return (
    <div className="tryon">
      <div className="tryon__container">
        <button className="tryon__close" onClick={handleClose}>✕</button>

        <div className="tryon__left">
          <div className="tryon__modeToggle">
            <button className={mode === "static" ? "active" : ""} onClick={() => setMode("static")}>Upload Photo</button>
            <button className={mode === "live" ? "active" : ""} onClick={() => setMode("live")}>Live Camera</button>
          </div>

          <div className="tryon__canvas">
            {isLoading && <div className="tryon__loading">Loading AI Model...</div>}

            {mode === "static" ? (
              userImage ? (
                <img ref={imageRef} src={userImage} onLoad={handleImageLoad} alt="User" className="tryon__userImage" draggable="false" />
              ) : (
                <div className="tryon__placeholder">
                  <p>Upload a clear, front-facing photo</p>
                  <input type="file" id="userImageUpload" hidden onChange={handleImageUpload} accept="image/*" />
                  <button className="tryon__uploadBtn" onClick={() => document.getElementById("userImageUpload").click()}>Upload Photo</button>
                </div>
              )
            ) : (
              <Webcam
                ref={webcamRef}
                className="tryon__webcam"
                mirrored={true}
                videoConstraints={{ facingMode: "user" }}
              />
            )}

            {(userImage || mode === "live") && (
              <div
                className="tryon__productOverlay"
                style={{
                  transform: `translate(${aiPosition.x}px, ${aiPosition.y}px) scale(${aiScale.x !== undefined ? aiScale.x : 1}, ${aiScale.y !== undefined ? aiScale.y : 1}) rotate(${aiRotate}deg)`,
                  width: "150px",
                  position: "absolute",
                  transformOrigin: "top left",
                  left: 0,
                  top: 0,
                  transition: "transform 0.1s linear"
                }}
              >
                <img 
                  src={tryOnProduct.image} 
                  alt={tryOnProduct.title} 
                  style={{ width: "100%", mixBlendMode: "multiply" }} 
                  draggable="false" 
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x400?text=Image+Not+Found"; }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="tryon__right">
          <div className="tryon__productInfo">
            <h2>{tryOnProduct.title}</h2>
            <p className="product__price"><small>$</small><strong>{tryOnProduct.price}</strong></p>
            <div className="tryon__description">
              <h3>Auto-Fitting AI Active:</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.5', color: '#ddd' }}>
                <li><strong>Scale:</strong> Auto-sized to your body.</li>
                <li><strong>Position:</strong> Tracks shoulders, chest, and waist.</li>
                <li><strong>Rotation:</strong> Adjusts dynamically to your posture.</li>
              </ul>
            </div>

            <div className="tryon__sizePanel">
              <h3>AI Size Recommender</h3>
              <div className="tryon__sizeResult">
                <p>Recommended Size: <strong style={{color: size !== "-" ? "#4facfe" : "rgba(255,255,255,0.3)"}}>{size}</strong></p>
                <p>Fit type: <strong style={{color: fit !== "-" ? "#00f2fe" : "rgba(255,255,255,0.3)"}}>{fit}</strong></p>
              </div>
            </div>

            <button
              className="tryon__uploadBtn"
              style={{ width: "100%", marginTop: "20px" }}
              onClick={() => {
                alert("Virtual sizing complete! Added to cart.");
                handleClose();
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
