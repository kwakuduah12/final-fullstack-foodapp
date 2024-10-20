const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const authRoutes = require('./authentication'); // Import auth routes

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const ordersTable = 'FoodOrders';
const usersTable = 'Users';

// Use authentication routes
app.use('/auth', authRoutes);

// POST: Create a new order
app.post('/order', async (req, res) => {
    const { orderId, items, total } = req.body;

    const params = {
        TableName: ordersTable,
        Item: {
            orderId,
            items,
            total
        }
    };

    try {
        await dynamoDB.put(params).promise();
        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating order', details: error });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
