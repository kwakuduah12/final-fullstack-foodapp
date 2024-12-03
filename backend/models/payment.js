// const mongoose = require('mongoose');

// const PaymentSchema = new mongoose.Schema({
//     order_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Order',
//         required: true,
//     },
//     user_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     amount: { type: Number, required: true },
//     payment_method: { type: String, enum: ['Credit Card', 'Debit Card', 'Cash', 'Digital Wallet'] },
//     payment_date: { type: Date, default: Date.now },
//     status: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Pending' },
// });

// module.exports = mongoose.model('Payment', PaymentSchema);

const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false, 
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    merchant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: false, 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    payment_type: { 
        type: String, 
        enum: ['Top-Up', 'Purchase'], 
        required: true,
    },
    payment_method: { 
        type: String, 
        enum: ['Credit Card', 'Debit Card', 'Cash', 'Digital Wallet', 'Fake Balance'], 
    },
    payment_date: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['Completed', 'Pending', 'Failed'], 
        default: 'Pending' 
    },
});

module.exports = mongoose.model('Payment', PaymentSchema);
