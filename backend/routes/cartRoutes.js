const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Menu = require('../models/menu');  // to fetch item details
const authenticate = require('../middlewares/authMiddleWares'); // assuming you have JWT authentication

// Add item to cart
router.post('/add', authenticate(['User']), async (req, res) => {
    const {menu_item_id, quantity } = req.body;
    const user_id = req.user.id;

    try {
        let cart = await Cart.findOne({ user_id });

        const item = await Menu.findById(menu_item_id);
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        if (!cart) {
            // Create a new cart if the user does not have one
            cart = new Cart({
                user_id,
                items: [{ menu_item_id, quantity }],
                total_price: item.price * quantity,
            });
        } else {
            // Check if item already exists in the cart
            const existingItemIndex = cart.items.findIndex(i => i.menu_item_id.toString() === menu_item_id);
            
            if (existingItemIndex >= 0) {
                // Update quantity and price of existing item
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.items.push({ menu_item_id, quantity });
            }
            
            // Update the total price
            cart.total_price += item.price * quantity;
        }

        await cart.save();
        res.status(200).json({ message: 'Item added to cart', data: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding item to cart' });
    }
});

// View cart
router.get('/', authenticate(['User']), async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user.id }).populate('items.menu_item_id');
        if (!cart) {
            return res.status(404).json({ message: 'Cart is empty' });
        }
        res.status(200).json({ message: 'Cart retrieved successfully', data: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving cart' });
    }
});

// Remove item from cart
router.delete('/remove', authenticate(['User']), async (req, res) => {
    const { menu_item_id } = req.body;

    try {
        const cart = await Cart.findOne({ user_id: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(i => i.menu_item_id.toString() === menu_item_id);
        if (itemIndex < 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update total price and remove item
        cart.total_price -= cart.items[itemIndex].quantity * cart.items[itemIndex].menu_item_id.price;
        cart.items.splice(itemIndex, 1);

        await cart.save();
        res.status(200).json({ message: 'Item removed from cart', data: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
});

// Clear the cart
router.delete('/clear', authenticate(['User']), async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.total_price = 0;
        await cart.save();

        res.status(200).json({ message: 'Cart cleared', data: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error clearing cart' });
    }
});

module.exports = router;