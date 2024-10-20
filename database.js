const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const usersTable = 'Users'; // Match the exact table name in AWS

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

class UserDatabase {
    static async createUser({ email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const params = {
            TableName: usersTable,
            Item: { email, password: hashedPassword }
        };

        await dynamoDB.put(params).promise();
    }

    static async findUserByEmail(email) {
        const params = {
            TableName: usersTable,
            Key: { email }
        };
        const result = await dynamoDB.get(params).promise();
        return result.Item;
    }

    static generateToken(user) {
        return jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    }
}

module.exports = UserDatabase;
