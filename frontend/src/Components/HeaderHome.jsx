import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaBell, FaShoppingCart } from 'react-icons/fa';
import '../Styles/HeaderHome.css';
import { useAuth } from './userContext';
import { Link } from 'react-router-dom';
import Cart from './Cart'; 

const HeaderHome = () => {
  const { userInfo } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false); 

  return (
    <header className="header-home">
      <div className="header-left">
        <h1 className="logo">HomeDasher</h1>
        <h3 className="logo">{userInfo?.name || 'Guest'}</h3>
      </div>
      <div className="header-center">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for food..."
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>
        <button className="location-button">
          <FaMapMarkerAlt />
          <span className="location-text">Your Location</span>
        </button>
      </div>
      <div className="header-right">
        <FaBell className="icon" />
    
        <Link to="/cart">
          <FaShoppingCart className="icon" />
        </Link>

      </div>

      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
          <Cart />
        </div>
      )}
    </header>
  );
};

export default HeaderHome;
