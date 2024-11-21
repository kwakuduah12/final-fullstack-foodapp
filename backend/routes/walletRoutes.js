const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Transaction = require('../models/Transaction');
const Merchant = require('../models/Merchant');
const authenticate = require('../middlewares/authMiddleWares');

// Wallet Balance
router.get('/balance', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ balance: user.wallet_balance });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Add money to wallet
router.post('/add-money/:userid', authenticate, async (req, res) => {
    const { amount } = req.body;
    try {
        const user = await User.findById(req.user.id );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { amount } = req.body;
        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }   
        if (amount < 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }
        user.wallet_balance += amount;
        await user.save();
        return res.status(200).json({ message: 'Money added to wallet successfully' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Deduct money from wallet
router.post('/deduct-money/:userid', authenticate, async (req, res) => {
    const { user_id, merchant_id, total_price } = req.body;
    const user = await User.findById(user_id);
    const merchant = await Merchant.findById(merchant_id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (!merchant) {
        return res.status(404).json({ message: 'Merchant not found' });
    }
    if (user.wallet < total_price) {
        return res.status(400).json({ message: 'Insufficient funds' });
    }
    user.wallet -= total_price;
    merchant.wallet += total_price;
    await user.save();
    await merchant.save();
    return res.status(200).json({ message: 'Money deducted from wallet successfully' });
});
    
// Get all transactions
router.get('/transactions', authenticate, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user.id });
        return res.status(200).json({ data: transactions });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server error' , transactions });
    }
});

module.exports = router;


