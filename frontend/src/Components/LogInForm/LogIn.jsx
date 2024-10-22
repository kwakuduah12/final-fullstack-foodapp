import React from 'react';
import './LogIn.css'; 
import { FaUser, FaLock } from "react-icons/fa"; 
import { Link } from 'react-router-dom'; 

export const LogIn = () => {
    return (
        <div className="login-container"> 
            <div className="login-wrapper"> 
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' required />
                        <FaLock className='icon' />
                    </div>
                    <div className="remember-forgot">
                        <label><input type="checkbox"/>Remember me </label>
                        <Link to="/password-recovery">Forgot Password?</Link>
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>Don't have an account? <Link to="/create-account">Create Account</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};


