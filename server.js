const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const authRoutes = require('./authentication'); // Import authentication routes

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Mount authentication routes
app.use('/auth', authRoutes);

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const ordersTable = 'FoodOrders';
const usersTable = 'Users'; 

// POST: Create a new order
app.post('/order', (req, res) => {
    const { orderId, items, total } = req.body;
    const params = { TableName: ordersTable, Item: { orderId, items, total } };

    dynamoDB.put(params, (err) => {
        if (err) res.status(500).json({ error: 'Error creating order', details: err });
        else res.status(201).json({ message: 'Order created successfully' });
    });
});

// GET: Fetch order by orderId
app.get('/order/:orderId', (req, res) => {
    const { orderId } = req.params;
    const params = { TableName: ordersTable, Key: { orderId } };

    dynamoDB.get(params, (err, data) => {
        if (err) res.status(500).json({ error: 'Error fetching order', details: err });
        else if (!data.Item) res.status(404).json({ error: 'Order not found' });
        else res.status(200).json({ message: 'Order fetched successfully', data: data.Item });
    });
});

// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
