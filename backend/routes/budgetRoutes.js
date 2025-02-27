const express = require('express');
const Budget = require('../models/Budget');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new budget
router.post('/', authMiddleware, async (req, res) => {
    const { category, amount, endDate, spendings } = req.body;
    try {
      const budget = new Budget({
        user: req.user.id,
        category,
        amount,
        endDate,
        spendings, // Include spendings in the new budget
      });
      await budget.save();
      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ error: 'Error creating budget' });
    }
  });


// Get budgets for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
});

// Update a budget
router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const budget = await Budget.findByIdAndUpdate(
        req.params.id,
        req.body, // Update with the entire request body
        { new: true } // Return the updated budget
      );
      res.json(budget);
    } catch (error) {
      res.status(500).json({ error: 'Error updating budget' });
    }
  });


// Delete a budget
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting budget' });
  }
});

module.exports = router;
