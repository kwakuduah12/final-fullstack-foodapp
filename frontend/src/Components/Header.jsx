// import React, {useState} from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../Styles/header.css';
// import HeroSection from './Herosection';


// const Header = () => {
//   const [isSignInPopupOpen, setSignInPopupOpen] = useState(false);
//   const [isSignUpPopupOpen, setSignUpPopupOpen] = useState(false);
//   const [isForgotPasswordPopupOpen, setForgotPasswordPopupOpen] = useState(false);

//   const navigate = useNavigate(); 

//   const toggleSignInPopup = () => {
//     setSignInPopupOpen(!isSignInPopupOpen);
//     setSignUpPopupOpen(false); 
//   };

//   const toggleSignUpPopup = () => {
//     setSignUpPopupOpen(!isSignUpPopupOpen);
//     setSignInPopupOpen(false); 
//   };

//   const toggleForgotPasswordPopup = () => {
//     setForgotPasswordPopupOpen(!isForgotPasswordPopupOpen);
//     setSignInPopupOpen(false); 
//     setSignUpPopupOpen(false); 
//   };

//   const handleSignInSubmit = (e) => {
//     e.preventDefault(); 
//     console.log("Sign In Submitted");
//     navigate('/home-page')
//     toggleSignInPopup(); 
//   };

//   const handleSignUpSubmit = (e) => {
//     e.preventDefault(); 
//     console.log("Sign Up Submitted");
//     navigate('/home-page')
//     toggleSignUpPopup(); 
//   };

//   const handleForgotPasswordSubmit = (e) => {
//     e.preventDefault();
//     console.log("Forgot Password Submitted");
//     toggleForgotPasswordPopup(); 
//     toggleSignInPopup();
//   };
  

//   return (
//     <>
//       <header className="header">
//         <div className="logo">
//           <h1>HomeDasher</h1>
//         </div>
//         <nav>
//           <ul className="nav-links">
//             <li>
//               <a href="#signIn" className="sign-in-btn" onClick={toggleSignInPopup}>
//                 Sign In
//               </a>
//             </li>
//             <li>
//               <a href="#createAccount" className="sign-up-btn" onClick={toggleSignUpPopup}>
//                 Create Account
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </header>

//       <HeroSection toggleSignInPopup={toggleSignInPopup} />

//       {/* Sign In Popup */}
//       {isSignInPopupOpen && (
//         <div className="popup">
//           <div className="popup-content">
//             <span className="close" onClick={toggleSignInPopup}>&times;</span>
//             <h2>Sign In</h2>
//             <form id="signInForm" onSubmit={handleSignInSubmit}>
//               <div className="form-group">
//                 <label htmlFor="username">Username:</label>
//                 <input type="text" id="username" required />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password">Password:</label>
//                 <input type="password" id="password" required />
//               </div>

//               <button type="submit" className="submit-btn">Submit</button>
//             </form>
//             <p>
//               <a href="#forgotPassword" className="forgot-password-link" onClick={toggleForgotPasswordPopup}>Forgot Password?</a>
//             </p>
//             <p>
//               Don't have an account? <a href="#createAccount" className="create-account-link" onClick={toggleSignUpPopup}>Create Account</a>
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Sign Up Popup */}
//       {isSignUpPopupOpen && (
//         <div className="popup">
//           <div className="popup-content">
//             <span className="close" onClick={toggleSignUpPopup}>&times;</span>
//             <h2>Create Account</h2>
//             <form id="signUpForm" onSubmit={handleSignUpSubmit}>
//               <label htmlFor="username">Username:</label>
//               <input type="text" id="username" required />

//               <label htmlFor="email">Email:</label>
//               <input type="email" id="email" required />

//               <label htmlFor="password">Password:</label>
//               <input type="password" id="password" required />

//               <label htmlFor="confirmPassword">Confirm Password:</label>
//               <input type="password" id="confirmPassword" required />

//               <button type="submit">Submit</button>
//             </form>
//             <p>
//               Already have an account? <a href="#signIn" className="sign-in-link"onClick={toggleSignInPopup}>Sign In</a>
//             </p>
//           </div>
//         </div>
//       )}
//       {/* Forgot Password Popup */}
//       {isForgotPasswordPopupOpen && (
//         <div className="popup">
//           <div className="popup-content">
//             <span className="close" onClick={toggleForgotPasswordPopup}>&times;</span>
//             <h2>Forgot Password</h2>
//             <form id="forgotPasswordForm" onSubmit={handleForgotPasswordSubmit}>
//               <label htmlFor="email">Email:</label>
//               <input type="email" id="email" required />
//               <button type="submit">Submit</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/header.css';
import HeroSection from './Herosection';

const Header = () => {
  const [isSignInPopupOpen, setSignInPopupOpen] = useState(false);
  const [isSignUpPopupOpen, setSignUpPopupOpen] = useState(false);
  const [isForgotPasswordPopupOpen, setForgotPasswordPopupOpen] = useState(false);

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

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    console.log("Sign In Successful");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:4000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log("Sign In Successful");
        navigate('/home-page');
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
    //console.log("Sign Up Successful");

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    console.log({ name, email, password, confirmPassword });
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

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot Password Submitted");
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

      {/* Sign In Popup */}
      {isSignInPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={toggleSignInPopup}>&times;</span>
            <h2>Sign In</h2>
            <form id="signInForm" onSubmit={handleSignInSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" required />
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
      )}

      {/* Sign Up Popup */}
      {isSignUpPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={toggleSignUpPopup}>&times;</span>
            <h2>Create Account</h2>
            <form id="signUpForm" onSubmit={handleSignUpSubmit}>
              <label htmlFor="name">Username:</label>
              <input type="text" id="name" required />

              <label htmlFor="email">Email:</label>
              <input type="email" id="email" required />

              <label htmlFor="password">Password:</label>
              <input type="password" id="password" required />

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" required />

              <button type="submit">Submit</button>
            </form>
            <p>
              Already have an account? <a href="#signIn" className="sign-in-link" onClick={toggleSignInPopup}>Sign In</a>
            </p>
          </div>
        </div>
      )}

      {/* Forgot Password Popup */}
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
