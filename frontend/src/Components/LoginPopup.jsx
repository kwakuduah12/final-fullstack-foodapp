import React from 'react';

const LoginPopup = ({ isVisible, onClose, onSubmit, selectedRole, errorMessage }) => {
  if (!isVisible) return null; // Do not render if the popup is not visible

  return (
    <div className="login-popup">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Welcome {selectedRole}!</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit" className="submit-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
