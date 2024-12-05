const express = require('express');
const router = express.Router();
const Promotion = require('../models/promotion');
const Menu = require("../models/menu");
const authenticate = require('../middlewares/authMiddleWares'); // Import middleware

// Create a new promotion (Only for merchants)
router.post('/', authenticate(['merchant']), async (req, res) => {
    try {
        const { promotionName, description, discount, startDate, endDate } = req.body;
        const merchantId = req.user.id; // Extract merchant ID from decoded token

        const newPromotion = new Promotion({
            promotionName,
            description,
            discount,
            startDate,
            endDate,
            merchantId,
        });

        const savedPromotion = await newPromotion.save();
        res.status(201).json(savedPromotion);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create promotion', details: error.message });
    }
});

// Get all promotions for a merchant
router.get('/merchant/:merchantId', authenticate(['Merchant']), async (req, res) => {
  try {
      const { merchantId } = req.params;

      // Ensure the requesting merchant is only accessing their own promotions
      if (merchantId !== req.user.id) {
          return res.status(403).json({ message: 'Access denied' });
      }

      // Fetch promotions and populate menu item details
      const promotions = await Promotion.find({ merchantId })
          .populate({
              path: 'menuItems',
              select: 'item_name price category', // Select specific fields from Menu
          })
          .populate({
              path: 'merchantId',
              select: 'store_name email', // Optional: Select merchant fields
          });

      res.status(200).json({
          message: 'Promotions retrieved successfully',
          data: promotions,
      });
  } catch (error) {
      res.status(500).json({
          error: 'Failed to fetch promotions',
          details: error.message,
      });
  }
});




// Update a promotion (Only for merchants)
router.put('/:id', authenticate(['Merchant']), async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const promotion = await Promotion.findById(id);

        // Ensure the requesting merchant owns the promotion
        if (!promotion || promotion.merchantId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to update this promotion' });
        }

        const updatedPromotion = await Promotion.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedPromotion);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update promotion', details: error.message });
    }
});

// Delete a promotion (Only for merchants)
router.delete('/:id', authenticate(['Merchant']), async (req, res) => {
  try {
      const { id } = req.params;

      // Find the promotion
      const promotion = await Promotion.findById(id);

      // Ensure the requesting merchant owns the promotion
      if (!promotion || promotion.merchantId.toString() !== req.user.id) {
          return res.status(403).json({ error: 'Unauthorized to delete this promotion' });
      }

      // Reset the discounted prices of linked menu items
      const menuItems = promotion.menuItems; // Array of menu item IDs
      await Menu.updateMany(
          { _id: { $in: menuItems } },
          { $unset: { discountedPrice: "" } } // Reset discountedPrice to null
      );

      // Delete the promotion
      await Promotion.findByIdAndDelete(id);

      res.status(200).json({ message: 'Promotion deleted successfully, and discounted prices reset.' });
  } catch (error) {
      console.error('Error deleting promotion:', error);
      res.status(500).json({ error: 'Failed to delete promotion', details: error.message });
  }
});


// Create a promotion for specific menu items
router.post("/create", authenticate(["Merchant"]), async (req, res) => {
    const { promotionName, description, discount, startDate, endDate, menuItems } = req.body;
    const merchantId = req.user.id;
  
    try {
      // Validate that the menu items belong to the merchant
      const validMenuItems = await Menu.find({
        _id: { $in: menuItems },
        merchant_id: merchantId,
      });
  
      if (validMenuItems.length !== menuItems.length) {
        return res.status(400).json({
          message: "One or more menu items do not belong to the authenticated merchant.",
        });
      }
  
      // Create the promotion
      const newPromotion = new Promotion({
        promotionName,
        description,
        discount,
        startDate,
        endDate,
        merchantId,
        menuItems,
      });
  
      const savedPromotion = await newPromotion.save();
  
      res.status(201).json({
        message: "Promotion created successfully",
        data: savedPromotion,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating promotion", details: error.message });
    }
  });
  
// Get promotions for specific menu items
router.get("/menu/:menuItemId", authenticate(['Merchant', 'User']), async (req, res) => {
    const { menuItemId } = req.params;
  
    try {
      const promotions = await Promotion.find({ menuItems: menuItemId })
        .populate("menuItems")
        .populate("merchantId", "name");
  
      res.status(200).json({
        message: "Promotions retrieved successfully",
        data: promotions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving promotions", details: error.message });
    }
  });

  router.get('/merchant/:merchantId', authenticate(['Merchant']), async (req, res) => {
    try {
        const { merchantId } = req.params;

        console.log("Requesting merchant ID:", merchantId);
        console.log("Authenticated user ID:", req.user.id);

        // Convert both IDs to strings for comparison
        if (merchantId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const promotions = await Promotion.find({ merchantId });
        res.status(200).json(promotions);
    } catch (error) {
        console.error("Error fetching promotions:", error);
        res.status(500).json({ error: 'Failed to fetch promotions', details: error.message });
    }
});

// Get all promotions from all merchants
router.get('/all', authenticate(['Merchant', 'User']), async (req, res) => {
    try {
        // Fetch all promotions without merchant ID filtering
        const promotions = await Promotion.find()
            .populate('menuItems', 'itemName price category') // Include details of menu items
            .populate('merchantId', 'name email'); // Include details of merchants

        res.status(200).json({
            message: 'Promotions retrieved successfully',
            data: promotions,
        });
    } catch (error) {
        console.error('Error fetching promotions for all merchants:', error);
        res.status(500).json({ error: 'Failed to fetch promotions', details: error.message });
    }
});


  

module.exports = router;
