// database.js
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const usersTable = 'Users'; // Ensure your DynamoDB table matches this name

// JWT Secret Key (replace with your own secure key)
const JWT_SECRET = 'your_jwt_secret_key'; 

class UserDatabase {
    static async createUser({ email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const params = {
            TableName: usersTable,
            Item: {
                email, // Partition key
                password: hashedPassword, // Store the hashed password
            },
        };

        return dynamoDB.put(params).promise(); // Returns a promise
    }

    static async findUserByEmail(email) {
        const params = {
            TableName: usersTable,
            Key: { email }, // Partition key must match
        };

        const result = await dynamoDB.get(params).promise();
        return result.Item;
    }

    static generateToken(user) {
        return jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    }

    static verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }
}

module.exports = UserDatabase;
