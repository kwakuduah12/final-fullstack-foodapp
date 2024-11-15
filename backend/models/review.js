const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    merchant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    review_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', ReviewSchema);