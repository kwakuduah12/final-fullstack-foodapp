import React from 'react';
// import Sidebar from './Sidebar';
import HeaderHome from './HeaderHome';
import '../Styles/Home.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeaderHome />
      <div className="main-container">
        {/* <Sidebar /> */}
        <div className="main-content">
          {/* You can add your main content here */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
