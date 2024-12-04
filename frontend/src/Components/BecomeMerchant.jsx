import React, { useState } from 'react';
import '../Styles/BecomeMerchant.css';

const BecomeMerchant = () => {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    storeName: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    storeType: ''
  });

  const storeTypes = ['Asian', 'Mexican', 'African', 'Italian'];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/merchant/signup', {
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
        console.log('Signup successful');
        setError(''); // Clear error if registration is successful
        
        // Redirect to landing page
        window.location.href = '/'; // Adjust the path as necessary
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="merchant-page">
      <section className="hero-section">
        <div className="register-card">
          <h2>Register Your Store</h2>
          {error && <p className="error-message">{error}</p>}
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