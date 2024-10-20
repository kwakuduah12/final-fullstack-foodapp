const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');


router.post('/signup', (req, res) => {
    let { name, email, password, confirmPassword } = req.body; 
    name = name.trim();
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

   
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All input is required' });
    }

    
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    User.findOne({ email }).then(result => {
        if (result) {
            return res.status(400).json({ message: 'Account already exists' });
        } else {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds).then(hashedPassword => {
                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                });

                newUser.save().then(user => {
                    return res.status(200).json({
                        message: 'Signup successful',
                        data: user,  
                    });
                }).catch(err => {
                    console.error(err.message);
                    return res.status(500).json({ message: 'Error saving user' });
                });
            }).catch(err => {
                console.error(err.message);
                return res.status(500).json({ message: 'Hashing password error' });
            });
        }
    }).catch(err => {
        console.error(err.message);
        return res.status(500).json({ message: 'Server error' });
    });
});


router.post('/login', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!email || !password) {
        return res.status(400).json({ message: 'All input is required' });
    }

    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ message: 'Account not found' });
        }

        bcrypt.compare(password, user.password).then(result => {
            if (!result) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } else {
                return res.status(200).json({ message: 'Login successful' });
            }
        }).catch(err => {
            console.error(err.message);
            return res.status(500).json({ message: 'Error comparing password' });
        });
    }).catch(err => {
        console.error(err.message);
        return res.status(500).json({ message: 'Server error' });
    });
});

module.exports = router;
