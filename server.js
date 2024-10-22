const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const ordersTable = 'FoodOrders';
const usersTable = 'Users';

// POST: Create a New Order
app.post('/order', (req, res) => {
    const { orderId, items, total } = req.body;
    const params = { TableName: ordersTable, Item: { orderId, items, total } };

    dynamoDB.put(params, (err) => {
        if (err) res.status(500).json({ error: 'Error creating order', details: err });
        else res.status(201).json({ message: 'Order created successfully' });
    });
});

// GET: Fetch Order by ID
app.get('/order/:orderId', (req, res) => {
    const { orderId } = req.params;
    const params = { TableName: ordersTable, Key: { orderId } };

    dynamoDB.get(params, (err, data) => {
        if (err) res.status(500).json({ error: 'Error fetching order', details: err });
        else if (!data.Item) res.status(404).json({ error: 'Order not found' });
        else res.status(200).json({ message: 'Order fetched successfully', data: data.Item });
    });
});

// POST: Create a New User
app.post('/user', (req, res) => {
    const { email, password } = req.body;
    const params = { TableName: usersTable, Item: { email, password } };

    dynamoDB.put(params, (err) => {
        if (err) res.status(500).json({ error: 'Error creating user', details: err });
        else res.status(201).json({ message: 'User created successfully' });
    });
});

// GET: Retrieve User by Email
app.get('/user/:email', (req, res) => {
    const { email } = req.params;
    const params = { TableName: usersTable, Key: { email } };

    dynamoDB.get(params, (err, data) => {
        if (err) res.status(500).json({ error: 'Error fetching user', details: err });
        else if (!data.Item) res.status(404).json({ error: 'User not found' });
        else res.status(200).json({ message: 'User fetched successfully', data: data.Item });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
