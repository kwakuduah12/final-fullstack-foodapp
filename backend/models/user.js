// const mongoose = require('mongoose');
// const { isEmail } = require('validator');

// const UserSchema = new mongoose.Schema({
//     name: { 
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         validate: [isEmail, 'Please enter a valid email']  
//     },
//     password: {
//         type: String,
//         required: [true, 'Please enter a password'],
//         minlength: [6, 'Minimum password length is 6 characters'],
//     },
//     wallet: {
//     type: Number,
//     default: 100,
//     },
// });



// module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const { isEmail } = require('validator');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'],  
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    balance: { // New field to track the user's fake money balance
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('User', UserSchema);
