const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');
const Restaurant = require('../models/restaurant');

// Route to create a new menu for a specific restaurant
router.post('/', async (req, res) => {
    const { restaurant_id, category } = req.body;

    // Validate input
    if (!restaurant_id || !category) {
        return res.status(400).json({ message: 'restaurant_id and category are required' });
    }

    // Check if the provided restaurant_id exists
    try {
        const restaurant = await Restaurant.findById(restaurant_id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        return res.status(400).json({ message: 'Invalid restaurant_id' });
    }

    // Create a new menu instance
    const newMenu = new Menu({
        restaurant_id,
        category
    });

    // Save the menu to the database
    newMenu.save()
        .then(menu => res.status(201).json({ message: 'Menu added successfully', data: menu }))
        .catch(error => {
            console.error(error.message);
            res.status(500).json({ message: 'Error saving menu' });
        });
});

module.exports = router;
