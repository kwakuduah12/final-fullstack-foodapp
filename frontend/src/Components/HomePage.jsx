import React from 'react';
import { FaCoffee, FaPizzaSlice, FaHamburger, FaIceCream, FaCarrot, FaFish, FaBreadSlice, FaAppleAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';
import HeaderHome from './HeaderHome';
import '../Styles/Home.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeaderHome />
      <div className="main-container">
        <Sidebar />
        <div className="main-content">
          <div className="content-section categories">
            <h2>Categories</h2>
            <div className="category-icons">
              <div className="category-icon">
                <FaCoffee size={40} />
                <p>Coffee</p>
              </div>
              <div className="category-icon">
                <FaPizzaSlice size={40} />
                <p>Pizza</p>
              </div>
              <div className="category-icon">
                <FaHamburger size={40} />
                <p>Burgers</p>
              </div>
              <div className="category-icon">
                <FaIceCream size={40} />
                <p>Desserts</p>
              </div>
              <div className="category-icon">
                <FaCarrot size={40} />
                <p>Healthy</p>
              </div>
              <div className="category-icon">
                <FaFish size={40} />
                <p>Seafood</p>
              </div>
              <div className="category-icon">
                <FaBreadSlice size={40} />
                <p>Bakery</p>
              </div>
              <div className="category-icon">
                <FaAppleAlt size={40} />
                <p>Fruits</p>
              </div>
            </div>
          </div>

          <div className="content-section promotions">
            <h2>Promotions</h2>
            <div className="promotion-cards">
              <div className="promotion-card">
                <p>Get $5 off orders $20+ with code SPEEDWAY5OFF</p>
              </div>
              <div className="promotion-card">
                <p>20% off orders at 7-Eleven!</p>
              </div>
            </div>
          </div>

          <div className="content-section order-again">
            <h2>Order Again</h2>
            <div className="order-again-cards">
              <div className="order-again-card">
                <img src="path/to/mcdonalds-image.jpg" alt="McDonald's" />
                <p>McDonald's</p>
              </div>
              <div className="order-again-card">
                <img src="path/to/tacobell-image.jpg" alt="Taco Bell" />
                <p>Taco Bell</p>
              </div>
              <div className="order-again-card">
                <img src="path/to/checkers-image.jpg" alt="Checkers" />
                <p>Checkers</p>
              </div>
              {/* Add more cards as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
