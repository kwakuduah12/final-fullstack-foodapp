const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  merchant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant", // Reference to Merchant
    required: true,
  },

  item_name: {
    type: String,
    required: true,
  },
  description: { type: String },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Appetizer", "Main Course", "Dessert", "Drink", "Other"],
  },
  available: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Menu", MenuSchema);