const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Payment = require('../models/payment');
const User = require('../models/user'); // Assuming you have a User model with a balance field
const Merchant = require('../models/merchants'); // Assuming you have a Merchant model with a balance field
const authenticate = require('../middlewares/authMiddleWares'); // Authentication middleware

// Top-up fake money for a user
router.post('/top-up', authenticate(['User']), async (req, res) => {
    const userId = req.user.id; // Authenticated user's ID
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid top-up amount' });
    }

    try {
        // Update user's balance
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.balance = (user.balance || 0) + amount;
        await user.save();

        // Record the top-up transaction
        const payment = new Payment({
            user_id: userId,
            amount,
            payment_type: 'Top-Up',
            status: 'Completed',
        });
        await payment.save();

        res.status(200).json({ message: 'Top-up successful', balance: user.balance });
    } catch (error) {
        console.error('Error during top-up:', error);
        res.status(500).json({ message: 'Error processing top-up' });
    }
});

router.post('/purchase', authenticate(['User']), async (req, res) => {
    const { merchantId, amount, orderId } = req.body;

    if (!merchantId || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid purchase details' });
    }

    try {
        // Find the user and validate the balance
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Credit the merchant's balance
        const merchant = await Merchant.findById(merchantId);
        if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

        merchant.balance = (merchant.balance || 0) + amount;
        await merchant.save();

        // Update the order status to 'Completed'
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = 'Completed';
        order.updated_at = new Date();
        await order.save();

        // Log the payment
        const payment = new Payment({
            user_id: req.user.id,
            merchant_id: merchantId,
            order_id: orderId,
            amount,
            payment_type: 'Purchase',
            status: 'Completed',
        });
        await payment.save();

        // Return updated balances and order status
        res.status(200).json({
            message: 'Payment successful',
            userBalance: user.balance,
            merchantBalance: merchant.balance,
            orderStatus: order.status,
            paymentStatus: payment.status,
        });
    } catch (error) {
        console.error('Error during purchase:', error);
        res.status(500).json({ message: 'Error processing payment' });
    }
});




// Get user's payment history
router.get('/history', authenticate(['User']), async (req, res) => {
    const userId = req.user.id;

    try {
        const payments = await Payment.find({ user_id: userId }).sort({ payment_date: -1 });
        res.status(200).json({ message: 'Payment history retrieved successfully', data: payments });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ message: 'Error retrieving payment history' });
    }
});

router.post('/deduct-balance', authenticate(['User']), async (req, res) => {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount to deduct' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if ((user.balance || 0) < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        user.balance -= amount;
        await user.save();

        res.status(200).json({ message: 'Balance deducted successfully', balance: user.balance });
    } catch (error) {
        console.error('Error deducting balance:', error);
        res.status(500).json({ message: 'Error processing balance deduction' });
    }
});

module.exports = router;
