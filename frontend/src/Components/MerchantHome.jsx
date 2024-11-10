import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import '../Styles/MerchantHome.css';
import Food from '../Assets/Food1.png';
import Menu from './Menu'; 

const MerchantHome = () => {

  const [activeSection, setActiveSection] = useState('dashboard'); 


  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="home-page">
      <HeaderHome />
      <div className="main-container">
        <Sidebar handleMenuClick={handleMenuClick} />
        <div className="main-content">
          {activeSection === 'dashboard' && (
            <div>
              <div className="section">
                <h2 className="section-title">Current Orders</h2>
                <div className="order-list">
                  <div className="order">
                    <p>Order 1</p>
                    <a href="/order-details" className="see-details-link">See Details</a>
                  </div>
                  <div className="order">
                    <p>Order 2</p>
                    <a href="/order-details" className="see-details-link">See Details</a>
                  </div>
                  <div className="order">
                    <p>Order 3</p>
                    <a href="/order-details" className="see-details-link">See Details</a>
                  </div>
                  <div className="order">
                    <p>Order 4</p>
                    <a href="/order-details" className="see-details-link">See Details</a>
                  </div>
                  <div className="order">
                    <p>Order 5</p>
                    <a href="/order-details" className="see-details-link">See Details</a>
                  </div>
                </div>
              </div>

              <div className="section">
                <h3 className="section-title">Most Ordered Foods</h3>
                <div className="food-list">
                  <div className="food-item">
                    <img src={Food} alt="Food" />
                    <p>Food 1</p>
                  </div>
                  <div className="food-item">
                    <img src={Food} alt="Food" />
                    <p>Food 2</p>
                  </div>
                  <div className="food-item">
                    <img src={Food} alt="Food" />
                    <p>Food 3</p>
                  </div>
                  <div className="food-item">
                    <img src={Food} alt="Food" />
                    <p>Food 4</p>
                  </div>
                  <div className="food-item">
                    <img src={Food} alt="Food" />
                    <p>Food 5</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'menu' && <Menu />} 
          
          {(activeSection === 'orders' || activeSection === 'reviews' || activeSection === 'promotions') && (
            <div className="section">
              <h2>Under Construction</h2>
              <p>This section is still under construction. Please check back later!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Sidebar = ({ handleMenuClick }) => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleClick = (section) => {
    handleMenuClick(section);
    setActiveSection(section);  
  };
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li  className={activeSection === 'dashboard' ? 'active' : ''} 
          onClick={() => handleClick('dashboard')}
        >
          <Link to="/" onClick={() => handleMenuClick('dashboard')}>Dashboard</Link></li>
          <li 
          className={activeSection === 'orders' ? 'active' : ''} 
          onClick={() => handleClick('orders')}
        >
          Orders
        </li>
        <li 
          className={activeSection === 'reviews' ? 'active' : ''} 
          onClick={() => handleClick('reviews')}
        >
          Reviews
        </li>
        <li 
          className={activeSection === 'promotions' ? 'active' : ''} 
          onClick={() => handleClick('promotions')}
        >
          Promotions
        </li>
      </ul>
      <hr className="divider" />
      <ul className="sidebar-bottom-menu">
        <li 
          className={activeSection === 'menu' ? 'active' : ''} 
          onClick={() => handleClick('menu')}
        >
          Menu
        </li>
        <li>Profile</li>
        <li>Settings</li>
        <li>Help</li>
        <li>Sign Out</li>
      </ul>
    </div>
  );
};

const HeaderHome = () => {
  return (
    <header className="header-home">
      <div className="header-left">
        <h1 className="logo">HomeDasher</h1>
      </div>
      <div className="header-center">
        <button className="location-button">
          <span className="location-text">View Store As A Customer</span>
        </button>
      </div>
      <div className="header-right">
        <FaBell className="icon" />
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 HomeDasher. All rights reserved.</p>
        <div className="social-links">
          <a href="#facebook">Victor</a>
          <a href="#instagram">Lawrencia</a>
          <a href="#twitter">Kwaku</a>
          <a href="#twitter">Chellissa</a>
          <a href="#twitter">Hanjoline</a>
          <a href="#twitter">Vincent</a>
        </div>
      </div>
    </footer>
  );
};

export default MerchantHome;
