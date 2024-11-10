import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import FeatureSection from './Components/FeatureSection';
import Testimonials from './Components/Testimonials';
import Footer from './Components/Footer';
import Partnership from './Components/PartnershipSection';
import './Styles/App.css';
import BecomeDasher from './Components/BecomeDasher';
import BecomeMerchant from './Components/BecomeMerchant';
import UseMobileApp from './Components/UseMobileApp';
import HomePage from './Components/HomePage';
import './Styles/Home.css';
import MerchantHome from './Components/MerchantHome';
import Menu from './Components/Menu';

const App = () => {
  const location = useLocation(); 

  return (
    <div className="App">
      {location.pathname === '/' && <Header />}
      
      <Routes>
        <Route path="/" element={
          <>
            <FeatureSection />
            <Partnership />
            <Testimonials />
            <Footer />
          </>
        } />
        <Route path="/become-dasher" element={<BecomeDasher />} />
        <Route path="/become-merchant" element={<BecomeMerchant />} />
        <Route path="/use-mobile-app" element={<UseMobileApp />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/merchanthome" element={<MerchantHome />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </div>
  );
}

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
