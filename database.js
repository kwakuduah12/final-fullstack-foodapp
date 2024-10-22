const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const usersTable = 'Users'; // DynamoDB Users table
//const JWT_SECRET = 'your_jwt_secret'; // Change to a secure secret!
const crypto = require('crypto');
const JWT_SECRET = crypto.randomBytes(32).toString('hex');
console.log(JWT_SECRET);


class UserDatabase {
    static async createUser(user) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const params = {
            TableName: usersTable,
            Item: {
                email: user.email,
                username: user.username,
                password: hashedPassword,
            },
        };

        return new Promise((resolve, reject) => {
            dynamoDB.put(params, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    static async findUserByEmail(email) {
        const params = {
            TableName: usersTable,
            Key: { email },
        };

        return new Promise((resolve, reject) => {
            dynamoDB.get(params, (err, data) => {
                if (err) reject(err);
                else resolve(data.Item);
            });
        });
    }

    static generateToken(user) {
        return jwt.sign({ email: user.email, username: user.username }, JWT_SECRET, {
            expiresIn: '1h',
        });
    }

    static verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }
}

module.exports = UserDatabase;