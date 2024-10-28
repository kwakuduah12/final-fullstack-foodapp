import React from 'react';
import { FaUserCircle, FaHome, FaStore, FaCarrot, FaTag, FaListAlt, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import '../Styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li><FaHome /> Home</li>
        <li><FaStore /> Stores</li>
        <li><FaCarrot /> Grocery</li>
        <li><FaTag /> African Food</li>
        <li><FaListAlt /> Promotions</li>
        <li><FaListAlt /> Browse All</li>
      </ul>
      <hr className="divider" />
      <ul className="sidebar-bottom-menu">
        <li><FaListAlt /> Orders</li>
        <li><FaUserCircle /> Account</li>
        <li><FaQuestionCircle /> Help</li>
        <li><FaSignOutAlt /> Sign Out</li>
      </ul>
    </div>
  );
};

export default Sidebar;
