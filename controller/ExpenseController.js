const catchAssyncError = require("../middleware/catchAssyncError");
const { ExpenseModel } = require("../models/ExpenseSchema");
const moment = require("moment");

// Add Cash In transaction
// Add Cash In transaction
exports.addCashIn = catchAssyncError(async (req, res, next) => {
    const { organizationId } = req.params;
    const { cashIn, note, transactionCategory } = req.body;

    // Basic validation
    if (!cashIn || cashIn <= 0) {
        return res.status(400).json({ success: false, message: "Invalid cash amount." });
    }

    // Fetch the last balance for the given organizationId (if exists)
    const lastExpense = await ExpenseModel.findOne({ organizationId })
        .sort({ transactionDate: -1 })
        .limit(1); // Get the most recent expense record

    // For the first transaction, if no balance exists, initialize it with the cashIn value
    const lastBalance = lastExpense ? lastExpense.balance : 0;

    // Calculate the new balance (either start from 0 or the last balance + cashIn)
    const newBalance = lastBalance + cashIn;

    // Create a new Expense document for Cash In
    const newExpense = new ExpenseModel({
        organizationId,
        cashIn,
        balance: newBalance, // Set the calculated balance
        transactionType: "cashIn",
        transactionCategory,
        note,
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

    // Fetch the last balance for the given organizationId (if exists)
    const lastExpense = await ExpenseModel.findOne({ organizationId })
        .sort({ transactionDate: -1 })
        .limit(1); // Get the most recent expense record

    // For the first transaction, if no balance exists, initialize it with 0
    const lastBalance = lastExpense ? lastExpense.balance : 0;

    // Calculate the new balance (either start from 0 or the last balance - cashOut)
    const newBalance = lastBalance - cashOut;

    // Create a new Expense document for Cash Out
    const newExpense = new ExpenseModel({
        organizationId,
        cashOut,
        balance: newBalance, // Set the calculated balance
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

// exports.getFilteredData = catchAssyncError(async (req, res, next) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const perPage = 10;
//         const skip = (page - 1) * perPage;
//         const { category, timePeriod } = req.query;
//         const { organizationId } = req.params;

//         console.log("organizationId", organizationId);

//         console.log("category", category);
//         console.log("timePeriod", timePeriod);


//         // Determine the date range based on the timePeriod
//         let startDate = null;
//         const endDate = new Date(); // Current date

//         if (timePeriod) {
//             switch (timePeriod) {
//                 case "weekly":
//                     startDate = moment().subtract(1, "week").startOf("day").toDate();
//                     break;
//                 case "monthly":
//                     startDate = moment().subtract(1, "month").startOf("day").toDate();
//                     break;
//                 case "yearly":
//                     startDate = moment().subtract(1, "year").startOf("day").toDate();
//                     break;
//                 case "all":
//                     startDate = null; // No filtering for 'all'
//                     break;
//                 default:
//                     return res.status(400).json({
//                         success: false,
//                         message: "Invalid time period. Use 'weekly', 'monthly', 'yearly', or 'all'.",
//                     });
//             }
//         }

//         // Build the query object
//         const query = {};

//         // Add organizationId to the query if provided
//         if (organizationId) {
//             query.organizationId = organizationId;
//         }

//         // Add category to the query if provided
//         if (category) {
//             query.transactionCategory = category;
//         }

//         // Add time range to the query if startDate is defined
//         if (startDate) {
//             query.transactionDate = { $gte: startDate, $lte: endDate };
//         }

//         console.log("query", query);


//         // Fetch the data from the database
//         const expenses = await ExpenseModel.find(query).skip(skip)
//             .limit(perPage);;

//         res.status(200).json({
//             success: true,
//             message: "Filtered data fetched successfully.",
//             data: expenses,
//             currentPage: page,
//             totalPages: Math.ceil(totalEmployees / perPage),
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });
exports.getFilteredData = catchAssyncError(async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;
        const { category, timePeriod } = req.query;
        const { organizationId } = req.params;

        console.log("organizationId", organizationId);
        console.log("category", category);
        console.log("timePeriod", timePeriod);

        // Determine the date range based on the timePeriod
        let startDate = null;
        const endDate = new Date(); // Current date

        if (timePeriod) {
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
        }

        // Build the query object
        const query = {};

        // Add organizationId to the query if provided
        if (organizationId) {
            query.organizationId = organizationId;
        }

        // Add category to the query if provided
        if (category) {
            query.transactionCategory = category;
        }

        // Add time range to the query if startDate is defined
        if (startDate) {
            query.transactionDate = { $gte: startDate, $lte: endDate };
        }

        console.log("query", query);

        // Fetch the total count for pagination
        const totalCount = await ExpenseModel.countDocuments(query);

        // Fetch the paginated data from the database
        const expenses = await ExpenseModel.find(query).skip(skip).limit(perPage);

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / perPage);

        res.status(200).json({
            success: true,
            message: "Filtered data fetched successfully.",
            data: expenses,
            currentPage: page,
            totalPages: totalPages,
            totalRecords: totalCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


exports.dataDeleteById = catchAssyncError(async (req, res, next) => {
    try {
        const { id } = req.params;



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






