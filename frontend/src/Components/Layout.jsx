import React from 'react';
import Sidebar from './Sidebar';
import HeaderHome from './HeaderHome';
import '../Styles/Home.css';

const Layout = ({ children }) => {
    console.log("children", children);
  return (
    <div className="home-page">
      <HeaderHome />
      <div className="main-container">
        <Sidebar />
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;