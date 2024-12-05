const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    menu_item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: false, // Optional for merchant-only reviews
    },
    merchant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review_text: {
        type: String,
        maxlength: 500, // Optional review text
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

// Add a unique index to enforce one review per user, order, and menu item
ReviewSchema.index(
    { user_id: 1, order_id: 1, menu_item_id: 1, merchant_id: 1 },
    { unique: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
