const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    tags: [{ type: String }],
    description: { type: String },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: {
        frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
        endDate: { type: Date },
        nextOccurrence: { type: Date }
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);