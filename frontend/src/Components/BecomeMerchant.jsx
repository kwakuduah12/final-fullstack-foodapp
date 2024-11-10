import React, { useState } from 'react';
import '../Styles/BecomeMerchant.css';
import MerchantDashboard from './MerchantHome'; 

const BecomeMerchant = () => {
  const [storeType, setStoreType] = useState('');
  const [registered, setRegistered] = useState(false); 

  const storeTypes = ['Grocery', 'Pet', 'African', 'Restaurant'];

 
  const handleSubmit = (e) => {
    e.preventDefault();

    
    
    setRegistered(true);
  };


  if (registered) {
    return <MerchantDashboard />;
  }

  return (
    <div className="merchant-page">
      <section className="hero-section">
        <div className="register-card">
          <h2>Register Your Store</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="storeName">Name of Store</label>
              <input type="text" id="storeName" placeholder="Enter store name" required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" placeholder="Enter address" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter email" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" placeholder="Enter phone number" required />
            </div>
            <div className="form-group">
              <label htmlFor="storeType">Type of Store</label>
              <select
                id="storeType"
                value={storeType}
                onChange={(e) => setStoreType(e.target.value)}
                required
              >
                <option value="">Select store type</option>
                {storeTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-btn">Register</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BecomeMerchant;
