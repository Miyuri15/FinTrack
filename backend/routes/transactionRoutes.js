const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a transaction
router.post('/', authMiddleware, async (req, res) => {
    const { type, amount, category, tags, description } = req.body;
    try {
        const transaction = new Transaction({ 
            user: req.user.id, 
            type, 
            amount, 
            category, 
            tags, 
            description 
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Error creating transaction' });
    }
});

// Get transactions for logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});

// Update a transaction
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Error updating transaction' });
    }
});

// Delete a transaction
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting transaction' });
    }
});

module.exports = router;
