import React from 'react';
import '../Styles/features.css';
import qualityFood from '../Assets/quality-food.png'

const FeatureSection = () => {
  return (
    <section id="features" className="features">
      <h2>Why Choose Us</h2>
      <div className="features-grid">
        <div className="feature-item">
        <img src={qualityFood} alt="Fast Delivery" className="feature-icon" />
          <h3>Fast Delivery</h3>
          <p>We ensure the food gets to you hot and fast.</p>
        </div>
        <div className="feature-item">
        <img src={qualityFood} alt="Fast Delivery" className="feature-icon" />
          <h3>Top Restaurants</h3>
          <p>Order from the top restaurants in your area.</p>
        </div>
        <div className="feature-item">
        <img src={qualityFood} alt="Fast Delivery" className="feature-icon" />
          <h3>Easy Payments</h3>
          <p>Pay securely through various payment options.</p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
