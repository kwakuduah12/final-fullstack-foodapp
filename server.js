const express = require('express');
const AWS = require('aws-sdk');

// Autehtication
const { authenticateToken } = require('./authentication'); // Import JWT authentication middleware
const authRoutes = require('./authentication').router;

// Initialize Express
const app = express();
app.use(express.json());

// Use the authentication routes
app.use('/auth', authRoutes);

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const tableName = 'FoodOrders';

// POST: Create a new order
app.post('/order', (req, res) => {
    const { orderId, items, total } = req.body;

    const params = {
        TableName: tableName,
        Item: {
            orderId: orderId,
            items: items,
            total: total
        }
    };

    dynamoDB.put(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error creating order', details: err });
        } else {
            res.status(201).json({ message: 'Order created successfully', data: data });
        }
    });
});

// GET: Fetch an order by orderId
app.get('/order/:orderId', (req, res) => {
    const { orderId } = req.params;

    const params = {
        TableName: tableName,
        Key: {
            orderId: orderId
        }
    };

    dynamoDB.get(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching order', details: err });
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

    const params = {
        TableName: tableName,
        Item: {
            orderId: orderId,
            items: items,
            total: total
        }
    };

    dynamoDB.put(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error replacing order', details: err });
        } else {
            res.status(200).json({ message: 'Order replaced successfully', data: data });
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

    // Remove the last comma in updateExpression
    updateExpression = updateExpression.slice(0, -1);

    const params = {
        TableName: tableName,
        Key: { orderId: orderId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
    };

    dynamoDB.update(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error updating order', details: err });
        } else {
            res.status(200).json({ message: 'Order updated successfully', data: data.Attributes });
        }
    });
});

// Start the server old code 
//app.listen(3000, () => {
  //  console.log('Server running at http://localhost:3000');
//});

// Start server port 
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});