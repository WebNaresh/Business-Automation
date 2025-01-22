const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            default: null,
        },
        cashIn: {
            type: Number,
            default: 0,
        },
        cashOut: {
            type: Number,
            default: 0,
        },
        transactionType: {
            type: String,
            enum: ["cashIn", "cashOut"],
            required: true,
        },
        transactionCategory: {
            type: String,
            enum: ["personal", "official"],
            default: null,
        },
        note: {
            type: String,
            default: "",
        },
        transactionDate: {
            type: Date,
            default: Date.now,
        },
        transactionTime: {
            type: Date,
            default: () => new Date(), 
        },
        file: {
            type: String,
            default: "",  
        },
    },
    {
        timestamps: true,
    }
);

const ExpenseModel = mongoose.model("Expense", ExpenseSchema);

module.exports = { ExpenseModel };
