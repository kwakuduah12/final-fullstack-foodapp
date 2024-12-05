// const mongoose = require('mongoose');

// const MerchantSchema = new mongoose.Schema({
//     store_name: {
//         type: String,
//         required: true,
//     },
//     //address: {
//       //  type: String,
//         //required: true,
//     //},
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     phone_number: {
//         type: String,
//         required: true,
//     },
//     store_type: {
//         type: String,
//         enum: ['African', 'Mexican', 'Asian', 'Italian', 'Other'], // Adjust based on possible store types
//         required: true,
//     },
//     // created_at: {
//     //     type: Date,
//     //     default: Date.now,
//     // },
    
//     password: {
//         type: String,
//         required: [true, 'Please enter a password'],
//         minlength: [6, 'Minimum password length is 6 characters'],
//     },

//     // updated_at: {
//     //     type: Date,
//     //     default: Date.now,
//     // },
//     wallet: {
//         type: Number,
//         default: 100,
//     },
// });

// module.exports = mongoose.model('Merchant', MerchantSchema);

const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema({
    store_name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    store_type: {
        type: String,
        enum: ['African', 'Mexican', 'Asian', 'Italian', 'Other'], 
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    balance: { // New field to track the merchant's fake money balance
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Merchant', MerchantSchema);
