const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');
const { sendNotification } = require('../utils/notification');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { type, amount, category, tags, description, isRecurring, recurrencePattern } = req.body;

    // Validate required fields
    if (!type || !amount || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const transaction = new Transaction({ 
            user: req.user.id, 
            type, 
            amount, 
            category, 
            tags, 
            description,
            isRecurring,
            recurrencePattern: isRecurring ? recurrencePattern : undefined
        });
        await transaction.save();

        // Send a notification to the user
        try {
            await sendNotification(req.user.email, `New transaction added: ${description} - $${amount}`, req.user.id);
        } catch (notificationError) {
            console.error('Failed to send notification:', notificationError.message);
        }

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error.message);
        res.status(500).json({ error: 'Error creating transaction' });
    }
});
// Get transactions for logged-in user
router.get('/', authMiddleware, async (req, res) => {
    const { tags, sortBy } = req.query;
    try {
        let query = { user: req.user.id };
        if (tags) {
            query.tags = { $in: tags.split(',') }; // Filter by tags
        }

        let sortOptions = { date: -1 }; // Default sorting by date
        if (sortBy === 'amount') {
            sortOptions = { amount: -1 }; // Sort by amount
        }

        const transactions = await Transaction.find(query).sort(sortOptions);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});

// Update a transaction
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { isRecurring, recurrencePattern, ...updateData } = req.body;
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { 
                ...updateData,
                isRecurring,
                recurrencePattern: isRecurring ? recurrencePattern : undefined
            },
            { new: true }
        );
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
