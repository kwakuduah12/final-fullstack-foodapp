import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import '../Styles/MerchantHome.css';
import Menu from './Menu'; 
import { useAuth } from './userContext';

const MerchantHome = () => {
  const [activeSection, setActiveSection] = useState('dashboard'); 
  const [orders, setOrders] = useState([]); // For storing current orders from backend
  const [mostOrderedFoods, setMostOrderedFoods] = useState([]); // For storing most ordered foods from backend

  // Fetch current orders and most ordered foods on component mount
  useEffect(() => {
    fetchOrders();
    fetchMostOrderedFoods();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/order/merchant-orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Orders in the data:", data.data);
        setOrders(data.data);
      } else {
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchMostOrderedFoods = async () => {
    try {
      const response = await fetch('http://localhost:4000/menu/most-ordered', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Most ordered foods:", data.data);
        setMostOrderedFoods(data.data);
      } else {
        console.error("Failed to fetch most ordered foods:", data.message);
      }
    } catch (error) {
      console.error("Error fetching most ordered foods:", error);
    }
  };

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
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <div key={order._id} className="order">
                        <p>Order ID: {order._id}</p>
                        <p>Total Price: ${order.total_price}</p>
                        <p>Status: {order.status}</p>
                        <p>Name of Customer: {order.user_id.name}</p>
                        <p>Order Date: {new Date(order.order_date).toLocaleString()}</p>
                        {order.items && order.items.length > 0 ? (
                          <div>
                            <h4>Items:</h4>
                            {order.items.map(item => (
                              <p key={item._id}>{item.menu_item_id.item_name} - Quantity: {item.quantity}</p>
                            ))}
                          </div>
                        ) : (
                          <p>No items in this order</p>
                        )}
                        <Link to={`/order-details/${order._id}`} className="see-details-link">See Details</Link>
                      </div>
                    ))
                  ) : (
                    <p>No current orders</p>
                  )}
                </div>
              </div>

              <div className="section">
                <h3 className="section-title">Most Ordered Foods</h3>
                <div className="food-list">
                  {mostOrderedFoods.length > 0 ? (
                    mostOrderedFoods.map(food => (
                      <div key={food._id} className="food-item">
                        <img src={food.imageUrl || '/default-food.png'} alt={food.item_name} />
                        <p>{food.item_name}</p>
                      </div>
                    ))
                  ) : (
                    <p>No popular items found</p>
                  )}
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
        <li className={activeSection === 'dashboard' ? 'active' : ''} onClick={() => handleClick('dashboard')}>
          <Link to="/">Dashboard</Link>
        </li>
        <li className={activeSection === 'orders' ? 'active' : ''} onClick={() => handleClick('orders')}>Orders</li>
        <li className={activeSection === 'reviews' ? 'active' : ''} onClick={() => handleClick('reviews')}>Reviews</li>
        <li className={activeSection === 'promotions' ? 'active' : ''} onClick={() => handleClick('promotions')}>Promotions</li>
      </ul>
      <hr className="divider" />
      <ul className="sidebar-bottom-menu">
        <li className={activeSection === 'menu' ? 'active' : ''} onClick={() => handleClick('menu')}>Menu</li>
        <li>Profile</li>
        <li>Settings</li>
        <li>Help</li>
        <li>Sign Out</li>
      </ul>
    </div>
  );
};

const HeaderHome = () => {
  const { userInfo } = useAuth();
  return (
    <header className="header-home">
      <div className="header-left">
        <h1 className="logo">HomeDasher</h1>
        <h3 className="logo">{userInfo?.store_name}</h3>
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

