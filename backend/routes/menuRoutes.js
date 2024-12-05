const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const Merchant = require("../models/merchants");
const Promotion = require("../models/promotion"); // Ensure Promotion model is imported
const Order = require("../models/order");

const authenticate = require("../middlewares/authMiddleWares");

// Create a new menu item
router.post("/create", authenticate(["Merchant"]), async (req, res) => {
    const { item_name, description, price, category, available } = req.body;

    const merchant_id = req.user.id;

    try {
        const merchantExists = await Merchant.findById(merchant_id);
        if (!merchantExists) {
            return res.status(404).json({ message: "Merchant not found" });
        }

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

// Get most ordered menu items
router.get("/most-ordered", authenticate(["Merchant"]), async (req, res) => {
    try {
        const mostOrderedItems = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.menu_item_id", count: { $sum: "$items.quantity" } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        const mostOrderedFoods = await Menu.find({ _id: { $in: mostOrderedItems.map((item) => item._id) } });

        res.status(200).json({
            message: "Most ordered foods retrieved successfully",
            data: mostOrderedFoods,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving most ordered foods" });
    }
});


router.get('/categories-and-merchants', authenticate(['User', 'Merchant']), async (req, res) => {
try {
const categoriesWithMerchants = await Menu.aggregate([
{
$group: {
_id: "$category", // Group by category
merchantIds: { $addToSet: "$merchant_id" }, // Collect unique merchant IDs for each category
},
},
{
$lookup: {
from: "merchants", // Name of the Merchant collection
localField: "merchantIds",
foreignField: "_id",
as: "merchants", // Populate merchant details
},
},
{
$project: {
_id: 0, // Exclude the default `_id` field
category: "$_id", // Rename `_id` to `category`
merchants: { _id: 1, name: 1 }, // Include only relevant fields from Merchant
},
},
]);

if (categoriesWithMerchants.length === 0) {
return res.status(404).json({ message: "No categories or merchants found" });
}

res.status(200).json({
message: "Categories and associated merchants retrieved successfully",
data: categoriesWithMerchants,
});
} catch (error) {
console.error(error);
res.status(500).json({ message: "Error retrieving categories and merchants" });
}
});


// Read all menu items for a specific merchant with isPromoted flag
router.get("/merchant/:merchantId", authenticate(["User", "Merchant"]), async (req, res) => {
    const { merchantId } = req.params;

    try {
        const menuItems = await Menu.find({ merchant_id: merchantId }).lean();

        if (menuItems.length === 0) {
            return res.status(404).json({ message: "No menu items found for this merchant" });
        }

        // Add `isPromoted` flag for each menu item
        const menuItemsWithPromotions = await Promise.all(
            menuItems.map(async (item) => {
                const promotion = await Promotion.findOne({
                    menuItems: item._id,
                    startDate: { $lte: new Date() },
                    endDate: { $gte: new Date() },
                });
                return {
                    ...item,
                    isPromoted: !!promotion, // True if promotion exists
                };
            })
        );

        res.status(200).json({
            message: "Menu items retrieved successfully",
            data: menuItemsWithPromotions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving menu items" });
    }
});

// Read a specific menu item by ID with isPromoted flag
router.get("/:id", authenticate(["User", "Merchant"]), async (req, res) => {
    const { id } = req.params;

    try {
        const menuItem = await Menu.findById(id).lean();
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        const promotion = await Promotion.findOne({
            menuItems: menuItem._id,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
        });

        res.status(200).json({
            message: "Menu item retrieved successfully",
            data: {
                ...menuItem,
                isPromoted: !!promotion, // True if promotion exists
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving menu item" });
    }
});

// Update a specific menu item
router.put("/:id", authenticate(["Merchant"]), async (req, res) => {
    const { id } = req.params;
    const { item_name, description, price, category, available } = req.body;

    const updateFields = {};
    if (item_name) updateFields.item_name = item_name;
    if (description) updateFields.description = description;
    if (price) updateFields.price = price;
    if (category) updateFields.category = category;
    if (available !== undefined) updateFields.available = available;
    updateFields.updated_at = Date.now();

    try {
        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        if (menuItem.merchant_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to update this menu item" });
        }

        const updatedMenuItem = await Menu.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

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
router.delete("/:id", authenticate(["Merchant"]), async (req, res) => {
    const { id } = req.params;

    try {
        const menuItem = await Menu.findById(id);
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        if (menuItem.merchant_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to delete this menu item" });
        }

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

module.exports = router;
