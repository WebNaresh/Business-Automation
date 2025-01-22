const catchAssyncError = require("../middleware/catchAssyncError");
const { ExpenseModel } = require("../models/ExpenseSchema");
const moment = require("moment");

// Add Cash In transaction
exports.addCashIn = catchAssyncError(async (req, res, next) => {
    const { organizationId } = req.params;
    const { cashIn, note, transactionCategory, file } = req.body;

    // Basic validation
    if (!cashIn || cashIn <= 0) {
        return res.status(400).json({ success: false, message: "Invalid cash amount." });
    }

    // Create a new Expense document for Cash In
    const newExpense = new ExpenseModel({
        organizationId,
        cashIn,
        transactionType: "cashIn",
        transactionCategory,
        note,
        file,
        transactionDate: new Date(),
    });

    try {
        await newExpense.save();

        res.status(200).json({
            success: true,
            message: "Cash In added successfully.",
            data: newExpense,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add Cash Out transaction
exports.addCashOut = catchAssyncError(async (req, res, next) => {
    const { organizationId } = req.params;
    const { cashOut, note, transactionCategory } = req.body;

    // Basic validation
    if (!cashOut || cashOut <= 0) {
        return res.status(400).json({ success: false, message: "Invalid cash out amount." });
    }

    // Create a new Expense document for Cash Out
    const newExpense = new ExpenseModel({
        organizationId,
        cashOut,
        transactionType: "cashOut",
        transactionCategory,
        note,
        transactionDate: new Date(),
    });

    try {
        await newExpense.save();

        res.status(200).json({
            success: true,
            message: "Cash Out added successfully.",
            data: newExpense,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

exports.getById = catchAssyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID",
            });
        }

        // Fetch single expense by ID
        const expense = await ExpenseModel.findById(id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "data added successfully.",
            data: expense,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


exports.getSummary = catchAssyncError(async (req, res, next) => {
    try {
        const { organizationId } = req.params;

        // Fetch total cash in and cash out grouped by organizationId
        const summary = await ExpenseModel.aggregate([
            {
                $match: { organizationId: organizationId }
            },
            {
                $group: {
                    _id: "$organizationId",
                    totalCashIn: { $sum: "$cashIn" },
                    totalCashOut: { $sum: "$cashOut" },
                }
            }
        ]);

        if (!summary || summary.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transactions found for the given organization.",
            });
        }

        // Calculate balance
        const totalCashIn = summary[0].totalCashIn || 0;
        const totalCashOut = summary[0].totalCashOut || 0;
        const balance = totalCashIn - totalCashOut;

        res.status(200).json({
            success: true,
            message: "Summary fetched successfully.",
            data: {
                totalCashIn,
                totalCashOut,
                balance,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


exports.getDataPersonalOfficial = catchAssyncError(async (req, res, next) => {
    try {
    
        const { category } = req.query;

        // Validate the transaction category
        if (!["personal", "official"].includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction category. Use 'personal' or 'official'.",
            });
        }

        // Fetch the data from the database
        const expenses = await ExpenseModel.find({
            transactionCategory: category,
        });

        res.status(200).json({
            success: true,
            message: "Summary fetched successfully.",
            data: expenses,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

exports.getDataByTimePeriod = catchAssyncError(async (req, res, next) => {
    try {
        const { organizationId } = req.params;
        const { timePeriod } = req.query; // Accept 'weekly', 'monthly', 'yearly', or 'all'

        // Determine the date range based on the timePeriod
        let startDate = null;
        const endDate = new Date(); // Current date

        switch (timePeriod) {
            case "weekly":
                startDate = moment().subtract(1, "week").startOf("day").toDate();
                break;
            case "monthly":
                startDate = moment().subtract(1, "month").startOf("day").toDate();
                break;
            case "yearly":
                startDate = moment().subtract(1, "year").startOf("day").toDate();
                break;
            case "all":
                startDate = null; // No filtering for 'all'
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid time period. Use 'weekly', 'monthly', 'yearly', or 'all'.",
                });
        }

        // Create the query based on the startDate
        const query = { organizationId };
        if (startDate) {
            query.transactionDate = { $gte: startDate, $lte: endDate };
        }

        // Fetch the data from the database
        const expenses = await ExpenseModel.find(query);

        res.status(200).json({
            success: true,
            message: "Filtered data fetched successfully.",
            data: expenses,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}); 


exports.dataDeleteById = catchAssyncError(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID",
            });
        }

        // Find and delete the document
        const deletedExpense = await ExpenseModel.findByIdAndDelete(id);

        // Check if the document exists
        if (!deletedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Data deleted successfully.",
            data: deletedExpense, // Return the deleted document if needed
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


exports.updateDataById = catchAssyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID",
            });
        }

        // Find the document by ID and update it
        const updatedExpense = await ExpenseModel.findByIdAndUpdate(
            id,
            { $set: updateData }, 
            { new: true, runValidators: true } 
        );

        // Check if the document exists
        if (!updatedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Data updated successfully.",
            data: updatedExpense, 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});






