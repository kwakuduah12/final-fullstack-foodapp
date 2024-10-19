const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const usersTable = 'Users'; // Ensure this matches exactly

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

class UserDatabase {
    static async createUser({ email, password }) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const params = {
                TableName: usersTable,
                Item: {
                    email, // Partition key
                    password: hashedPassword, // Store the hashed password
                },
            };
            await dynamoDB.put(params).promise();
        } catch (error) {
            throw new Error('Error creating user');
        }
    }

    static async findUserByEmail(email) {
        try {
            const params = {
                TableName: usersTable,
                Key: { email },
            };
            const result = await dynamoDB.get(params).promise();
            if (!result.Item) throw new Error('User not found');
            return result.Item;
        } catch (error) {
            throw new Error('Error fetching user');
        }
    }

    static generateToken(user) {
        return jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    }

    static verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }
}

module.exports = UserDatabase;
