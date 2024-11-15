import React from 'react';
import '../Styles/hero.css';

const HeroSection = ({ toggleSignInPopup }) => {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <h2>Get Your Food Delivered Fast</h2>
        <p>Order food from the best restaurants around you and have it delivered in no time.</p>
        <button className="cta-btn" onClick={toggleSignInPopup}>Order Now</button>
      </div>
    </section>
  );
};

export default HeroSection;
