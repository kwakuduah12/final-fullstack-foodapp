const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');

// Route to create a new restaurant
router.post('/', (req, res) => {
    const { name, description, rating } = req.body;

    // Validate the input
    if (!name || !description || rating == null) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new restaurant instance
    const newRestaurant = new Restaurant({
        name,
        description,
        rating
    });

    // Save the restaurant to the database
    newRestaurant.save()
        .then(restaurant => res.status(201).json({ message: 'Restaurant added successfully', data: restaurant }))
        .catch(error => {
            console.error(error.message);
            res.status(500).json({ message: 'Error saving restaurant' });
        });
});

// Route to get all restaurants
router.get('/', (req, res) => {
    Restaurant.find()
        .then(restaurants => res.status(200).json({ data: restaurants }))
        .catch(error => {
            console.error(error.message);
            res.status(500).json({ message: 'Error fetching restaurants' });
        });
});

module.exports = router;
