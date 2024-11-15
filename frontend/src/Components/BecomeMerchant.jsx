import React, { useState } from 'react';
import '../Styles/BecomeMerchant.css';
import MerchantDashboard from './MerchantHome';

const BecomeMerchant = () => {
  const [storeType, setStoreType] = useState('');
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    storeType: ''
  });

  const storeTypes = ['Grocery', 'Pet', 'African', 'Restaurant'];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/merchant/signup', { // Adjust the URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store_name: formData.storeName,
          address: formData.address,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone_number: formData.phone,
          store_type: formData.storeType
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        setRegistered(true); // Redirect to the dashboard on successful registration
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
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
              <input type="text" id="storeName" value={formData.storeName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="storeType">Type of Store</label>
              <select
                id="storeType"
                value={formData.storeType}
                onChange={handleChange}
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