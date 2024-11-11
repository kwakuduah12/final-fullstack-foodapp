const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
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
    items: [
        {
            menu_item_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu',
                required: true,
            },
            quantity: { type: Number, required: true },
        }
    ],
    total_price: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    order_date: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);