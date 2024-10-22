import React, { useState } from "react";
import './CreateAccount.css'; 
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"; 

export const CreateAccount = () => {
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [error, setError] = useState("");
        const [success, setSuccess] = useState("");
      
        const handleSubmit = async (e) => {
          e.preventDefault();
          setError("");
          setSuccess("");
      
          if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
          }
      
          if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.");
            return;
          }
      
          if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
          }
      
          const response = await fakeApiCall({ name, email, password });
          if (response.success) {
            setSuccess("Account created successfully!");
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          } else {
            setError("Error creating account. Please try again.");
          }
        };
      
        const fakeApiCall = (userData) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ success: true });
            }, 1000);
          });
        };

    return (
        <div className="create-account-container"> 
            <div className="create-account-wrapper"> 
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                        <FaEnvelope className='icon' /> 
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                        <FaLock className='icon' />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                        />
                        <FaLock className='icon' />
                    </div>
                    <button type="submit">Create Account</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                </form>
                <div>
                  <p>Already have an account? <Link to="/login">Log In</Link></p>
                </div>  
            </div>
        </div>
    );
};

