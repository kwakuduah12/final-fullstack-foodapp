const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            menu_item_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu',
                required: true,
            },
            quantity: { type: Number, required: true, default: 1 },
        }
    ],
    total_price: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', CartSchema);

