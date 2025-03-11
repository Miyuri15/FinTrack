const TransactionService = require('../services/transactionService');

class TransactionController {
    static async createTransaction(req, res) {
        try {
            const transaction = await TransactionService.createTransaction(req.user.id, req.body);
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getTransactions(req, res) {
        try {
            const transactions = await TransactionService.getTransactions(req.user.id, req.query);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateTransaction(req, res) {
        try {
            const transaction = await TransactionService.updateTransaction(req.params.id, req.body);
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteTransaction(req, res) {
        try {
            await TransactionService.deleteTransaction(req.params.id);
            res.json({ message: 'Transaction deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = TransactionController;