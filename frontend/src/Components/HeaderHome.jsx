import React from 'react';
import { FaSearch, FaMapMarkerAlt, FaBell, FaShoppingCart} from 'react-icons/fa';
import '../Styles/HeaderHome.css'; 

const HeaderHome = () => {
  return (
    <header className="header-home">
      <div className="header-left">
        <h1 className="logo">HomeDasher</h1>
      </div>
      <div className="header-center">
        <div className="search-container">
          <input type="text" placeholder="Search for food..." className="search-input" />
          <FaSearch className="search-icon" />
        </div>
        <button className="location-button">
          <FaMapMarkerAlt />
          <span className="location-text">Your Location</span>
        </button>
      </div>
      <div className="header-right">
        <FaBell className="icon" />
        <FaShoppingCart className="icon" />
      </div>
    </header>
  );
};

export default HeaderHome;
