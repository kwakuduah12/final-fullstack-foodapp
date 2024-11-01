const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',  // Reference to the Restaurant model
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['African', 'Mexican', 'American', 'Italian', 'Chinese', 'Indian', 'Other']  // Example categories
    },
});

module.exports = mongoose.model('Menu', MenuSchema);
