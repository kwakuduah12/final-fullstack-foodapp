const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Menu = require('../models/menu');
const authenticate = require('../middlewares/authMiddleWares'); // Import the authentication middleware

// Create a new order
router.post('/create', authenticate(['User']), async (req, res) => {
    const { merchant_id, items } = req.body;
    console.log("This is merchant_id", merchant_id);

    const user_id = req.user.id; // Authenticated user’s ID

    try {
        // Calculate total price
        let total_price = 0;
        for (const item of items) {
            const menuItem = await Menu.findById(item.menu_item_id);
            if (!menuItem) {
                return res.status(404).json({ message: `Menu item with ID ${item.menu_item_id} not found` });
            }
            total_price += menuItem.price * item.quantity;
        }

        // Create the new order
        const newOrder = new Order({
            user_id,
            merchant_id,
            items,
            total_price,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({
            message: 'Order created successfully',
            data: savedOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Get all orders for a user
router.get('/user-orders', authenticate(['User']), async (req, res) => {
    const user_id = req.user.id;

    try {
        const orders = await Order.find({ user_id }).populate('merchant_id items.menu_item_id');
        res.status(200).json({ message: 'User orders retrieved successfully', data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user orders' });
    }
});

// Get all orders for a merchant
router.get('/merchant-orders', authenticate(['Merchant']), async (req, res) => {
    const merchant_id = req.user.id;
    console.log("This is merchant_id here ", merchant_id);

    try {
        const orders = await Order.find({ merchant_id }).populate('user_id items.menu_item_id');
        res.status(200).json({ message: 'Merchant orders retrieved successfully', data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving merchant orders' });
    }
});

// Update order status (for merchants only)
router.put('/update-status/:orderId', authenticate(['Merchant']), async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.merchant_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        order.status = status;
        order.updated_at = Date.now();
        const updatedOrder = await order.save();

        res.status(200).json({ message: 'Order status updated successfully', data: updatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

module.exports = router;