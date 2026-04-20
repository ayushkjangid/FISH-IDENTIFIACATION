import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

const fishClasses = [
  "Clownfish", "Lionfish", "Snapper", "Mahi Mahi", "Tuna", "Salmon", 
  "Barracuda", "Grouper", "Pufferfish", "Swordfish", "Manta Ray",
  "Angelfish", "Tilapia", "Cod", "Halibut", "Stingray", "Marlin"
];

export default function Home() {
  const navigate = useNavigate();

  // Removed static recharts data array

  const getRandomBlip = () => ({
    name: fishClasses[Math.floor(Math.random() * fishClasses.length)],
    conf: Math.floor(Math.random() * 15) + 85
  });

  const [blipData, setBlipData] = useState([
    getRandomBlip(),
    getRandomBlip(),
    getRandomBlip()
  ]);

  const handleAnimationIteration = (index) => {
    setBlipData(prev => {
      const newData = [...prev];
      newData[index] = getRandomBlip();
      return newData;
    });
  };

  return (
    <div className="home">
      {/* 🌊 Hero Section */}
      <section className="hero">
        <div className="overlay">
          <div className="hero-content">
            <h1>
              Welcome to <span>AAIDES</span>
            </h1>
            <p>
              AI-Powered Animal Identification & Detection System for Aquatic Species.
              Upload an image and get instant fish species detection using deep learning.
            </p>
            <button onClick={() => navigate("/detect")} className="btn">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ✨ Features */}
      <section className="features">
        <h2>Our Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="identify" />
            <h3>Identify Species</h3>
            <p>Upload an image and our AI identifies the aquatic species within seconds.</p>
          </div>
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/1239/1239713.png" alt="ai" />
            <h3>AI-Powered Precision</h3>
            <p>Powered by CNN & transfer learning models for robust accuracy.</p>
          </div>
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3069/3069186.png" alt="marine" />
            <h3>Marine Conservation</h3>
            <p>Helping researchers monitor aquatic biodiversity and preserve habitats.</p>
          </div>
        </div>
      </section>

      {/* 🌊 Interactive AI Sonar Scanner */}
      <section className="sonar-section">
        <h2>Live Ocean Scanner</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto", paddingBottom: "2rem" }}>
          Experience the power of our real-time AI detection. Actively processing aquatic structures with deep precision!
        </p>
        
        <div className="sonar-container">
          <div className="sonar-grid"></div>
          <div className="sonar-circle sonar-circle-1"></div>
          <div className="sonar-circle sonar-circle-2"></div>
          <div className="sonar-circle sonar-circle-3"></div>
          <div className="sonar-sweep"></div>

          {/* Animated Detection Blips */}
          <div className="sonar-blip" style={{ top: '25%', left: '65%', animationDelay: '0.9s' }} onAnimationIteration={() => handleAnimationIteration(0)}>
            <div className="sonar-blip-label" style={{ animationDelay: '0.9s' }}>{blipData[0].name} ({blipData[0].conf}%)</div>
          </div>
          <div className="sonar-blip" style={{ top: '75%', left: '35%', animationDelay: '2.8s' }} onAnimationIteration={() => handleAnimationIteration(1)}>
            <div className="sonar-blip-label" style={{ animationDelay: '2.8s' }}>{blipData[1].name} ({blipData[1].conf}%)</div>
          </div>
          <div className="sonar-blip" style={{ top: '40%', left: '20%', animationDelay: '3.4s' }} onAnimationIteration={() => handleAnimationIteration(2)}>
            <div className="sonar-blip-label" style={{ animationDelay: '3.4s' }}>{blipData[2].name} ({blipData[2].conf}%)</div>
          </div>
        </div>
      </section>

      {/* 🌍 Mission Section */}
      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          At AAIDES, we aim to blend artificial intelligence with marine research to simplify
          the identification and study of aquatic species. Our goal is to provide
          accessible tools for marine biologists, students, and enthusiasts alike.
        </p>
        <button className="btn" onClick={() => navigate("/about")}>Learn More</button>
      </section>

      {/* 💬 Testimonials */}
      <section className="reviews">
        <h2>What Our Users Say</h2>
        <div className="review-grid">
          <div className="review-card">
            <p>“AAIDES is incredibly accurate! It identified my fish instantly. Great tool for marine enthusiasts.”</p>
            <h4>- Riya Sharma</h4>
          </div>
          <div className="review-card">
            <p>“The interface is so clean and simple. I use it for my research and it saves me hours every week.”</p>
            <h4>- Dr. Aditya Mehta</h4>
          </div>
          <div className="review-card">
            <p>“A perfect example of how AI can help nature. Love how smooth and fast it works.”</p>
            <h4>- Kavita Patel</h4>
          </div>
        </div>
      </section>

      {/* ⚓ Footer */}
      <footer className="footer">
        <p>© 2025 AAIDES | Designed with 💙 for Ocean Conservation</p>
      </footer>
    </div>
  );
}
