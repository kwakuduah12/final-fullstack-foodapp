import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LogIn } from './Components/LogInForm/LogIn';
import { CreateAccount } from './Components/SignUp/CreateAccount';
import PasswordRecovery from './Components/PasswordRecovery';
import './App.css';
import Home from './Components/Home';

function App() {
    return (
    <div className="App">
      <Home/>
    </div>
        <Router>
            <Routes>
                <Route path="/login" element={<LogIn />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/" element={<LogIn />} /> 
                <Route path="/password-recovery" element={<PasswordRecovery />} /> 
            </Routes>
        </Router>
    );
}

export default App;
