const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Merchant = require('../models/merchants');
const authenticate = require("../middlewares/authMiddleWares");


const JWT_SECRET = process.env.JWT_SECRET;


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
                    role: 'User' 
                });

                newUser.save().then(user => {
                    return res.status(200).json({
                        message: 'Signup successful. Please log in.',
                        data: user
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
                
                const token = jwt.sign(
                    { id: user._id, role: "User" }, 
                    JWT_SECRET,
                    { expiresIn: '1h' } 
                );
                return res.status(200).json({ message: 'Login successful', token });
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

// Get user profile
router.get('/profile', authenticate(['User']), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User profile retrieved successfully', data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user information' });
    }
});

router.get('/balance', authenticate(['User', 'Merchant']), async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role; // Assuming `role` is included in the token payload

    try {
        if (role === 'User') {
            // Fetch User Balance
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'Balance retrieved successfully', balance: user.balance || 0 });
        } else if (role === 'Merchant') {
            // Fetch Merchant Balance
            const merchant = await Merchant.findById(userId);
            if (!merchant) {
                return res.status(404).json({ message: 'Merchant not found' });
            }
            return res.status(200).json({ message: 'Balance retrieved successfully', balance: merchant.balance || 0 });
        } else {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ message: 'Error retrieving balance' });
    }
});




module.exports = router;