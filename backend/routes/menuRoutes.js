const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const Merchant = require("../models/merchants");

const Order = require('../models/order');


// Ensure you have access to the Merchant model for validations

const authenticate = require("../middlewares/authMiddleWares");

router.post("/create", authenticate(['Merchant']), async (req, res) => {
    const { item_name, description, price, category, available } = req.body;

    // Retrieve the authenticated merchanjt's ID from req.user
    const merchant_id = req.user.id;

    try {
        // Check if the merchant exists (optional if you already verify this in the middleware)
        const merchantExists = await Merchant.findById(merchant_id);
        if (!merchantExists) {
            return res.status(404).json({ message: "Merchant not found" });
        }

        // Create a new menu item with the merchant_id from req.user
        const newMenuItem = new Menu({
            merchant_id,
            item_name,
            description,
            price,
            category,
            available,
        });

        const savedMenuItem = await newMenuItem.save();
        res.status(201).json({
            message: "Menu item created successfully",
            data: savedMenuItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating menu item" });
    }
});

router.get('/most-ordered', authenticate(['Merchant']), async (req, res) => {
    try {
        
        // Aggregate orders to count menu item frequency
        const mostOrderedItems = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.menu_item_id", count: { $sum: "$items.quantity" } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Populate the menu item details
        const mostOrderedFoods = await Menu.find({ _id: { $in: mostOrderedItems.map(item => item._id) } });
        
        res.status(200).json({ message: 'Most ordered foods retrieved successfully', data: mostOrderedFoods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving most ordered foods' });
    }
});


// Read all menu items for a specific merchant
router.get("/merchant/:merchantId", authenticate(['User','Merchant']), async (req, res) => {
  const { merchantId } = req.params;

  try {
    const menuItems = await Menu.find({ merchant_id: merchantId });
    if (menuItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No menu items found for this merchant" });
    }
    res.status(200).json({
      message: "Menu items retrieved successfully",
      data: menuItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving menu items" });
  }
});

// Read a specific menu item by ID
router.get("/:id", authenticate(['User','Merchant']), async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({
      message: "Menu item retrieved successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving menu item" });
  }
});


// Update a specific menu item
router.put("/:id", authenticate(['Merchant']), async (req, res) => {
    const { id } = req.params;
    const { item_name, description, price, category, available } = req.body;

    // Prepare fields to update
    const updateFields = {};
    if (item_name) updateFields.item_name = item_name;
    if (description) updateFields.description = description;
    if (price) updateFields.price = price;
    if (category) updateFields.category = category;
    if (available !== undefined) updateFields.available = available;
    updateFields.updated_at = Date.now();

    try {
        // Find the menu item and verify ownership
        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        
        // Check if the menu item belongs to the authenticated merchant
        if (menuItem.merchant_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to update this menu item" });
        }

        // Update the menu item
        const updatedMenuItem = await Menu.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true } // Returns the updated document
        );

        res.status(200).json({
            message: "Menu item updated successfully",
            data: updatedMenuItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating menu item" });
    }
});

// Delete a specific menu item
router.delete("/:id", authenticate(['Merchant']), async (req, res) => {
    const { id } = req.params;

    try {
        // Find the menu item and verify ownership
        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        // Check if the menu item belongs to the authenticated merchant
        if (menuItem.merchant_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to delete this menu item" });
        }

        // Delete the menu item
        const deletedMenuItem = await Menu.findByIdAndDelete(id);

        res.status(200).json({
            message: "Menu item deleted successfully",
            data: deletedMenuItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting menu item" });
    }
});


// Most ordered foods




module.exports = router;