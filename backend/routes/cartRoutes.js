const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Menu = require('../models/menu');  
const authenticate = require('../middlewares/authMiddleWares'); 


router.post('/add', authenticate(['User']), async (req, res) => {
    const { menu_item_id, quantity } = req.body;
    const user_id = req.user.id;

    try {
        let cart = await Cart.findOne({ user_id });

        // Fetch the menu item details
        const item = await Menu.findById(menu_item_id);
        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Determine the price to use (discounted price if available, otherwise regular price)
        const priceToUse = item.discountedPrice ?? item.price;

        if (!cart) {
            
            cart = new Cart({
                user_id,
                items: [{ menu_item_id, quantity }],
                total_price: priceToUse * quantity, // Use the determined price
            });
        } else {
            // Check if the item already exists in the cart
            const existingItemIndex = cart.items.findIndex(i => i.menu_item_id.toString() === menu_item_id);

            if (existingItemIndex >= 0) {
                // Update the quantity and total price of the existing item
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add a new item to the cart
                cart.items.push({ menu_item_id, quantity });
                cart.total_price += priceToUse * quantity;
            }
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
        const cart = await Cart.findOne({ user_id: req.user.id }).populate('items.menu_item_id');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Clean invalid items
        cart.items = cart.items.filter(item => item.menu_item_id);

        // Find the item to remove
        const itemIndex = cart.items.findIndex(i => i.menu_item_id._id.toString() === menu_item_id);
        if (itemIndex < 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const item = cart.items[itemIndex];
        const itemPrice = item.menu_item_id.discountedPrice ?? item.menu_item_id.price; // Use the correct price
        const itemQuantity = item.quantity || 0;

        if (typeof itemPrice === 'number' && typeof itemQuantity === 'number') {
            cart.total_price -= itemQuantity * itemPrice;

            // Ensure the total_price does not go below 0
            if (cart.total_price < 0) {
                cart.total_price = 0;
            }
        }

        // Remove the item
        cart.items.splice(itemIndex, 1);

        // Validate the cart and save
        await cart.validate(); // Ensure the cart is valid before saving
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart', data: cart });
    } catch (error) {
        console.error('Error during item removal:', error);
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