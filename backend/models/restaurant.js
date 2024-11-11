const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    //location: { 
      //  type: String,
        //required: true,
    //},
    //phone_number: {
      //  type: String,
        //required: true,
    //},
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);