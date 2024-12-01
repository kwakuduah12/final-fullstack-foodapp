import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaHome, FaStore, FaCarrot, FaTag, FaListAlt, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import '../Styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Top menu */}
      <ul className="sidebar-menu">
        <li>
          <Link to="/home-page">
            <FaHome /> Home
          </Link>
        </li>
        <li>
          <Link to="/stores">
            <FaStore /> Stores
          </Link>
        </li>
        <li>
          <Link to="/grocery">
            <FaCarrot /> Grocery
          </Link>
        </li>
        <li>
          <Link to="/african-food">
            <FaTag /> African Food
          </Link>
        </li>
        <li>
          <Link to="/promotions">
            <FaListAlt /> Promotions
          </Link>
        </li>
        <li>
          <Link to="/browse-all">
            <FaListAlt /> Browse All
          </Link>
        </li>
      </ul>
      
      <hr className="divider" />
      
      {/* Bottom menu */}
      <ul className="sidebar-bottom-menu">
        <li>
          <Link to="/orders">
            <FaListAlt /> Orders
          </Link>
        </li>
        <li>
          <Link to="/account">
            <FaUserCircle /> Account
          </Link>
        </li>
        <li>
          <Link to="/help">
            <FaQuestionCircle /> Help
          </Link>
        </li>
        <li>
          <Link to="/sign-out">
            <FaSignOutAlt /> Sign Out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;