const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true }, // Fixed typo: 'expense'
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    tags: [{ type: String }], // Array of custom tags
    description: { type: String },
    isRecurring: { type: Boolean, default: false }, // Flag for recurring transactions
    recurrencePattern: { // Recurrence details
        frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
        endDate: { type: Date }, // Optional end date for recurrence
        nextOccurrence: { type: Date } // Next occurrence date
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);