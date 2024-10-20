// server.js
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const authRoutes = require('./authentication');

// Initialize Express
const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming requests

// Use the authentication routes
app.use('/auth', authRoutes);

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const ordersTable = 'FoodOrders'; // Orders table
const usersTable = 'Users'; // Users table

// POST: Create a new order
app.post('/order', (req, res) => {
    const { orderId, items, total } = req.body;

    if (!orderId || !items || !total) {
        return res.status(400).json({ error: 'Missing required fields: orderId, items, total' });
    }

    const params = {
        TableName: ordersTable,
        Item: {
            orderId,
            items,
            total
        }
    };

    dynamoDB.put(params, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error creating order', details: err.message });
        } else {
            res.status(201).json({ message: 'Order created successfully' });
        }
    });
});

// GET: Fetch an order by orderId
app.get('/order/:orderId', (req, res) => {
    const { orderId } = req.params;

    const params = {
        TableName: ordersTable,
        Key: { orderId }
    };

    dynamoDB.get(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching order', details: err.message });
        } else if (!data.Item) {
            res.status(404).json({ error: 'Order not found' });
        } else {
            res.status(200).json({ message: 'Order fetched successfully', data: data.Item });
        }
    });
});

// PUT: Replace an order by orderId
app.put('/order/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { items, total } = req.body;

    if (!items || !total) {
        return res.status(400).json({ error: 'Missing required fields: items, total' });
    }

    const params = {
        TableName: ordersTable,
        Item: {
            orderId,
            items,
            total
        }
    };

    dynamoDB.put(params, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error replacing order', details: err.message });
        } else {
            res.status(200).json({ message: 'Order replaced successfully' });
        }
    });
});

// PATCH: Update parts of an order by orderId
app.patch('/order/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { items, total } = req.body;

    let updateExpression = 'set';
    let expressionAttributeValues = {};

    if (items) {
        updateExpression += ' items = :items,';
        expressionAttributeValues[':items'] = items;
    }

    if (total) {
        updateExpression += ' total = :total,';
        expressionAttributeValues[':total'] = total;
    }

    if (updateExpression === 'set') {
        return res.status(400).json({ error: 'No fields to update' });
    }

    // Remove the last comma in updateExpression
    updateExpression = updateExpression.slice(0, -1);

    const params = {
        TableName: ordersTable,
        Key: { orderId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };

    dynamoDB.update(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error updating order', details: err.message });
        } else {
            res.status(200).json({ message: 'Order updated successfully', data: data.Attributes });
        }
    });
});

// POST: Create a new user
app.post('/user', (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Missing required fields: email, username, password' });
    }

    const params = {
        TableName: usersTable,
        Item: {
            email,
            username,
            password,
        },
    };

    dynamoDB.put(params, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error creating user', details: err.message });
        } else {
            res.status(201).json({ message: 'User created successfully' });
        }
    });
});

// GET: Retrieve user by email
app.get('/user/:email', (req, res) => {
    const { email } = req.params;

    const params = {
        TableName: usersTable,
        Key: { email },
    };

    dynamoDB.get(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching user', details: err.message });
        } else if (!data.Item) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json({ message: 'User fetched successfully', data: data.Item });
        }
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

