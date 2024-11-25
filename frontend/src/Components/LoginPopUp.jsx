import React, { useState } from 'react';
import '../Styles/header.css';

const LoginPopup = ({
  isVisible,
  onClose,
  onSubmit,
  selectedRole,
  handleRoleChange,
  toggleForgotPasswordPopup,
  toggleSignUpPopup,
  errorMessage
}) => {
  const [error, setError] = useState(''); // State to store error message



  // Enhanced onSubmit to handle errors
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSubmit(e);
    } catch (error) {
        console.error('Error during sign-in:', error);
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Sign In</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}

        <form id="signInForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          
          {/* Role Selection */}
          <div className="form-group">
            <label>Role:</label>
            <input
              type="radio"
              id="userRole"
              name="role"
              value="User"
              checked={selectedRole === 'User'}
              onChange={handleRoleChange}
            />
            <label htmlFor="userRole">User</label>
            <input
              type="radio"
              id="merchantRole"
              name="role"
              value="Merchant"
              checked={selectedRole === 'Merchant'}
              onChange={handleRoleChange}
            />
            <label htmlFor="merchantRole">Merchant</label>
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
        <p>
          <a href="#forgotPassword" className="forgot-password-link" onClick={toggleForgotPasswordPopup}>Forgot Password?</a>
        </p>
        <p>
          Don't have an account? <a href="#createAccount" className="create-account-link" onClick={toggleSignUpPopup}>Create Account</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;