// // // const express = require('express');
// // // const router = express.Router();
// // // const User = require('../models/user');
// // // const Transaction = require('../models/Transaction');
// // // const Merchant = require('../models/merchants');
// // // const authenticate = require('../middlewares/authMiddleWares');

// // // // Utility function to handle server errors
// // // const handleServerError = (res, error) => {
// // //     console.error(error.message);
// // //     return res.status(500).json({ message: 'Server error' });
// // // };

// // // // Wallet Balance
// // // router.get('/balance', authenticate, async (req, res) => {
// // //     try {
// // //         const user = await User.findById(req.user.id);
// // //         if (!user) return res.status(404).json({ message: 'User not found' });
// // //         res.status(200).json({ balance: user.wallet});
// // //     } catch (err) {
// // //         handleServerError(res, err);
// // //     }
// // // });

// // // // Add money to wallet
// // // // router.post('/add-money', authenticate, async (req, res) => {
// // // //     const { amount } = req.body;
// // // //     if (!amount || amount <= 0) {
// // // //         return res.status(400).json({ message: 'Amount must be greater than 0' });
// // // //     }
// // // //     try {
// // // //         const user = await User.findById(req.user.id);
// // // //         if (!user) return res.status(404).json({ message: 'User not found' });
// // // //         user.wallet_balance += amount;
// // // //         await user.save();
// // // //         res.status(200).json({ message: 'Money added to wallet successfully', balance: user.wallet_balance });
// // // //     } catch (err) {
// // // //         handleServerError(res, err);
// // // //     }
// // // // });

// // // // Add money to wallet
// // // router.post('/add-money', authenticate, async (req, res) => {
// // //     const { amount } = req.body;

// // //     if (!amount || typeof amount !== 'number' || amount <= 0) {
// // //         return res.status(400).json({ message: 'Invalid or missing amount' });
// // //     }

// // //     try {
// // //         const user = await User.findById(req.user.id);
// // //         if (!user) return res.status(404).json({ message: 'User not found' });


// // //         user.wallet += amount;
// // //         await user.save();

// // //         res.status(200).json({ message: 'Money added successfully', balance: user.wallet });
// // //     } catch (err) {
// // //         handleServerError(res, err);
// // //     }
// // // });


// // // // Deduct money from wallet
// // // // router.post('/deduct-money', authenticate, async (req, res) => {
// // // //     const { merchant_id, total_price } = req.body;
// // // //     if (!merchant_id || !total_price || total_price <= 0) {
// // // //         return res.status(400).json({ message: 'Invalid merchant or amount' });
// // // //     }
// // // //     try {
// // // //         const user = await User.findById(req.user.id);
// // // //         const merchant = await Merchant.findById(merchant_id);

// // // //         if (!user) return res.status(404).json({ message: 'User not found' });
// // // //         if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
// // // //         if (user.wallet_balance < total_price) {
// // // //             return res.status(400).json({ message: 'Insufficient funds' });
// // // //         }

// // // //         user.wallet_balance -= total_price;
// // // //         merchant.wallet_balance += total_price;

// // // //         await user.save();
// // // //         await merchant.save();
// // // //         res.status(200).json({ message: 'Money deducted from wallet successfully', balance: user.wallet_balance });
// // // //     } catch (err) {
// // // //         handleServerError(res, err);
// // // //     }
// // // // });

// // // // Deduct money from wallet
// // // router.post('/deduct-money', authenticate, async (req, res) => {
// // //     const { merchant_id, total_price } = req.body;

// // //     if (!merchant_id || typeof total_price !== 'number' || total_price <= 0) {
// // //         return res.status(400).json({ message: 'Invalid merchant or amount' });
// // //     }

// // //     try {
// // //         const user = await User.findById(req.user.id);
// // //         const merchant = await Merchant.findById(merchant_id);

// // //         if (!user) return res.status(404).json({ message: 'User not found' });
// // //         if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
// // //         if (user.wallet < total_price) {
// // //             return res.status(400).json({ message: 'Insufficient funds' });
// // //         }

// // //         user.wallet -= total_price;
// // //         merchant.wallet += total_price;

// // //         await user.save();
// // //         await merchant.save();

// // //         res.status(200).json({ message: 'Money deducted successfully', balance: user.wallet });
// // //     } catch (err) {
// // //         handleServerError(res, err);
// // //     }
// // // });


// // // // Get all transactions
// // // // router.get('/transactions', authenticate, async (req, res) => {
// // // //     try {
// // // //         const transactions = await Transaction.find({ user_id: req.user.id });
// // // //         res.status(200).json({ transactions });
// // // //     } catch (err) {
// // // //         handleServerError(res, err);
// // // //     }
// // // // });

// // // // Get all transactions
// // // router.get('/transactions', authenticate, async (req, res) => {
// // //     try {
// // //         const transactions = await Transaction.find({ user_id: req.user.id }).sort({ createdAt: -1 });
// // //         res.status(200).json({ transactions });
// // //     } catch (err) {
// // //         handleServerError(res, err);
// // //     }
// // // });

// // // module.exports = router;


// // const express = require('express');
// // const router = express.Router();
// // const User = require('../models/user');
// // const Transaction = require('../models/Transaction');
// // const Merchant = require('../models/merchants');
// // const authenticate = require('../middlewares/authMiddleWares');
// // const mongoose = require('mongoose');

// // // Utility function to handle server errors
// // const handleServerError = (res, error) => {
// //     console.error(error.message);
// //     return res.status(500).json({ message: 'Server error', error: error.message });
// // };

// // // Wallet Balance
// // router.get('/balance', authenticate, async (req, res) => {
// //     try {
// //         const user = await User.findById(req.user.id);
// //         if (!user) return res.status(404).json({ message: 'User not found' });
// //         res.status(200).json({ balance: user.wallet_balance });
// //     } catch (err) {
// //         handleServerError(res, err);
// //     }
// // });

// // // Add money to wallet
// // router.post('/add-money', authenticate, async (req, res) => {
// //     const { amount } = req.body;
// //     if (!amount || amount <= 0) {
// //         return res.status(400).json({ message: 'Amount must be greater than 0' });
// //     }
// //     try {
// //         const session = await mongoose.startSession();
// //         session.startTransaction();
// //         const user = await User.findById(req.user.id).session(session);
// //         if (!user) return res.status(404).json({ message: 'User not found' });

// //         user.wallet_balance += amount;
// //         await user.save({ session });

// //         await session.commitTransaction();
// //         session.endSession();

// //         res.status(200).json({ message: 'Money added to wallet successfully', balance: user.wallet_balance });
// //     } catch (err) {
// //         handleServerError(res, err);
// //     }
// // });

// // // Deduct money from wallet
// // router.post('/deduct-money', authenticate, async (req, res) => {
// //     const { merchant_id, total_price } = req.body;
// //     if (!merchant_id || !total_price || total_price <= 0) {
// //         return res.status(400).json({ message: 'Invalid merchant or amount' });
// //     }
// //     try {
// //         const session = await mongoose.startSession();
// //         session.startTransaction();

// //         const user = await User.findById(req.user.id).session(session);
// //         const merchant = await Merchant.findById(merchant_id).session(session);

// //         if (!user) return res.status(404).json({ message: 'User not found' });
// //         if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
// //         if (user.wallet_balance < total_price) {
// //             return res.status(400).json({ message: 'Insufficient funds' });
// //         }

// //         user.wallet_balance -= total_price;
// //         merchant.wallet_balance += total_price;

// //         await user.save({ session });
// //         await merchant.save({ session });

// //         await session.commitTransaction();
// //         session.endSession();

// //         res.status(200).json({ message: 'Money deducted from wallet successfully', balance: user.wallet_balance });
// //     } catch (err) {
// //         handleServerError(res, err);
// //     }
// // });

// // // Get all transactions
// // router.get('/transactions', authenticate, async (req, res) => {
// //     try {
// //         const transactions = await Transaction.find({ user_id: req.user.id });
// //         res.status(200).json({ transactions });
// //     } catch (err) {
// //         handleServerError(res, err);
// //     }
// // });

// // module.exports = router;


// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');
// const Transaction = require('../models/Transaction');
// const Merchant = require('../models/merchants');
// const authenticate = require('../middlewares/authMiddleWares');

// // Utility function to handle server errors
// const handleServerError = (res, error) => {
//     console.error(error.message);
//     return res.status(500).json({ message: 'Server error' });
// };

// // Wallet Balance
// router.get('/balance', authenticate, async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         res.status(200).json({ balance: user.wallet_balance });
//     } catch (err) {
//         handleServerError(res, err);
//     }
// });

// // Add money to wallet
// router.post('/add-money', authenticate, async (req, res) => {
//     const { amount } = req.body;
//     if (!amount || amount <= 0) {
//         return res.status(400).json({ message: 'Amount must be greater than 0' });
//     }
//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         user.wallet_balance += amount;
//         await user.save();
//         res.status(200).json({ message: 'Money added to wallet successfully', balance: user.wallet_balance });
//     } catch (err) {
//         handleServerError(res, err);
//     }
// });

// // Deduct money from wallet
// // router.post('/deduct-money', authenticate, async (req, res) => {
// //     const { merchant_id, total_price } = req.body;
// //     if (!merchant_id || !total_price || total_price <= 0) {
// //         return res.status(400).json({ message: 'Invalid merchant or amount' });
// //     }
// //     try {
// //         const user = await User.findById(req.user.id);
// //         const merchant = await Merchant.findById(merchant_id);

// //         if (!user) return res.status(404).json({ message: 'User not found' });
// //         if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
// //         if (user.wallet_balance < total_price) {
// //             return res.status(400).json({ message: 'Insufficient funds' });
// //         }

// //         user.wallet_balance -= total_price;
// //         merchant.wallet_balance += total_price;

// //         await user.save();
// //         await merchant.save();
// //         res.status(200).json({ message: 'Money deducted from wallet successfully', balance: user.wallet_balance });
// //     } catch (err) {
// //         handleServerError(res, err);
// //     }
// // });

// router.post('/deduct-money', authenticate, async (req, res) => {
//     const { merchant_id, total_price } = req.body;
//     if (!merchant_id || !total_price || total_price <= 0) {
//         return res.status(400).json({ message: 'Invalid merchant or amount' });
//     }
//     try {
//         const session = await mongoose.startSession();
//         session.startTransaction();

//         const user = await User.findById(req.user.id).session(session);
//         const merchant = await Merchant.findById(merchant_id).session(session);

//         if (!user) return res.status(404).json({ message: 'User not found' });
//         if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
//         if (user.wallet_balance < total_price) {
//             return res.status(400).json({ message: 'Insufficient funds' });
//         }

//         user.wallet_balance -= total_price;
//         merchant.wallet_balance += total_price;

//         await user.save({ session });
//         await merchant.save({ session });

//         await session.commitTransaction();
//         session.endSession();

//         res.status(200).json({ message: 'Money deducted from wallet successfully', balance: user.wallet_balance });
//     } catch (err) {
//         handleServerError(res, err);
//     }
// });


// // Get all transactions
// router.get('/transactions', authenticate, async (req, res) => {
//     try {
//         const transactions = await Transaction.find({ user_id: req.user.id });
//         res.status(200).json({ transactions });
//     } catch (err) {
//         handleServerError(res, err);
//     }
// });

// module.exports = router;