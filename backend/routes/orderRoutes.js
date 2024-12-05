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
        // Calculate total price using discountedPrice if available
        let total_price = 0;

        for (const item of items) {
            const menuItem = await Menu.findById(item.menu_item_id);
            if (!menuItem) {
                return res.status(404).json({ message: `Menu item with ID ${item.menu_item_id} not found` });
            }

            // Use discountedPrice if it exists, otherwise use regular price
            const itemPrice = menuItem.discountedPrice ?? menuItem.price;
            total_price += itemPrice * item.quantity;
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


// Get all orders for a user with optional status filter
router.get('/user-orders', authenticate(['User']), async (req, res) => {
    const user_id = req.user.id;
    const { status } = req.query; // Optional query parameter for status

    const query = { user_id };
    if (status) {
        query.status = status; // Add status filter if provided
    }

    try {
        const orders = await Order.find(query).populate('merchant_id items.menu_item_id');
        res.status(200).json({ message: 'User orders retrieved successfully', data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user orders' });
    }
});


// Get all orders for a merchant with optional status filter
router.get('/merchant-orders', authenticate(['Merchant']), async (req, res) => {
    const merchant_id = req.user.id;
    const { status } = req.query; // Optional query parameter for status
    console.log("This is merchant_id here ", merchant_id);

    const query = { merchant_id };
    if (status) {
        query.status = status; // Add status filter if provided
        console.log('Query being executed:', query);
    }

    try {
        const orders = await Order.find(query).populate('user_id items.menu_item_id');
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

router.get('/most-ordered', authenticate(['Merchant', 'User']), async (req, res) => {
    try {
        const mostOrderedFoods = await Order.aggregate([
            { $unwind: "$items" }, // Deconstruct the items array
            {
                $group: {
                    _id: "$items.menu_item_id", // Group by menu item ID
                    totalQuantity: { $sum: "$items.quantity" }, // Sum up the quantity
                },
            },
            {
                $lookup: {
                    from: "menus", // Join with the Menu collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "menuDetails",
                },
            },
            { $unwind: "$menuDetails" }, // Unwind the menu details
            {
                $lookup: {
                    from: "merchants", // Join with the Merchants collection
                    localField: "menuDetails.merchant_id", // Assuming menuDetails contains merchant_id
                    foreignField: "_id",
                    as: "merchantDetails",
                },
            },
            { $unwind: "$merchantDetails" }, // Unwind the merchant details
            {
                $project: {
                    _id: 1,
                    totalQuantity: 1,
                    menuItemName: "$menuDetails.item_name",
                    menuItemPrice: "$menuDetails.price",
                    storeName: "$merchantDetails.store_name", // Add store name
                    merchantId: "$merchantDetails._id", // Add merchant ID
                },
            },
            { $sort: { totalQuantity: -1 } }, // Sort by totalQuantity in descending order
            { $limit: 10 }, // Limit to the top 10 most ordered foods
        ]);

        res.status(200).json({
            message: "Most ordered foods retrieved successfully",
            data: mostOrderedFoods,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving most ordered foods" });
    }
});

// Get the last order for a user
// Get the past three orders for a user
router.get('/user-orders/:userId', authenticate(['User']), async (req, res) => {
    const userId = req.params.userId;

    try {
        console.log(`Fetching last 3 orders for user: ${userId}`);
        const orders = await Order.find({ user_id: userId })
            .sort({ created_at: -1 }) // Sort by most recent
            .limit(3) // Limit to the last three orders
            .populate('items.menu_item_id merchant_id');

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json({ message: 'Orders retrieved successfully', data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error retrieving orders' });
    }
});




module.exports = router;