import './PasswordRecovery.css';
import React, { useState } from 'react';

const PasswordRecovery = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (emailOrUsername) {
            setMessage('Recovery link sent to ' + emailOrUsername);
        } else {
            setMessage('Please enter your email or username.');
        }
    };

    return (
        <div className="wrapper">
            <h2>Password Recovery</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your email or username"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                />
                <button type="submit">Recover Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordRecovery;
