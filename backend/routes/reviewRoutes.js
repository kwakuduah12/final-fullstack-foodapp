const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Order = require('../models/order');
const mongoose = require('mongoose');
const authenticate = require('../middlewares/authMiddleWares');

// Create a new review for an order's food item or merchant
router.post('/', authenticate(['User']), async (req, res) => {
    const { order_id, menu_item_id, rating, review_text } = req.body;
    const user_id = req.user.id;

    try {
        // Verify the order belongs to the user
        const order = await Order.findOne({ _id: order_id, user_id }).populate('items.menu_item_id');
        if (!order) {
            return res.status(403).json({ message: 'You cannot review this order.' });
        }

        // Ensure the menu item belongs to the order (if menu_item_id is provided)
        if (menu_item_id) {
            const menuItemExists = order.items.some(item => item.menu_item_id._id.toString() === menu_item_id);
            if (!menuItemExists) {
                return res.status(403).json({ message: 'You cannot review this item.' });
            }
        }

        const newReview = new Review({
            user_id,
            order_id,
            menu_item_id,
            merchant_id: order.merchant_id,
            rating,
            review_text,
        });

        const savedReview = await newReview.save();
        res.status(201).json({
            message: 'Review created successfully',
            data: savedReview,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating review', details: error.message });
    }
});

// Get reviews for a specific menu item
router.get('/menu/:menuItemId', async (req, res) => {
    const { menuItemId } = req.params;

    try {
        const reviews = await Review.find({ menu_item_id: menuItemId }).populate('user_id', 'name email');
        res.status(200).json({
            message: 'Reviews retrieved successfully',
            data: reviews,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving reviews', details: error.message });
    }
});

// Get reviews for a specific merchant
router.get('/merchant/:merchantId', async (req, res) => {
    const { merchantId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(merchantId)) {
            return res.status(400).json({ message: 'Invalid merchant ID' });
        }

        // Fetch all reviews for the merchant
        const reviews = await Review.find({ merchant_id: merchantId }).populate('user_id', 'name email');

        // Calculate the average rating
        const averageRating = await Review.aggregate([
            { $match: { merchant_id: new mongoose.Types.ObjectId(merchantId) } },
            { $group: { _id: null, average: { $avg: '$rating' } } },
        ]);

        res.status(200).json({
            message: 'Merchant reviews retrieved successfully',
            data: reviews,
            averageRating: averageRating.length ? averageRating[0].average.toFixed(2) : null,
        });
    } catch (error) {
        console.error('Error retrieving merchant reviews:', error);
        res.status(500).json({ message: 'Error retrieving merchant reviews', details: error.message });
    }
});


// Get reviews written by the logged-in user
router.get('/user', authenticate(['User']), async (req, res) => {
    const user_id = req.user.id;

    try {
        const reviews = await Review.find({ user_id }).populate('menu_item_id merchant_id', 'item_name store_name');
        res.status(200).json({
            message: 'User reviews retrieved successfully',
            data: reviews,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving reviews', details: error.message });
    }
});

router.get('/menu/:menuItemId/order/:orderId', authenticate(['User']), async (req, res) => {
    const { menuItemId, orderId } = req.params;
    const user_id = req.user.id;

    try {
        // Find the review for the specific menu item and order by the user
        const review = await Review.findOne({
            user_id,
            menu_item_id: menuItemId,
            order_id: orderId,
        }).populate('user_id', 'name email');
        

        if (!review) {
            return res.status(404).json({ 
                message: 'Review not found.',
                details: `No review found for menuItemId: ${menuItemId} and orderId: ${orderId} for user: ${user_id}.`,
            });
        }

        res.status(200).json({
            message: 'Review retrieved successfully',
            data: review,
        });
    } catch (error) {
        console.error(`Error retrieving review for menuItemId: ${menuItemId}, orderId: ${orderId}, user: ${user_id}.`, error);
        res.status(500).json({ message: 'Error retrieving review', details: error.message });
    }
});

// Get reviews for a merchant's orders
router.get('/merchant/:merchantId/orders/reviews', authenticate(['Merchant']), async (req, res) => {
    const { merchantId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(merchantId)) {
            return res.status(400).json({ message: 'Invalid merchant ID' });
        }

        const merchantObjectId = new mongoose.Types.ObjectId(merchantId);

        const orders = await Order.find({ merchant_id: merchantObjectId }).populate('items.menu_item_id');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this merchant.' });
        }

        const orderIds = orders.map(order => order._id);
        const reviews = await Review.find({ order_id: { $in: orderIds } }).populate('user_id', 'name email');

        const groupedReviews = reviews.reduce((acc, review) => {
            const { order_id, menu_item_id } = review;

            if (!acc[order_id]) acc[order_id] = {};
            if (!acc[order_id][menu_item_id]) acc[order_id][menu_item_id] = [];
            acc[order_id][menu_item_id].push(review);

            return acc;
        }, {});

        const response = orders.map(order => ({
            order_id: order._id,
            items: order.items.map(item => ({
                menu_item_id: item.menu_item_id?._id,
                menu_item_name: item.menu_item_id?.item_name,
                reviews: groupedReviews[order._id]?.[item.menu_item_id?._id] || []
            })),
        }));

        res.status(200).json({
            message: 'Reviews retrieved successfully for merchant\'s orders.',
            data: response,
        });
    } catch (error) {
        console.error('Error retrieving reviews for merchant\'s orders:', error);
        res.status(500).json({ message: 'Error retrieving reviews', details: error.message });
    }
});

// Rate a Merchant
router.post('/merchant/:merchantId/rate', authenticate(['User']), async (req, res) => {
    const { merchantId } = req.params;
    const { rating, review_text } = req.body;
    const user_id = req.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(merchantId)) {
            return res.status(400).json({ message: 'Invalid merchant ID' });
        }

        // Check if user already rated this merchant
        const existingReview = await Review.findOne({ user_id, merchant_id: merchantId });
        if (existingReview) {
            // Update existing review
            existingReview.rating = rating;
            existingReview.review_text = review_text || existingReview.review_text;
            await existingReview.save();

            return res.status(200).json({
                message: 'Merchant rating updated successfully',
                data: existingReview,
            });
        }

        // Create a new rating for the merchant
        const newReview = new Review({
            user_id,
            merchant_id: merchantId,
            rating,
            review_text,
        });

        const savedReview = await newReview.save();

        res.status(201).json({
            message: 'Merchant rated successfully',
            data: savedReview,
        });
    } catch (error) {
        console.error('Error rating merchant:', error);
        res.status(500).json({ message: 'Error rating merchant', details: error.message });
    }
});

// Get reviews and average rating for a specific merchant
router.get('/merchant/:merchantId', async (req, res) => {
    const { merchantId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(merchantId)) {
            return res.status(400).json({ message: 'Invalid merchant ID' });
        }

        // Fetch all reviews for the merchant
        const reviews = await Review.find({ merchant_id: merchantId }).populate('user_id', 'name email');

        // Calculate the average rating
        const averageRating = await Review.aggregate([
            { $match: { merchant_id: new mongoose.Types.ObjectId(merchantId) } },
            { $group: { _id: null, average: { $avg: '$rating' } } },
        ]);
        

        res.status(200).json({
            message: 'Merchant reviews retrieved successfully',
            data: reviews,
            averageRating: averageRating.length ? averageRating[0].average.toFixed(2) : null,
        });
    } catch (error) {
        console.error('Error retrieving merchant reviews:', error);
        res.status(500).json({ message: 'Error retrieving merchant reviews', details: error.message });
    }
});





module.exports = router;
