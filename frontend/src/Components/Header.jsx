import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './userContext'; // Import useAuth from AuthContext
import '../Styles/header.css';
import HeroSection from './Herosection';

const Header = () => {
  const [isSignInPopupOpen, setSignInPopupOpen] = useState(false);
  const [isSignUpPopupOpen, setSignUpPopupOpen] = useState(false);
  const [isForgotPasswordPopupOpen, setForgotPasswordPopupOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('User'); // Add state to track selected role
  const { userInfo, login, logout } = useAuth(); // Access userInfo, login, and logout from context
  const navigate = useNavigate();

  const toggleSignInPopup = () => {
    setSignInPopupOpen(!isSignInPopupOpen);
    setSignUpPopupOpen(false);
  };

  const toggleSignUpPopup = () => {
    setSignUpPopupOpen(!isSignUpPopupOpen);
    setSignInPopupOpen(false);
  };

  const toggleForgotPasswordPopup = () => {
    setForgotPasswordPopupOpen(!isForgotPasswordPopupOpen);
    setSignInPopupOpen(false);
    setSignUpPopupOpen(false);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value); // Update selected role
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const endpoint = selectedRole === 'Merchant' ? 'merchant/login' : 'user/login'; // Set endpoint based on role

    try {
      const response = await fetch(`http://localhost:4000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token); // Use login from context to save token
        
        // Navigate based on role
        if (selectedRole === 'Merchant') {
          navigate('/merchanthome'); // Redirect to MerchantHome
        } else {
          navigate('/home-page'); // Redirect to HomePage
        }
      } else {
        console.error("Sign In Failed");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }

    toggleSignInPopup();
  };
  

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    try {
      const response = await fetch('http://localhost:4000/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      if (response.ok) {
        console.log("Sign Up Successful");
        navigate('/home-page');
      } else {
        console.error("Sign Up Failed");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    }

    toggleSignUpPopup();
  };

  const handleLogout = () => {
    logout(); // Use logout from context to clear authentication
    navigate('/');
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    toggleForgotPasswordPopup();
    toggleSignInPopup();
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <h1>HomeDasher</h1>
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <a href="#signIn" className="sign-in-btn" onClick={toggleSignInPopup}>
                Sign In
              </a>
            </li>
            <li>
              <a href="#createAccount" className="sign-up-btn" onClick={toggleSignUpPopup}>
                Create Account
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <HeroSection toggleSignInPopup={toggleSignInPopup} />

      {isSignInPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={toggleSignInPopup}>&times;</span>
            <h2>Sign In</h2>
            <form id="signInForm" onSubmit={handleSignInSubmit}>
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

              <button type="submit" className="submit-btn">Login</button>
            </form>
            <p>
              <a href="#forgotPassword" className="forgot-password-link" onClick={toggleForgotPasswordPopup}>Forgot Password?</a>
            </p>
            <p>
              Don't have an account? <a href="#createAccount" className="create-account-link" onClick={toggleSignUpPopup}>Create Account</a>
            </p>
          </div>
        </div>
      )}

{isSignUpPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={toggleSignUpPopup}>&times;</span>
            <h2>Create Account</h2>
            <form id="signUpForm" onSubmit={handleSignUpSubmit}>
              <label htmlFor="name">Username:</label>
              <input type="text" id="name" name="name" required />

              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />

              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required />

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required />

              <button type="submit">Submit</button>
            </form>
            <p>
              Already have an account? <a href="#signIn" className="sign-in-link" onClick={toggleSignInPopup}>Sign In</a>
            </p>
          </div>
        </div>
      )}

      {isForgotPasswordPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={toggleForgotPasswordPopup}>&times;</span>
            <h2>Forgot Password</h2>
            <form id="forgotPasswordForm" onSubmit={handleForgotPasswordSubmit}>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" required />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;