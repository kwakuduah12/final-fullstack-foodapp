import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/partnership.css';
import dasher from '../Assets/dasher.png'
import mobileApp from '../Assets/mobileapp.png'
import restaurant from '../Assets/restaurant.png'

const PartnershipSection = () => {
  return (
    <div className="partnership-section">

      {/* Become a Dasher */}
      <div className="partnership-item">
        <img src={dasher} alt="Become a Dasher" />
        <div className="partnership-text">
        <Link to="/become-dasher">
          <h2>Become a Dasher</h2>
          </Link>
          <p>Join our team of delivery drivers and start earning money on your schedule.</p>
        </div>
      </div>

      {/* Become a Merchant */}
      <div className="partnership-item reverse">
      <img src={restaurant} alt="Become a Merchant" />
        <div className="partnership-text">
        <Link to="/become-merchant">
          <h2>Become a Merchant</h2>
          </Link>
          <p>Partner with us to expand your business and reach more customers.</p>
        </div>   
      </div>

      {/* Use Our Phone App */}
      <div className="partnership-item">
        <img src={mobileApp} alt="Use Our Phone App" />
        <div className="partnership-text">
        <Link to="/use-mobile-app">
          <h2>Use Our Phone App</h2>
          </Link>
          <p>Download our app for a seamless and convenient experience.</p>
        </div>
      </div>
    </div>
  );
};

export default PartnershipSection;
