const express = require('express');
const Budget = require('../models/Budget');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new budget
router.post('/', authMiddleware, async (req, res) => {
  const { month, budgetName, amount, endDate, spendings } = req.body;
  try {
    const budget = new Budget({
      user: req.user.id,
      month,
      budgetName,
      amount,
      endDate,
      spendings: spendings.map((spending) => ({
        category: spending.category,
        amount: spending.amount,
        spent: 0, // Initialize spent amount to 0
      })),
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
    const budgetsWithAlerts = budgets.map((budget) => {
      const totalSpent = budget.spendings.reduce((sum, spending) => sum + spending.spent, 0);
      const exceededAmount = totalSpent > budget.amount ? totalSpent - budget.amount : 0;
      return {
        ...budget.toObject(),
        exceededAmount,
      };
    });
    res.json(budgetsWithAlerts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
});

// Get all budgets (Admin Only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const budgets = await Budget.find({}).populate('user', 'username email');
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

// Add or update spending for a budget
router.put('/:id/spendings/:spendingId', authMiddleware, async (req, res) => {
  const { spentAmount } = req.body;
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Find the spending category to update
    const spendingIndex = budget.spendings.findIndex(
      (spending) => spending._id.toString() === req.params.spendingId
    );

    if (spendingIndex === -1) {
      return res.status(404).json({ error: 'Spending category not found' });
    }

    // Update the spent amount
    budget.spendings[spendingIndex].spent = spentAmount;

    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error updating spending' });
  }
});

// Delete a spending category
router.delete('/:id/spendings/:spendingId', authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Remove the spending category
    budget.spendings = budget.spendings.filter(
      (spending) => spending._id.toString() !== req.params.spendingId
    );

    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting spending category' });
  }
});

// Route to get count of budgets for the logged-in user
router.get('/count', authMiddleware, async (req, res) => {
  try {
    const count = await Budget.countDocuments({ user: req.user.id });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budget count' });
  }
});

module.exports = router;