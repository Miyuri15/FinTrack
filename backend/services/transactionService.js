const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Notification = require('../models/Notification');

class TransactionService {
    static async createTransaction(userId, transactionData) {
        const { type, amount, currency, category, description, isRecurring, recurrencePattern } = transactionData;

        const transaction = new Transaction({
            user: userId,
            type,
            amount,
            currency,
            category,
            description,
            isRecurring,
            recurrencePattern,
        });

        await transaction.save();

        // Send notification to the user
        const user = await User.findById(userId);
        if (user) {
            await Notification.create({
                user: userId,
                message: `New transaction added: ${description} - $${amount}`,
                type: 'transaction',
            });
        }

        return transaction;
    }

    static async getTransactions(userId, filters = {}) {
        let query = { user: userId };

        if (filters.tags) {
            query.tags = { $in: filters.tags.split(',') };
        }

        return await Transaction.find(query).sort({ date: -1 });
    }

    static async updateTransaction(transactionId, updateData) {
        return await Transaction.findByIdAndUpdate(transactionId, updateData, { new: true });
    }

    static async deleteTransaction(transactionId) {
        return await Transaction.findByIdAndDelete(transactionId);
    }
}

module.exports = TransactionService;