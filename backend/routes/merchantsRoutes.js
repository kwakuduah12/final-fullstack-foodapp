const express = require('express');
const router = express.Router();
const Merchant = require('../models/merchants');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authMiddleWares');

const JWT_SECRET = process.env.JWT_SECRET;// Replace with a secure key, and store in an environment variable

// Merchant Signup
router.post('/signup', (req, res) => {
    let { store_name, address, email, phone_number, store_type, password, confirmPassword } = req.body; 
    store_name = store_name.trim();
    address = address.trim();
    email = email.trim();
    phone_number = phone_number.trim();
    store_type = store_type.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    if (!store_name || !address || !email || !phone_number || !store_type || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All input is required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    Merchant.findOne({ email }).then(result => {
        if (result) {
            return res.status(400).json({ message: 'Account already exists' });
        } else {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds).then(hashedPassword => {
                const newMerchant = new Merchant({
                    store_name,
                    address,
                    email,
                    phone_number,
                    store_type,
                    password: hashedPassword,
                });

                newMerchant.save().then(merchant => {
                    return res.status(200).json({
                        message: 'Merchant signup successful',
                        data: merchant,
                    });
                }).catch(err => {
                    console.error(err.message);
                    return res.status(500).json({ message: 'Error saving merchant' });
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

// Merchant Login with JWT token generation
router.post('/login', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!email || !password) {
        return res.status(400).json({ message: 'All input is required' });
    }

    Merchant.findOne({ email }).then(merchant => {
        if (!merchant) {
            return res.status(404).json({ message: 'Account not found' });
        }

        bcrypt.compare(password, merchant.password).then(result => {
            if (!result) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } else {
                // Generate JWT token
                const token = jwt.sign(
                    { id: merchant._id, role: 'Merchant' }, // Include role in the token
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

// Public route to get all merchants (accessible by everyone)
router.get('/all-merchants', (req, res) => {
    Merchant.find({})
        .then(merchants => {
            if (merchants.length === 0) {
                return res.status(404).json({ message: 'No merchants found' });
            }
            res.status(200).json({ message: 'Merchants retrieved successfully', data: merchants });
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).json({ message: 'Server error' });
        });
});


// Unregister (Delete) Merchant Account - Only accessible to the authenticated merchant
router.delete('/unregister', authenticate(['Merchant']), async (req, res) => {
    try {
        // Get the merchant ID from the authenticated user (req.user)
        const merchantId = req.user.id;

        // Find the merchant by ID and delete the account
        const deletedMerchant = await Merchant.findByIdAndDelete(merchantId);
        if (!deletedMerchant) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.status(200).json({ message: 'Merchant account deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error deleting merchant account' });
    }
});

// Protected route to get merchant's profile
router.get('/profile', authenticate(['Merchant']), async (req, res) => {
    try {
        // Get the merchant ID from the authenticated user (req.user)
        const merchantId = req.user.id;

        // Find the merchant by ID
        const merchant = await Merchant.findById(merchantId).select('-password'); // Exclude password field
        if (!merchant) {
            return res.status(404).json({ message: 'Merchant not found' });
        }

        res.status(200).json({ message: 'Merchant profile retrieved successfully', data: merchant });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error retrieving merchant profile' });
    }
});


module.exports = router;