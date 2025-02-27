const mongoose = require('mongoose');

const SpendingSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  spent: { type: Number, default: 0 }, // Track how much has been spent in this category
});

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String }, // Month for the budget
  budgetName: { type: String }, // Name for the budget
  amount: { type: Number, required: true }, // Total budget amount
  startDate: { type: Date, default: Date.now }, // Start date of the budget
  endDate: { type: Date }, // End date of the budget
  spendings: [SpendingSchema], // Array of spending categories
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);