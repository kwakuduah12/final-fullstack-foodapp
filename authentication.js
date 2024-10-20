const express = require('express');
const bcrypt = require('bcryptjs'); 
const UserDatabase = require('./database'); 
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Sign-up Route
router.post('/signup', 
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            const existingUser = await UserDatabase.findUserByEmail(email);
            if (existingUser) return res.status(400).json({ error: 'User already exists' });

            await UserDatabase.createUser({ email, password });
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error registering user', details: error.message });
        }
    }
);

// Login Route
router.post('/login', 
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').exists().withMessage('Password is required'),
    async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await UserDatabase.findUserByEmail(email);
            if (!user) return res.status(400).json({ error: 'Invalid email or password' });

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) return res.status(400).json({ error: 'Invalid email or password' });

            const token = UserDatabase.generateToken(user);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Error logging in', details: error.message });
        }
    }
);

module.exports = router;
