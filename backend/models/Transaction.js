const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    merchant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Merchant",
        required: true,
    },
    total_price: { 
        type: Number, 
        ref: "Cart",
        required: true,
    },
    // created_at: { 
    //     type: Date, 
    //     ref : "Cart",
    //     required: true,
    // },
    // updated_at: { 
    //     type: Date, 
    //     ref : "Cart",
    //     default: Date.now ,
    //     required: true,
    // },
    type : {
        type : String,
        enum : ["credit", "debit"],
        required : true,
    },
    timestamps: true,
});

await TransactionSchema.save();

module.exports = mongoose.model("Transaction", TransactionSchema);

