import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserCircle,
  FaHome,
  FaStore,
  FaCarrot,
  FaTag,
  FaListAlt,
  FaSignOutAlt,
  FaQuestionCircle,
  FaWallet,
} from 'react-icons/fa';
import '../Styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="sidebar">
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
          <Link to="/wallet">
            <FaWallet /> Wallet
          </Link>
        </li>
        <li>
          <Link to="/help">
            <FaQuestionCircle /> Help
          </Link>
        </li>
        <li>
          <button onClick={handleSignOut} className="sign-out-btn">
            <FaSignOutAlt /> Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

