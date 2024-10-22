const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const AWS = require('aws-sdk');

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const tableName = 'Users';

// JWT Secret Key (replace with your own secure key)
const JWT_SECRET = 'your_jwt_secret_key';

const router = express.Router();

// Sign-up Route
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const params = {
        TableName: tableName,
        Item: { email, password: hashedPassword },
      };

      // Store user in DynamoDB
      await dynamoDB.put(params).promise();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error registering user', details: error });
    }
  }
);

// Login Route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const params = {
        TableName: tableName,
        Key: { email },
      };

      // Retrieve user from DynamoDB
      const user = await dynamoDB.get(params).promise();

      if (!user.Item) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.Item.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Generate JWT
      const token = jwt.sign({ email: user.Item.email }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in', details: error });
    }
  }
);

// Middleware to Authenticate JWT Token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { router, authenticateToken };