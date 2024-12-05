const mongoose = require("mongoose");
const Menu = require("./menu");

const promotionSchema = new mongoose.Schema({
  promotionName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Discount percentage
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
    required: true,
  },
  menuItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu", // Reference menu items
      required: true,
    },
  ],
});

// Middleware to apply discounts to menu items
promotionSchema.post("save", async function (doc) {
  try {
    const { discount, menuItems } = doc;

    // Fetch the menu items
    const menuItemsToUpdate = await Menu.find({ _id: { $in: menuItems } });

    // Calculate and update the discounted price for each item
    for (const item of menuItemsToUpdate) {
      const discountedPrice = item.price * (1 - discount / 100);
      item.discountedPrice = discountedPrice;
      await item.save(); // Save the updated menu item
    }
  } catch (error) {
    console.error("Error applying discount to menu items:", error);
  }
});


// Middleware to remove discounts after promotion ends
promotionSchema.post("remove", async function (doc) {
  try {
    const { menuItems } = doc;

    // Remove discounted prices from menu items
    await Menu.updateMany(
      { _id: { $in: menuItems } },
      { $unset: { discountedPrice: "" } }
    );
  } catch (error) {
    console.error("Error removing discount from menu items:", error);
  }
});

const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
